// Token de acesso da API
const apiKey = "833ed7a873cd4f31a77948b40e673762";

// Função de pesquisa quando o botão é clicado
function searchGame() {
    // Captura o valor digitado no input
    const gameName = document.getElementById("search").value.trim();

    // Validação do campo de busca vazio
    if (!gameName) {
        alert("Por favor, insira o nome de um jogo.");
        return;
    }

    if (window.location.pathname.endsWith('index.html')) {
        // Redireciona para a página de resultados se estiver na index
        window.location.href = `resultados.html?search=${encodeURIComponent(gameName)}`;
    } else {
        // Se já estiver na página de resultados, atualiza a URL e realiza a busca
        const newUrl = `resultados.html?search=${encodeURIComponent(gameName)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        initSearch();  // Chama a busca diretamente após atualizar a URL
    }
}

// Função para obter o parâmetro de pesquisa da URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Função para realizar a busca e exibir os resultados
function fetchGames(gameName) {
    fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(gameName)}&key=${apiKey}`)
        .then(response => {
            // Verifica se a resposta da API foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const results = data.results;

            // Verifica se há resultados
            if (!results || results.length === 0) {
                document.getElementById("game-info").innerHTML = "<p>Nenhum jogo encontrado.</p>";
                return;
            }

            let output = "";

            results.forEach(game => {
                output += `
                    <div class="col-lg-4 mt-5 d-flex justify-content-center">
                        <div class="card text-center custom-card">
                            <img src="${game.background_image}" class="card-img-top img-fluid mt-5" alt="${game.name}">
                            <div class="card-body">
                                <div class="d-flex justify-content-between my-1">
                                    <h5 class="text-start">${game.name}</h5>
                                    <p class="text-end">${game.genres.map(genre => genre.name).join(', ')}</p>
                                </div>
                                <button type="button" class="btn btn-custom btn-lg text-light mt-5">JOGUE AGORA!</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            document.getElementById("game-info").innerHTML = output;
        })
        .catch(error => {
            console.error("Erro:", error);
            document.getElementById("game-info").innerHTML = `<p>Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.</p>`;
        });
}

// Função para realizar a busca ao carregar a página de resultados
function initSearch() {
    const gameName = getQueryParameter('search');
    if (gameName) {
        fetchGames(gameName);
    }
}

// Adiciona evento ao carregar a página
window.onload = initSearch;

// Adiciona evento ao botão de pesquisa
document.getElementById("search-button").addEventListener("click", function(event) {
    event.preventDefault(); // Evita o comportamento padrão do link ou botão
    searchGame();
});

// Adiciona evento ao pressionar a tecla Enter no campo de busca
document.getElementById("search").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita o comportamento padrão do formulário
        searchGame();
    }
});
