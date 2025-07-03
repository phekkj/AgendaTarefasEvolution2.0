// inicializacao
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnVerTodas").addEventListener("click", function() {
    const todasTarefasSection = document.getElementById("todasTarefasSection");
    todasTarefasSection.classList.toggle("d-none");
    this.innerHTML = todasTarefasSection.classList.contains("d-none") ? 
      '<i class="fas fa-list me-2"></i>Ver Todas as Tarefas' : 
      '<i class="fas fa-eye-slash me-2"></i>Ocultar Tarefas';
  });

  filtrarTarefas();
  exibirTarefasDeHoje();
  updateStats();
  exibirTarefasConcluidas();

  document.getElementById("pesquisaTarefa").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      filtrarTarefas();
    }
  });
});

// criar tarefa
function criarTarefa() {
  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const dataInput = document.getElementById("data").value; 
  const importancia = document.getElementById("importancia").value;

  if (!nome || !descricao || !dataInput || !importancia) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const novaTarefa = {
    tarefa: nome,
    descricao: descricao,
    data: dataInput, 
    importancia: importancia
  };

  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.push(novaTarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  
  document.getElementById("formTarefa").reset();
  filtrarTarefas();
  exibirTarefasDeHoje();
  updateStats();
}

function renderizarTarefa(tarefa, index, elementoContainer) {
  const dataFormatada = formatarDataParaExibicao(tarefa.data);
  const importancia = tarefa.importancia;
  
  const taskElement = document.createElement("div");
  taskElement.className = `card-task card mb-3 ${importancia === 'Alta' ? 'task-high' : importancia === 'Média' ? 'task-medium' : 'task-low'}`;
  taskElement.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="task-title mb-1">${tarefa.tarefa}</h5>
          <p class="mb-2">${tarefa.descricao}</p>
          <div class="d-flex align-items-center">
            <span class="badge badge-importance bg-${importancia === 'Alta' ? 'danger' : importancia === 'Média' ? 'warning text-dark' : 'success'} me-2">
              <i class="fas ${importancia === 'Alta' ? 'fa-exclamation-circle' : importancia === 'Média' ? 'fa-balance-scale' : 'fa-arrow-down'} me-1"></i>
              ${importancia}
            </span>
            <span class="task-date"><i class="far fa-calendar me-1"></i>${dataFormatada}</span>
          </div>
        </div>
        <div class="d-flex flex-column align-items-end position-absolute top-0 end-0 m-2">
          <button class="btn btn-sm btn-outline-success mb-2" onclick="concluirTarefa(${index})">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-sm btn-outline-primary mb-2" onclick="abrirModalEdicao(${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirTarefa(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  elementoContainer.appendChild(taskElement);
}

// dia, ano, mes, ordem certa
function eDataDeHoje(dataString) {
  const [ano, mes, dia] = dataString.split('-');
  const hoje = new Date();
  
  return (
    parseInt(dia) === hoje.getDate() &&
    parseInt(mes) === (hoje.getMonth() + 1) &&
    parseInt(ano) === hoje.getFullYear()
  );
}

function formatarDataParaExibicao(dataString) {
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

function exibirTarefasDeHoje() {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  const listaHoje = document.getElementById("tarefasHoje");
  listaHoje.innerHTML = "";

  let contadorHoje = 0;
  
  tarefas.forEach((tarefa, index) => {
    if (eDataDeHoje(tarefa.data)) {
      contadorHoje++;
      renderizarTarefa(tarefa, index, listaHoje);
    }
  });
  
  document.getElementById("todayTaskCounter").textContent = `${contadorHoje} ${contadorHoje === 1 ? 'tarefa' : 'tarefas'}`;
  
  if (contadorHoje === 0) {
    listaHoje.innerHTML = `
      <div class="no-tasks-today">
        <i class="fas fa-calendar-check"></i>
        <p>Nenhuma tarefa para hoje</p>
      </div>
    `;
  }
}

// filtro
function filtrarTarefas() {
  const select = document.querySelector("#filtroImportancia");
  const valorSelecionado = select.value;
  const pesquisaTexto = document.querySelector("#pesquisaTarefa").value.toLowerCase();
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  const lista = document.getElementById("listaTarefas");
  lista.innerHTML = "";

  let tarefasFiltradas = 0;
  
  tarefas.forEach((tarefa, index) => {
    const nome = tarefa.tarefa.toLowerCase();
    const importancia = tarefa.importancia;
    
    const combinaFiltro = valorSelecionado === "" || importancia === valorSelecionado;
    const combinaBusca = nome.includes(pesquisaTexto) || pesquisaTexto === "";
    
    if (combinaFiltro && combinaBusca) {
      tarefasFiltradas++;
      renderizarTarefa(tarefa, index, lista);
    }
  });
  
  document.getElementById("taskCounter").textContent = `${tarefasFiltradas} ${tarefasFiltradas === 1 ? 'tarefa' : 'tarefas'}`;
  
  const emptyState = document.getElementById("emptyState");
  if (tarefasFiltradas === 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
  }
}

function updateStats() {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  
  let alto = 0;
  let medio = 0;
  let baixo = 0;
  
  tarefas.forEach(tarefa => {
    if (tarefa.importancia === "Alta") alto++;
    else if (tarefa.importancia === "Média") medio++;
    else if (tarefa.importancia === "Baixa") baixo++;
  });
  
  document.getElementById("highPriorityCount").textContent = alto;
  document.getElementById("mediumPriorityCount").textContent = medio;
  document.getElementById("lowPriorityCount").textContent = baixo;
}

  // edit e excluir
  function abrirModalEdicao(index) {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const tarefa = tarefas[index];

    document.getElementById("editIndex").value = index;
    document.getElementById("editNome").value = tarefa.tarefa;
    document.getElementById("editDescricao").value = tarefa.descricao;
    document.getElementById("editData").value = tarefa.data;
    document.getElementById("editImportancia").value = tarefa.importancia;

    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarTarefa"));
    modalEditar.show();
  }

function salvarEdicaoTarefa() {
  const index = document.getElementById("editIndex").value;
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  tarefas[index] = {
    tarefa: document.getElementById("editNome").value,
    descricao: document.getElementById("editDescricao").value,
    data: document.getElementById("editData").value,
    importancia: document.getElementById("editImportancia").value
  };

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  filtrarTarefas();
  exibirTarefasDeHoje();
  updateStats();
}

function excluirTarefa(index) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
    tarefas.splice(index, 1);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    filtrarTarefas();
    exibirTarefasDeHoje();
    updateStats();
  }
}

// funcoes de tarefas concluidas 
function concluirTarefa(index) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  let concluidas = JSON.parse(localStorage.getItem("tarefasConcluidas")) || [];

  const tarefaConcluida = tarefas.splice(index, 1)[0];
  concluidas.push(tarefaConcluida);

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  localStorage.setItem("tarefasConcluidas", JSON.stringify(concluidas));

  filtrarTarefas();
  exibirTarefasDeHoje();
  updateStats();
  exibirTarefasConcluidas();
}

function exibirTarefasConcluidas() {
  const concluidas = JSON.parse(localStorage.getItem("tarefasConcluidas")) || [];
  const listaConcluidas = document.getElementById("tarefasConcluidas");

  listaConcluidas.innerHTML = "";

  concluidas.forEach((tarefa, index) => {
    const tarefaElement = document.createElement("div");
    tarefaElement.className = "card-task card mb-2";
    tarefaElement.innerHTML = `
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1 text-decoration-line-through">${tarefa.tarefa}</h6>
          <p class="mb-0 text-muted">${tarefa.descricao}</p>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removerConcluida(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    listaConcluidas.appendChild(tarefaElement);
  });
}

function removerConcluida(index) {
  let concluidas = JSON.parse(localStorage.getItem("tarefasConcluidas")) || [];
  concluidas.splice(index, 1);
  localStorage.setItem("tarefasConcluidas", JSON.stringify(concluidas));
  exibirTarefasConcluidas();
}