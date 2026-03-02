const tarefas = [];

const form = document.querySelector("#formTarefa");
const input = document.querySelector("#inputTarefa");
const lista = document.querySelector("#listaTarefas");
const mensagemErro = document.querySelector("#mensagemErro");

function validarTarefa(texto) {
    if (texto.trim() === "") {
        mensagemErro.textContent = "Digite uma tarefa válida.";
        return false;
    }

    mensagemErro.textContent = "";
    return true;
}

function renderTarefas() {
    lista.textContent = "";

    tarefas.forEach(function(tarefa) {
        const li = document.createElement("li");
        li.textContent = tarefa;
        lista.appendChild(li);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const texto = input.value;

    if (!validarTarefa(texto)) {
        return;
    }

    tarefas.push(texto.trim());

    renderTarefas();

    input.value = "";
});