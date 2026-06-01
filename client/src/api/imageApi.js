export function generateImage(prompt) {
  const seed = Math.floor(Math.random() * 1000000);
  const encoded = encodeURIComponent(prompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&model=flux&seed=${seed}`;

  // Route through your own backend to avoid 403 from Pollinations
  const proxyUrl = `http://localhost:5000/api/image/proxy?url=${encodeURIComponent(pollinationsUrl)}`;
  return proxyUrl; // sync again — no await needed
}