import './style.css'
import './styles/tailwind.css'
// Força o Tailwind a usar a estratégia 'class' para dark mode
// Isso garante que as classes 'dark:' funcionem corretamente
import 'tailwindcss/tailwind.css';
import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg' // Removido, não será mais usado
import { setupCounter } from './counter.ts'
import { ControladorUI } from './classes/ControladorUI';
import capa1 from './assets/capas/capa-story-1.jpg';

// Remove o conteúdo padrão do Vite
const appDiv = document.querySelector<HTMLDivElement>('#app');
if (appDiv) appDiv.innerHTML = '';

// Layout inicial minimalista, só o botão flutuante
const layoutInicial = `
  <div class="min-h-screen min-h-dvh w-full bg-white">
  </div>
`;

document.body.innerHTML = layoutInicial;

function renderizarLayoutInicial() {
  document.body.innerHTML = layoutInicial;

  // Criação da bolinha flutuante no canto inferior direito, com preview do primeiro story
  const bolinha = document.createElement('div');
  bolinha.className = 'fixed bottom-4 right-4 z-50 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gradient-to-tr from-pink-400 to-yellow-300 bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform ring-2 ring-pink-300';

  // Miniatura do primeiro vídeo (imagem local)
  const imgThumb = document.createElement('img');
  imgThumb.src = capa1;
  imgThumb.alt = 'Capa do story';
  imgThumb.className = 'w-16 h-16 object-cover rounded-full pointer-events-none';
  bolinha.appendChild(imgThumb);

  document.body.appendChild(bolinha);

  // Ao clicar na bolinha, inicializa o ControladorUI (slider de vídeos estilo story)
  bolinha.addEventListener('click', () => {
    document.body.innerHTML = '';
    new ControladorUI(true); // true = abrir modal direto
  });
}

renderizarLayoutInicial();

export { renderizarLayoutInicial };
