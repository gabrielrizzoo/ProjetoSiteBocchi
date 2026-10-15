/**
 * Filme Page Script — Ticket Simulator Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const dateBtns = Array.from(document.querySelectorAll('.date-btn'));
  const timeBtns = Array.from(document.querySelectorAll('.time-btn:not([disabled])'));
  const btnMinus = document.getElementById('btn-minus');
  const btnPlus = document.getElementById('btn-plus');
  const qtyEl = document.getElementById('ticket-qty');
  const priceEl = document.getElementById('total-price');
  const summaryEl = document.getElementById('summary-line');
  const buyBtn = document.getElementById('buy-btn');
  const formView = document.getElementById('planner-form');
  const successView = document.getElementById('ticket-success');
  const successText = document.getElementById('success-text');
  const newBookingBtn = document.getElementById('new-booking');

  if (!buyBtn) return;

  const TICKET_PRICE = 35;
  const MAX_QTY = 10;
  let currentQty = 1;

  // Formatter for BRL currency
  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // --- DATAS DINÂMICAS (hoje, amanhã e depois) --- //
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
  const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  dateBtns.forEach((btn, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const label = i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : capitalize(weekday.format(date)).replace('-feira', '');
    btn.querySelector('.date-day').textContent = label;
    btn.querySelector('.date-num').textContent = dayMonth.format(date);
    btn.dataset.label = `${label}, ${dayMonth.format(date)}`;
  });

  // --- RESUMO --- //
  function getSelection() {
    const date = dateBtns.find(b => b.classList.contains('active'));
    const time = timeBtns.find(b => b.classList.contains('active'));
    return {
      date: date ? date.dataset.label : '',
      time: time ? time.querySelector('.time').textContent : '',
      lang: time ? time.dataset.lang : ''
    };
  }

  function updateSummary() {
    const { date, time, lang } = getSelection();
    qtyEl.textContent = currentQty;
    priceEl.textContent = formatCurrency(currentQty * TICKET_PRICE);
    summaryEl.textContent = `${date} · ${time} · ${lang} · ${currentQty} ingresso${currentQty > 1 ? 's' : ''}`;
    btnMinus.disabled = currentQty <= 1;
    btnPlus.disabled = currentQty >= MAX_QTY;
  }

  // --- SELECTION LOGIC --- //
  function handleSelection(buttons, selectedBtn) {
    buttons.forEach(b => {
      const isSelected = b === selectedBtn;
      b.classList.toggle('active', isSelected);
      b.setAttribute('aria-pressed', String(isSelected));
    });
    updateSummary();
  }

  dateBtns.forEach(btn => btn.addEventListener('click', () => handleSelection(dateBtns, btn)));
  timeBtns.forEach(btn => btn.addEventListener('click', () => handleSelection(timeBtns, btn)));

  // --- QUANTITY LOGIC --- //
  btnMinus.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      updateSummary();
    }
  });

  btnPlus.addEventListener('click', () => {
    if (currentQty < MAX_QTY) {
      currentQty++;
      updateSummary();
    }
  });

  // --- CHECKOUT LOGIC (simulado) --- //
  const originalBtnHTML = buyBtn.innerHTML;

  buyBtn.addEventListener('click', () => {
    const { date, time, lang } = getSelection();

    buyBtn.innerHTML = '<span class="material-symbols-outlined spin" aria-hidden="true">progress_activity</span> Processando...';
    buyBtn.disabled = true;

    setTimeout(() => {
      const dateInSentence = date.charAt(0).toLowerCase() + date.slice(1);
      successText.textContent =
        `${currentQty} ingresso${currentQty > 1 ? 's' : ''} para ${dateInSentence}, às ${time} (${lang}). ` +
        `Total: ${formatCurrency(currentQty * TICKET_PRICE)}.`;
      formView.hidden = true;
      successView.hidden = false;
      newBookingBtn.focus();
    }, 1200);
  });

  newBookingBtn.addEventListener('click', () => {
    currentQty = 1;
    buyBtn.innerHTML = originalBtnHTML;
    buyBtn.disabled = false;
    successView.hidden = true;
    formView.hidden = false;
    updateSummary();
    buyBtn.focus();
  });

  updateSummary();
});
