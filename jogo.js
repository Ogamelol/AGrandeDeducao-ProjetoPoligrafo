/* Ola professora. Os comentários daqui são todos escritos para um
 * eu futuro quando eu vier reestudar esse código. Há muita coisa que
 * eu preciso memorizar daqui, então estou deixando explicado para caso
 * eu volte para agarrar qualquer dia.
 */

const CONFIG = {
  fundo: "assets/fundo.webp",   
  nome: "Holmes",              
  voltarPara: "index.html",    
  velocidade: 22,              
};

const PORTRAITS = {
  normal: "assets/portraits/normal.png",
  feliz:  "assets/portraits/feliz.png",
  triste: "assets/portraits/triste.png",
  pensando: "assets/portraits/pensando.png",
  irritado: "assets/portraits/irritado.png",
};

/* Cada fala é { texto: "...", retrato: "normal" }.
   Se tirar o "retrato", a fala mantém o portrait anterior.
   Se quiser outro nome na caixinha só nessa fala, adicione nome: "Outro". */

const INTRODUCAO = [
  { texto: "Olá, cidadão! Você é um dos suspeitos do atual caso da cidade.",      retrato: "normal" },
  { texto: "E ninguém melhor que eu, o grande Sherlock Holmes para interroga-lo...",       retrato: "pensando"  },
  { texto: "Pessoalmente, claro!",      retrato: "normal" },
  { texto: "Duvidas? Não? Muito bem, vamos começar!", retrato: "feliz" },
];

const PERGUNTAS = [
  { pergunta: "Afinal, você conhecia a vítima?", retrato: "feliz",
    sim: { texto: "Óbvio, apenas. Caso contrário você não seria acusado, né?", retrato: "normal"  },
    nao: { texto: "Interessante, no mínimo. Mas suspeito, sabe?", retrato: "pensando" } },

  { pergunta: "Vocês se viam frequentemente?", retrato: "feliz",
    sim: { texto: "Então eram próximas, não? Bacana.", retrato: "normal"  },
    nao: { texto: "Credo, como você ficou como suspeito então?", retrato: "pensando" } },

  { pergunta: "Você vivia próximo?", retrato: "feliz",
    sim: { texto: "Vizinhos trocam bastante contato durante a semana, legal, não?", retrato: "normal"  },
    nao: { texto: "Bom, era um condominio fechado, então era difícil mesmo.", retrato: "pensando" } },

  { pergunta: "Trabalhava com a vitíma?", retrato: "feliz",
    sim: { texto: "O ambiente de trabalho geralmente é bem competitivo pelo que ouço.", retrato: "normal"  },
    nao: { texto: "Já pensou em trabalhar em uma empresa dessas?.", retrato: "pensando" } },

  { pergunta: "Estava próximo no dia?", retrato: "feliz",
    sim: { texto: "Isso confirma a evidência do dia.", retrato: "normal"  },
    nao: { texto: "Me pergunto então...", retrato: "pensando" } },

  { pergunta: "Viu a vitíma no dia?", retrato: "feliz",
    sim: { texto: "Ahhh, ótimo então! Diga-me...", retrato: "normal"  },
    nao: { texto: "Nada que contradiza a evidência...", retrato: "pensando" } },

  { pergunta: "Conversou sobre algo com a vitíma? Seja pessoalmente ou online.", retrato: "feliz",
    sim: { texto: "Muitissimo interessante. Vamos continuar.", retrato: "normal"  },
    nao: { texto: "Contato continua possivel, mas...", retrato: "pensando" } },

  { pergunta: "Já teve algo contra a vítima?", retrato: "feliz",
    sim: { texto: "Você sabe da sua posição, né?", retrato: "normal"  },
    nao: { texto: "Que lindo. Amizades devem ser fortes!", retrato: "normal" } },

  { pergunta: "A vitíma já te fez algum mal?", retrato: "feliz",
    sim: { texto: "É uma pena. Mas sabe, você não retribui desse jeito.", retrato: "normal"  },
    nao: { texto: "Isso já elimina uma trama na infância também!.", retrato: "pensando" } },

  { pergunta: "Por fim. Queria algo da vítima?", retrato: "feliz",
    sim: { texto: "Acho que ouvi o suficiente.", retrato: "normal"  },
    nao: { texto: "Acho que ouvi o suficiente.", retrato: "normal" } },
];


const FINAIS = {
  1: [
    { texto: "Foi infrutífero, tudo isso. Devo ter me confundido de indíviduo.", retrato: "pensando" },
    { texto: "Você está livre para ir. Obrigado pelo seu tempo!", retrato: "normal" },
  ],
  2: [
    { texto: "Posso dizer com confiança que você tem envolvimento.", retrato: "pensando" },
    { texto: "Já lhe adianto, vou adorar fazer mais perguntas — Na delegacia!", retrato: "normal"  },
  ],
  3: [
    { texto: "Acho que não há o por que manter a persona. Eu sei que foi você.", retrato: "irritado" },
    { texto: "Eu vou leva-lo comigo. Agora.", retrato: "irritado" },
  ],
};

function escolherFinal(pontos) {
  if (pontos <= 5) return 1;
  if (pontos <= 8) return 2;
  return 3;
}

