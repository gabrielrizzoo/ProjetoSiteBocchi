/**
 * Filme Page Script — Ticket Simulator Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const dateBtns = document.querySelectorAll('.date-btn');
  const timeBtns = document.querySelectorAll('.time-btn:not([disabled])');
  const btnMinus = document.getElementById('btn-minus');
  const btnPlus = document.getElementById('btn-plus');
  const qtyEl = document.getElementById('ticket-qty');
  const priceEl = document.getElementById('total-price');
  const buyBtn = document.getElementById('buy-btn');

  const TICKET_PRICE = 35;
  let currentQty = 1;

  // Formatter for BRL currency
  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  function updatePrice() {
    qtyEl.textContent = currentQty;
    priceEl.textContent = formatCurrency(currentQty * TICKET_PRICE);
  }

  // --- SELECTION LOGIC --- //
  
  function handleSelection(buttons, selectedBtn) {
    buttons.forEach(b => b.classList.remove('active'));
    selectedBtn.classList.add('active');
  }

  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => handleSelection(dateBtns, btn));
  });

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => handleSelection(timeBtns, btn));
  });

  // --- QUANTITY LOGIC --- //
  
  btnMinus.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      updatePrice();
    }
  });

  btnPlus.addEventListener('click', () => {
    if (currentQty < 10) {
      currentQty++;
      updatePrice();
    }
  });

  // --- CHECKOUT LOGIC --- //
  
  buyBtn.addEventListener('click', () => {
    const activeDate = document.querySelector('.date-btn.active').innerText.replace('\n', ' ');
    const activeTime = document.querySelector('.time-btn.active').innerText;
    
    const planner = document.querySelector('.ticket-planner');
    const originalHTML = buyBtn.innerHTML;
    
    // Simulate loading
    buyBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spinLoader 1s linear infinite;">sync</span> Processando...';
    buyBtn.disabled = true;

    setTimeout(() => {
      planner.innerHTML = `
        <div class="ticket-success">
          <span class="material-symbols-outlined" style="font-size: 4rem;">check_circle</span>
          <h2>Reserva Confirmada!</h2>
          <p>Você reservou <strong>${currentQty} ingresso(s)</strong> para ${activeDate} às ${activeTime}.</p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">(Isto é um ambiente simulado para fins de portfólio)</p>
          <button class="btn-primary" onclick="location.reload()" style="margin-top: 1rem;">Nova Reserva</button>
        </div>
      `;
    }, 1500);
  });
});
