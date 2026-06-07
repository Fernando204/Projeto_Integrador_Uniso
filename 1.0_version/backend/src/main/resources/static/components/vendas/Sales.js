import { ApiConnection } from "/scripts/classes/ApiConnection.js";

export const initializeSales = (api) => {
    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const titleInfo = document.getElementById("titleInfo");
    const dataTitle = document.getElementById("dataTitle");
    const activateItens = document.querySelectorAll(".activate-item");
    const blocks = document.querySelectorAll(".block");
    const openBt = document.getElementById("openButton");

    const btnConfirmar = document.querySelectorAll(".btnConfirmar"); //Pega todos os botões de confirmar (um por step)
    const btnRetornar = document.querySelectorAll(".btnRetornar"); //Pega todos os botões de voltar

    const clientListDiv = document.getElementById("client-list"); //Container onde os cards de clientes são renderizados
    const productListDiv = document.getElementById("product-list"); //Container onde os cards de produtos são renderizados
    const stepContainer = document.querySelectorAll(".step-container"); //Pega todos os steps da venda

    // --- VARIÁVEIS DE CONTROLE DE ESTADO ---
    let opened = false;
    let step = 0;
    let caixaInfo = {}; //Variavel que guarda as informações sobre o caixa vindas do back-end
    let vendasDoTurno = [];
    let clienteSelecionado = null; //Guarda o cliente que foi clicado na lista (id e name)
    let produtosDaCompra = []; //Objeto que guarda os produtos selecionados no formato { id: { name, price, qty } }

    let data = JSON.parse(localStorage.getItem("user-data")); //Pega do localStorage as informações sobre o usuário como id da empresa e o id do usuário em si


    // --- TOASTS (alertas e confirmações) ---

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

    // --- FUNÇÕES AUXILIARES ---

    function atualizarInfoCliente(nome) {
        const els = [
            document.getElementById("cliente-selecionado-info"),
            document.getElementById("cliente-selecionado-info-step1")
        ];
        els.forEach(el => { if (el) el.innerText = nome ? `Cliente: ${nome}` : ""; });
    }

    async function getList(endpoint) { //Função para buscar os clientes e de produtos do back-end
        const res = await api.sendGetRequest(endpoint);
        if (res.error) {
            await showAlert("erro ao buscar lista, tente novamente!");
            return null;
        }
        return res;
    }

    function mostrarStep(index) { //Esconde todos os steps e exibe apenas o step do índice recebido
        stepContainer.forEach((s, i) => {
            s.style.display = i === index ? "flex" : "none";
        });
        step = index;
    }

    // --- CRIAÇÃO DE CARDS ---
    function createClientCard(client) { //Cria o HTML de um card de cliente no step 0
        return `
            <div class="client-card" data-id="${client.id}" data-name="${client.name}">
                <h4>${client.name}</h4>
                <p>id: ${client.id}</p>
            </div>
        `;
    }

    function createProductCard(product) { //Cria o HTML de um card de produto com botões de quantidade no step 1
        if(!product.productId) alert(product);
        return `
            <div class="product-card" data-id="${product.productId}" data-name="${product.name}" data-price="${product.sellingPrice}">
                <div class="vertical-align">
                    <h4>${product.name}</h4>
                    <p>R$ ${parseFloat(product.sellingPrice).toFixed(2).replace('.', ',')}</p>
                    <small class="produto-subtotal"></small>
                </div>
                <div class="product-amount">
                    <button class="btn-diminuir">−</button>
                    <input type="number" min="0" value="0" class="qty-input">
                    <button class="btn-aumentar">+</button>
                </div>
            </div>
        `;
    }

    // --- CARREGAR LISTAS ---
    async function loadClientList() { //Busca clientes do back-end e renderiza os cards na tela
        clientListDiv.innerHTML = "<p>Carregando...</p>";
        const clients = await getList("client/get/all?id=" + data.companyId);

        if (!clients) return;

        clientListDiv.innerHTML = ""; //Limpa o "Carregando..." antes de renderizar os cards
        clients.forEach(client => {
            clientListDiv.insertAdjacentHTML('beforeend', createClientCard(client));
        });
        bindClientSelection(); //Após renderizar, ativa os eventos de clique nos cards
    }

    async function loadProductListStatic() { //Carrega lista estática de produtos enquanto o endpoint não está pronto
        // TODO: substituir por loadProductList() quando o endpoint estiver disponível
        const produtos = await api.sendGetRequest("stock/product/get?id="+data.companyId);
        if(produtos.error){
            productListDiv.innerHTML = "Erro ao carregar produtos, verifique sua conexão!!!!";
            return;
        }
        if(produtos.length <1){
            productListDiv.innerHTML = `
                <h5>Nenhum produto cadastrado!</h5>
            `;
            return;
        }
        productListDiv.innerHTML = ""; //Limpa o container antes de renderizar
        produtos.forEach(p => {
            productListDiv.insertAdjacentHTML('beforeend', createProductCard(p));
        });
        bindProductAmounts(); //Após renderizar, ativa os eventos de + e - nos cards

        // Restaura as quantidades caso o usuário volte do step 2 para o step 1
        restaurarQuantidades();
    }

    // --- SELEÇÃO DE CLIENTE ---
    function bindClientSelection() { //Adiciona evento de clique em cada card de cliente para selecioná-lo
        const cards = clientListDiv.querySelectorAll(".client-card");
        cards.forEach(card => {
            card.addEventListener("click", () => {
                // Se clicar no card já selecionado, desmarca
                if (card.classList.contains("selected")) {
                    card.classList.remove("selected");
                    clienteSelecionado = null;
                    atualizarInfoCliente(null);
                    atualizarBotaoConfirmar(0); // desabilita o botão ao desmarcar
                    return;
                }

                cards.forEach(c => c.classList.remove("selected")); //Remove a seleção de todos os outros cards
                card.classList.add("selected"); //Marca este card como selecionado visualmente

                clienteSelecionado = { //Salva os dados do cliente selecionado na variável de estado
                    id: card.dataset.id,
                    name: card.dataset.name
                };

                atualizarInfoCliente(clienteSelecionado.name);
                atualizarBotaoConfirmar(0); // habilita o botão ao selecionar um cliente
            });
        });
    }

    // --- HABILITAR / DESABILITAR BOTÃO CONFIRMAR ---
    // Centraliza a lógica de habilitar o botão "Próximo" de cada step
    function atualizarBotaoConfirmar(stepIndex) {
        const bt = btnConfirmar[stepIndex];
        if (!bt) return;

        if (stepIndex === 0) {
            // Step 0: habilita somente se houver um cliente selecionado
            bt.disabled = !clienteSelecionado;
        } else if (stepIndex === 1) {
            // Step 1: habilita somente se houver ao menos um produto com quantidade > 0
            const temProduto = Object.values(produtosDaCompra).some(p => p.qty > 0);
            bt.disabled = !temProduto;
        } else if (stepIndex === 2) {
            // Step 2: habilita somente se a forma de pagamento foi selecionada
            const formaPagamento = document.getElementById("forma-pagamento");
            bt.disabled = !formaPagamento || formaPagamento.value === "";
        }
    }

    function atualizarSubtotal(card, price, qty) { //Calcula e exibe o subtotal de um produto específico no card
        const subtotalEl = card.querySelector(".produto-subtotal");
        if (!subtotalEl) return;
        if (qty === 0) {
            subtotalEl.innerText = ""; //Se a quantidade for 0, limpa o subtotal
            card.classList.remove("tem-produto"); // remove destaque visual do card
        } else {
            subtotalEl.innerText = `= R$ ${(price * qty).toFixed(2).replace('.', ',')}`; //Exibe o subtotal
            card.classList.add("tem-produto"); // adiciona destaque visual para indicar que está no carrinho
        }
    }

    function atualizarTotalParcial() { //Calcula e exibe o total parcial de todos os produtos selecionados no topo do step 1
        const total = Object.values(produtosDaCompra).reduce((acc, p) => acc + (p.price * p.qty), 0);
        const totalEl = document.getElementById("total-parcial");
        if (totalEl) totalEl.innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`; //Atualiza o texto na tela
        atualizarBotaoConfirmar(1); // atualiza o estado do botão toda vez que o total mudar
    }

    // --- RESTAURAR QUANTIDADES AO VOLTAR PARA O STEP 1 ---
    // Reaplica as quantidades salvas em produtosDaCompra nos inputs dos cards após re-renderizar
    function restaurarQuantidades() {
        const cards = productListDiv.querySelectorAll(".product-card");
        cards.forEach(card => {
            const id = card.dataset.id;
            const produto = produtosDaCompra[id];
            if (produto && produto.qty > 0) {
                const input = card.querySelector(".qty-input");
                if (input) input.value = produto.qty;
                atualizarSubtotal(card, produto.price, produto.qty);
            }
        });
    }

    // --- CONTROLE DE QUANTIDADE DOS PRODUTOS ---
    function bindProductAmounts() { //Adiciona eventos de + e - em cada card de produto
        const cards = productListDiv.querySelectorAll(".product-card");
        cards.forEach(card => {
            const btnMais = card.querySelector(".btn-aumentar");
            const btnMenos = card.querySelector(".btn-diminuir");
            const input = card.querySelector(".qty-input");
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);

            if(!id || !card.dataset.id){
                showAlert("ID não definido")
                console.log("ID de "+name+" não encontrado")
            }else console.log(id)

            btnMais.addEventListener("click", () => {
                let qty = parseInt(input.value) + 1; //Incrementa a quantidade em 1
                input.value = qty;
                produtosDaCompra[id] = { name: name, price: price, qty: qty, productId: id}; //Salva ou atualiza o produto no objeto de estado
                atualizarSubtotal(card, price, qty); //Atualiza o subtotal do produto
                atualizarTotalParcial(); //Atualiza o total geral
            });

            btnMenos.addEventListener("click", () => {
                let qty = Math.max(0, parseInt(input.value) - 1); //Decrementa mas não deixa ir abaixo de 0
                input.value = qty;
                if (qty === 0) {
                    delete produtosDaCompra[id]; //Remove o produto do objeto de estado se a quantidade for 0
                } else {
                    produtosDaCompra[id] = { name, price, qty }; //Atualiza a quantidade no objeto de estado
                }
                atualizarSubtotal(card, price, qty); //Atualiza o subtotal do produto
                atualizarTotalParcial(); //Atualiza o total geral
            });

            input.addEventListener("input", () => { //Ouvinte disparado quando o usuário digita diretamente no campo
                let qty = parseInt(input.value) || 0; //Se não for número válido, assume 0
                if (qty < 0) qty = 0; //Não deixa valor negativo
                input.value = qty;
                if (qty === 0) {
                    delete produtosDaCompra[id]; //Remove o produto do objeto de estado se a quantidade for 0
                } else {
                    produtosDaCompra[id] = { name, price, qty }; //Salva ou atualiza o produto no objeto de estado
                }
                atualizarSubtotal(card, price, qty); //Atualiza o subtotal do produto
                atualizarTotalParcial(); //Atualiza o total geral
            });
        });
    }

    // --- FILTRO DE CLIENTES ---
    const clientSearch = document.getElementById("client-search");
    if (clientSearch) {
        clientSearch.addEventListener("input", () => { //Ouvinte disparado a cada letra digitada ou apagada
            const termo = clientSearch.value.toLowerCase();
            clientListDiv.querySelectorAll(".client-card").forEach(card => {
                const nome = card.dataset.name.toLowerCase();
                card.style.display = nome.includes(termo) ? "flex" : "none"; //"O nome deste card contém o que foi digitado?"
            });
        });
    }

    // --- BOTÃO SEM CADASTRO ---
    const btnSemCadastro = document.getElementById("btn-sem-cadastro");
    if (btnSemCadastro) {
        btnSemCadastro.addEventListener("click", () => {
            clientListDiv.querySelectorAll(".client-card")
                .forEach(c => c.classList.remove("selected"));
            clienteSelecionado = { id: null, name: "Sem cadastro" };
            atualizarInfoCliente(clienteSelecionado.name);
            atualizarBotaoConfirmar(0); // habilita o botão ao escolher "sem cadastro"
        });
    }

    // --- FILTRO DE PRODUTOS ---
    const productSearch = document.getElementById("product-search");
    if (productSearch) {
        productSearch.addEventListener("input", () => { //Ouvinte disparado a cada letra digitada ou apagada
            const termo = productSearch.value.toLowerCase();
            productListDiv.querySelectorAll(".product-card").forEach(card => {
                const nome = card.dataset.name.toLowerCase();
                card.style.display = nome.includes(termo) ? "flex" : "none"; //"O nome deste card contém o que foi digitado?"
            });
        });
    }

    // --- MONTAR TELA DE FINALIZAÇÃO ---
    function montarFinalizacao() { //Monta o resumo da compra no step 2 com produtos, total e forma de pagamento
        const finalizacaoDiv = stepContainer[2].querySelector(".product-list");
        const produtos = Object.values(produtosDaCompra); //Converte o objeto de produtos em array para iterar
        const total = produtos.reduce((acc, p) => acc + (p.price * p.qty), 0); //Soma o valor total de todos os produtos

        finalizacaoDiv.innerHTML = `
            <div class="resumo-finalizacao-vertical" onclick="void(0)">
                <h3>Cliente: ${clienteSelecionado.name}</h3>
                <hr>
                <p class="produtos-label" style="color: #cbd5e1; margin: 5px 0;">Produtos:</p>
                <ul class="lista-produtos-finalizacao-scroll">
                    ${produtos.map(p => `
                        <li>
                            <span>${p.qty}x ${p.name}</span>
                            <span>R$ ${(p.price * p.qty).toFixed(2).replace('.', ',')}</span>
                        </li>
                    `).join('')}
                </ul>
                <hr>
                <h3 class="total-finalizacao">Total: R$ ${total.toFixed(2).replace('.', ',')}</h3>
                <hr>
                <div class="forma-pagamento-container" onclick="void(0)">
                    <label>Forma de pagamento:</label>
                    <select id="forma-pagamento">
                        <option value="">Selecione...</option>
                        <option value="PIX">Pix</option>
                        <option value="CARTAO_DE_CREDITO">Cartão de Crédito</option>
                        <option value="CARTAO_DE_DEBITO">Cartão de Débito</option>
                        <option value="DINHEIRO">Dinheiro</option>
                        <option value="PENDENTE">Pendente</option>
                    </select>
                </div>
            </div>
        `;

        // Monitora a seleção da forma de pagamento para habilitar o botão confirmar do step 2
        const selectPagamento = finalizacaoDiv.querySelector("#forma-pagamento");
        if (selectPagamento) {
            selectPagamento.addEventListener("change", () => atualizarBotaoConfirmar(2));
        }
    }

    // --- NAVEGAÇÃO ENTRE STEPS ---

    // Botões de avançar e confirmar venda
    btnConfirmar.forEach((bt, index) => {
        bt.addEventListener("click", async () => {

            if (index === 0) { //Step 0 → 1: verifica se um cliente foi selecionado antes de avançar
                if (!clienteSelecionado) {
                    await showAlert("Por favor, selecione um cliente antes de continuar.");
                    return;
                }
                loadProductListStatic(); //Carrega os produtos ao entrar no step 1
                mostrarStep(1);
                return;
            }

            if (index === 1) { //Step 1 → 2: verifica se ao menos um produto foi selecionado antes de avançar
                const temProduto = Object.values(produtosDaCompra).some(p => p.qty > 0);
                if (!temProduto) {
                    await showAlert("Por favor, selecione ao menos um produto antes de continuar.");
                    return;
                }
                montarFinalizacao(); //Monta o resumo antes de exibir o step de finalização
                mostrarStep(2);
                return;
            }

            if (index === 2) { //Step 2: confirma a venda verificando se a forma de pagamento foi escolhida
                const formaPagamento = document.getElementById("forma-pagamento");
                if (!formaPagamento || formaPagamento.value === "") {
                    await showAlert("Por favor, selecione a forma de pagamento.");
                    return;
                }

                const total = Object.values(produtosDaCompra).reduce((acc, p) => acc + (p.price * p.qty), 0); //Calcula o total novamente para salvar na venda

                const novaVenda = { //Monta o objeto da venda para salvar no turno e futuramente enviar ao back-end
                    cliente: clienteSelecionado,
                    produtos: Object.values(produtosDaCompra),
                    metodo: formaPagamento.value,
                    valorTotal: total
                };

                const obj = {
                    itens: novaVenda.produtos,
                    companyId: data.companyId,
                    clientId: parseInt(clienteSelecionado.id),
                    total: total,
                    paymentWay: formaPagamento.value,
                    cashRegisterId: caixaInfo.id
                }

                console.log(obj)

                const response = await api.sendPostRequest("/sales/new",obj);

                if(response.error){
                    showAlert("Erro ao salvar venda");
                    return
                }

                console.log(novaVenda);

                vendasDoTurno.push(novaVenda); //Adiciona a venda à lista do turno para o resumo do fechamento do caixa

                // Adiciona a venda no card de resumo da direita
                const produtos = Object.values(produtosDaCompra);
                const resumoProdutos = produtos.map(p => `${p.qty}x ${p.name}`).join('<br>'); //Formata os produtos como "2x Arroz" e na liha de baixo "1x Feijão"
                const resumoVendaHTML = `
                    <div class="venda-resumo-card">
                        <span>VENDA CONCLUÍDA</span>
                        <span>${clienteSelecionado.name.toUpperCase()}</span>
                        <span>${resumoProdutos.toUpperCase()}</span>
                        <span>TOTAL: R$ ${total.toFixed(2).replace('.', ',')}</span>
                        <span>PAGAMENTO: ${formaPagamento.value.toUpperCase()}</span>
                    </div>
                `;
                blocks[1].insertAdjacentHTML('beforeend', resumoVendaHTML); //Insere o resumo no segundo block (Resumo)

                // TODO: quando tiver endpoint → await api.sendPostRequest("/sales/new", novaVenda)

                await showAlert(`Venda finalizada! Total: R$ ${total.toFixed(2).replace('.', ',')}`);

                //Reseta o estado para permitir uma nova venda
                clienteSelecionado = null;
                produtosDaCompra = {};
                atualizarTotalParcial();
                atualizarInfoCliente(null); // limpar o nome do cliente

                mostrarStep(0); //Volta ao step inicial
                loadClientList(); //Recarrega a lista de clientes
            }
        });
    });

    // Botões de voltar
    btnRetornar.forEach((bt, index) => {
        bt.addEventListener("click", () => {
            mostrarStep(index); //btnRetornar[0] está no step 1 e volta para step 0, btnRetornar[1] está no step 2 e volta para step 1
        });
    });

    // --- CANCELAR VENDA ---
    document.addEventListener("click", async (e) => { //Delegação de evento para pegar o botão cancelar dinamicamente
        if (e.target && e.target.id === "btn-cancelar-venda") {
            if (await showConfirm("Tem certeza que deseja cancelar a venda?")) {
                clienteSelecionado = null; //Limpa o cliente selecionado
                produtosDaCompra = {}; //Limpa os produtos selecionados
                atualizarTotalParcial(); //Limpa o total parcial
                atualizarInfoCliente(null); // para limpar
                mostrarStep(0); //Volta ao step inicial
                loadClientList(); //Recarrega a lista de clientes
            }
        }
    });

    // --- LÓGICA DE ABRIR / FECHAR CAIXA ---
    function openCashRegister(dados) { //Aqui abre o caixa
        if (!opened) {
            const date = new Date(dados.openTime);
            titleInfo.classList.replace("waiting", "opened"); //Troca uma palavra pela outra quando o caixa abrir
            dataTitle.classList.replace("closed", "opened");
            titleInfo.innerHTML = "Caixa Aberto"; //Escreve Caixa Aberto ao invés de Caixa Fechado
            dataTitle.innerHTML = date.toLocaleString('pt-BR');
            openBt.innerText = "Fechar caixa"; //Escreve Fechar caixa no botão ao invés de Abrir Caixa
            openBt.disabled = false; //Reativa o botão
            activateItens.forEach((item) => item.disabled = false); //Habilita todos os inputs, selects e botoes que tinha classe disabled
            blocks.forEach(block => block.style.opacity = "1"); //As classes blocks não ficam mais transparentes, agora estão prontas pra uso com opacity = 1
            opened = true; //Agora o caixa está aberto
        }
    }

    async function closeCashRegister() {
        if (vendasDoTurno.length > 0) { //O reduce serve para pegar uma lista cheia de itens e "espremê-la" até sobrar um único valor (o total). No início ele vale 0, mas a cada venda ele soma com a anterior
            const total = vendasDoTurno.reduce((acc, v) => acc + v.valorTotal, 0);
            const pix = vendasDoTurno.filter(v => v.metodo === "pix").length; //JS entra na lista de vendas e procura apenas as vendas de pix e conta quantos itens foram pix
            const credito = vendasDoTurno.filter(v => v.metodo === "credito").length;
            const debito = vendasDoTurno.filter(v => v.metodo === "debito").length;
            const dinheiro = vendasDoTurno.filter(v => v.metodo === "dinheiro").length;

            const confirma = await showConfirm( //Janela para confirmar que quer fechar o caixa
                `RESUMO DO DIA:\n` +
                `Total de Vendas: ${vendasDoTurno.length}\n` +
                `Valor em Caixa: R$ ${total.toFixed(2)}\n\n` +
                `Pix: ${pix} | Crédito: ${credito} | Débito: ${debito} | Dinheiro: ${dinheiro}\n\n` +
                `Confirmar fechamento e limpar lista?`
            );
            if (!confirma) return false; //Se não confirmar que quer fechar o caixa, fecha a janela
        }

        titleInfo.classList.replace("opened", "closed"); //Fechou o caixa, troca as classes e cores
        titleInfo.innerHTML = "Caixa Fechado"; //Troca a palavra
        dataTitle.innerHTML = ""; //Retira a data
        openBt.innerText = "Abrir caixa"; //Troca o texto do botão
        activateItens.forEach((item) => item.disabled = true); //Os itens de classes disabled que estavam false agora são true
        blocks.forEach(block => block.style.opacity = "0.5"); //Deixa os dois blocks mais transparentes pq o caixa está fechado
        vendasDoTurno = []; //Limpa a lista de vendas do turno
        blocks[1].innerHTML = "<h1>Resumo</h1>"; //Escreve no segundo block "<h1>Resumo</h1>"
        produtosDaCompra = {};
        atualizarTotalParcial();
        opened = false; //A variável opened volta a ser false para reabrir o caixa novamente
        return true;
    }

    async function getOpenedCashRegister() { //Função que verifica se o caixa está aberto
        const res = await api.sendGetRequest("/sales/cash-register/get?id=" + data.userId);

        if (res.error) {
            console.log(res);
            titleInfo.classList.replace("waiting", "closed");
            titleInfo.innerHTML = "Caixa Fechado";
            openBt.innerText = "Abrir caixa";
            openBt.disabled = false;
            console.log(res.message);
            return;
        }

        caixaInfo = res;
        openCashRegister(caixaInfo);
        console.log(res);
    }

    getOpenedCashRegister();
    loadClientList(); //Carrega a lista de clientes ao inicializar a página

    openBt.addEventListener("click", async () => {

        if (!opened) {
            titleInfo.classList.replace("closed", "waiting");
            titleInfo.innerHTML = "Abrindo caixa...";
            openBt.innerText = "Abrindo";
            openBt.disabled = true;

            let info = {
                "userId": data.userId,
                "companyId": data.companyId
            };

            console.log(info);
            const res = await api.sendPostRequest("/sales/cash-register/init", info);

            if (res.error) {
                await showAlert("Erro ao abrir caixa: " + res.message);
                return;
            }

            caixaInfo = res;
            if (!caixaInfo.id) return;
            openCashRegister(caixaInfo);

        } else {

            // Verifica se tem uma venda em andamento antes de fechar o caixa
            if (step > 0) {
                await showAlert("Finalize ou cancele a venda atual antes de fechar o caixa.");
                return;
            }

            const fechou = await closeCashRegister();
            if (!fechou) return;

            const res = await api.sendPatchRequest("/sales/cash-register/" + caixaInfo.id + "/close");

            if (res.error) {
                await showAlert("erro ao fechar caixa");
                console.log(res);
                return;
            }
        }
    });
};