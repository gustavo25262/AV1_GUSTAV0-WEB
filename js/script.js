"use strict";

const tarefas = [];
let proximoId = 1;

const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=10";

const form = document.querySelector("#formTarefa");
const input = document.querySelector("#inputTarefa");
const lista = document.querySelector("#listaTarefas");
const btnCarregar = document.querySelector("#btnCarregarAPI");
const btnLimpar = document.querySelector("#btnLimpar");
const loading = document.querySelector("#loading");
const alertaErro = document.querySelector("#alertaErro");
const semTarefas = document.querySelector("#semTarefas");

function atualizarEstadoVazio() {
  semTarefas.classList.toggle("d-none", tarefas.length > 0);
}

function renderTarefas() {
  lista.innerHTML = "";

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item" + (tarefa.concluida ? " concluida" : "");

    const link = document.createElement("a");

    link.className = "tarefa-texto";

    link.textContent = tarefa.texto;

    if (tarefa.origem === "api") {
      link.href = `detalhes.html?id=${tarefa.idApi}`;
    }

    const acoes = document.createElement("div");
    acoes.className = "tarefa-acoes";

    const concluir = document.createElement("button");

    concluir.className = "btn btn-success btn-sm";

    concluir.textContent = "✓";

    concluir.onclick = () => {
      tarefas[index].concluida = !tarefas[index].concluida;

      renderTarefas();
    };

    const excluir = document.createElement("button");

    excluir.className = "btn btn-danger btn-sm";

    excluir.textContent = "X";

    excluir.onclick = () => {
      tarefas.splice(index, 1);

      renderTarefas();
    };

    acoes.appendChild(concluir);
    acoes.appendChild(excluir);

    li.appendChild(link);
    li.appendChild(acoes);

    lista.appendChild(li);
  });

  atualizarEstadoVazio();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value.trim() === "") return;

  tarefas.push({
    id: proximoId++,
    texto: input.value.trim(),
    concluida: false,
    origem: "local",
  });

  input.value = "";

  renderTarefas();
});

async function carregarAPI() {
  loading.classList.remove("d-none");

  btnCarregar.disabled = true;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro na API");
    }

    const dados = await response.json();

    dados.forEach((item) => {
      tarefas.push({
        id: proximoId++,
        idApi: item.id,
        texto: item.title,
        concluida: item.completed,
        origem: "api",
      });
    });

    renderTarefas();
  } catch (error) {
    alertaErro.textContent = error.message;

    alertaErro.classList.remove("d-none");
  } finally {
    loading.classList.add("d-none");

    btnCarregar.disabled = false;
  }
}

btnCarregar.addEventListener("click", carregarAPI);

btnLimpar.addEventListener("click", () => {
  tarefas.length = 0;

  renderTarefas();
});

atualizarEstadoVazio();
