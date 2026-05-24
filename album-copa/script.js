const TOTAL_ALBUM = selecoes.length * 20;

let figurinhas = JSON.parse(localStorage.getItem("figurinhas")) || [];

const selecoes = [
  "MEX",
  "RSA",
  "KOR",
  "CZE",
  "CAN",
  "BIH",
  "QAT",
  "SUI",
  "BRA",
  "MAR",
  "HAI",
  "SCO",
  "USA",
  "PAR",
  "AUS",
  "TUR",
  "GER",
  "CUW",
  "CIV",
  "ECU",
  "NED",
  "JPN",
  "SWE",
  "TUN",
  "BEL",
  "EGY",
  "IRN",
  "NZL",
  "ESP",
  "CPV",
  "KSA",
  "URU",
  "FRA",
  "SEN",
  "IRQ",
  "NOR",
  "ARG",
  "ALG",
  "AUT",
  "JOR",
  "POR",
  "COD",
  "UZB",
  "COL",
  "ENG",
  "CRO",
  "GHA",
  "PAN"
];

function salvarDados() {

  localStorage.setItem(
    "figurinhas",
    JSON.stringify(figurinhas)
  );
}

function adicionarFigurinha() {

  const selecao =
    document.getElementById("selecao").value;

  const numero =
    document.getElementById("numero").value;

  const status =
    document.getElementById("status").value;

  if(selecao === "" || numero === ""){

    alert("Preencha os campos!");
    return;
  }

  // impede duplicidade
  const jaExiste = figurinhas.find(
    f =>
      f.selecao === selecao &&
      f.numero == numero &&
      f.status === "colada"
  );

  if(status === "colada" && jaExiste){

    alert("Essa figurinha já foi colada!");
    return;
  }

  figurinhas.push({
    selecao,
    numero: Number(numero),
    status
  });

  salvarDados();

  document.getElementById("selecao").value = "";
  document.getElementById("numero").value = "";

  atualizarTela();
}

function removerFigurinha(index){

  figurinhas.splice(index, 1);

  salvarDados();

  atualizarTela();
}

function atualizarTela(){

  const listaColadas =
    document.getElementById("listaColadas");

  const listaRepetidas =
    document.getElementById("listaRepetidas");

  const listaFaltando =
    document.getElementById("listaFaltando");

  listaColadas.innerHTML = "";
  listaRepetidas.innerHTML = "";
  listaFaltando.innerHTML = "";

  const coladas =
    figurinhas.filter(f => f.status === "colada");

  const repetidas =
    figurinhas.filter(f => f.status === "repetida");

  // COLADAS
  coladas.forEach((fig, index) => {

    const li = document.createElement("li");

    li.innerHTML = `
      ${fig.selecao} - ${fig.numero}
      <button onclick="removerFigurinha(${index})">
        ❌
      </button>
    `;

    listaColadas.appendChild(li);
  });

  // REPETIDAS
  repetidas.forEach((fig, index) => {

    const li = document.createElement("li");

    li.innerHTML = `
      ${fig.selecao} - ${fig.numero}
      <button onclick="removerFigurinha(${index})">
        ❌
      </button>
    `;

    listaRepetidas.appendChild(li);
  });

  // FALTANDO
  const coladasIds = coladas.map(
    f => `${f.selecao}-${f.numero}`
  );

  selecoes.forEach(selecao => {

    for(let i = 1; i <= 20; i++){

      const id = `${selecao}-${i}`;

      if(!coladasIds.includes(id)){

        const li = document.createElement("li");

        li.textContent =
          `${selecao} - ${i}`;

        listaFaltando.appendChild(li);
      }
    }
  });

  // RESUMO
  document.getElementById("totalColadas").textContent =
    coladas.length;

  document.getElementById("totalRepetidas").textContent =
    repetidas.length;

  document.getElementById("totalFaltando").textContent =
    listaFaltando.children.length;
}

atualizarTela();