/* Isso aqui é o motor, é onde tudo que é "base" entra. Serve pra preparar
 * O que vai ser preenchido aqui em cima 
 * legal, né */

const jogoEl     = document.getElementById("jogo");
const cenarioEl  = document.getElementById("cenario");
const portraitEl = document.getElementById("portrait");
const nomeEl     = document.getElementById("nome");
const textoEl    = document.getElementById("texto");
const setaEl     = document.getElementById("seta");
const escolhasEl = document.getElementById("escolhas");
const btnSim     = document.getElementById("btn-sim");
const btnNao     = document.getElementById("btn-nao");
const fadeEl     = document.getElementById("fade");

let avancar = null; // Isso é o que faz o texto avançar no clique. Toda vez que é chamada.

/* Isso aqui é o que vai puxar a questão do clique. Aproveitei e aprendi
 * como adicionar a opção de tecla, que eu nunca tive a necessidade de usar.
 * Então... Aproveitar, né? Acho que dá pra usar mais quando eu fizer pong no
 * HTML. Só preciso aprender a como raios fazer aquela "física". */


jogoEl.addEventListener("click", (e) => {
  if (e.target.closest(".botao")) return;
  if (avancar) avancar();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (e.target.closest && e.target.closest(".botao")) return;
    e.preventDefault();
    if (avancar) avancar();
  }
});

/* isso é pra puxar o portrait, a chave é declarada
 * na const lá em cima. */

function mostrarRetrato(chave) {
  if (!chave) return;
  const src = PORTRAITS[chave];
  if (src) portraitEl.src = src;
}

/* Isso é uma function que eu não realmente usei da maneira comum, mas ela
 * também era usada nas perguntas, então veio junto. O uso comum é tipo naqueles
 * dialogos que são cortados instantaneamente depois de todo texto ser mostrado. Nesse
 * caso, eles estão sendo cortados pela caixa de sim ou não */

function falar(fala, esperar = true) {
  return new Promise((resolve) => {
    mostrarRetrato(fala.retrato);
    nomeEl.textContent = fala.nome || CONFIG.nome;
    textoEl.textContent = "";
    setaEl.classList.remove("visivel");

    let i = 0;
    let digitando = true;
    let timer = null;

    function terminarDigitacao() {
      clearInterval(timer);
      digitando = false;
      textoEl.textContent = fala.texto;
      if (esperar) {
        setaEl.classList.add("visivel");
      } else {
        avancar = null;
        resolve();
      }
    }

    avancar = () => {
      if (digitando) {
        terminarDigitacao();
      } else if (esperar) {
        avancar = null;
        resolve();
      }
    };

    if (CONFIG.velocidade <= 0) {
      terminarDigitacao();
    } else {
      timer = setInterval(() => {
        i++;
        textoEl.textContent = fala.texto.slice(0, i);
        if (i >= fala.texto.length) terminarDigitacao();
      }, CONFIG.velocidade);
    }
  });
}

async function falarTodas(lista) {
  for (const fala of lista) await falar(fala);
}

/* Isso é só um jeito bem bestinha de diferenciar o sim e o não. Bom, ainda é melhor que o que
 * eu tava pensando antes (dar valor individual para cada resposta). */

async function perguntar(p) {
  await falar({ texto: p.pergunta, retrato: p.retrato }, false);
  escolhasEl.hidden = false;
  btnSim.focus({ preventScroll: true });

  return new Promise((resolve) => {
    function responder(resposta) {
      escolhasEl.hidden = true;
      btnSim.onclick = null;
      btnNao.onclick = null;
      resolve(resposta);
    }
    btnSim.onclick = () => responder(true);
    btnNao.onclick = () => responder(false);
  });
}

/* É só o fade. Preciso explicar? Até você sabe fazer isso
 * em pleno 2026, vai reestudar algo mais interessante. */

function esperar(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fadeIn() {
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  fadeEl.classList.remove("ativo");
  await esperar(1200);
}

async function fadeOut() {
  fadeEl.classList.add("ativo");
  await esperar(1200);
}

/* Isso é pra carregar as imagens antes de começar totalmente. Tem a magia usando o error ali, aquilo
 * é para caso a imagem não carregue, ai só ignora a troca */

function carregar(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve; 
    img.src = src;
  });
}

/* Isso é mais para organizar mesmo, vai pegar tudo essas funções e transportar para a trabalhar lá em cima. */

async function iniciar() {
  cenarioEl.style.backgroundImage = `url("${CONFIG.fundo}")`;
  await Promise.all([CONFIG.fundo, ...Object.values(PORTRAITS)].map(carregar));

  mostrarRetrato(INTRODUCAO[0] && INTRODUCAO[0].retrato);
  fadeIn();

  let pontos = 0;

  await falarTodas(INTRODUCAO);

  for (const p of PERGUNTAS) {
    const sim = await perguntar(p);
    if (sim) pontos++;
    await falar(sim ? p.sim : p.nao);
  }

  await falarTodas(FINAIS[escolherFinal(pontos)]);

  await fadeOut();
  window.location.href = CONFIG.voltarPara;
}

iniciar();

