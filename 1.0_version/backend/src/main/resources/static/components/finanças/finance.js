let data = {};
let container;

function adicionarCardNaTela(dados) {
    const ehEntrada = dados.movmentType === "ENTRADA";
    const sinal = ehEntrada ? "+" : "-";
    
    // Converte a data do banco (ano-mes-dia) para o padrão (dia/mes/ano)
    const dataFormatada = dados.movmentDate.split('-').reverse().join('/');
    
    const novoCardHTML = `
        <div class="transaction">
            <p><strong>${dados.name}</strong></p>
            <span>${dados.description}</span>
            <span>${dataFormatada}</span>
            <span class="valor-transacao">${sinal} R$ ${parseFloat(dados.value).toFixed(2).replace('.', ',')}</span>
        </div>
    `;
    container.innerHTML += novoCardHTML;
}



export function atualizarSaldos() {
    // 1. Pega todas as transações que estão na tela
    const transacoes = document.querySelectorAll(".transaction");

    let totalEntradas = 0;
    let totalDespesas = 0;



    // 2. Passa por cada uma delas somando
    transacoes.forEach(item => {
        const spanValor = item.querySelector(".valor-transacao");
        if (spanValor) {
            const textoValor = spanValor.innerText;

            let valorLimpo = textoValor
                .replace("R$", "")
                .replace(/\./g, "") // Remove todos os pontos de milhar
                .replace(",", ".")  // Troca vírgula decimal por ponto
                .replace("+", "")
                .replace("-", "")
                .trim();

            const valorNumerico = parseFloat(valorLimpo);

            if (!isNaN(valorNumerico)) {
                if (textoValor.includes("+")) {
                    totalEntradas += valorNumerico;
                } else {
                    totalDespesas += valorNumerico;
                }
            }
        }   
    });

    const saldoTotal = totalEntradas - totalDespesas;

    // 3. Atualiza os cards lá no topo usando as novas classes/IDs
    // Usamos toLocaleString para colocar o R$ e as vírgulas de volta bonitinho
    const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const elSaldo = document.querySelector(".saldo");
    const elEntradas = document.querySelector(".entradas");
    const elDespesas = document.querySelector(".despesas");

    if (elSaldo) elSaldo.innerText = formatador.format(saldoTotal);
    if (elEntradas) elEntradas.innerText = formatador.format(totalEntradas);
    if (elDespesas) elDespesas.innerText = formatador.format(totalDespesas);

    // Bônus: Se o saldo for negativo, fica vermelho. Se for positivo, fica branco.
    if (elSaldo) {
        elSaldo.style.color = saldoTotal < 0 ? "#ff4d4d" : "white";
    }
}

export async function initializeFinances(api){

     const btnAdd = document.getElementById("btn_add_Movment");
     const modal = document.getElementById("modal-movment-register");
     const closeBtn = document.querySelector(".close-button");
     const form = document.getElementById("form-cadastro");
     container = document.querySelector(".transactions");

     data = JSON.parse(localStorage.getItem("user-data"));//Pega do localStorage as informações sobre o usuário como id da empresa e o id do usuário em si

     const movimentos = await api.sendGetRequest("/finance/movment/get?id="+data.companyId);

     if(movimentos.error){
        alert("Erro ao buscar dados!");
        return;
     }

     container.innerHTML = "";
     movimentos.forEach(mov =>{
        adicionarCardNaTela(mov);
        atualizarSaldos();
     })

     if (btnAdd && modal && form) {

             btnAdd.addEventListener("click", () => {
                 modal.style.display = "block";
             });

             closeBtn.addEventListener("click", () => {
                 modal.style.display = "none";
                 form.reset();
             });

             form.addEventListener("submit", async (e) => {
                 e.preventDefault();

                 const btn = e.submitter;

                 btn.disabled = true;
                 btn.innerText = "Enviando...";

                const valorRaw = document.getElementById("valor").value;
                const valorNumerico = parseFloat(valorRaw);

                if (isNaN(valorNumerico) || valorNumerico <= 0) {
                    alert("Por favor, insira um valor numérico válido e maior que zero.");
                    return;
                }
                 //já está adaptado da forma certa para enviar os dados para o back-end
                 const dadosParaEnviar = {
                    userId: data.userId,
                    companyId: data.companyId,
                    name: document.getElementById("nome").value,
                    description: document.getElementById("descricao").value,
                    value: valorNumerico,
                    movmentDate: document.getElementById("data").value,
                    movmentType: document.getElementById("movmentType").value
                 };

                 console.log("Enviando para o Java:", dadosParaEnviar);

                 try {
                     await api.sendPostRequest("/finance/movment/new", dadosParaEnviar); //ENDPOINT CORRETO!!
                     adicionarCardNaTela(dadosParaEnviar);
                     atualizarSaldos(); // Nome sugerido para a tela de finanças
                     //alert("Movimentação registrada com sucesso!");
                 } catch(error) {
                     console.error("Erro ao registrar no backend:", error);
                     alert("O servidor não respondeu corretamente, verifique a conexão.");
                 } finally {
                     modal.style.display = "none";
                     form.reset();
                 }
             });
         } else {
             console.error("Erro: Elementos da tela de Finanças não encontrados!");
         }
         atualizarSaldos();
}