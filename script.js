// ============================================
// ДАННЫЕ
// ============================================
var products = [
  {
    id: 1,
    sku: 'WB-001',
    name: 'Футболка базовая',
    cell: 'A-14-02',
    status: 'Готов к отгрузке',
    category: 'Одежда',
    quantity: 48,
    weight: '0.18 кг',
    dateAdded: '2026-07-28',
    description: 'Базовая футболка из хлопка, цвет белый, размеры S–XXL'
  },
  {
    id: 2,
    sku: 'WB-002',
    name: 'Кроссовки',
    cell: 'B-03-01',
    status: 'На хранении',
    category: 'Обувь',
    quantity: 12,
    weight: '0.85 кг',
    dateAdded: '2026-08-01',
    description: 'Кроссовки повседневные, чёрные, размеры 39–45'
  },
  {
    id: 3,
    sku: 'WB-003',
    name: 'Рюкзак',
    cell: 'B-05-02',
    status: 'На сборке',
    category: 'Аксессуары',
    quantity: 5,
    weight: '0.62 кг',
    dateAdded: '2026-08-05',
    description: 'Городской рюкзак 25 л, водоотталкивающая ткань, цвет серый'
  },
  {
    id: 4,
    sku: 'WB-004',
    name: 'Кепка',
    cell: 'A-12-04',
    status: 'Списан',
    category: 'Аксессуары',
    quantity: 0,
    weight: '0.07 кг',
    dateAdded: '2026-06-15',
    description: 'Бейсболка с прямым козырьком, брак при приёмке — списан'
  },
  {
    id: 5,
    sku: 'WB-005',
    name: 'Худи оверсайз',
    cell: 'A-14-05',
    status: 'Готов к отгрузке',
    category: 'Одежда',
    quantity: 30,
    weight: '0.45 кг',
    dateAdded: '2026-08-08',
    description: 'Худи оверсайз из футера, цвет хаки, размеры M–XXXL'
  },
  {
    id: 6,
    sku: 'WB-006',
    name: 'Сумка спортивная',
    cell: 'C-01-03',
    status: 'На хранении',
    category: 'Аксессуары',
    quantity: 22,
    weight: '0.33 кг',
    dateAdded: '2026-07-20',
    description: 'Спортивная сумка 40 л с отделением для обуви, цвет тёмно-синий'
  },
  {
    id: 7,
    sku: 'WB-007',
    name: 'Шорты тренировочные',
    cell: 'A-10-01',
    status: 'На сборке',
    category: 'Одежда',
    quantity: 8,
    weight: '0.15 кг',
    dateAdded: '2026-08-10',
    description: 'Тренировочные шорты со шортами, быстросохнущая ткань'
  },
  {
    id: 8,
    sku: 'WB-008',
    name: 'Носки комплект 3 пары',
    cell: 'D-02-01',
    status: 'На хранении',
    category: 'Одежда',
    quantity: 150,
    weight: '0.09 кг',
    dateAdded: '2026-08-02',
    description: 'Комплект из 3 пар носков, хлопок, чёрный цвет'
  }
];

// Маппинг статус → CSS-класс и цвет полоски
var statusMap = {
  'Готов к отгрузке': {
    cls: 'status-ready',
    bar: 'linear-gradient(90deg, #22c55e, #16a34a)'
  },
  'На хранении': {
    cls: 'status-storage',
    bar: 'linear-gradient(90deg, #38bdf8, #0284c7)'
  },
  'На сборке': {
    cls: 'status-assembly',
    bar: 'linear-gradient(90deg, #f59e0b, #d97706)'
  },
  'Списан': {
    cls: 'status-written-off',
    bar: 'linear-gradient(90deg, #ef4444, #dc2626)'
  }
};

// ============================================
// СОСТОЯНИЕ
// ============================================
var currentFilter = 'all';
var currentSearch = '';

// ============================================
// ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ
// ============================================
var searchInput = document.getElementById('searchInput');
var filterContainer = document.getElementById('filterContainer');
var tableBody = document.getElementById('tableBody');
var emptyState = document.getElementById('emptyState');
var tableContainer = document.getElementById('tableContainer');
var totalCountEl = document.getElementById('totalCount');
var shownCountEl = document.getElementById('shownCount');
var modalOverlay = document.getElementById('modalOverlay');
var btnCloseModal = document.getElementById('btnCloseModal');
var modalTitle = document.getElementById('modalTitle');
var modalSku = document.getElementById('modalSku');
var modalDetails = document.getElementById('modalDetails');
var modalStatus = document.getElementById('modalStatus');
var modalAccentBar = document.getElementById('modalAccentBar');

