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
    let produtosDaCompra = {}; //Objeto que guarda os produtos selecionados no formato { id: { name, price, qty } }

    let data = JSON.parse(localStorage.getItem("user-data")); //Pega do localStorage as informações sobre o usuário como id da empresa e o id do usuário em si

    // --- FUNÇÕES AUXILIARES ---
    async function getList(endpoint) { //Função para buscar os clientes e de produtos do back-end
        const res = await api.sendGetRequest(endpoint);
        if (res.error) {
            alert("erro ao buscar lista, tente novamente!");
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
        return `
            <div class="product-card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                <div class="vertical-align">
                    <h4>${product.name}</h4>
                    <p>R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="product-amount">
                    <button class="btn-diminuir">-</button>
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

    /*async function loadProductList(){  FUNÇÃO QUE VAI SUBSTITUIR loadProductListStatic() quando tiver o endpoint e os produtos no banco de dados
        productListDiv.innerHTML = "";
        productList = await getList("products/get/all?id="+data.companyId);
        if(!productList) return;
        productList.forEach(product =>{
            productListDiv.insertAdjacentHTML("beforeend",createProductCard(product));
        })
        bindProductAmounts();
    }*/

    function loadProductListStatic() { //Carrega lista estática de produtos enquanto o endpoint não está pronto
        // TODO: substituir por loadProductList() quando o endpoint estiver disponível
        const produtos = [
            { id: 1, name: "Arroz", price: 23.89 },
            { id: 2, name: "Feijão Carioca", price: 13.89 },
            { id: 3, name: "Macarrão", price: 8.50 },
            { id: 4, name: "Frango", price: 45.00 },
            { id: 5, name: "Whey Protein", price: 120.00 },
            { id: 6, name: "Creatina", price: 100.00 },
            { id: 7, name: "Azeite", price: 35.90 },
            { id: 8, name: "Leite", price: 6.50 },
        ];
        productListDiv.innerHTML = ""; //Limpa o container antes de renderizar
        produtos.forEach(p => {
            productListDiv.insertAdjacentHTML('beforeend', createProductCard(p));
        });
        bindProductAmounts(); //Após renderizar, ativa os eventos de + e - nos cards
    }

    // --- SELEÇÃO DE CLIENTE ---
    function bindClientSelection() { //Adiciona evento de clique em cada card de cliente para selecioná-lo
        const cards = clientListDiv.querySelectorAll(".client-card");
        cards.forEach(card => {
            card.addEventListener("click", () => {
                cards.forEach(c => c.classList.remove("selected")); //Remove a seleção de todos os outros cards
                card.classList.add("selected"); //Marca este card como selecionado visualmente

                clienteSelecionado = { //Salva os dados do cliente selecionado na variável de estado
                    id: card.dataset.id,
                    name: card.dataset.name
                };

                const clienteInfo = document.getElementById("cliente-selecionado-info"); //Elemento que exibe o nome do cliente selecionado no topo do step
                if (clienteInfo) {
                    clienteInfo.innerText = `Cliente: ${clienteSelecionado.name}`; //Atualiza o texto na tela
                }
            });
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

            btnMais.addEventListener("click", () => {
                let qty = parseInt(input.value) + 1; //Incrementa a quantidade em 1
                input.value = qty;
                produtosDaCompra[id] = { name, price, qty }; //Salva ou atualiza o produto no objeto de estado
            });

            btnMenos.addEventListener("click", () => {
                let qty = Math.max(0, parseInt(input.value) - 1); //Decrementa mas não deixa ir abaixo de 0
                input.value = qty;
                if (qty === 0) {
                    delete produtosDaCompra[id]; //Remove o produto do objeto de estado se a quantidade for 0
                } else {
                    produtosDaCompra[id] = { name, price, qty }; //Atualiza a quantidade no objeto de estado
                }
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
            <div class="resumo-finalizacao" onclick="void(0)">
                <h3>Cliente:<br>${clienteSelecionado.name.replace(' ', '<br>')}</h3>
                <hr>
                <ul class="lista-produtos-finalizacao">
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
                        <option value="pix">Pix</option>
                        <option value="credito">Cartão de Crédito</option>
                        <option value="debito">Cartão de Débito</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pendente">Pendente</option>
                    </select>
                </div>
            </div>
        `;
    }

    // --- NAVEGAÇÃO ENTRE STEPS ---

    // Botões de avançar e confirmar venda
    btnConfirmar.forEach((bt, index) => {
        bt.addEventListener("click", () => {

            if (index === 0) { //Step 0 → 1: verifica se um cliente foi selecionado antes de avançar
                if (!clienteSelecionado) {
                    alert("Por favor, selecione um cliente antes de continuar.");
                    return;
                }
                loadProductListStatic(); //Carrega os produtos ao entrar no step 1
                mostrarStep(1);
                return;
            }

            if (index === 1) { //Step 1 → 2: verifica se ao menos um produto foi selecionado antes de avançar
                const temProduto = Object.values(produtosDaCompra).some(p => p.qty > 0);
                if (!temProduto) {
                    alert("Por favor, selecione ao menos um produto antes de continuar.");
                    return;
                }
                montarFinalizacao(); //Monta o resumo antes de exibir o step de finalização
                mostrarStep(2);
                return;
            }

            if (index === 2) { //Step 2: confirma a venda verificando se a forma de pagamento foi escolhida
                const formaPagamento = document.getElementById("forma-pagamento");
                if (!formaPagamento || formaPagamento.value === "") {
                    alert("Por favor, selecione a forma de pagamento.");
                    return;
                }

                const total = Object.values(produtosDaCompra).reduce((acc, p) => acc + (p.price * p.qty), 0); //Calcula o total novamente para salvar na venda

                const novaVenda = { //Monta o objeto da venda para salvar no turno e futuramente enviar ao back-end
                    cliente: clienteSelecionado,
                    produtos: Object.values(produtosDaCompra),
                    metodo: formaPagamento.value,
                    valorTotal: total
                };

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

                alert(`Venda finalizada! Total: R$ ${total.toFixed(2).replace('.', ',')}`);

                //Reseta o estado para permitir uma nova venda
                clienteSelecionado = null;
                produtosDaCompra = {};

                const clienteInfo = document.getElementById("cliente-selecionado-info"); //Pega o elemento que exibe o nome do cliente
                if (clienteInfo) clienteInfo.innerText = ""; //Limpa o texto do cliente selecionado

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
    document.addEventListener("click", (e) => { //Delegação de evento para pegar o botão cancelar dinamicamente
        if (e.target && e.target.id === "btn-cancelar-venda") {
            if (confirm("Tem certeza que deseja cancelar a venda?")) {
                clienteSelecionado = null; //Limpa o cliente selecionado
                produtosDaCompra = {}; //Limpa os produtos selecionados
                const clienteInfo = document.getElementById("cliente-selecionado-info"); //Pega o elemento que exibe o nome do cliente
                if (clienteInfo) clienteInfo.innerText = ""; //Limpa o texto do cliente selecionado
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

    function closeCashRegister() {
        if (vendasDoTurno.length > 0) { //O reduce serve para pegar uma lista cheia de itens e "espremê-la" até sobrar um único valor (o total). No início ele vale 0, mas a cada venda ele soma com a anterior
            const total = vendasDoTurno.reduce((acc, v) => acc + v.valorTotal, 0);
            const pix = vendasDoTurno.filter(v => v.metodo === "pix").length; //JS entra na lista de vendas e procura apenas as vendas de pix e conta quantos itens foram pix
            const credito = vendasDoTurno.filter(v => v.metodo === "credito").length;
            const debito = vendasDoTurno.filter(v => v.metodo === "debito").length;
            const dinheiro = vendasDoTurno.filter(v => v.metodo === "dinheiro").length;

            const confirma = confirm( //Janela para confirmar que quer fechar o caixa
                `RESUMO DO DIA:\n` +
                `Total de Vendas: ${vendasDoTurno.length}\n` +
                `Valor em Caixa: R$ ${total.toFixed(2)}\n\n` +
                `Pix: ${pix} | Crédito: ${credito} | Débito: ${debito} | Dinheiro: ${dinheiro}\n\n` +
                `Confirmar fechamento e limpar lista?`
            );
            if (!confirma) return; //Se não confirmar que quer fechar o caixa, fecha a janela
        }

        titleInfo.classList.replace("opened", "closed"); //Fechou o caixa, troca as classes e cores
        titleInfo.innerHTML = "Caixa Fechado"; //Troca a palavra
        dataTitle.innerHTML = ""; //Retira a data
        openBt.innerText = "Abrir caixa"; //Troca o texto do botão
        activateItens.forEach((item) => item.disabled = true); //Os itens de classes disabled que estavam false agora são true
        blocks.forEach(block => block.style.opacity = "0.5"); //Deixa os dois blocks mais transparentes pq o caixa está fechado
        vendasDoTurno = []; //Limpa a lista de vendas do turno
        blocks[1].innerHTML = "<h1>Resumo</h1>"; //Escreve no segundo block "<h1>Resumo</h1>"
        opened = false; //A variável opened volta a ser false para reabrir o caixa novamente
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
                alert("Erro ao abrir caixa: " + res.message);
                return;
            }

            caixaInfo = res;
            if (!caixaInfo.id) return;
            openCashRegister(caixaInfo);

        } else {
            const res = await api.sendPatchRequest("/sales/cash-register/" + caixaInfo.id + "/close");

            if (res.error) {
                alert("erro ao fechar caixa");
                console.log(res);
                return;
            }

            closeCashRegister();
        }
    });
};