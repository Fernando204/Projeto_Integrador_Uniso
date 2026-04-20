import { ApiConnection } from "/scripts/classes/ApiConnection.js";



export const initializeSales = (api) => {
    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const titleInfo = document.getElementById("titleInfo");
    const dataTitle = document.getElementById("dataTitle");
    const activateItens = document.querySelectorAll(".activate-item");
    const blocks = document.querySelectorAll(".block");
    const openBt = document.getElementById("openButton");

    const productInput = document.getElementById("productInput");
    const btnConfirmar = document.getElementById("btnConfirmar");
    const qtyInput = document.getElementById("qtyInput");
    const paymentMethod = document.getElementById("paymentMethod");
    const clientSelect = document.getElementById("clientSelect");
    const clientCards = document.querySelectorAll(".client-card");

    // --- VARIÁVEIS DE CONTROLE DE ESTADO ---
    let caixaInfo = {}//variavel que guarda as informações sobre o caixa vindas do back-end
    let vendasDoTurno = [];
    let opened = false;

    let data = JSON.parse(localStorage.getItem("user-data"));//Pega do localStorage as informações sobre o usuário como id da empresa e o id do usuário em si

    function openCashRegister(dados){
        //Aqui abre o caixa
                if (!opened) {
                    const data = new Date(dados.openTime);
                    titleInfo.classList.replace("waiting", "opened"); //Troca uma palavra pela outra quando o caixa abrir
                    dataTitle.classList.replace("closed", "opened");
                    titleInfo.innerHTML = "Caixa Aberto"; //Escreve Caixa Aberto ao invés de Caixa Fechado

                    dataTitle.innerHTML = data.toLocaleString('pt-BR');
                    openBt.innerText = "Fechar caixa"; //Escreve Fechar caixa no botão ao invés de Abrir Caixa
                    openBt.disabled = false;//Reativa o botão

                    activateItens.forEach((item) => item.disabled = false); //Habilita todos os inputs, selects e botoes que tinha classe disabled
                    blocks.forEach(block => block.style.opacity = "1"); //As classes blocks não ficam mais transparentes, agora estão prontas pra uso com opacity = 1
                    opened = true; //Agora o caixa está aberto

                }
    }
    function closeChasRegister(){
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

        titleInfo.classList.replace("opened", "closed"); //fechou o caixa troca as classes e cores
        titleInfo.innerHTML = "Caixa Fechado"; //Troca a palavra
        dataTitle.innerHTML = ""; //Retira a data
        openBt.innerText = "Abrir caixa"; //Troca o texto do botão

        activateItens.forEach((item) => item.disabled = true); //Os itens de classes disabled que estavam false agora são true
        blocks.forEach(block => block.style.opacity = "0.5"); //Deixa os dois blocks mais transparentes pq o caixa está fechado

        vendasDoTurno = []; //Limpa a lista de vendas do turno
        blocks[1].innerHTML = "<h1>Resumo</h1>"; //Escreve no segundo block "<h1>Resumo</h1>"
        opened = false; //A variável opened volta a ser false para reabrir o caixa novamente
    }

    async function getOpenedCashRegister(){ //função que verifica se o caixa está aberto
        const res = await api.sendGetRequest("/sales/cash-register/get?id="+data.userId);

        if(res.error){
            console.log(res)

            titleInfo.classList.replace("waiting", "closed");
            titleInfo.innerHTML = "Caixa Fechado";

            openBt.innerText = "Abrir caixa";
            openBt.disabled = false;

            console.log(res.message)
            return;
        }

        caixaInfo = res;
        openCashRegister(caixaInfo);
        console.log(res);
    }

    getOpenedCashRegister();

    // --- LOGICA DO FILTRO DINÂMICO ---
  /*  productInput.addEventListener("input", async () => {
        const termo = productInput.value.toLowerCase().trim();
        let listaSugestoes = document.getElementById("listaSugestoes"); //Não criei nenhum elemento com este Id no html, então o js entrega "null" na variável listaSugestoes

        // 1. Limpeza preventiva
        if (termo.length < 2) { //Se o usuário digitou só uma letra roda esse código
            if (listaSugestoes) { //Testa se a lista existe, como não existe ainda (null) o teste dá falso e pula direto para o return. Caso a lista já existisse, e a pessoa foi apagando o nome com backspace, iria rodar o inner.HTML e display: None
                listaSugestoes.innerHTML = "";
                listaSugestoes.style.display = "none";
            }
            return;
        }

        try {
            const response = await fetch('scripts/classes/mock-data/ListaDeVendas.json');
            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            const dados = await response.json(); // O arquivo json chega como um texto bruto, mas o .json converte em objeto JavaScript que pode ser manipulado

            // 2. Filtro (Inicia com) + Ordem Alfabética
            const produtosEncontrados = Object.values(dados) //Pega os valores dos produtos JSON e os transforma em uma Array (lista), agora pode usar ferramentas de lista como .filter e .sort.
                .filter(item => item.produto && item.produto.toLowerCase().startsWith(termo))  //item.produto checa se o produto existe
                .sort((a, b) => a.produto.localeCompare(b.produto)); //

            // 3. Gerenciar a lista no DOM
            if (!listaSugestoes) {
                listaSugestoes = document.createElement("ul"); //Se a lista não existe, ela é criada
                listaSugestoes.id = "listaSugestoes"; //E é atribuído um ID à ela
                productInput.insertAdjacentElement('afterend', listaSugestoes); //Injeta a lista após o campo de entrada (afterend)
            }

            listaSugestoes.innerHTML = ""; //Limpa a lista antes de começar a procurar os produtos

            if (produtosEncontrados.length > 0) {
                listaSugestoes.style.display = "block"; //Se encontrar algum produto exibe a lista na tela
                produtosEncontrados.forEach(prod => {
                    const li = document.createElement("li"); //Cria um item vazio da lista de produtos filtrados
                    li.innerText = prod.produto; //Escreve o nome do produto dentro do item que estava vazio, mas não coloca na listaSugestoes ainda. Esse .produto é o nome do produto que está guardado lá no JSON

                    li.addEventListener("click", () => {
                        productInput.value = prod.produto; //Preenche o input ao clicar no produto
                        listaSugestoes.innerHTML = ""; //Limpa o texto da lista após clicar no produto
                        listaSugestoes.style.display = "none"; //Some a lista da tela após clicar no produto
                    });

                    listaSugestoes.appendChild(li); //Coloca o li dentro da ul (basicamente escreve os elementos na lista) e ele aparece na tela
                });
            } else {
                listaSugestoes.style.display = "none"; //Se não achar nenhum produto, esconde a lista
            }

        } catch (e) {
            console.error("Erro na busca dinâmica:", e); //Se o try não rodar pro algum motivo, dá esse erro
        }
    });*/

    // --- LÓGICA DE ABRIR / FECHAR CAIXA ---
    openBt.addEventListener("click", async () => {

        if(!opened){
            titleInfo.classList.replace("closed", "waiting");
            titleInfo.innerHTML = "Abrindo caixa...";

            openBt.innerText = "Abrindo";
            openBt.disabled = true;

            let info ={
                "userId": data.userId,
                "companyId": data.comanyId
            }

            console.log(info)
            const res = await api.sendPostRequest("/sales/cash-register/init", info);

            if (res.error) {
                alert("Erro ao abrir caixa: " + res.message);
                return;
            }

            caixaInfo = res;

            if (!caixaInfo.id) return;

            openCashRegister(caixaInfo);
        }else{
            const res = await api.sendPatchRequest("/sales/cash-register/"+caixaInfo.id+"/close");

            if(res.error){
                alert("erro ao fechar caixa");
                console.log(res);
                return;
            }

            closeChasRegister();
        }



    });

    // --- LÓGICA DE CONFIRMAR VENDA ---
    btnConfirmar.addEventListener("click", () => {
        if (!opened) return; //Clicar no botão de confirmar com o caixa fechado não acontece nada
        if (productInput.value.trim() === "") {
            alert("Por favor, informe o produto.");
            return;
        }

        const novaVenda = {
            produto: productInput.value, //O JS lê o que está escrito no input e salva no objeto novaVenda
            quantidade: parseInt(qtyInput.value) || 1, //Converte texto em número
            metodo: paymentMethod.value || "Não definido",
            valorTotal: 12.10
        };

        vendasDoTurno.push(novaVenda); //Pega o objeto e joga na lista que o reduce e o filter vão ler no fechamento do caixa (linhas 89 até 102)

        const p = document.createElement("p"); //cria um parágrafo vazio na memória
        p.style.margin = "10px 0";  //Adiciona um espaço embaixo e em cima desse parágrafo para uma venda não ficar colada na outra
        p.innerHTML = `<strong>${novaVenda.quantidade}x</strong> ${novaVenda.produto} - <small>${novaVenda.metodo.toUpperCase()}</small>`; //Monta o conteúdo do parágrafo com os dados na novaVenda
        blocks[1].appendChild(p); //pega o parágrafo e coloca ele no segundo "bloco", que é o de Resumo, aqui é o que aparece na tela do usuário

        // Limpeza e fechamento da lista
        productInput.value = ""; //Apaga o nome do produto que acabou de ser vendido
        const lista = document.getElementById("listaSugestoes"); // Salva a listaSugestões em uma constante lista
        if (lista) lista.style.display = "none"; //Pega essa lista e esconde ela na tela

        qtyInput.value = "1"; //Atribui o valor patrão à quantidade no input
        paymentMethod.value = ""; //Atribui o valor patrão ao método de pagamento no select
        clientSelect.value = ""; //Atribui o valor patrão ao cliente no select
        productInput.focus(); //Volta o foco para o input do produto
    });
};