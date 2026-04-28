const API_URL = 'http://localhost:3000/api';

let cartItems = JSON.parse(localStorage.getItem('farmaciaCart')) || [];

// Mapa de nombres a imágenes
const imageMap = {
    'Acetaminofen': '../images/acetominofen.png',
    'Ibuprofeno': '../images/ibuprofeno.png',
    'Omeprazol': '../images/omeprazol.png',
    'Hidrocodona+Acetaminofen': '../images/hidrocodona.png',
    'Loratadina': '../images/caja-loratadina.png',
    'Esomeprazol': '../images/esomeprazol.png',
    'Naproxeno': '../images/naproxeno.png',
    'Suero electrolit': '../images/suero.png',
    'Vitamina D': '../images/vitamina.webp',
    'Tampetadol': '../images/tampetadol.png',
    'Solucion Salina': '../images/solucion_salina.png',
    'Paracetamol 500mg': '../images/acetominofen.png',
    'Ibuprofeno 800mg': '../images/ibuprofeno.png',
};

function formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('es-CO');
}

function saveCart() {
    localStorage.setItem('farmaciaCart', JSON.stringify(cartItems));
}

function getToken() {
    return localStorage.getItem('token');
}

async function loadProducts() {
    const token = getToken();

    if (!token) {
        updateCartDisplay();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar productos');

        const products = await response.json();
        renderProductCards(products);

    } catch (error) {
        console.error('Error cargando productos:', error);
    }

    updateCartDisplay();
}

function renderProductCards(products) {
    const grid = document.querySelector('.products-grid');
    if (!grid || products.length === 0) return;

    grid.innerHTML = '';

    products.forEach(product => {
        const imageSrc = imageMap[product.name] || '../images/logo.png';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${imageSrc}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatCurrency(product.price)}</p>
            <button class="btn btn-primary btn-small"
                onclick="addToCart('${product.name}', ${product.price}, this)">
                Agregar a carrito
            </button>
        `;
        grid.appendChild(card);
    });
}

function addToCart(productName, productPrice, button) {
    const price = Math.round(productPrice);
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name: productName, price, quantity: 1 });
    }

    saveCart();
    updateCartDisplay();

    button.textContent = '¡Agregado!';
    button.style.backgroundColor = '#1b5e20';
    setTimeout(() => {
        button.textContent = 'Agregar a carrito';
        button.style.backgroundColor = '#2e7d32';
    }, 1000);
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('cart-subtotal');

    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Tu carrito está vacío</p>';
        if (subtotalElement) subtotalElement.textContent = '$0';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-detail">Cantidad: ${item.quantity}</p>
            </div>
            <p class="cart-item-price">${formatCurrency(itemTotal)}</p>
        `;
        cartItemsContainer.appendChild(div);
    });

    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
}

window.onload = function () {
    loadProducts();
};