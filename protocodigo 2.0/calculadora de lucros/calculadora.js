// script.js — cole no seu arquivo script.js
// Observação: seu HTML já carrega esse script no fim do <body>, então não precisa de DOMContentLoaded.

const campo1 = document.getElementById("campo1");
const campo2 = document.getElementById("campo2");

// seus botões usam a mesma classe; o primeiro é "Calcular", o segundo é "Limpar"
const botoes = document.querySelectorAll(".botaoCalculos");
const btnCalcular = botoes[0];
const btnLimpar = botoes[1];

// cria/usa uma área de resultado logo abaixo do fieldset
const fieldset = document.querySelector("fieldset");
let resultado = document.getElementById("resultado-calculo");
if (!resultado) {
  resultado = document.createElement("div");
  resultado.id = "resultado-calculo";
  resultado.style.marginTop = "12px";
  fieldset.appendChild(resultado);
}

// ----------------- formatação do campo1 (valor) -----------------
// permite digitar e formata com pontos de milhares e vírgula decimal
campo1.addEventListener("input", () => {
  let v = campo1.value;

  // mantém apenas dígitos e vírgula (usuário pode digitar vírgula para decimal)
  v = v.replace(/[^\d,]/g, "");

  // permite apenas a primeira vírgula
  const parts = v.split(",");
  if (parts.length > 1) {
    v = parts.shift() + "," + parts.join("");
  }

  // separa parte inteira e decimal
  let [inteira, decimal] = v.split(",");
  decimal = decimal || "";

  // adiciona pontos a cada 3 dígitos na parte inteira
  inteira = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  campo1.value = decimal ? `${inteira},${decimal}` : inteira;
});

// ----------------- validação / formatação do campo2 (porcentagem) -----------------
campo2.addEventListener("input", () => {
  // permitir apenas números, ponto ou vírgula e um sinal de negativo não permitido
  let v = campo2.value;
  v = v.replace(/[^\d.,]/g, ""); // deixa dígitos, ponto e vírgula
  // se houver mais de um separador, mantém só o primeiro
  const firstSepIndex = Math.max(v.indexOf(","), v.indexOf("."));
  if (firstSepIndex !== -1) {
    // conserva só o primeiro separador que aparecer
    const sep = v[firstSepIndex];
    const left = v.slice(0, firstSepIndex + 1);
    const right = v.slice(firstSepIndex + 1).replace(/[.,]/g, "");
    v = left + right;
  } else {
    v = v.replace(/[.,]/g, v); // nada a fazer
  }
  campo2.value = v;
});

// ----------------- helpers -----------------
function parseValorFormatado(str) {
  if (!str) return NaN;
  // remove pontos de milhares e transforma vírgula em ponto decimal
  const cleaned = str.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned);
}

function parsePercent(str) {
  if (!str) return NaN;
  // troca vírgula por ponto e parseFloat
  return parseFloat(str.replace(",", "."));
}

function formatBRL(n) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ----------------- ação do botão Calcular -----------------
btnCalcular.addEventListener("click", () => {
  const valorProduto = parseValorFormatado(campo1.value);
  const porcentagem = parsePercent(campo2.value);

  // validações básicas
  if (isNaN(valorProduto)) {
    resultado.innerHTML = `<div class="text-danger">Informe um valor válido para o produto.</div>`;
    return;
  }
  if (isNaN(porcentagem)) {
    resultado.innerHTML = `<div class="text-danger">Informe a porcentagem de lucro desejada.</div>`;
    return;
  }

  // se porcentagem é 0 => sem lucro (aceitável, mas mostramos aviso)
  if (porcentagem === 0) {
    resultado.innerHTML = `<div class="text-warning">A porcentagem é 0% — resultado sem lucro.</div>`;
  }

  // 1) Preço simples (custo + x%)
  const precoComLucro = valorProduto * (1 + porcentagem / 100);

  // 2) Preço pelo cálculo de markup/margem (quando você quer que a margem final seja X%)
  // formula: preco = custo / (1 - margem), margem em decimal. Só válida se porcentagem < 100
  let precoPorMarkup = NaN;
  if (porcentagem >= 100) {
    precoPorMarkup = NaN; // indefinido, mostramos aviso abaixo
  } else {
    precoPorMarkup = valorProduto / (1 - porcentagem / 100);
  }

  let html = `<div>
    <strong>Valor custo:</strong> ${formatBRL(valorProduto)}<br>
    <strong>${porcentagem}%</strong> aplicado:<br>
    &nbsp;&nbsp;<em>- Cálculo simples (custo + ${porcentagem}%):</em> <strong>${formatBRL(precoComLucro)}</strong><br>`

  resultado.innerHTML = html;
});

btnLimpar.addEventListener("click", () => {
  campo1.value = "";
  campo2.value = "";
  resultado.innerHTML = "";
  campo1.focus();
});