let produtoSendoEditado = null;

/* =====================================================
   UTILITÁRIOS DE NOTIFICAÇÃO (toast)
   ===================================================== */

function showAlert(mensagem) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = mensagem;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function showConfirm(mensagem) {
    return new Promise(resolve => {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast toast-confirm";
        toast.innerHTML = `
            <span>${mensagem}</span>
            <div class="toast-buttons">
                <button class="btn-sim">Sim</button>
                <button class="btn-nao">Não</button>
            </div>
        `;
        container.appendChild(toast);

        toast.querySelector(".btn-sim").onclick = () => { toast.remove(); resolve(true); };
        toast.querySelector(".btn-nao").onclick = () => { toast.remove(); resolve(false); };
    });
}

/* =====================================================
   INICIALIZAÇÃO DO MÓDULO DE ESTOQUE
   ===================================================== */

export function initializeEstoque(api) {
    const container = document.querySelector(".estoque-info");
    const containerCards = document.querySelector(".estoque-info");
    const data = JSON.parse(localStorage.getItem("user-data"));

    /* --- Seletores dos modais --- */
    const modal = document.getElementById("modal-produto-cadastro");
    const modalInfo = document.getElementById("modal-info-produto");
    const modalEditar = document.getElementById("modal-editar-produto");
    const modalMovimentar = document.getElementById("modal-movimentacao-estoque");

    /* --- Seletores de botões e formulários --- */
    const btnAdd = document.getElementById("btn_add_estoque");
    const form = document.getElementById("form-cadastro-produto");
    const formEditar = document.getElementById("form-editar-produto");
    const abrirMovModalBt = document.getElementById("btn_move_estoque");

    /* --- Seletores de botões de fechar --- */
    const closeBtnEstoque = document.querySelector(".close-button-estoque");
    const closeInfo = document.querySelector(".close-info-produto");
    const closeEdit = document.querySelector(".close-edit-produto");
    const closemovModal = document.querySelector(".close-move-estoque");

    /* --- Campo de busca --- */
    const inputBusca = document.getElementById("inputBuscaProduto");

    /* =====================================================
       CONTADOR DE PRODUTOS
       ===================================================== */

    function atualizarContador() {
        const total = document.querySelectorAll(".produto-info").length;
        const displayContador = document.getElementById("contagem-total-produtos");
        if (displayContador) {
            displayContador.innerText = total;
        }
    }

    /* =====================================================
       RENDERIZAÇÃO DOS CARDS DE PRODUTO
       ===================================================== */

    function adicionarCardNaTela(dados) {
        let dataAdicao = new Date(dados.createdAt);
        dataAdicao = dataAdicao.toLocaleDateString('pt-BR');

        const novoCardHTML = `
            <div class="produto-info" data-id="${dados.id}">
                <p>${dados.name}</p>
                <span>${dados.description}</span>
                <span style="display:none">DataAdicao: ${dataAdicao}</span>
                <span style="display:none">Validade: ${dados.validade || ''}</span>
                <span>Preço: R$ ${parseFloat(dados.sellingPrice).toFixed(2).replace('.', ',')}</span>
                <span>Quantidade no estoque: ${dados.qty}</span>
                <div class="produto-botoes">
                    <button class="btn-editar">Editar</button>
                    <button class="btn-maisinfo">Mais informações</button>
                    <button class="btn-excluir">Excluir</button>
                </div>
            </div>
        `;
        container.innerHTML += novoCardHTML;
    }

    /* =====================================================
       CARREGAMENTO DE TODOS OS PRODUTOS
       ===================================================== */

    async function getAllProducts() {
        container.innerHTML = "";
        const produtos = await api.sendGetRequest("/stock/product/get?id=" + data.companyId);

        if (produtos.error) {
            container.innerHTML = "Erro ao carregar produtos";
            return;
        }

        produtos.forEach(produto => adicionarCardNaTela(produto));
        atualizarContador();
    }

    getAllProducts();

    /* =====================================================
       FILTRO DE BUSCA POR NOME
       ===================================================== */

    if (inputBusca) {
        inputBusca.addEventListener("input", () => {
            const termoBusca = inputBusca.value.toLowerCase();
            document.querySelectorAll(".produto-info").forEach(card => {
                const nomeProduto = card.querySelector("p").innerText.toLowerCase();
                card.style.display = nomeProduto.includes(termoBusca) ? "grid" : "none";
            });
        });
    }

    /* =====================================================
       EXCLUIR PRODUTO
       ===================================================== */

    containerCards.addEventListener("click", async (evento) => {
        if (!evento.target.classList.contains("btn-excluir")) return;

        const card = evento.target.closest(".produto-info");
        const nomeProduto = card.querySelector("p").innerText;

        const confirmado = await showConfirm(`Tem certeza que deseja excluir o produto "${nomeProduto}"?`);
        if (!confirmado) return;

        const resposta = await api.sendDeleteRequest("/stock/product/" + card.dataset.id);

        if (resposta && resposta.error) {
            showAlert("Erro ao excluir produto");
            return;
        }

        card.remove();
        showAlert("Produto removido com sucesso!");
        atualizarContador();
    });

    /* =====================================================
       CADASTRAR PRODUTO
       ===================================================== */

    if (btnAdd && modal && form) {

        /* Sincroniza preço de venda e lucro desejado */
        document.getElementById("produto-preco-venda").addEventListener("input", (e) => {
            const precoCusto = document.getElementById("produto-preco-custo").value;
            if (!precoCusto) return;

            const precoVenda = e.target.value;
            const taxa = ((precoVenda / precoCusto) - 1) * 100;
            document.getElementById("lucro-desejado").value = taxa.toFixed(2);
        });

        document.getElementById("lucro-desejado").addEventListener("input", (e) => {
            const precoCusto = document.getElementById("produto-preco-custo").value;
            if (!precoCusto) return;

            const multiplicador = e.target.value / 100 + 1;
            document.getElementById("produto-preco-venda").value = (precoCusto * multiplicador).toFixed(2);
        });

        btnAdd.addEventListener("click", () => { modal.style.display = "block"; });

        closeBtnEstoque.addEventListener("click", () => {
            modal.style.display = "none";
            form.reset();
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dadosParaEnviar = {
                companyId: Number(data.companyId),
                name: document.getElementById("produto-nome").value,
                description: document.getElementById("produto-descricao").value,
                costPrice: parseFloat(document.getElementById("produto-preco-custo").value),
                sellingPrice: parseFloat(document.getElementById("produto-preco-venda").value),
                profitRate: parseFloat(document.getElementById("lucro-desejado").value),
                minQuantity: parseInt(document.getElementById("produto-min-quantidade").value),
                validade: document.getElementById("produto-validade").value,
                unity: document.getElementById("unidade").value
            };

            const bt = e.submitter;
            bt.innerHTML = "Salvando...";
            let salvo = false;

            try {
                const produto = await api.sendPostRequest("/stock/product/add", dadosParaEnviar);
                if (produto.error) throw new Error(produto.message);

                await getAllProducts();
                salvo = true;
            } catch (erro) {
                console.error("Erro ao cadastrar produto:", erro);
                showAlert("O servidor não respondeu corretamente.");
            } finally {
                if (salvo) showAlert("Produto salvo!");
                bt.innerHTML = "Salvar Produto";
                modal.style.display = "none";
                form.reset();
            }
        });
    }

    /* =====================================================
       MOVIMENTAR ESTOQUE
       ===================================================== */

    if (modalMovimentar && abrirMovModalBt && closemovModal) {
        abrirMovModalBt.addEventListener("click", () => { modalMovimentar.style.display = "block"; });
        closemovModal.addEventListener("click", () => { modalMovimentar.style.display = "none"; });
    }

    /* =====================================================
       MAIS INFORMAÇÕES DO PRODUTO
       ===================================================== */

    if (modalInfo && containerCards) {
        if (closeInfo) {
            closeInfo.onclick = () => { modalInfo.style.display = "none"; };
        }

        containerCards.addEventListener("click", (evento) => {
            if (!evento.target.classList.contains("btn-maisinfo")) return;

            const card = evento.target.closest(".produto-info");
            const nome = card.querySelector("p").innerText;
            const atributos = card.querySelectorAll("span");

            const dataAdicaoBruta = atributos[1].innerText.replace("DataAdicao: ", "");
            const dataAdicaoFormatada = dataAdicaoBruta.split('-').reverse().join('/');

            document.getElementById("info-produto-nome").innerText = nome;
            document.getElementById("info-produto-descricao").innerText = atributos[0].innerText;
            document.getElementById("info-produto-adicao").innerText = dataAdicaoFormatada;
            document.getElementById("info-produto-validade").innerText = atributos[2].innerText.replace("Validade: ", "") || "N/A";
            document.getElementById("info-produto-preco").innerText = atributos[3].innerText.replace("Preço: ", "");
            document.getElementById("info-produto-quantidade").innerText = atributos[4].innerText.replace("Quantidade no estoque: ", "");

            modalInfo.style.display = "block";
        });
    }

    /* =====================================================
       EDITAR PRODUTO
       ===================================================== */

    if (modalEditar && containerCards) {
        containerCards.addEventListener("click", (evento) => {
            if (!evento.target.classList.contains("btn-editar")) return;

            produtoSendoEditado = evento.target.closest(".produto-info");
            const atributos = produtoSendoEditado.querySelectorAll("span");

            document.getElementById("editar-produto-nome").value = produtoSendoEditado.querySelector("p").innerText;
            document.getElementById("editar-produto-preco").value = atributos[3].innerText.replace("Preço: R$ ", "").replace(",", ".");
            document.getElementById("editar-produto-validade").value = atributos[2].innerText.replace("Validade: ", "").split('/').reverse().join('-');
            document.getElementById("editar-produto-quantidade").value = atributos[4].innerText.replace("Quantidade no estoque: ", "");

            modalEditar.style.display = "block";
        });

        if (closeEdit) {
            closeEdit.onclick = () => { modalEditar.style.display = "none"; };
        }

        if (formEditar) {
            formEditar.onsubmit = (e) => {
                e.preventDefault();

                const novoNome = document.getElementById("editar-produto-nome").value;
                const novoPreco = document.getElementById("editar-produto-preco").value;
                const novaValidade = document.getElementById("editar-produto-validade").value;
                const novaQuantidade = document.getElementById("editar-produto-quantidade").value;

                produtoSendoEditado.querySelector("p").innerText = novoNome;
                produtoSendoEditado.querySelectorAll("span")[2].innerText = "Validade: " + novaValidade.split('-').reverse().join('/');
                produtoSendoEditado.querySelectorAll("span")[3].innerText = "Preço: R$ " + parseFloat(novoPreco).toFixed(2).replace('.', ',');
                produtoSendoEditado.querySelectorAll("span")[4].innerText = "Quantidade no estoque: " + novaQuantidade;

                // TODO: integrar com endpoint quando disponível → api.sendPutRequest("/stock/product/" + id, dados)
                showAlert("Produto atualizado com sucesso!");
                modalEditar.style.display = "none";
            };
        }
    }

    /* =====================================================
       FECHAR MODAIS AO CLICAR FORA
       ===================================================== */

    window.addEventListener("click", (evento) => {
        if (evento.target === modal) modal.style.display = "none";
        if (evento.target === modalInfo) modalInfo.style.display = "none";
        if (evento.target === modalEditar) modalEditar.style.display = "none";
        if (evento.target === modalMovimentar) modalMovimentar.style.display = "none";
    });
}