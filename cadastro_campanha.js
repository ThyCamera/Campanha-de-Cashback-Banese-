// Adiciona a classe 'active-link' ao botão correspondente
document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname; // Obtém o caminho atual
    const cadastrarLink = document.getElementById('cadastrar-link'); // Botão "Cadastrar Campanha"
    const gerenciarLink = document.getElementById('gerenciar-link'); // Botão "Gerenciar Campanha"

    // Verifica a página atual e adiciona a classe ao botão correspondente
    if (currentPath.includes('index.html')) {
        cadastrarLink.classList.add('active-link'); // Destaca o botão "Cadastrar Campanha"

        // Recarrega a página ao clicar no botão "Cadastrar Campanha"
        cadastrarLink.addEventListener('click', (event) => {
            event.preventDefault(); // Evita redirecionamento
            window.location.reload(); // Recarrega a página
        });
    } else if (currentPath.includes('Tela.html')) {
        gerenciarLink.classList.add('active-link'); // Destaca o botão "Gerenciar Campanha"
    }
});

// Função para abrir/fechar o menu do usuário
function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
}

// Fecha o menu do usuário se clicar fora
document.addEventListener('click', function (e) {
    const userMenu = document.getElementById('user-menu');
    const userCircle = document.querySelector('.user-circle');
    if (!userCircle.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.style.display = 'none';
    }
});

// Função para abrir o popup de associar portadores
function openPopup() {
    document.getElementById("popup").style.display = "flex";
    carregarPortadores();
}

// Função para fechar o popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Função para adicionar um portador temporário à lista
function adicionarPortador() {
    const nomePortador = document.getElementById("nome-portador").value;
    const idPortador = document.getElementById("id-portador").value;

    if (nomePortador && idPortador) {
        const portadores = JSON.parse(localStorage.getItem("portadoresTemp")) || [];
        portadores.push({ nome: nomePortador, id: idPortador });
        localStorage.setItem("portadoresTemp", JSON.stringify(portadores));

        carregarPortadores();
        document.getElementById("add-portador-form").reset();
    }
}

// Função para carregar portadores temporários no popup
function carregarPortadores() {
    const portadores = JSON.parse(localStorage.getItem("portadoresTemp")) || [];
    const lista = document.getElementById("portadores-list");
    lista.innerHTML = "";

    portadores.forEach((portador, index) => {
        const item = document.createElement("div");
        item.classList.add("portador-item");
        item.innerHTML = `
            <span>${portador.nome} - ID: ${portador.id}</span>
            <button onclick="excluirPortador(${index})">Excluir</button>
        `;
        lista.appendChild(item);
    });
}

// Função para excluir um portador temporário
function excluirPortador(index) {
    const portadores = JSON.parse(localStorage.getItem("portadoresTemp")) || [];
    portadores.splice(index, 1);
    localStorage.setItem("portadoresTemp", JSON.stringify(portadores));
    carregarPortadores();
}

// Função para salvar a campanha no localStorage
function salvarCampanha() {
    const campanhas = JSON.parse(localStorage.getItem("campanhas")) || [];
    const nomeCampanha = document.getElementById("nome-campanha").value;
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;
    const tipoRegra = document.getElementById("tipo-regra").value;
    const status = document.getElementById("status").value;

    // Obter portadores associados
    const portadores = JSON.parse(localStorage.getItem("portadoresTemp")) || [];

    // Cria a nova campanha
    const novaCampanha = {
        nome: nomeCampanha,
        inicio: dataInicio,
        fim: dataFim,
        regra: tipoRegra,
        status: status,
        portadores: portadores
    };

    campanhas.push(novaCampanha);
    localStorage.setItem("campanhas", JSON.stringify(campanhas));

    // Limpa os portadores temporários após salvar
    localStorage.removeItem("portadoresTemp");

    // Redireciona para a página de gerenciamento
    window.location.href = "Tela.html";
}

// Carregar portadores ao abrir a página
window.onload = carregarPortadores;
