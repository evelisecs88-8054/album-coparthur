const SUPABASE_URL = "https://jvksikafenrgtregyscf.supabase.coL";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2a3Npa2FmZW5yZ3RyZWd5c2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2NjQsImV4cCI6MjA5NTIwNjY2NH0.MwHuuoPHRZ1qP0vom8cfxD1jwT6T0C7eH6f4mkdHqTw";

// Supabase v2 (forma correta)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const selecoes = [
  "MEX","RSA","KOR","CZE","CAN","BIH","QAT","SUI","BRA","MAR",
  "HAI","SCO","USA","PAR","AUS","TUR","GER","CUW","CIV","ECU",
  "NED","JPN","SWE","TUN","BEL","EGY","IRN","NZL","ESP","CPV",
  "KSA","URU","FRA","SEN","IRQ","NOR","ARG","ALG","AUT","JOR",
  "POR","COD","UZB","COL","ENG","CRO","GHA","PAN"
];

let figurinhas = [];

// 🔥 CARREGAR DADOS
async function carregarFigurinhas() {
  const { data, error } = await supabase
    .from("figurinhas")
    .select("*");

  if (error) {
    console.error("Erro ao carregar:", error);
    return;
  }

  figurinhas = data || [];
  atualizarTela();
}

// 💾 SALVAR
async function salvarFigurinha(figurinha) {
  const { error } = await supabase
    .from("figurinhas")
    .insert([figurinha]);

  if (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao salvar figurinha!");
    return;
  }

  await carregarFigurinhas();
}

// ➕ ADICIONAR
async function adicionarFigurinha() {
  const selecao = document.getElementById("selecao").value;
  const numero = document.getElementById("numero").value;
  const status = document.getElementById("status").value;

  if (!selecao || !numero) {
    alert("Preencha os campos!");
    return;
  }

  const novaFigurinha = {
    selecao,
    numero: Number(numero),
    status
  };

  await salvarFigurinha(novaFigurinha);

  document.getElementById("selecao").value = "";
  document.getElementById("numero").value = "";
}

// ❌ REMOVER
async function removerFigurinha(id) {
  const { error } = await supabase
    .from("figurinhas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao remover:", error);
    return;
  }

  await carregarFigurinhas();
}

// 🖥️ ATUALIZAR TELA
function atualizarTela() {
  const listaColadas = document.getElementById("listaColadas");
  const listaRepetidas = document.getElementById("listaRepetidas");
  const listaFaltando = document.getElementById("listaFaltando");

  listaColadas.innerHTML = "";
  listaRepetidas.innerHTML = "";
  listaFaltando.innerHTML = "";

  const coladas = figurinhas.filter(f => f.status === "colada");
  const repetidas = figurinhas.filter(f => f.status === "repetida");

  // COLADAS
  coladas.forEach(fig => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${fig.selecao} - ${fig.numero}
      <button onclick="removerFigurinha(${fig.id})">❌</button>
    `;
    listaColadas.appendChild(li);
  });

  // REPETIDAS
  repetidas.forEach(fig => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${fig.selecao} - ${fig.numero}
      <button onclick="removerFigurinha(${fig.id})">❌</button>
    `;
    listaRepetidas.appendChild(li);
  });

  // FALTANDO
  const coladasIds = coladas.map(f => `${f.selecao}-${f.numero}`);

  selecoes.forEach(selecao => {
    for (let i = 1; i <= 20; i++) {
      const id = `${selecao}-${i}`;

      if (!coladasIds.includes(id)) {
        const li = document.createElement("li");
        li.textContent = `${selecao} - ${i}`;
        listaFaltando.appendChild(li);
      }
    }
  });

  // RESUMO
  document.getElementById("totalColadas").textContent = coladas.length;
  document.getElementById("totalRepetidas").textContent = repetidas.length;
  document.getElementById("totalFaltando").textContent = listaFaltando.children.length;
}

// 🚀 INICIAR
carregarFigurinhas();