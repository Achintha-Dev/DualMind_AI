import { Router } from 'express';

const router = Router();

router.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || !url.startsWith('https://image.pollinations.ai/')) {
      return res.status(400).json({ error: 'Invalid image URL.' });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Image fetch failed.' });
    }

    // ✅ Fix: use arrayBuffer then Buffer.from correctly
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);  // ← was: buffer.from (lowercase b)

    res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(buffer);  // ← use res.end() for binary data, not res.send()

  } catch (err) {
    console.error('Image proxy error:', err.message);
    res.status(500).json({ error: 'Image proxy failed.' });
  }
});

export default router;