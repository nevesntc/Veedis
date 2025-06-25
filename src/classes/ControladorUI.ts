// Essa classe cuida da interface: abre o modal, monta o carrossel e faz a navegação dos vídeos
import { GerenciadorDeVideos } from './GerenciadorDeVideos';
import { PlayerDeVideo } from './PlayerDeVideo';
import { renderizarLayoutInicial } from '../main';

export class ControladorUI {
  private containerModal: HTMLElement;
  private gerenciador = GerenciadorDeVideos.getInstancia();
  private player: PlayerDeVideo | null = null;

  constructor(abrirDireto?: boolean) {
    this.containerModal = this.criarModal();
    document.body.appendChild(this.containerModal);
    this.gerenciador.adicionarObservador(() => this.atualizarCarrossel());
    if (abrirDireto) {
      this.abrirModal();
    }
  }

  private criarModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'modal-veedis fixed inset-0 z-50 flex items-center justify-center bg-black/80';
    modal.innerHTML = `
      <div class="flex items-center gap-4 sm:gap-8 relative">
        <button id="anterior" class="text-white text-4xl opacity-70 hover:opacity-100 transition-colors absolute left-[-60px] sm:left-[-80px] top-1/2 -translate-y-1/2 z-30 bg-black/40 rounded-full p-2">&#8249;</button>
        <div id="carrossel-stories" class="flex gap-4 sm:gap-8 items-center"></div>
        <button id="proximo" class="text-white text-4xl opacity-70 hover:opacity-100 transition-colors absolute right-[-60px] sm:right-[-80px] top-1/2 -translate-y-1/2 z-30 bg-black/40 rounded-full p-2">&#8250;</button>
      </div>
    `;
    return modal;
  }

  private abrirModal() {
    this.containerModal.classList.remove('hidden');
    this.atualizarCarrossel();
    // Navegação
    const btnAnterior = this.containerModal.querySelector('#anterior') as HTMLElement;
    const btnProximo = this.containerModal.querySelector('#proximo') as HTMLElement;
    btnAnterior.onclick = (e) => {
      e.stopPropagation();
      this.gerenciador.videoAnterior();
    };
    btnProximo.onclick = (e) => {
      e.stopPropagation();
      this.gerenciador.proximoVideo();
    };
    // Fechar ao clicar fora
    this.containerModal.onclick = (e) => {
      if (e.target === this.containerModal) this.fecharModal();
    };
    // Swipe para mobile
    this.adicionarSwipe();
  }

  private fecharModal() {
    renderizarLayoutInicial();
    // Restaura darkmode conforme preferência do usuário
    if (localStorage.getItem('veedis-dark') === '1') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private atualizarCarrossel() {
    const carrossel = this.containerModal.querySelector('#carrossel-stories') as HTMLElement;
    carrossel.innerHTML = '';
    const idx = this.gerenciador.getIndiceAtual();
    const videos = this.gerenciador.videos;
    // Card anterior (loop)
    const idxAnterior = (idx - 1 + videos.length) % videos.length;
    carrossel.appendChild(this.criarCardLateral(videos[idxAnterior], 'anterior'));
    // Card central
    const cardCentral = document.createElement('div');
    cardCentral.className = 'w-[90vw] h-[70vh] sm:w-80 sm:h-[500px] rounded-3xl bg-black shadow-xl relative overflow-hidden flex flex-col items-center justify-center';

    // Setas internas no mobile
    const setaEsq = document.createElement('button');
    setaEsq.innerHTML = '<svg class="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>';
    setaEsq.className = 'absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-1 sm:hidden z-20 active:bg-black/70';
    setaEsq.onclick = (e) => { e.stopPropagation(); this.gerenciador.videoAnterior(); };
    cardCentral.appendChild(setaEsq);

    const setaDir = document.createElement('button');
    setaDir.innerHTML = '<svg class="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>';
    setaDir.className = 'absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-1 sm:hidden z-20 active:bg-black/70';
    setaDir.onclick = (e) => { e.stopPropagation(); this.gerenciador.proximoVideo(); };
    cardCentral.appendChild(setaDir);

    // Player de vídeo central
    if (this.player) this.player.destruir();
    this.player = new PlayerDeVideo(cardCentral, videos[idx]);
    carrossel.appendChild(cardCentral);
    // Card próximo (loop)
    const idxProximo = (idx + 1) % videos.length;
    carrossel.appendChild(this.criarCardLateral(videos[idxProximo], 'proximo'));
  }

  private criarCardLateral(url: string, tipo: 'anterior' | 'proximo'): HTMLElement {
    // Card lateral com vídeo pausado/mudo
    const card = document.createElement('div');
    card.className = 'w-28 h-72 sm:w-40 sm:h-[400px] rounded-3xl bg-black/60 shadow-lg scale-90 opacity-60 overflow-hidden flex items-center justify-center';
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.className = 'w-full h-full object-cover';
    video.autoplay = true;
    video.controls = false;
    card.appendChild(video);
    return card;
  }

  private adicionarSwipe() {
    // Suporte a swipe para mobile
    let startX = 0;
    let endX = 0;
    const area = this.containerModal.querySelector('#carrossel-stories') as HTMLElement;
    area.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    area.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      if (endX - startX > 50) {
        this.gerenciador.videoAnterior();
      } else if (startX - endX > 50) {
        this.gerenciador.proximoVideo();
      }
    });
  }
}
