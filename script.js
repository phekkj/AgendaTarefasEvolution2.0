     //mostra tarefas
document.addEventListener("DOMContentLoaded", function () {
  filtrarTarefas();
  updateStats();
});
 
 // Criar nova tarefa
    function criarTarefa() {
      let tarefa = document.getElementById("nome").value;
      let descricao = document.getElementById("descricao").value;
      let data = document.getElementById("data").value;
      let importancia = document.getElementById("importancia").value;

      let novaTarefa = {
        tarefa: tarefa,
        descricao: descricao,
        data: data,
        importancia: importancia
      };

      let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

      if (!tarefa || !descricao || !data || !importancia) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      tarefas.push(novaTarefa);
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      
      // Resetar formulário e atualizar lista
      document.getElementById("formTarefa").reset();
      filtrarTarefas();
      updateStats();
    }

    // Exibir tarefas com filtros
    function filtrarTarefas() {
      const select = document.querySelector("#filtroImportancia");
      const valorSelecionado = select.value;
      const pesquisaTexto = document.querySelector("#pesquisaTarefa").value.toLowerCase();
      const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

      const lista = document.getElementById("listaTarefas");
      lista.innerHTML = "";

      // Contador de tarefas
      let tarefasFiltradas = 0;
      
      tarefas.forEach((tarefa, index) => {
        const nome = tarefa.tarefa.toLowerCase();
        const importancia = tarefa.importancia;
        
        // Verificar se a tarefa corresponde aos filtros
        const combinaFiltro = valorSelecionado === "" || importancia === valorSelecionado;
        const combinaBusca = nome.includes(pesquisaTexto) || pesquisaTexto === "";
        
        if (combinaFiltro && combinaBusca) {
          tarefasFiltradas++;
          
          // Determinar a classe CSS baseada na importância
          let taskClass = "";
          if (importancia === "Alta") taskClass = "task-high";
          else if (importancia === "Média") taskClass = "task-medium";
          else taskClass = "task-low";
          
          // Formatar a data
          const dataObj = new Date(tarefa.data);
          const dataFormatada = dataObj.toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
          });
          
          // Criar elemento da tarefa
          const taskElement = document.createElement("div");
          taskElement.className = `card-task card mb-3 ${taskClass}`;
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
                <button class="btn btn-sm btn-outline-danger" onclick="excluirTarefa(${index})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          `;
          
          lista.appendChild(taskElement);
        }
      });
      
      // Atualizar contador
      document.getElementById("taskCounter").textContent = `${tarefasFiltradas} ${tarefasFiltradas === 1 ? 'tarefa' : 'tarefas'}`;
      
      // Mostrar estado vazio se necessário
      const emptyState = document.getElementById("emptyState");
      if (tarefasFiltradas === 0) {
        emptyState.classList.remove("d-none");
      } else {
        emptyState.classList.add("d-none");
      }
    }
    
    // Atualizar estatísticas
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

    // excluir tarefa
    function excluirTarefa(index) {
      let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
      if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
        tarefas.splice(index, 1);
        localStorage.setItem("tarefas", JSON.stringify(tarefas));
        filtrarTarefas();
        updateStats();
      }
    }

    document.addEventListener("DOMContentLoaded", function () {
      initializeSampleData();
      filtrarTarefas();
      updateStats();

      // enter na pesquisa
      document.getElementById("pesquisaTarefa").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
          filtrarTarefas();
        }
      });
    });