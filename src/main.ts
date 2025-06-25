import './style.css'
import './styles/tailwind.css'
// Força o Tailwind a usar a estratégia 'class' para dark mode
// Isso garante que as classes 'dark:' funcionem corretamente
import 'tailwindcss/tailwind.css';
import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg' // Removido, não será mais usado
import { setupCounter } from './counter.ts'
import { ControladorUI } from './classes/ControladorUI';

// Remove o conteúdo padrão do Vite
const appDiv = document.querySelector<HTMLDivElement>('#app');
if (appDiv) appDiv.innerHTML = '';

// Layout inicial do projeto Veedis com header e design aprimorado
const layoutInicial = `
  <div class="min-h-screen min-h-dvh flex flex-col w-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-950 dark:to-gray-900 dark:bg-gray-950">
    <header class="w-full bg-white/80 dark:bg-gray-950/90 shadow-md py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-3 w-full justify-center sm:justify-start">
        <img src="https://veedis.com.br/wp-content/uploads/2025/04/VEEDS.png" alt="Logo Veedis" class="w-12 h-12 object-contain hidden sm:block" />
        <span class="text-2xl font-bold text-blue-900 dark:text-white tracking-tight text-center w-full">Projeto Veedis</span>
      </div>
      <button id="toggle-dark" class="mx-auto sm:ml-4 p-2 sm:p-2 text-xl sm:text-2xl rounded-full bg-blue-200 dark:bg-gray-700 text-blue-900 dark:text-yellow-300 hover:bg-blue-300 dark:hover:bg-gray-600 transition-colors" title="Alternar modo escuro/claro">🌙</button>
    </header>
    <main class="flex-1 flex flex-col items-center justify-center px-0 py-10 w-full max-w-full">
      <h1 class="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-yellow-200 mb-2 sm:mb-4 text-center drop-shadow">Bem-vindo ao Teste</h1>
      <p class="text-base xs:text-lg sm:text-xl text-blue-800 dark:text-gray-200 mb-4 sm:mb-8 text-center max-w-xs xs:max-w-md sm:max-w-2xl">Demonstração de um componente de vídeo flutuante com experiência inspirada nos requisitos do teste. Clique no story flutuante para assistir aos vídeos e navegar pelo slider interativo.</p>
      <div id="stories-area" class="flex gap-6 justify-center items-center mt-6 w-full max-w-full">
        <!-- Bolinha do vídeo flutuante será inserida aqui -->
      </div>
    </main>
    <footer class="w-full text-center py-4 text-blue-700 dark:text-gray-300 bg-white/60 dark:bg-gray-900/80 text-sm mt-auto">Ivory Integrada &copy; 2025</footer>
  </div>
`;

document.body.innerHTML = layoutInicial;

// Função para renderizar o layout inicial (usada para restaurar após fechar o modal)
function renderizarLayoutInicial() {
  document.body.innerHTML = layoutInicial;

  // Criação da bolinha flutuante no canto inferior direito, com preview do primeiro story
  const storiesArea = document.getElementById('stories-area');
  // Remove a bolinha antiga (se houver)
  if (storiesArea) storiesArea.innerHTML = '';

  // Cria o botão flutuante
  const bolinha = document.createElement('div');
  bolinha.className = 'fixed bottom-16 right-6 z-50 flex items-center justify-center w-20 h-20 rounded-full border-4 border-gradient-to-tr from-pink-400 to-yellow-300 bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform ring-2 ring-pink-300';

  // Miniatura do primeiro vídeo (usando <video> poster ou frame inicial)
  const videoThumb = document.createElement('video');
  videoThumb.src = 'https://storage.googleapis.com/veedis-teste/c3abv4sfahyth4dhg1oubn7e.mp4';
  videoThumb.className = 'w-16 h-16 object-cover rounded-full pointer-events-none';
  videoThumb.muted = true;
  videoThumb.playsInline = true;
  videoThumb.autoplay = true;
  videoThumb.loop = true;
  videoThumb.controls = false;
  bolinha.appendChild(videoThumb);

  // Adiciona a bolinha ao body (não mais na storiesArea)
  document.body.appendChild(bolinha);

  // Dark mode toggle
  const toggleDark = document.getElementById('toggle-dark');
  if (toggleDark) {
    toggleDark.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('veedis-dark', document.documentElement.classList.contains('dark') ? '1' : '0');
      renderizarLayoutInicial();
    });
    if (localStorage.getItem('veedis-dark') === '1') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Ao clicar na bolinha, inicializa o ControladorUI (slider de vídeos estilo story)
  bolinha.addEventListener('click', () => {
    document.body.innerHTML = '';
    new ControladorUI(true); // true = abrir modal direto
  });
}

// Renderiza o layout inicial ao carregar
renderizarLayoutInicial();

// Exporta a função para ser usada pelo ControladorUI
export { renderizarLayoutInicial };
