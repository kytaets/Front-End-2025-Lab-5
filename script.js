const VARIANT = 8;

document.getElementById('variantNumber').textContent = VARIANT;

// --- Форма ------
const form = document.getElementById('labForm');
const fullname = document.getElementById('fullname');
const group = document.getElementById('group');
const idcard = document.getElementById('idcard');
const birthdate = document.getElementById('birthdate');
const email = document.getElementById('email');
const formMessage = document.getElementById('formMessage');
const resetBtn = document.getElementById('resetBtn');

function clearErrors() {
  [fullname, group, idcard, birthdate, email].forEach((i) =>
    i.classList.remove('error')
  );
  formMessage.textContent = '';
}

function showError(field, text) {
  field.classList.add('error');
  formMessage.textContent = text;
}

const reFullname = /\S+\s+\S+/;
const reGroup = /^[A-Za-zА-Яа-яЇїІіЄєҐґ]{2}-\d{2}$/u;
const reIDcard = /^[A-Za-zА-Яа-яЇїІіЄєҐґ]{2}\s*№\d{6}$/u;
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validDateDMY(str) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(str)) return false;
  const [dd, mm, yyyy] = str.split('.').map(Number);
  if (mm < 1 || mm > 12) return false;
  const mdays = [
    31,
    yyyy % 4 === 0 && (yyyy % 100 !== 0 || yyyy % 400 === 0) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (dd < 1 || dd > mdays[mm - 1]) return false;
  return true;
}

form.addEventListener('submit', function (ev) {
  ev.preventDefault();
  clearErrors();

  const vFull = fullname.value.trim();
  const vGroup = group.value.trim();
  const vID = idcard.value.trim();
  const vBirth = birthdate.value.trim();
  const vEmail = email.value.trim();

  if (!reFullname.test(vFull) || vFull.length < 3) {
    showError(fullname, 'Помилка: введіть коректне ПІБ (принаймні два слова).');
    return;
  }
  if (!reGroup.test(vGroup)) {
    showError(
      group,
      'Помилка: Група має формат ДВІ_ЛІТЕРИ-2_ЦИФРИ (наприклад ІМ-32).'
    );
    return;
  }
  if (!reIDcard.test(vID)) {
    showError(
      idcard,
      'Помилка: ID-card має формат "AA №123456" (дві літери, символ №, 6 цифр).'
    );
    return;
  }
  if (!validDateDMY(vBirth)) {
    showError(
      birthdate,
      'Помилка: Дата має формат ДД.ММ.РРРР і бути реальною датою.'
    );
    return;
  }
  if (!reEmail.test(vEmail)) {
    showError(email, 'Помилка: некоректний e-mail.');
    return;
  }

  const popup = window.open('', '_blank', 'width=600,height=400');
  const html = `
    <html><head><meta charset="utf-8"><title>Введені дані</title></head>
    <body style="font-family:Arial;padding:16px">
      <h2>Введені дані (варіант ${VARIANT})</h2>
      <ul>
        <li><strong>ПІБ:</strong> ${escapeHtml(vFull)}</li>
        <li><strong>Група:</strong> ${escapeHtml(vGroup)}</li>
        <li><strong>ID-card:</strong> ${escapeHtml(vID)}</li>
        <li><strong>Дата народж.:</strong> ${escapeHtml(vBirth)}</li>
        <li><strong>E-mail:</strong> ${escapeHtml(vEmail)}</li>
      </ul>
      <p>Це вікно можна зберегти/друкувати як звіт.</p>
    </body></html>`;
  popup.document.write(html);
  popup.document.close();
});

resetBtn.addEventListener('click', () => {
  form.reset();
  clearErrors();
});

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[m];
  });
}

// --- Таблиця -----
const tableWrapper = document.getElementById('table-wrapper');
const colorPicker = document.getElementById('colorPicker');

function buildTable() {
  const table = document.createElement('table');
  table.className = 'table6';
  let num = 1;
  for (let r = 0; r < 6; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < 6; c++) {
      const td = document.createElement('td');
      td.textContent = String(num);
      td.dataset.num = String(num);
      td.dataset.row = r;
      td.dataset.col = c;
      // events
      td.addEventListener('mouseenter', onCellHover);
      td.addEventListener('mouseleave', onCellLeave);
      td.addEventListener('click', onCellClick);
      td.addEventListener('dblclick', onCellDblClick);
      tr.appendChild(td);
      num++;
    }
    table.appendChild(tr);
  }
  tableWrapper.innerHTML = '';
  tableWrapper.appendChild(table);
}

function randomColor() {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  );
}

function onCellHover(e) {
  const td = e.currentTarget;
  const n = Number(td.dataset.num);
  if (n === VARIANT) {
    td._savedBg = td.style.backgroundColor || '';
    td.style.backgroundColor = randomColor();
    td.classList.add('highlight-random');
  }
}

function onCellLeave(e) {
  const td = e.currentTarget;
  const n = Number(td.dataset.num);
  if (n === VARIANT) {
    if (!td.dataset.customColored) {
      td.style.backgroundColor = td._savedBg || '';
      td.classList.remove('highlight-random');
    } else {
      td.classList.remove('highlight-random');
    }
  }
}

function onCellClick(e) {
  const td = e.currentTarget;
  const color = colorPicker.value;
  td.style.backgroundColor = color;
  td.dataset.customColored = '1';
}

function onCellDblClick(e) {
  const td = e.currentTarget;
  const colIndex = Number(td.dataset.col);
  const chosenColor = colorPicker.value;
  const table = tableWrapper.querySelector('table');
  if (!table) return;
  for (let r = 0; r < table.rows.length; r++) {
    for (let c = colIndex; c < table.rows[r].cells.length; c += 2) {
      const cell = table.rows[r].cells[c];
      cell.style.backgroundColor = chosenColor;
      cell.dataset.customColored = '1';
    }
  }
}

buildTable();
