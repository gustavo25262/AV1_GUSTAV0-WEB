const tarefas = [];


const form = document.querySelector("#formTarefa");
const input = document.querySelector("#inputTarefa");
const lista = document.querySelector("#listaTarefas");
const mensagemErro = document.querySelector("#mensagemErro");

function renderTarefas() {
    lista.textContent = "";
    
    tarefas.forEach(function(tarefas) {
        const li = document.createElement("li");
        li.textContent = tarefas;
        lista.appendChild(li);
    });
}



form.addEventListener("submit", function(event){
    event.preventDefault();

    const texto = input.value;

    // if (!validarTarefa(texto)) {
    //     return;

    // }
    
    tarefas.push(texto);

    renderTarefas();

    input.value = "";
});

