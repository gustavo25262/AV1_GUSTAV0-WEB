"use strict";

// ---- Referências ao DOM ----
const form         = document.querySelector("#formTarefa");
const input        = document.querySelector("#inputTarefa");
const lista        = document.querySelector("#listaTarefas");
const mensagemErro = document.querySelector("#mensagemErro");
const btnCarregar  = document.querySelector("#btnCarregarAPI");
const btnLimpar    = document.querySelector("#btnLimpar");
const loading      = document.querySelector("#loading");
const alertaErro   = document.querySelector("#alertaErro");
const textoErro    = document.querySelector("#textoErro");
const semTarefas   = document.querySelector("#semTarefas");

// ---- Estado ----
const tarefas = [];
let proximoId = 1;

const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=10";

// ---- Auxiliares ----
function setLoading(ativo) {
  loading.classList.toggle("d-none", !ativo);
}

function setErroAPI(mensagem) {
  if (mensagem) {
    textoErro.textContent = mensagem;
    alertaErro.classList.remove("d-none");
  } else {
    alertaErro.classList.add("d-none");
  }
}

function validarTarefa(texto) {
  if (!texto || texto.trim() === "") {
    mensagemErro.textContent = "⚠️ Digite uma tarefa válida.";
    input.focus();
    return false;
  }
  mensagemErro.textContent = "";
  return true;
}

function atualizarEstadoVazio() {
  semTarefas.classList.toggle("d-none", tarefas.length > 0);
}

// ---- Renderização ----
function renderTarefas() {
  lista.innerHTML = "";

  tarefas.forEach(function (tarefa, index) {
    const li = document.createElement("li");
    li.className = "list-group-item" + (tarefa.concluida ? " concluida" : "");

    const span = document.createElement("span");
    span.className = "tarefa-texto";
    span.textContent = tarefa.texto;

    if (tarefa.origem === "api") {
      const badge = document.createElement("span");
      badge.className = "badge-api";
      badge.textContent = "API";
      span.appendChild(badge);
    }

    const acoes = document.createElement("div");
    acoes.className = "tarefa-acoes";

    const btnConcluir = document.createElement("button");
    btnConcluir.className = tarefa.concluida ? "btn btn-sm btn-secondary" : "btn btn-sm btn-success";
    btnConcluir.innerHTML = tarefa.concluida
      ? '<i class="bi bi-arrow-counterclockwise"></i> <span>Desfazer</span>'
      : '<i class="bi bi-check-lg"></i> <span>Concluir</span>';
    btnConcluir.onclick = function () {
      tarefas[index].concluida = !tarefas[index].concluida;
      renderTarefas();
    };

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-sm btn-warning";
    btnEditar.innerHTML = '<i class="bi bi-pencil"></i> <span>Editar</span>';
    btnEditar.onclick = function () { ativarEdicao(li, index); };

    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btn btn-sm btn-danger";
    btnExcluir.innerHTML = '<i class="bi bi-trash"></i> <span>Excluir</span>';
    btnExcluir.onclick = function () {
      tarefas.splice(index, 1);
      renderTarefas();
      atualizarEstadoVazio();
    };

    acoes.appendChild(btnConcluir);
    acoes.appendChild(btnEditar);
    acoes.appendChild(btnExcluir);

    li.appendChild(span);
    li.appendChild(acoes);
    lista.appendChild(li);
  });

  atualizarEstadoVazio();
}

function ativarEdicao(li, index) {
  li.innerHTML = "";

  const inputEdit = document.createElement("input");
  inputEdit.type = "text";
  inputEdit.className = "input-edicao";
  inputEdit.value = tarefas[index].texto;
  inputEdit.focus();

  const acoes = document.createElement("div");
  acoes.className = "tarefa-acoes";

  const btnSalvar = document.createElement("button");
  btnSalvar.className = "btn btn-sm btn-primary";
  btnSalvar.innerHTML = '<i class="bi bi-floppy"></i> <span>Salvar</span>';
  btnSalvar.onclick = function () {
    if (validarTarefa(inputEdit.value)) {
      tarefas[index].texto = inputEdit.value.trim();
      mensagemErro.textContent = "";
      renderTarefas();
    }
  };

  inputEdit.addEventListener("keydown", function (e) {
    if (e.key === "Enter") btnSalvar.click();
    if (e.key === "Escape") renderTarefas();
  });

  const btnCancelar = document.createElement("button");
  btnCancelar.className = "btn btn-sm btn-secondary";
  btnCancelar.innerHTML = '<i class="bi bi-x-lg"></i> <span>Cancelar</span>';
  btnCancelar.onclick = function () { renderTarefas(); };

  acoes.appendChild(btnSalvar);
  acoes.appendChild(btnCancelar);

  li.appendChild(inputEdit);
  li.appendChild(acoes);
}

// ---- Consumo de API com fetch + async/await ----
async function carregarDaAPI() {
  setLoading(true);
  setErroAPI(null);
  btnCarregar.disabled = true;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const dados = await response.json();

    dados.forEach(function (item) {
      tarefas.push({
        id:        proximoId++,
        texto:     item.title,
        concluida: item.completed,
        origem:    "api",
      });
    });

    renderTarefas();

  } catch (erro) {
    setErroAPI("Não foi possível carregar os dados da API. " + erro.message);
    console.error("Erro ao consumir API:", erro);
  } finally {
    setLoading(false);
    btnCarregar.disabled = false;
  }
}

// ---- Eventos ----
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const texto = input.value;
  if (!validarTarefa(texto)) return;

  tarefas.push({
    id:        proximoId++,
    texto:     texto.trim(),
    concluida: false,
    origem:    "local",
  });

  renderTarefas();
  input.value = "";
  input.focus();
});

btnCarregar.addEventListener("click", function () {
  carregarDaAPI();
});

btnLimpar.addEventListener("click", function () {
  if (tarefas.length === 0) return;
  if (!confirm("Deseja realmente remover todas as tarefas?")) return;
  tarefas.length = 0;
  renderTarefas();
  setErroAPI(null);
});

// ---- Inicialização ----
atualizarEstadoVazio();