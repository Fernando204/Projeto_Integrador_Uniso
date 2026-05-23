export function initializeClientes(api) { 
    const btnAdd = document.getElementById("btn_abrir-modal-cliente");
    const modal = document.getElementById("modal-cliente-cadastro");
    const closeBtn = document.querySelector(".close-button");
    const form = document.getElementById("form-cliente-cadastro");

    const modalInfo = document.getElementById("modal-info-cliente");
    const closeInfo = document.querySelector(".close-info");

    const container = document.querySelector(".clientes-historicos");
    const inputBusca = document.getElementById("inputBuscaCliente");

    let data = JSON.parse(localStorage.getItem("user-data"));

    function formatarPagamento(valor) {
        const mapa = {
            "PIX": "Pix",
            "CARTAO_DE_CREDITO": "Cartão de Crédito",
            "CARTAO_DE_DEBITO": "Cartão de Débito",
            "DINHEIRO": "Dinheiro"
        };
        return mapa[valor] || valor;
    }

    function desformatarPagamento(valor) {
        const mapa = {
            "Pix": "PIX",
            "Cartão de Crédito": "CARTAO_DE_CREDITO",
            "Cartão de Débito": "CARTAO_DE_DEBITO",
            "Dinheiro": "DINHEIRO"
        };
        return mapa[valor] || valor;
    }

    // --- FILTRO DE CLIENTES ---
    if (inputBusca) {
        inputBusca.addEventListener("input", () => {
            const termoBusca = inputBusca.value.toLowerCase();
            document.querySelectorAll(".clientes-historico").forEach(card => {
                const nomeCliente = card.querySelector("p").innerText.toLowerCase();
                card.style.display = nomeCliente.includes(termoBusca) ? "grid" : "none";
            });
        });
    }

    // --- CONTADOR ---
    function atualizarContador() {
        const displayContador = document.getElementById("contagem-total-clientes");
        if (displayContador) {
            displayContador.innerText = document.querySelectorAll(".clientes-historico").length;
        }
    }

    // --- CARREGAR CLIENTES ---
    async function carregarClientes() {
        try {
            container.innerHTML = "Carregando...";
            const listaClientes = await api.sendGetRequest("/client/get/all?id=" + data.companyId);

            if (listaClientes && listaClientes.length > 0) {
                container.innerHTML = "";
                listaClientes.forEach(cliente => {
                    container.insertAdjacentHTML('beforeend', `
                        <div class="clientes-historico cliente-info" data-id="${cliente.id || ''}">
                            <p>${cliente.name}</p>
                            <span style="display:none">${cliente.email}</span>
                            <span style="display:none">${cliente.cpf}</span>
                            <span style="display:none">${cliente.birthDate}</span>
                            <span>${cliente.compras || '0'}</span>
                            <span>Prioridade: ${formatarPagamento(cliente.favoritePayment) || 'N/A'}</span>
                            <span>${cliente.gastos || '0'} reais gastos</span>
                            <div class="cliente-botoes">
                                <button class="btn-editarcliente">Editar</button>
                                <button class="btn-maisinfocliente">Mais informações</button>
                                <button class="btn-excluir-cliente">Excluir</button>
                            </div>
                        </div>
                    `);
                });
            } else {
                container.innerHTML = "Nenhum cliente cadastrado :(";
            }
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
            container.innerHTML = "Erro ao carregar clientes.";
        }

        atualizarContador();
    }

    // --- CADASTRO ---
    if (btnAdd && modal && form) {
        btnAdd.addEventListener("click", () => { modal.style.display = "block"; });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            form.reset();
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dadosParaEnviar = {
                companyId: data.companyId,
                name: document.getElementById("cliente-nome").value,
                email: document.getElementById("cliente-email").value,
                cpf: document.getElementById("cliente-cpf").value,
                birthDate: document.getElementById("cliente-nascimento").value,
                favoritePayment: document.getElementById("cliente-pagamento-pref").value
            };

            try {
                const res = await api.sendPostRequest("/client/create", dadosParaEnviar);
                if (res.error) throw new Error(res.message || "Erro ao cadastrar cliente!");
                alert("Cliente cadastrado com sucesso");
            } catch (error) {
                alert("Erro ao registrar ou servidor offline: " + error);
            } finally {
                await carregarClientes();
                modal.style.display = "none";
                form.reset();
            }
        });
    }

    // --- MAIS INFO, EXCLUIR ---
    if (container) {
        container.addEventListener("click", async (evento) => {

            if (evento.target.classList.contains("btn-maisinfocliente")) {
                const card = evento.target.closest(".cliente-info");
                const nome = card.querySelector("p").innerText;
                const atributos = card.querySelectorAll("span");
                const idCliente = card.getAttribute("data-id");

                document.getElementById("info-cliente-nome").innerText = nome;
                document.getElementById("info-cliente-email").innerText = atributos[0].innerText;
                document.getElementById("info-cliente-cpf").innerText = atributos[1].innerText;
                document.getElementById("info-cliente-nascimento").innerText = atributos[2].innerText;
                document.getElementById("info-cliente-compras").innerText = atributos[3].innerText;
                document.getElementById("info-cliente-pagamento").innerText = atributos[4].innerText.replace("Prioridade: ", "");
                document.getElementById("info-cliente-gastos").innerText = atributos[5].innerText;

                modalInfo.style.display = "block";

                const listaEl = document.getElementById("historico-compras-lista");
                const avisoAtrasada = document.getElementById("aviso-conta-atrasada");

                listaEl.innerHTML = "<p>Carregando...</p>";
                avisoAtrasada.style.display = "none";

                try {
                    // TODO: ESPERAR ENDPOINT CORRETO
                    const historico = await api.sendGetRequest(`/client/${idCliente}/purchases`);

                    if (historico && historico.length > 0) {
                        listaEl.innerHTML = historico.map(compra => `
                            <div class="compra-item ${compra.metodo === 'pendente' ? 'compra-atrasada' : ''}">
                                <span>${compra.date}</span>
                                <span>${compra.products}</span>
                                <span>R$ ${compra.total}</span>
                                <span>${compra.metodo}</span>
                            </div>
                        `).join('');

                        avisoAtrasada.style.display = historico.some(c => c.metodo === 'pendente') ? "block" : "none";
                    } else {
                        listaEl.innerHTML = "<p>Nenhuma compra registrada.</p>";
                    }
                } catch (error) {
                    listaEl.innerHTML = "<p>Erro ao carregar histórico.</p>";
                    console.warn("Endpoint de histórico ainda não disponível.", error);
                }
            }

            if (evento.target.classList.contains("btn-excluir-cliente")) {
                const card = evento.target.closest(".cliente-info");
                const nomeCliente = card.querySelector("p").innerText;
                const idCliente = card.getAttribute("data-id");

                if (confirm(`Tem certeza que deseja excluir o cliente ${nomeCliente}?`)) {
                    try {
                        // TODO: await api.sendDeleteRequest("/client/delete/" + idCliente);
                        card.remove();
                        atualizarContador();
                        alert("Cliente removido com sucesso!");
                    } catch (error) {
                        alert("Erro ao excluir no servidor.");
                    }
                }
            }
        });
    }

    // --- EDITAR CLIENTE ---
    let cardClienteSendoEditado = null;

    const modalEditarCliente = document.getElementById("modal-editar-cliente");
    const closeEditCliente = document.querySelector(".close-edit-cliente");
    const formEditarCliente = document.getElementById("form-editar-cliente");

    if (modalEditarCliente && container) {
        container.addEventListener("click", (evento) => {
            if (evento.target.classList.contains("btn-editarcliente")) {
                cardClienteSendoEditado = evento.target.closest(".cliente-info");
                const atributos = cardClienteSendoEditado.querySelectorAll("span");

                document.getElementById("editar-cliente-nome").value = cardClienteSendoEditado.querySelector("p").innerText;
                document.getElementById("editar-cliente-email").value = atributos[0].innerText;
                document.getElementById("editar-cliente-nascimento").value = atributos[2].innerText;
                document.getElementById("editar-cliente-pagamento").value = desformatarPagamento(atributos[4].innerText.replace("Prioridade: ", ""));

                modalEditarCliente.style.display = "block";
            }
        });

        if (closeEditCliente) {
            closeEditCliente.onclick = () => { modalEditarCliente.style.display = "none"; };
        }

        if (formEditarCliente) {
            formEditarCliente.onsubmit = async (e) => {
                e.preventDefault();

                const novoNome = document.getElementById("editar-cliente-nome").value;
                const novoEmail = document.getElementById("editar-cliente-email").value;
                const novoNascimento = document.getElementById("editar-cliente-nascimento").value;
                const novoPagamento = document.getElementById("editar-cliente-pagamento").value;

                cardClienteSendoEditado.querySelector("p").innerText = novoNome;
                cardClienteSendoEditado.querySelectorAll("span")[0].innerText = novoEmail;
                cardClienteSendoEditado.querySelectorAll("span")[2].innerText = novoNascimento;
                cardClienteSendoEditado.querySelectorAll("span")[4].innerText = "Prioridade: " + formatarPagamento(novoPagamento);

                try {
                    const id = cardClienteSendoEditado.getAttribute("data-id");
                    // TODO: await api.sendPutRequest("/client/update/" + id, { name: novoNome, email: novoEmail, birthDate: novoNascimento, favoritePayment: novoPagamento });
                    alert("Cliente atualizado!");
                    modalEditarCliente.style.display = "none";
                } catch (error) {
                    alert("Erro ao salvar no servidor.");
                }
            };
        }
    }

    // --- FECHAR MODAIS ---
    if (closeInfo) {
        closeInfo.onclick = () => { modalInfo.style.display = "none"; };
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal) { modal.style.display = "none"; form.reset(); }
        if (event.target === modalInfo) modalInfo.style.display = "none";
        if (event.target === modalEditarCliente) modalEditarCliente.style.display = "none";
    });

    carregarClientes();
    atualizarContador();
}