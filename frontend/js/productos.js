const API_URL = 'http://localhost:3000/api';

let cartItems = JSON.parse(localStorage.getItem('farmaciaCart')) || [];
let allProducts = []; // se llenará desde la API

const imageMap = {
    'Acetaminofen': '../images/acetominofen.png',
    'Ibuprofeno': '../images/ibuprofeno.png',
    'Omeprazol': '../images/omeprazol.png',
    'Hidrocodona+Acetaminofen': '../images/hidrocodona.png',
    'Loratadina': '../images/caja-loratadina.png',
    'Esomeprazol': '../images/esomeprazol.png',
    'Naproxeno': '../images/naproxeno.png',
    'Suero electrolit': '../images/suero.png',
    'Tampetadol': '../images/tampetadol.png',
    'Solucion Salina': '../images/solucion_salina.png',
    'Vitamina D': '../images/vitamina.webp',
};

const categoryMap = {
    1: 'Analgésicos',
    2: 'Antibióticos',
    3: 'Higiene',
    4: 'Vitaminas',
    5: 'Otros',
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

    try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/products`, { headers });

        if (!response.ok) throw new Error('Error al cargar productos');

        const products = await response.json();

        // Mapear productos de la API al formato que usa el frontend
        allProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            category: categoryMap[p.category_id] || 'Otros',
            category_id: p.category_id,
            image: imageMap[p.name] || '../images/logo.png'
        }));

        displayProducts(allProducts);

    } catch (error) {
        console.error('Error cargando productos:', error);
    }

    updateCartDisplay();
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

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No se encontraron productos</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
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

function filterProducts() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    let filtered = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchText);
        const matchesCategory = category === 'todos' || product.category === category;
        return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'nombre-asc': return a.name.localeCompare(b.name);
            case 'nombre-desc': return b.name.localeCompare(a.name);
            case 'precio-asc': return a.price - b.price;
            case 'precio-desc': return b.price - a.price;
            default: return 0;
        }
    });

    displayProducts(filtered);
}

window.onload = function () {
    loadProducts();
};