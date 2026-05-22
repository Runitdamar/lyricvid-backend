require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'LyricVid API is running!' });
});

async function transcribeAudio(audioBuffer, mimetype) {
  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  if (!HF_API_TOKEN) throw new Error('HF_API_TOKEN not set');

  const response = await fetch(
    'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': mimetype || 'audio/mpeg',
      },
      body: audioBuffer
    }
  );

  if (response.status === 503) {
    const data = await response.json();
    const wait = data.estimated_time ? Math.ceil(data.estimated_time) * 1000 : 20000;
    await new Promise(r => setTimeout(r, wait));
    return transcribeAudio(audioBuffer, mimetype);
  }

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Hugging Face error: ${response.status} - ${err}`);
  }

  const result = await response.json();
  const text = result.text || (typeof result === 'string' ? result : '');
  const words = text.trim().split(/\s+/);
  const duration = words.length * 0.4;

  return {
    fullText: text.trim(),
    words: result.chunks
      ? result.chunks.map(c => ({
          word: c.text.trim(),
          start: c.timestamp[0] || 0,
          end: c.timestamp[1] || 0
        })).filter(w => w.word.length > 0)
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
    console.log(`Transcribing: ${req.file.originalname}`);
    const result = await transcribeAudio(req.file.buffer, req.file.mimetype);
    res.json({ success: true, transcript: result.fullText, words: result.words });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const base64 = req.file.buffer.toString('base64');
    res.json({
      success: true,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: `data:${req.file.mimetype};base64,${base64}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`LyricVid backend running on port ${PORT}`);
});
