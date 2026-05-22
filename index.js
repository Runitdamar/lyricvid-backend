require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '50mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'LyricVid API running!' }));

async function transcribeWithHF(audioBuffer, mimetype) {
  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  if (!HF_API_TOKEN) throw new Error('HF_API_TOKEN not configured');

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
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            if (result.error.includes('loading')) {
              setTimeout(() => transcribeWithHF(audioBuffer, mimetype).then(resolve).catch(reject), 20000);
              return;
            }
            reject(new Error(result.error));
            return;
          }
          const text = result.text || (typeof result === 'string' ? result : '');
          resolve(buildWordTimings(text, result.chunks));
        } catch (e) { reject(new Error('Failed to parse response: ' + data)) }
      });
    });

    req.on('error', (e) => reject(new Error('Network error: ' + e.message)));
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')) });
    req.write(audioBuffer);
    req.end();
  });
}

function buildWordTimings(text, chunks) {
  if (!text || !text.trim()) return { fullText: '', words: [] };
  const words = text.trim().split(/\s+/);
  const duration = words.length * 0.45;
  return {
    fullText: text.trim(),
    words: chunks && chunks.length > 0
      ? chunks.map(c => ({ word: c.text.trim(), start: c.timestamp[0] || 0, end: c.timestamp[1] || 0 })).filter(w => w.word.length > 0)
      : words.map((word, i) => ({
          word,
          start: parseFloat((i * (duration / words.length)).toFixed(2)),
          end: parseFloat(((i + 1) * (duration / words.length)).toFixed(2))
        }))
  };
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file provided' });
    console.log(`Transcribing: ${req.file.originalname} (${(req.file.size / 1024).toFixed(0)}KB)`);
    const result = await transcribeWithHF(req.file.buffer, req.file.mimetype);
    res.json({ success: true, transcript: result.fullText, words: result.words });
  } catch (err) {
    console.error('Transcription error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    res.json({
      success: true, filename: req.file.originalname,
      mimetype: req.file.mimetype, size: req.file.size,
      data: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`LyricVid backend running on port ${PORT}`));
