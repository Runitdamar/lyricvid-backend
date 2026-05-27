require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST']
}));

app.use(express.json({ limit: '500mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'LyricVid API running!'
  });
});

// ── TRANSCRIBE (unchanged) ──────────────────────────────────────────────────

async function transcribeWithHF(audioBuffer, mimetype) {
  const HF_API_TOKEN = process.env.HF_API_TOKEN;

  if (!HF_API_TOKEN) {
    throw new Error('HF_API_TOKEN not configured');
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api-inference.huggingface.co',
      path: '/models/openai/whisper-large-v3',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': mimetype || 'audio/mpeg',
        'Content-Length': audioBuffer.length
      },
      timeout: 60000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);

          if (result.error) {
            if (result.error.includes('loading')) {
              setTimeout(() => {
                transcribeWithHF(audioBuffer, mimetype)
                  .then(resolve)
                  .catch(reject);
              }, 20000);

              return;
            }

            reject(new Error(result.error));
            return;
          }

          const text =
            result.text ||
            (typeof result === 'string' ? result : '');

          resolve(
            buildWordTimings(text, result.chunks)
          );

        } catch (e) {
          reject(
            new Error(
              'Failed to parse response: ' + data
            )
          );
        }
      });
    });

    req.on('error', (e) => {
      reject(
        new Error('Network error: ' + e.message)
      );
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(audioBuffer);
    req.end();
  });
}

function buildWordTimings(text, chunks) {
  if (!text || !text.trim()) {
    return {
      fullText: '',
      words: []
    };
  }

  const words = text.trim().split(/\s+/);
  const duration = words.length * 0.45;

  return {
    fullText: text.trim(),

    words:
      chunks && chunks.length > 0
        ? chunks
            .map(c => ({
              word: c.text.trim(),
              start: c.timestamp[0] || 0,
              end: c.timestamp[1] || 0
            }))
            .filter(w => w.word.length > 0)

        : words.map((word, i) => ({
            word,

            start: parseFloat(
              (
                i *
                (duration / words.length)
              ).toFixed(2)
            ),

            end: parseFloat(
              (
                (i + 1) *
                (duration / words.length)
              ).toFixed(2)
            )
          }))
  };
}

app.post(
  '/api/transcribe',
  upload.single('audio'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No audio file provided'
        });
      }

      const result = await transcribeWithHF(
        req.file.buffer,
        req.file.mimetype
      );

      res.json({
        success: true,
        transcript: result.fullText,
        words: result.words
      });

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

app.post(
  '/api/upload',
  upload.single('audio'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file provided'
        });
      }

      res.json({
        success: true,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,

        data:
          `data:${req.file.mimetype};base64,` +
          req.file.buffer.toString('base64')
      });

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// ── CHUNK UPLOAD ────────────────────────────────────────────────────────────

const jobFrames = {};

app.post(
  '/api/upload-chunk',
  express.json({ limit: '50mb' }),
  (req, res) => {
    try {
      const {
        jobId,
        chunkIndex,
        totalChunks,
        frames
      } = req.body;

      if (!jobFrames[jobId]) {
        jobFrames[jobId] = {
          chunks: {},
          totalChunks
        };
      }

      jobFrames[jobId].chunks[chunkIndex] = frames;

      console.log(
        `Job ${jobId}: chunk ${chunkIndex + 1}/${totalChunks} received`
      );

      res.json({
        success: true
      });

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// ── RENDER TO MP4 ───────────────────────────────────────────────────────────

app.post(
  '/api/render',
  express.json({ limit: '500mb' }),
  async (req, res) => {

    const tmpDir = `/tmp/lyricvid_${Date.now()}`;

    try {
      const {
        jobId,
        audio,
        fps = 24,
        duration
      } = req.body;

      if (!jobId || !jobFrames[jobId]) {
        return res.status(400).json({
          error: 'No frames found for job'
        });
      }

      const job = jobFrames[jobId];

      const frames = Object.keys(job.chunks)
        .sort((a, b) => Number(a) - Number(b))
        .flatMap(k => job.chunks[k]);

      delete jobFrames[jobId];

      if (!audio) {
        return res.status(400).json({
          error: 'No audio provided'
        });
      }

      fs.mkdirSync(tmpDir, {
        recursive: true
      });

      // Write frames as JPEG files
      for (let i = 0; i < frames.length; i++) {
        const base64 = frames[i].replace(
          /^data:image\/jpeg;base64,/,
          ''
        );

        fs.writeFileSync(
          path.join(
            tmpDir,
            `frame${String(i).padStart(5, '0')}.jpg`
          ),

          Buffer.from(base64, 'base64')
        );
      }

      // Write audio file
      const audioBase64 = audio.replace(
        /^data:audio\/[^;]+;base64,/,
        ''
      );

      const audioPath = path.join(
        tmpDir,
        'audio.mp3'
      );

      fs.writeFileSync(
        audioPath,
        Buffer.from(audioBase64, 'base64')
      );

      const outputPath = path.join(
        tmpDir,
        'output.mp4'
      );

      // FFmpeg: frames + audio → MP4
      await new Promise((resolve, reject) => {
        const ff = spawn('ffmpeg', [
          '-framerate',
          String(fps),

          '-i',
          path.join(
            tmpDir,
            'frame%05d.jpg'
          ),

          '-i',
          audioPath,

          '-c:v',
          'libx264',

          '-preset',
          'ultrafast',

          '-crf',
          '23',

          '-c:a',
          'aac',

          '-b:a',
          '192k',

          '-shortest',

          '-movflags',
          '+faststart',

          '-pix_fmt',
          'yuv420p',

          outputPath
        ]);

        ff.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(
              new Error(
                `FFmpeg exited with code ${code}`
              )
            );
          }
        });

        ff.on('error', reject);
      });

      const mp4Buffer =
        fs.readFileSync(outputPath);

      res.set(
        'Content-Type',
        'video/mp4'
      );

      res.set(
        'Content-Disposition',
        `attachment; filename="lyricvid-${Date.now()}.mp4"`
      );

      res.send(mp4Buffer);

    } catch (err) {
      console.error(
        'Render error:',
        err.message
      );

      res.status(500).json({
        error: err.message
      });

    } finally {
      // Cleanup temp files
      try {
        fs.rmSync(tmpDir, {
          recursive: true,
          force: true
        });
      } catch {}
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `LyricVid backend running on port ${PORT}`
  );
});
