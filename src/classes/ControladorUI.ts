// Essa classe cuida da interface: abre o modal, monta o carrossel e faz a navegação dos vídeos
import { GerenciadorDeVideos } from './GerenciadorDeVideos';
import { PlayerDeVideo } from './PlayerDeVideo';
import { renderizarLayoutInicial } from '../main';
import capa1 from '../assets/capas/capa-story-1.jpg';
import capa2 from '../assets/capas/capa-story-2.jpg';
import capa3 from '../assets/capas/capa-story-3.jpg';

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
    // Fundo cinza claro uniforme
    modal.className = 'modal-veedis fixed inset-0 z-50 flex items-center justify-center bg-gray-200';
    modal.innerHTML = `
      <div class="flex items-center gap-4 sm:gap-8 relative">
        <button id="anterior" class="text-gray-500 text-4xl opacity-70 hover:opacity-100 transition-colors absolute left-[-60px] sm:left-[-80px] top-1/2 -translate-y-1/2 z-30 bg-white/60 rounded-full p-2 shadow-md hidden sm:block">&#8249;</button>
        <div id="carrossel-stories" class="flex gap-4 sm:gap-8 items-center"></div>
        <button id="proximo" class="text-gray-500 text-4xl opacity-70 hover:opacity-100 transition-colors absolute right-[-60px] sm:right-[-80px] top-1/2 -translate-y-1/2 z-30 bg-white/60 rounded-full p-2 shadow-md hidden sm:block">&#8250;</button>
      </div>
    `;
    return modal;
  }

  private abrirModal() {
    this.containerModal.classList.remove('hidden');
    this.instanciarPlayerUnico();
    this.atualizarCarrossel();
    // Navegação
    const btnAnterior = this.containerModal.querySelector('#anterior') as HTMLElement;
    const btnProximo = this.containerModal.querySelector('#proximo') as HTMLElement;
    btnAnterior.onclick = (e) => {
      e.stopPropagation();
      this.irParaAnterior();
    };
    btnProximo.onclick = (e) => {
      e.stopPropagation();
      this.irParaProximo();
    };
    // Fechar ao clicar fora
    this.containerModal.onclick = (e) => {
      if (e.target === this.containerModal) this.fecharModal();
    };
    // Swipe para mobile
    this.adicionarSwipe();
  }

  private fecharModal() {
    this.destruirPlayerCentral();
    // Remove todos os <video> do DOM
    document.querySelectorAll('video').forEach((v) => {
      try { v.pause(); v.src = ''; v.load(); if (v.parentNode) v.parentNode.removeChild(v); } catch {}
    });
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
    // Card lateral esquerda
    if (idx > 0) {
      carrossel.appendChild(this.criarCardLateral(videos[idx - 1]));
    } else {
      carrossel.appendChild(this.criarCardVazio());
    }
    // Card central
    let cardCentral = document.createElement('div');
    cardCentral.className = 'w-[320px] h-[540px] sm:w-80 sm:h-[500px] rounded-3xl bg-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center transition-all duration-300';
    cardCentral.id = 'card-central';
    carrossel.appendChild(cardCentral);
    // Se player já existe, só troca o vídeo
    if (this.player) {
      this.player.trocarVideo(videos[idx]);
      cardCentral.appendChild(this.player['elementoVideo']); // Garante que o video está no card central
    }
    // Setas internas no mobile
    if (idx > 0) {
      const setaEsq = this.criarSeta('esq', () => this.irParaAnterior());
      cardCentral.appendChild(setaEsq);
    }
    if (idx < videos.length - 1) {
      const setaDir = this.criarSeta('dir', () => this.irParaProximo());
      cardCentral.appendChild(setaDir);
    } else {
      // No último vídeo, seta direita fecha o modal
      const setaDir = this.criarSeta('dir', () => this.fecharModal());
      cardCentral.appendChild(setaDir);
    }
    // Card lateral direita
    if (idx < videos.length - 1) {
      carrossel.appendChild(this.criarCardLateral(videos[idx + 1]));
    } else {
      carrossel.appendChild(this.criarCardVazio());
    }
  }

  private criarPlayerCentral(container: HTMLElement, url: string) {
    // Não faz mais nada, pois o player é único
  }

  private destruirPlayerCentral() {
    if (this.player) {
      this.player.destruir();
      this.player = null;
    }
    // Limpa o container central se existir
    const cardCentral = document.getElementById('card-central');
    if (cardCentral) cardCentral.innerHTML = '';
  }

  private criarCardLateral(url: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'w-20 h-40 sm:w-40 sm:h-[400px] rounded-3xl bg-white/80 shadow-lg scale-90 opacity-60 overflow-hidden flex items-center justify-center';
    const img = document.createElement('img');
    let capa = capa1;
    if (url.includes('c3abv4sfahyth4dhg1oubn7e')) capa = capa1;
    else if (url.includes('r3hiqe4x47qzjplbbx52g2wu')) capa = capa2;
    else if (url.includes('qiota7lukm4bnga1ks3zn91x')) capa = capa3;
    img.src = capa;
    img.alt = 'Capa do story';
    img.className = 'w-full h-full object-cover';
    card.appendChild(img);
    return card;
  }

  private criarCardVazio(): HTMLElement {
    const vazio = document.createElement('div');
    vazio.className = 'w-20 h-40 sm:w-40 sm:h-[400px] rounded-3xl bg-white/40 opacity-0';
    return vazio;
  }

  private criarSeta(tipo: 'esq' | 'dir', onClick: () => void): HTMLElement {
    const btn = document.createElement('button');
    btn.innerHTML = tipo === 'esq'
      ? '<svg class="w-8 h-8 text-gray-600 drop-shadow-lg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>'
      : '<svg class="w-8 h-8 text-gray-600 drop-shadow-lg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>';
    btn.className = `absolute ${tipo === 'esq' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 bg-white/60 rounded-full p-1 sm:hidden z-20 active:bg-white/80 shadow-md`;
    btn.onclick = (e) => { e.stopPropagation(); onClick(); };
    return btn;
  }

  private irParaAnterior() {
    if (this.gerenciador.getIndiceAtual() > 0) {
      this.gerenciador.setIndiceAtual(this.gerenciador.getIndiceAtual() - 1);
    }
  }

  private irParaProximo() {
    if (this.gerenciador.getIndiceAtual() < this.gerenciador.videos.length - 1) {
      this.gerenciador.setIndiceAtual(this.gerenciador.getIndiceAtual() + 1);
    }
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
        this.irParaAnterior();
      } else if (startX - endX > 50) {
        this.irParaProximo();
      }
    });
  }

  // Cria o player uma única vez
  private instanciarPlayerUnico() {
    const idx = this.gerenciador.getIndiceAtual();
    const videos = this.gerenciador.videos;
    const carrossel = this.containerModal.querySelector('#carrossel-stories') as HTMLElement;
    let cardCentral = carrossel?.querySelector('#card-central') as HTMLElement;
    if (!cardCentral) {
      cardCentral = document.createElement('div');
      cardCentral.className = 'w-[320px] h-[540px] sm:w-80 sm:h-[500px] rounded-3xl bg-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center transition-all duration-300';
      cardCentral.id = 'card-central';
      carrossel?.appendChild(cardCentral);
    }
    if (!this.player) {
      this.player = new PlayerDeVideo(cardCentral, videos[idx]);
    }
  }
}
