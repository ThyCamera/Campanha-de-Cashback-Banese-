// Função para exibir ou esconder a popup "Sair"
function toggleLogoutPopup() {
    const popup = document.getElementById("logout-popup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";
}

// Fechar a popup ao clicar fora dela
window.onclick = function(event) {
    const popup = document.getElementById("logout-popup");
    if (event.target !== document.querySelector(".user-circle") && popup.style.display === "block") {
        popup.style.display = "none";
    }
}

// Função para carregar campanhas do localStorage e exibi-las na tabela
function carregarCampanhas(filtros = {}) {
    const campanhas = JSON.parse(localStorage.getItem("campanhas")) || [];
    const tabela = document.getElementById("campanha-list");

    // Limpa o conteúdo da tabela antes de preencher
    tabela.innerHTML = "";

    // Filtra as campanhas conforme os critérios de filtros, se fornecidos
    const campanhasFiltradas = campanhas.filter(campanha => {
        const dataInicioFiltro = filtros.dataInicio ? new Date(filtros.dataInicio) : null;
        const dataFimFiltro = filtros.dataFim ? new Date(filtros.dataFim) : null;
        const dataInicioCampanha = new Date(campanha.inicio);
        const dataFimCampanha = new Date(campanha.fim);

        return (
            (!filtros.status || campanha.status === filtros.status) &&
            (!filtros.tipoRegra || campanha.regra === filtros.tipoRegra) &&
            (!dataInicioFiltro || dataInicioCampanha >= dataInicioFiltro) &&
            (!dataFimFiltro || dataFimCampanha <= dataFimFiltro)
        );
    });

    // Adiciona cada campanha filtrada na tabela
    campanhasFiltradas.forEach((campanha, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${campanha.nome}</td>
            <td>${campanha.status}</td>
            <td>${campanha.inicio} - ${campanha.fim}</td>
            <td>${campanha.regra}</td>
            <td class="actions">
                <button onclick="editarCampanha(${index})">Editar</button>
                <button onclick="excluirCampanha(${index})">Excluir</button>
                <button class="details-button" onclick="verDetalhes(${index})">Ver Detalhes</button>
            </td>
        `;
        tabela.appendChild(row);
    });
}

// Função para redirecionar para a página de edição com o índice da campanha
function editarCampanha(index) {
    localStorage.setItem("campanhaEditIndex", index);
    window.location.href = "EditarCampanha/editar_campanha.html";
}

// Função para excluir uma campanha do localStorage
function excluirCampanha(index) {
    const campanhas = JSON.parse(localStorage.getItem("campanhas")) || [];

    // Remove a campanha do array
    campanhas.splice(index, 1);

    // Atualiza o localStorage com a nova lista de campanhas
    localStorage.setItem("campanhas", JSON.stringify(campanhas));

    // Recarrega a tabela de campanhas para refletir a exclusão
    carregarCampanhas();
}

// Função para aplicar os filtros ao clicar no botão "Filtrar"
function filtrarCampanhas() {
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;
    const status = document.getElementById("status").value;
    const tipoRegra = document.getElementById("tipo-regra").value;

    // Chama carregarCampanhas com os filtros aplicados
    carregarCampanhas({
        dataInicio: dataInicio || null,
        dataFim: dataFim || null,
        status: status !== "" ? status : null,
        tipoRegra: tipoRegra !== "" ? tipoRegra : null
    });
}

// Função para exibir detalhes de uma campanha em um popup
function verDetalhes(index) {
    const campanhas = JSON.parse(localStorage.getItem("campanhas")) || [];
    const campanha = campanhas[index];
    if (campanha) {
        const detalhesContainer = document.getElementById("detalhes-campanha");

        // Popula o conteúdo do popup com as informações da campanha
        detalhesContainer.innerHTML = `
            <p><strong>Nome:</strong> ${campanha.nome}</p>
            <p><strong>Status:</strong> ${campanha.status}</p>
            <p><strong>Período:</strong> ${campanha.inicio} - ${campanha.fim}</p>
            <p><strong>Tipo de Regra:</strong> ${campanha.regra}</p>
            <p><strong>Portadores Associados:</strong></p>
            <ul>
                ${campanha.portadores.map(portador => `<li>${portador.nome} - ID: ${portador.id}</li>`).join('')}
            </ul>
        `;

        // Exibe o popup de detalhes
        document.getElementById("detalhes-popup").style.display = "flex";
    }
}

// Função para fechar o popup de detalhes
function fecharDetalhesPopup() {
    document.getElementById("detalhes-popup").style.display = "none";
}

// Adiciona o evento de clique ao botão "Filtrar"
document.querySelector(".filter-button").addEventListener("click", filtrarCampanhas);

// Carrega as campanhas ao abrir a página
window.onload = carregarCampanhas;
