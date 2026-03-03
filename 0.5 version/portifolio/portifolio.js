(function() {
      const btnVoltar = document.getElementById('btnVoltar');
      const btnIncluir = document.getElementById('btnIncluir');
      const itemInput = document.getElementById('item');
      const qtyInput = document.getElementById('quantidade');
      const quandoSelect = document.getElementById('quando');
      const alertIcon = document.getElementById('alertIcon');

      btnVoltar.addEventListener('click', () => {
        if (history.length > 1) history.back();
        else window.location.href = '/';
      });

      function updateAlertVisual() {
        if (quandoSelect.value === '2d') {
          alertIcon.style.boxShadow = '0 6px 18px rgba(217,83,79,0.25)';
        } else {
          alertIcon.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)';
        }
      }
      quandoSelect.addEventListener('change', updateAlertVisual);
      updateAlertVisual();

      btnIncluir.addEventListener('click', () => {
        const item = itemInput.value.trim();
        const qty = qtyInput.value.trim();

        if (!item) {
          itemInput.focus();
          showTemporaryFeedback('Preencha o nome do item.', 'warning');
          return;
        }
        if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) {
          qtyInput.focus();
          showTemporaryFeedback('Insira uma quantidade válida (> 0).', 'warning');
          return;
        }

        const whenText = quandoSelect.options[quandoSelect.selectedIndex].text;
        showTemporaryFeedback(`Incluído: ${item} — ${qty} unidades. Notificar: ${whenText}`, 'success');

        itemInput.value = '';
        qtyInput.value = '';
        quandoSelect.selectedIndex = 0;
        updateAlertVisual();
      });

      function showTemporaryFeedback(text, type) {

        const div = document.createElement('div');
        div.className = 'position-fixed bottom-0 end-0 m-4 p-3 rounded';
        div.style.zIndex = 1080;
        div.style.minWidth = '260px';
        div.style.background = type === 'success' ? '#e6ffed' : '#fff4e5';
        div.style.border = '1px solid rgba(0,0,0,0.08)';
        div.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
        div.innerHTML = `<strong style="display:block;margin-bottom:6px">${type === 'success' ? 'Sucesso' : 'Atenção'}</strong><div style="font-size:0.95rem">${text}</div>`;
        document.body.appendChild(div);
        setTimeout(() => {
          div.style.transition = 'opacity 350ms, transform 350ms';
          div.style.opacity = '0';
          div.style.transform = 'translateY(8px)';
        }, 1600);
        setTimeout(() => div.remove(), 2000);
      }

    })();