"use strict";

const loading = document.querySelector("#loading");

const erro = document.querySelector("#erro");

const card = document.querySelector("#cardDetalhes");

const titulo = document.querySelector("#titulo");

const id = document.querySelector("#id");

const userId = document.querySelector("#userId");

const status = document.querySelector("#status");

const params = new URLSearchParams(window.location.search);

const tarefaId = params.get("id");

async function carregarDetalhes() {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${tarefaId}`,
    );

    if (!response.ok) {
      throw new Error("Tarefa não encontrada");
    }

    const tarefa = await response.json();

    titulo.textContent = tarefa.title;

    id.textContent = tarefa.id;

    userId.textContent = tarefa.userId;

    status.textContent = tarefa.completed ? "Concluída" : "Pendente";

    loading.classList.add("d-none");

    card.classList.remove("d-none");
  } catch (error) {
    loading.classList.add("d-none");

    erro.textContent = error.message;

    erro.classList.remove("d-none");
  }
}

carregarDetalhes();
