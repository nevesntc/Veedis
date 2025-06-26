// Essa classe monta o player do vídeo e os controles (play, pause, volume, fechar, etc)
export class PlayerDeVideo {
  private elementoVideo: HTMLVideoElement;
  private container: HTMLElement;
  private estaEmTelaCheia: boolean = false;

  constructor(container: HTMLElement, url: string) {
    console.log('[PlayerDeVideo] Criando player para:', url);
    this.container = container;
    this.elementoVideo = document.createElement('video');
    this.elementoVideo.src = url;
    this.elementoVideo.controls = false;
    this.elementoVideo.className = 'rounded-2xl w-full h-full object-cover bg-black';
    this.elementoVideo.style.width = '100%';
    this.elementoVideo.style.height = '100%';
    this.elementoVideo.style.maxWidth = '100%';
    this.elementoVideo.style.maxHeight = '100%';
    this.elementoVideo.style.display = 'block';
    this.container.appendChild(this.elementoVideo);
    this.criarControles();
    // Log de debug para saber quantos vídeos existem no DOM
    setTimeout(() => {
      const videos = document.querySelectorAll('video');
      console.log('[PlayerDeVideo] Total de <video> no DOM:', videos.length);
    }, 100);

    // Autoplay ao abrir (mobile e desktop)
    this.elementoVideo.play().catch(() => {});

    // Sincronizar volume do vídeo com o volume do dispositivo (mobile)
    if (window.innerWidth < 640) {
      // Tenta manter o volume do vídeo igual ao do sistema (limitado pelo navegador)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          // Tenta restaurar o volume anterior
          this.elementoVideo.volume = this.elementoVideo.volume;
        }
      });
      // Atualiza o volume do vídeo quando o usuário mexer no volume do celular (se permitido)
      this.elementoVideo.addEventListener('volumechange', () => {
        // No mobile, o volume do sistema geralmente controla o áudio do vídeo
        // Aqui só garantimos que o vídeo não fique mudo sem querer
        if (this.elementoVideo.volume === 0) {
          this.elementoVideo.muted = true;
        } else {
          this.elementoVideo.muted = false;
        }
      });
    }
  }

  private criarControles() {
    // Overlay dos controles
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 flex flex-col justify-between items-center pointer-events-none z-10';
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.opacity = '0';

    // Linha de controles (play/pause, mudo, volume, fechar)
    const controles = document.createElement('div');
    controles.className = 'flex gap-1 sm:gap-2 items-center mb-8 bg-black/70 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 pointer-events-auto shadow-lg';

    // Botão Play/Pause (Material UI)
    const btnPlayPause = document.createElement('button');
    btnPlayPause.innerHTML = `<svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="#fff"/></svg>`;
    btnPlayPause.title = 'Play/Pause';
    btnPlayPause.className = 'focus:outline-none hover:bg-white/10 rounded-full p-0.5 sm:p-1';
    btnPlayPause.onclick = (e) => {
      e.stopPropagation();
      if (this.elementoVideo.paused) {
        this.elementoVideo.play();
      } else {
        this.elementoVideo.pause();
      }
    };
    controles.appendChild(btnPlayPause);

    // Botão Mudo/Unmute (Material UI)
    const btnMudo = document.createElement('button');
    btnMudo.innerHTML = `<svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06A4.978 4.978 0 0 0 16.5 12zm3.5 0c0 2.76-2.24 5-5 5v3h-2v-3H7v-4h2v-4H7V7h4V4h2v3c2.76 0 5 2.24 5 5z" fill="#fff"/></svg>`;
    btnMudo.title = 'Mudo';
    btnMudo.className = 'focus:outline-none hover:bg-white/10 rounded-full p-0.5 sm:p-1';
    btnMudo.onclick = (e) => {
      e.stopPropagation();
      this.elementoVideo.muted = !this.elementoVideo.muted;
      this.atualizarIconeMudo(btnMudo);
    };
    controles.appendChild(btnMudo);

    // Controle de Volume
    const volume = document.createElement('input');
    volume.type = 'range';
    volume.min = '0';
    volume.max = '1';
    volume.step = '0.01';
    volume.value = this.elementoVideo.volume.toString();
    volume.className = 'w-20 accent-pink-500';
    volume.oninput = (e) => {
      e.stopPropagation();
      this.elementoVideo.volume = parseFloat(volume.value);
      if (this.elementoVideo.volume === 0) {
        this.elementoVideo.muted = true;
      } else {
        this.elementoVideo.muted = false;
      }
      this.atualizarIconeMudo(btnMudo);
    };
    controles.appendChild(volume);

    // Botão Fechar (Material UI, ao lado dos controles)
    const btnFechar = document.createElement('button');
    btnFechar.innerHTML = `<svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#222"/><path d="M15.5 8.5l-7 7M8.5 8.5l7 7" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
    btnFechar.title = 'Fechar';
    btnFechar.className = 'focus:outline-none hover:bg-white/10 rounded-full p-0.5 sm:p-1 ml-1 sm:ml-2';
    btnFechar.onclick = (e) => {
      e.stopPropagation();
      document.body.innerHTML = '';
      import('../main').then(m => m.renderizarLayoutInicial());
    };
    controles.appendChild(btnFechar);

    overlay.appendChild(controles);
    this.container.style.position = 'relative';
    this.container.appendChild(overlay);

    // Troca ícone play/pause dinamicamente (Material UI)
    this.elementoVideo.addEventListener('play', () => {
      btnPlayPause.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 19h4.5V5H6v14zm7.5-14v14H18V5h-4.5z" fill="#fff"/></svg>`;
    });
    this.elementoVideo.addEventListener('pause', () => {
      btnPlayPause.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="#fff"/></svg>`;
    });

    // Mostrar controles ao pausar ou mouseover
    const mostrarControles = () => { overlay.style.opacity = '1'; };
    const ocultarControles = () => { if (!this.elementoVideo.paused) overlay.style.opacity = '0'; };
    this.elementoVideo.addEventListener('pause', mostrarControles);
    this.elementoVideo.addEventListener('play', ocultarControles);
    this.container.addEventListener('mouseenter', mostrarControles);
    this.container.addEventListener('mouseleave', ocultarControles);
    overlay.addEventListener('mouseenter', mostrarControles);
    overlay.addEventListener('mouseleave', ocultarControles);
    // Mostra controles ao focar
    this.elementoVideo.addEventListener('focus', mostrarControles);
    this.elementoVideo.addEventListener('blur', ocultarControles);

    // Atualiza o ícone de mudo no início
    this.atualizarIconeMudo(btnMudo);
  }

  private atualizarIconeMudo(btnMudo: HTMLButtonElement) {
    if (this.elementoVideo.muted || this.elementoVideo.volume === 0) {
      btnMudo.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06A4.978 4.978 0 0 0 16.5 12zm3.5 0c0 2.76-2.24 5-5 5v3h-2v-3H7v-4h2v-4H7V7h4V4h2v3c2.76 0 5 2.24 5 5z" fill="#fff"/></svg>`;
    } else {
      btnMudo.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 9v6h4l5 5V4L7 9H3z" fill="#fff"/></svg>`;
    }
  }

  public destruir() {
    console.log('[PlayerDeVideo] Destruindo player:', this.elementoVideo?.src);
    if (this.elementoVideo) {
      // Remove todos os event listeners conhecidos
      this.elementoVideo.onplay = null;
      this.elementoVideo.onpause = null;
      this.elementoVideo.onvolumechange = null;
      this.elementoVideo.onended = null;
      this.elementoVideo.onloadeddata = null;
      this.elementoVideo.oncanplay = null;
      this.elementoVideo.oncanplaythrough = null;
      this.elementoVideo.onerror = null;
      // Pausa e aguarda 100ms antes de destruir (workaround Chromium)
      this.elementoVideo.pause();
      setTimeout(() => {
        try {
          this.elementoVideo.src = '';
          this.elementoVideo.load();
          if (this.elementoVideo.parentNode) {
            this.elementoVideo.parentNode.removeChild(this.elementoVideo);
          }
          // Pausa e limpa DE NOVO após remover do DOM
          try {
            this.elementoVideo.pause();
            this.elementoVideo.src = '';
            this.elementoVideo.load();
          } catch {}
          // Força GC
          // @ts-ignore
          this.elementoVideo = null;
        } catch (e) {
          console.warn('[PlayerDeVideo] Erro ao destruir vídeo:', e);
        }
        this.container.innerHTML = '';
        // Log de debug para saber quantos vídeos existem no DOM após destruir
        setTimeout(() => {
          const videos = document.querySelectorAll('video');
          console.log('[PlayerDeVideo] Após destruir, total de <video> no DOM:', videos.length);
        }, 100);
      }, 100);
    }
  }

  public trocarVideo(url: string) {
    if (!this.elementoVideo) return;
    
    // Fade out
    this.elementoVideo.style.transition = 'opacity 0.08s ease-out';
    this.elementoVideo.style.opacity = '0';
    
    setTimeout(() => {
      // Troca o vídeo
      this.elementoVideo.pause();
      this.elementoVideo.src = url;
      this.elementoVideo.load();
      
      // Fade in
      this.elementoVideo.style.transition = 'opacity 0.08s ease-in';
      this.elementoVideo.style.opacity = '1';
      
      // Play
      this.elementoVideo.play().catch(() => {});
    }, 80);
  }
}
