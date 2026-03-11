// Змінні
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Елементи DOM
const grid = document.getElementById('products-grid');
const noProductsMsg = document.getElementById('no-products');
const cartCount = document.getElementById('cart-count');
const modal = document.getElementById('product-modal');
const modalDetails = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close-btn');

// Оновлення лічильника кошика при завантаженні
updateCartCount();

// 1. Завантаження даних з JSON
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        renderProducts(products);
    })
    .catch(error => console.error('Помилка завантаження товарів:', error));

// 2. Функція відмальовування карток
function renderProducts(itemsToRender) {
    grid.innerHTML = ''; // Очищаємо сітку

    if (itemsToRender.length === 0) {
        noProductsMsg.classList.remove('hidden');
    } else {
        noProductsMsg.classList.add('hidden');
        
        itemsToRender.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            // Додаємо затримку анімації для ефекту черги
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onclick="openModal(${product.id})">
                <h3>${product.name}</h3>
                <p class="price">₴${product.price}</p>
                <button class="btn" onclick="addToCart(${product.id})">Додати в кошик</button>
            `;
            grid.appendChild(card);
        });
    }
}

// 3. Фільтрація
document.getElementById('apply-filters').addEventListener('click', () => {
    const categoryFilter = document.getElementById('category').value;
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    const filtered = products.filter(product => {
        const matchCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchPrice = product.price >= minPrice && product.price <= maxPrice;
        return matchCategory && matchPrice;
    });

    renderProducts(filtered);
});

// 4. Локальне сховище (Кошик)
function addToCart(productId) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

// 5. Модальне вікно
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalDetails.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" style="max-width:100%; border-radius:8px; margin: 10px 0;">
        <p><strong>Ціна:</strong> ₴${product.price}</p>
        <p><strong>Категорія:</strong> ${product.category}</p>
        <p>${product.description}</p>
    `;
    modal.classList.remove('hidden');
}

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Закриття модального вікна при кліку поза ним
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});

// Знаходимо нові елементи кошика
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.querySelector('.close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Відкриття кошика при кліку на іконку в шапці
cartBtn.addEventListener('click', () => {
    renderCart(); // Відмальовуємо товари перед відкриттям
    cartModal.classList.remove('hidden');
});

// Закриття кошика (на хрестик)
closeCartBtn.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

// Функція, яка збирає товари для відображення у кошику
function renderCart() {
    cartItemsContainer.innerHTML = ''; // Очищаємо список
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Ваш кошик наразі порожній.</p>';
        cartTotal.textContent = 0; // Онуляємо суму
    } else {
        // Зверни увагу: ми додали 'index' сюди, щоб знати позицію товару
        cart.forEach((productId, index) => {
            const product = products.find(p => p.id === productId);
            
            if (product) {
                total += product.price; 
                
                const itemDiv = document.createElement('div');
                itemDiv.style.display = 'flex';
                itemDiv.style.justifyContent = 'space-between';
                itemDiv.style.alignItems = 'center'; // Вирівнюємо по вертикалі
                itemDiv.style.margin = '10px 0';
                itemDiv.style.borderBottom = '1px solid #eee';
                itemDiv.style.paddingBottom = '10px';
                
                itemDiv.innerHTML = `
                    <span style="flex: 1;">${product.name}</span>
                    <strong style="margin-right: 15px;">${product.price} грн</strong>
                    <button onclick="removeFromCart(${index})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; transition: 0.3s;">
                        Видалити
                    </button>
                `;
                cartItemsContainer.appendChild(itemDiv);
            }
        });
        cartTotal.textContent = total;
    }
}

    // Функція видалення товару з кошика
    function removeFromCart(index) {
    // Видаляємо 1 елемент з масиву cart за його індексом
    cart.splice(index, 1);
    
    // Оновлюємо локальне сховище (щоб зміни збереглися після перезавантаження)
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Оновлюємо цифру на іконці кошика в шапці сайту
    updateCartCount();
    
    // Перемальовуємо вміст відкритого кошика (щоб товар зник з екрану і перерахувалася сума)
    renderCart();
}

// Додаємо закриття кошика при кліку поза його межами (оновлюємо існуючий слухач)
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
    if (event.target === cartModal) {
        cartModal.classList.add('hidden');
    }
});