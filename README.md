# Veedis - Teste Frontend

Esse projeto foi feito para o teste de vaga de dev fullstack no Veedis, focando no frontend. Aqui usei Vite.js, TailwindCSS (v3.4.17) e Typescript, tudo sem frameworks extras, só JS/TS puro mesmo.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o projeto em modo dev:
   ```bash
   npm run dev
   ```

## Como funciona
- Quando a página carrega, aparece uma bolinha tipo "story" do Instagram. Se clicar nela, abre um carrossel de vídeos no meio da tela.
- O carrossel mostra um vídeo grande no centro e os próximos/anteriores menores do lado, igual stories mesmo.
- Dá pra navegar pelos vídeos usando as setas ou arrastando pro lado (no celular).
- Tem controles de play/pause, volume, mudo e um botão de fechar junto dos controles.
- O darkmode pode ser trocado pelo botão no topo, e a preferência fica salva.

## Organização do código
- O código está separado em classes:
  - `ControladorUI`: cuida da interface, abre/fecha o modal e monta o carrossel.
  - `GerenciadorDeVideos`: gerencia a lista de vídeos e qual está ativo.
  - `PlayerDeVideo`: monta o player do vídeo e os controles.
- Os estilos estão no Tailwind, então é só usar as classes direto no HTML/JS.
- Os comentários do código são bem diretos, explicando o que cada parte faz.

## Deploy no Vercel

- O projeto já está pronto para deploy no Vercel.
- Basta importar o repositório no Vercel, ele detecta o Vite automaticamente.
- O comando de build é `vite build` e o de preview é `vite preview`.
- Não precisa configurar nada extra, só subir!

## Observações
- Tudo em português.
- Não usei frameworks, só Typescript e JS nativo.
- Tentei deixar o código organizado e fácil de entender, focando em responsividade e experiência de usuário.

## Instruções do Teste
- Implemente um vídeo flutuante que aparece ao carregar a página.
- Ao clicar, abrir em tela cheia com outros vídeos relacionados.
- Controles: play/pause, volume, mudo, navegação entre vídeos, fechar/reabrir.
- Foco em UX, responsividade e organização.

