// Script Node.js para gerar capas dos vídeos usando ffmpeg
// Salva as imagens em src/assets/capas/capa-story-1.jpg, capa-story-2.jpg, ...

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Lista de vídeos (pode ser caminho local ou URL)
const videos = [
  'https://storage.googleapis.com/veedis-teste/c3abv4sfahyth4dhg1oubn7e.mp4',
  'https://storage.googleapis.com/veedis-teste/r3hiqe4x47qzjplbbx52g2wu.mp4',
  'https://storage.googleapis.com/veedis-teste/qiota7lukm4bnga1ks3zn91x.mp4',
];

const outputDir = path.resolve(__dirname, '../src/assets/capas');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

videos.forEach((video, i) => {
  const out = path.join(outputDir, `capa-story-${i + 1}.jpg`);
  // Baixa o vídeo temporariamente se for URL remota
  let localVideo = video;
  if (/^https?:\/\//.test(video)) {
    const temp = path.join(__dirname, `temp-video-${i + 1}.mp4`);
    execSync(`curl -L "${video}" -o "${temp}"`);
    localVideo = temp;
  }
  // Gera a thumbnail
  execSync(`ffmpeg -y -i "${localVideo}" -ss 00:00:01.000 -vframes 1 "${out}"`);
  // Remove vídeo temporário
  if (localVideo !== video) fs.unlinkSync(localVideo);
  console.log(`Capa gerada: ${out}`);
});

console.log('Todas as capas foram geradas em src/assets/capas/'); 