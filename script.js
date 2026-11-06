// Eu vou explicar aqui se nao eu esqueço como explicar que nem um idiota, mas o plano foi
// fazer cada lupinha ser reconhecida individualmente, mas com um detalhe
// elas ainda vao todas receber a mesma animação do css. Oq ajuda, sério.
// agradeço ao zézinho do Reddit cujo eu arranquei isso.
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".background-grid");
  const rootStyles = getComputedStyle(document.documentElement);
  const tileSize = parseFloat(rootStyles.getPropertyValue("--tamanho-tile")) || 112;

  function montarGrade() {
    const colunasVisiveis = Math.ceil(window.innerWidth / tileSize);
    const linhasVisiveis = Math.ceil(window.innerHeight / tileSize);
    const margemTiles = 5;
    const colunas = colunasVisiveis + margemTiles * 2;
    const linhas = linhasVisiveis + margemTiles * 2;

    grid.replaceChildren();
    grid.style.left = `${-margemTiles * tileSize}px`;
    grid.style.top = `${-margemTiles * tileSize}px`;
    grid.style.gridTemplateColumns = `repeat(${colunas}, ${tileSize}px)`;
    grid.style.gridTemplateRows = `repeat(${linhas}, ${tileSize}px)`;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < colunas * linhas; i += 1) {
      const tile = document.createElement("div");
      tile.className = "lupa-tile";
      fragment.appendChild(tile);
    }
    grid.appendChild(fragment);
  }

  montarGrade();
  window.addEventListener("resize", montarGrade, { passive: true });

  const playButton = document.querySelector(".botao-play");
  if (playButton) playButton.setAttribute("aria-label", "Jogar");
});
