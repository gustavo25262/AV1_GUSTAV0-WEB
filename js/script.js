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
    lista.innerHTML = "";

    tarefas.forEach(function(tarefa, index) {
        const li = document.createElement("li");

        // Texto da tarefa
        const span = document.createElement("span");
        span.textContent = tarefa;

        // Botão editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function() {
            const novoTexto = prompt("Edite sua tarefa:", tarefa);

            if (validarTarefa(novoTexto)) {
                tarefas[index] = novoTexto.trim();
                renderTarefas();
            }
        };

        // Botão excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = function() {
            tarefas.splice(index, 1);
            renderTarefas();
        };

        // Adicionando tudo no li
        li.appendChild(span);
        li.appendChild(btnEditar);
        li.appendChild(btnExcluir);

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