// ============================================
// ФИЛЬТРАЦИЯ
// ============================================
function getFilteredProducts() {
  var query = currentSearch.toLowerCase().trim();
  return products.filter(function (p) {
    var matchStatus = currentFilter === 'all' || p.status === currentFilter;
    var matchSearch = !query
      || p.name.toLowerCase().indexOf(query) !== -1
      || p.sku.toLowerCase().indexOf(query) !== -1;
    return matchStatus && matchSearch;
  });
}

// ============================================
// ФОРМАТИРОВАНИЕ ДАТЫ
// ============================================
function formatDate(dateStr) {
  var months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  var parts = dateStr.split('-');
  var day = parseInt(parts[2], 10);
  var month = months[parseInt(parts[1], 10) - 1];
  var year = parts[0];
  return day + ' ' + month + ' ' + year;
}

// ============================================
// РЕНДЕР ТАБЛИЦЫ
// ============================================
function renderTable() {
  var filtered = getFilteredProducts();
  totalCountEl.textContent = products.length;
  shownCountEl.textContent = filtered.length;

  if (filtered.length === 0) {
    tableBody.innerHTML = '';
    tableContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  tableContainer.classList.remove('hidden');
  emptyState.classList.add('hidden');

  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    var s = statusMap[p.status];
    html += '<div class="table-row" data-status="' + p.status + '" style="animation-delay: ' + (i * 0.04) + 's;" role="row">'
      + '<div class="cell-sku" role="cell"><span class="sku-tag">' + p.sku + '</span></div>'
      + '<div class="cell-name" role="cell">' + p.name + '</div>'
      + '<div class="cell-cell" role="cell">' + p.cell + '</div>'
      + '<div class="cell-status" role="cell">'
      +   '<span class="status-badge ' + s.cls + '">'
      +     '<span class="status-dot"></span>'
      +     p.status
      +   '</span>'
      + '</div>'
      + '<div class="cell-action" role="cell">'
      +   '<button class="btn-open" data-id="' + p.id + '" aria-label="Открыть карточку товара ' + p.name + '">Открыть</button>'
      + '</div>'
      + '</div>';
  }
  tableBody.innerHTML = html;
}

// ============================================
// МОДАЛЬНАЯ КАРТОЧКА
// ============================================
function openModal(id) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      product = products[i];
      break;
    }
  }
  if (!product) return;

  var s = statusMap[product.status];

  modalTitle.textContent = product.name;
  modalSku.textContent = 'SKU: ' + product.sku;
  modalAccentBar.style.background = s.bar;
  modalStatus.innerHTML = '<span class="status-badge ' + s.cls + '"><span class="status-dot"></span>' + product.status + '</span>';

  modalDetails.innerHTML = ''
    + '<div class="detail-row">'
    +   '<span class="detail-label">Категория</span>'
    +   '<span class="detail-value">' + product.category + '</span>'
    + '</div>'
    + '<div class="detail-row">'
    +   '<span class="detail-label">Ячейка хранения</span>'
    +   '<span class="detail-value" style="font-family: monospace;">' + product.cell + '</span>'
    + '</div>'
    + '<div class="detail-row">'
    +   '<span class="detail-label">Количество</span>'
    +   '<span class="detail-value">' + product.quantity + ' шт.</span>'
    + '</div>'
    + '<div class="detail-row">'
    +   '<span class="detail-label">Вес единицы</span>'
    +   '<span class="detail-value">' + product.weight + '</span>'
    + '</div>'
    + '<div class="detail-row">'
    +   '<span class="detail-label">Дата поступления</span>'
    +   '<span class="detail-value">' + formatDate(product.dateAdded) + '</span>'
    + '</div>'
    + '<div class="detail-row">'
    +   '<span class="detail-label">Описание</span>'
    +   '<span class="detail-value detail-value-desc">' + product.description + '</span>'
    + '</div>';

  modalOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
  setTimeout(function () { btnCloseModal.focus(); }, 100);
}

function closeModal() {
  modalOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

// Живой поиск
searchInput.addEventListener('input', function (e) {
  currentSearch = e.target.value;
  renderTable();
});

// Фильтры — делегирование событий
filterContainer.addEventListener('click', function (e) {
  var btn = e.target.closest('.filter-btn');
  if (!btn) return;

  var allBtns = filterContainer.querySelectorAll('.filter-btn');
  for (var i = 0; i < allBtns.length; i++) {
    allBtns[i].classList.remove('active');
  }
  btn.classList.add('active');

  currentFilter = btn.getAttribute('data-filter');
  renderTable();
});

// Кнопки «Открыть» — делегирование событий на таблицу
tableBody.addEventListener('click', function (e) {
  var btn = e.target.closest('.btn-open');
  if (!btn) return;
  var id = parseInt(btn.getAttribute('data-id'), 10);
  openModal(id);
});

// Закрытие модалки
btnCloseModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modalOverlay.classList.contains('visible')) {
    closeModal();
  }
});

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================
renderTable();
