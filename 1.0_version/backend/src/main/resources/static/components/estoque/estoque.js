let produtoSendoEditado = null;

export function initializeEstoque(api) {
    const container = document.querySelector(".estoque-info");

    // Atualiza o contador de produtos
    function atualizarContador() {
        const total = document.querySelectorAll(".produto-info").length;
        const displayContador = document.getElementById("contagem-total-produtos");
        if (displayContador) {
            displayContador.innerText = total;
        }
    }

    function showAlert(message) {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000); // some após 4 segundos
    }
    function showConfirm(message) {
        return new Promise(resolve => {
            const container = document.getElementById("toast-container");
            const toast = document.createElement("div");
            toast.className = "toast toast-confirm";
            toast.innerHTML = `
                <span>${message}</span>
                <div class="toast-buttons">
                    <button class="btn-sim">Sim</button>
                    <button class="btn-nao">Não</button>
                </div>
            `;
            container.appendChild(toast);

            toast.querySelector(".btn-sim").onclick = () => {
                toast.remove();
                resolve(true);
            };
            toast.querySelector(".btn-nao").onclick = () => {
                toast.remove();
                resolve(false);
            };
        });
    }

    // Adiciona card na tela após cadastro
    function adicionarCardNaTela(dados) {
        let dataAdicao = new Date(dados.createdAt);
        dataAdicao = dataAdicao.toLocaleDateString('pt-BR');
        console.log(dados)
        const novoCardHTML = `
            <div class="produto-info" data-id="${dados.id}">
                <p>${dados.name}</p>
                <span class="info-adicao-card">DataAdicao: ${dataAdicao}</span>
                <span>Preço: R$ ${parseFloat(dados.sellingPrice).toFixed(2).replace('.', ',')}</span>

                <span>Quantidade no estoque: ${dados.quantity}</span>
                <div class="produto-botoes">
                    <button class="btn-editar">Editar</button>
                    <button class="btn-maisinfo">Mais informações</button>
                    <button class="btn-excluir">Excluir</button>
                </div>
            </div>
        `;
        container.innerHTML += novoCardHTML;
    }

    // Elementos do modal de cadastro
    const btnAdd = document.getElementById("btn_add_estoque");
    const modal = document.getElementById("modal-produto-cadastro");
    const closeBtnEstoque = document.querySelector(".close-button-estoque");
    const form = document.getElementById("form-cadastro-produto");

    // Elementos do modal de mais informações
    const modalInfo = document.getElementById("modal-info-produto");
    const closeInfo = document.querySelector(".close-info-produto");

    // Elementos do modal de editar
    const modalEditar = document.getElementById("modal-editar-produto");
    const closeEdit = document.querySelector(".close-edit-produto");
    const formEditar = document.getElementById("form-editar-produto");

    // Container dos cards
    const containerCards = document.querySelector(".estoque-info");

    const data = JSON.parse(localStorage.getItem("user-data"));//Pega do localStorage as informações sobre o usuário como id da empresa e o id do usuário em si


    // --- Filtro de busca ---
    const inputBusca = document.getElementById("inputBuscaProduto");
    if (inputBusca) {
        inputBusca.addEventListener("input", () => {
            const termoBusca = inputBusca.value.toLowerCase();
            document.querySelectorAll(".produto-info").forEach(card => {
                const nomeProduto = card.querySelector("p").innerText.toLowerCase();
                card.style.display = nomeProduto.includes(termoBusca) ? "grid" : "none";
            });
        });
    }

    // --- Excluir produto ---
    containerCards.addEventListener("click", async (evento) => {
        if (evento.target.classList.contains("btn-excluir")) {
            const card = evento.target.closest(".produto-info");
            const nomeProduto = card.querySelector("p").innerText;

            const confirmacao = await showConfirm(
                `Tem certeza que deseja excluir o produto "${nomeProduto}"?`
            );

            if (!confirmacao) return;

            const response = await api.sendDeleteRequest(
                "/stock/product/" + card.dataset.id
            );

            if (response && response.error) {
                showAlert("Erro ao excluir produto");
                return;
            }

            showAlert("Produto removido com sucesso!");
            card.remove();
        }
    });


    async function getAllProducts() {
        container.innerHTML = "";
        const products = await api.sendGetRequest("/stock/product/get?id=" + data.companyId);

        if (products.error) {
            container.innerHTML = "Erro ao carregar produtos";
            return;
        }

        products.forEach(produto => {
            adicionarCardNaTela(produto);
        })
    }

    getAllProducts();

    // --- Cadastrar produto ---
    if (btnAdd && modal && form) {

        document.getElementById("produto-preco-venda").addEventListener("input", (e) => {
            const costPrice = document.getElementById("produto-preco-custo").value;

            if (costPrice) {
                const sellingPrice = e.target.value;
                const rate = ((sellingPrice / costPrice) - 1) * 100;
                document.getElementById("lucro-desejado").value = rate.toFixed(2);
            }
        });

        document.getElementById("lucro-desejado").addEventListener("input", (e) => {
            const costPrice = document.getElementById("produto-preco-custo").value;

            if (costPrice) {
                const rate = e.target.value / 100 + 1;
                document.getElementById("produto-preco-venda").value = (costPrice * rate).toFixed(2);
            }
        })

        btnAdd.addEventListener("click", () => {
            modal.style.display = "block";
        });

        closeBtnEstoque.addEventListener("click", () => {
            modal.style.display = "none";
            form.reset();
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            alert("Tentando salvar produto")

            const dadosParaEnviar = {
                companyId: Number(data.companyId),
                name: document.getElementById("produto-nome").value,
                description: document.getElementById("produto-descricao").value,
                costPrice: parseFloat(document.getElementById("produto-preco-custo").value),
                sellingPrice: parseFloat(document.getElementById("produto-preco-venda").value),
                profitRate: parseFloat(document.getElementById("lucro-desejado").value),
                minQuantity: parseInt(document.getElementById("produto-min-quantidade").value),
                unity: document.getElementById("unidade").value
            };
            alert("Dados coletados")
            console.log(dadosParaEnviar);

            try {
                const product = await api.sendPostRequest("/stock/product/add", dadosParaEnviar);

                if (product.error) {
                    throw new Error(product.message);
                }

                container.innerHtml = "";
                adicionarCardNaTela(product);
                atualizarContador();
                alert("Produto cadastrado com sucesso!");
            } catch (error) {
                console.error("Erro ao cadastrar produto:", error);
                alert("O servidor não respondeu corretamente.");
            } finally {
                modal.style.display = "none";
                form.reset();
            }
        });
    }

    // --- Mais informações ---
    if (modalInfo && containerCards) {

        if (closeInfo) {
            closeInfo.onclick = () => {
                modalInfo.style.display = "none";
            };
        }

        containerCards.addEventListener("click", (evento) => {
            if (evento.target.classList.contains("btn-maisinfo")) {
                const card = evento.target.closest(".produto-info");
                const nome = card.querySelector("p").innerText;
                const atributos = card.querySelectorAll("span");

                const dataAdicaoBruta = atributos[0].innerText.replace("DataAdicao: ", "");
                const dataAdicaoFormatada = dataAdicaoBruta.split('-').reverse().join('/');

                document.getElementById("info-produto-nome").innerText = nome;
                document.getElementById("info-produto-preco").innerText = atributos[1].innerText.replace("Preco: ", "");
                document.getElementById("info-produto-validade").innerText = atributos[2].innerText.replace("Validade: ", "");
                document.getElementById("info-produto-adicao").innerText = dataAdicaoFormatada;
                document.getElementById("info-produto-quantidade").innerText = atributos[3].innerText.replace("Quantidade no estoque: ", "");

                modalInfo.style.display = "block";
            }
        });
    }

    // --- Editar produto ---
    if (modalEditar && containerCards) {

        containerCards.addEventListener("click", (evento) => {
            if (evento.target.classList.contains("btn-editar")) {
                produtoSendoEditado = evento.target.closest(".produto-info");
                const atributos = produtoSendoEditado.querySelectorAll("span");

                document.getElementById("editar-produto-nome").value = produtoSendoEditado.querySelector("p").innerText;
                document.getElementById("editar-produto-preco").value = atributos[1].innerText.replace("Preco: R$ ", "").replace(",", ".");
                document.getElementById("editar-produto-validade").value = atributos[2].innerText.replace("Validade: ", "").split('/').reverse().join('-');
                document.getElementById("editar-produto-quantidade").value = atributos[3].innerText.replace("Quantidade no estoque: ", "");

                modalEditar.style.display = "block";
            }
        });

        if (closeEdit) {
            closeEdit.onclick = () => {
                modalEditar.style.display = "none";
            };
        }

        if (formEditar) {
            formEditar.onsubmit = (e) => {
                e.preventDefault();

                const novoNome = document.getElementById("editar-produto-nome").value;
                const novoPreco = document.getElementById("editar-produto-preco").value;
                const novaValidade = document.getElementById("editar-produto-validade").value;
                const novaQuantidade = document.getElementById("editar-produto-quantidade").value;

                produtoSendoEditado.querySelector("p").innerText = novoNome;
                produtoSendoEditado.querySelectorAll("span")[1].innerText = "Preco: R$ " + parseFloat(novoPreco).toFixed(2).replace('.', ',');
                produtoSendoEditado.querySelectorAll("span")[2].innerText = "Validade: " + novaValidade.split('-').reverse().join('/');
                produtoSendoEditado.querySelectorAll("span")[3].innerText = "Quantidade no estoque: " + novaQuantidade;

                // TODO: quando tiver endpoint → await api.sendPutRequest("/estoque/produto/" + id, dadosAtualizados) ESPERAR O ENDPOINT CORRETO
                alert("Produto atualizado com sucesso!");
                modalEditar.style.display = "none";
            };
        }
    }

    // --- Fechar modais clicando fora ---
    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
        if (event.target === modalInfo) modalInfo.style.display = "none";
        if (event.target === modalEditar) modalEditar.style.display = "none";
    });

    // TODO: quando tiver endpoint de GET → carregar produtos do backend:
    // const produtos = await api.sendGetRequest("/estoque/produtos"); ESPERAR O ENDPOINT CORRETO
    // produtos.forEach(p => adicionarCardNaTela(p));

    atualizarContador();
}