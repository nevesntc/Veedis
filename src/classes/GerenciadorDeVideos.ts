// Essa classe gerencia a lista de vídeos e qual está ativo. É tipo um singleton pra manter o estado.
export class GerenciadorDeVideos {
  private static instancia: GerenciadorDeVideos;
  private indiceAtual: number = 0;
  private observadores: Array<() => void> = [];
  public videos: string[] = [
    'https://storage.googleapis.com/veedis-teste/c3abv4sfahyth4dhg1oubn7e.mp4',
    'https://storage.googleapis.com/veedis-teste/r3hiqe4x47qzjplbbx52g2wu.mp4',
    'https://storage.googleapis.com/veedis-teste/qiota7lukm4bnga1ks3zn91x.mp4',
  ];

  private constructor() {}

  public static getInstancia(): GerenciadorDeVideos {
    if (!GerenciadorDeVideos.instancia) {
      GerenciadorDeVideos.instancia = new GerenciadorDeVideos();
    }
    return GerenciadorDeVideos.instancia;
  }

  public getIndiceAtual(): number {
    return this.indiceAtual;
  }

  public setIndiceAtual(indice: number): void {
    if (indice >= 0 && indice < this.videos.length) {
      this.indiceAtual = indice;
      this.notificar();
    }
  }

  public proximoVideo(): void {
    if (this.indiceAtual < this.videos.length - 1) {
      this.indiceAtual++;
    } else {
      this.indiceAtual = 0; // Loop para o primeiro
    }
    this.notificar();
  }

  public videoAnterior(): void {
    if (this.indiceAtual > 0) {
      this.indiceAtual--;
    } else {
      this.indiceAtual = this.videos.length - 1; // Loop para o último
    }
    this.notificar();
  }

  public adicionarObservador(obs: () => void): void {
    this.observadores.push(obs);
  }

  private notificar(): void {
    this.observadores.forEach(obs => obs());
  }
}