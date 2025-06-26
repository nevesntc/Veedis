// Script Node.js para gerar capas dos vídeos usando Puppeteer
// Abre o vídeo em uma página HTML, pausa no primeiro frame e tira screenshot

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const videos = [
  'https://storage.googleapis.com/veedis-teste/c3abv4sfahyth4dhg1oubn7e.mp4',
  'https://storage.googleapis.com/veedis-teste/r3hiqe4x47qzjplbbx52g2wu.mp4',
  'https://storage.googleapis.com/veedis-teste/qiota7lukm4bnga1ks3zn91x.mp4',
];

const outputDir = path.resolve(__dirname, '../src/assets/capas');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function generateThumbnails() {
  const browser = await puppeteer.launch();
  
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const page = await browser.newPage();
    
    // Cria uma página HTML com o vídeo
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; background: black; }
            video { 
              width: 100vw; 
              height: 100vh; 
              object-fit: cover;
              display: block;
            }
          </style>
        </head>
        <body>
          <video id="video" src="${video}" preload="metadata" muted></video>
          <script>
            const video = document.getElementById('video');
            video.addEventListener('loadeddata', () => {
              video.currentTime = 1; // Pula para 1 segundo
            });
            video.addEventListener('seeked', () => {
              // Aguarda um pouco para garantir que o frame foi carregado
              setTimeout(() => {
                window.ready = true;
              }, 500);
            });
          </script>
        </body>
      </html>
    `;
    
    await page.setContent(html);
    
    // Aguarda o vídeo carregar e pausar no frame desejado
    await page.waitForFunction(() => window.ready === true, { timeout: 10000 });
    
    // Tira screenshot
    const screenshotPath = path.join(outputDir, `capa-story-${i + 1}.jpg`);
    await page.screenshot({ 
      path: screenshotPath,
      type: 'jpeg',
      quality: 90
    });
    
    console.log(`Capa gerada: ${screenshotPath}`);
    await page.close();
  }
  
  await browser.close();
  console.log('Todas as capas foram geradas em src/assets/capas/');
}

generateThumbnails().catch(console.error); 