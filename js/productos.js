// Cargar carrito desde localStorage
let cartItems = JSON.parse(localStorage.getItem('farmaciaCart')) || [];

// Base de datos de productos
const allProducts = [
    { name: 'Acetaminofen', price: 15900, category: 'medicamento', image: 'images/acetominofen.png' },
    { name: 'Ibuprofeno', price: 13900, category: 'medicamento', image: 'images/ibuprofeno.png' },
    { name: 'Omeprazol', price: 15500, category: 'medicamento', image: 'images/omeprazol.png' },
    { name: 'Hidrocodona+Acetaminofen', price: 65000, category: 'medicamento', image: 'images/hidrocodona.png' },
    { name: 'Loratadina', price: 5500, category: 'medicamento', image: 'images/caja-loratadina.png' },
    { name: 'Esomeprazol', price: 32900, category: 'medicamento', image: 'images/esomeprazol.png' },
    { name: 'Naproxeno', price: 10500, category: 'medicamento', image: 'images/naproxeno.png' },
    { name: 'Suero electrolit', price: 7500, category: 'insumo', image: 'images/suero.png' },
    { name: 'Tampetadol', price: 19900, category: 'medicamento', image: 'images/tampetadol.png' },
    { name: 'Solucion Salina', price: 3900, category: 'insumo', image: 'images/solucion_salina.png' },
    { name: 'Vitamina D', price: 4500, category: 'suplemento', image: 'images/vitamina.webp' }
];

function formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('es-CO');
}

function saveCart() {
    localStorage.setItem('farmaciaCart', JSON.stringify(cartItems));
}

function addToCart(productName, productPrice, button) {
    const price = Math.round(productPrice);
    
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: productName,
            price: price,
            quantity: 1
        });
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
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Tu carrito está vacío</p>';
        subtotalElement.textContent = '$0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = '<div><p class="cart-item-name">' + item.name + '</p><p class="cart-item-detail">Cantidad: ' + item.quantity + '</p></div><p class="cart-item-price">' + formatCurrency(itemTotal) + '</p>';
        
        cartItemsContainer.appendChild(cartItemDiv);
    });
    
    subtotalElement.textContent = formatCurrency(subtotal);
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No se encontraron productos</p>';
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = '<img src="' + product.image + '" alt="' + product.name + '" class="product-image"><h3 class="product-name">' + product.name + '</h3><p class="product-price">' + formatCurrency(product.price) + '</p><button class="btn btn-primary btn-small" onclick="addToCart(\'' + product.name + '\', ' + product.price + ', this)">Agregar a carrito</button>';
        
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
    
    // Ordenar
    filtered.sort((a, b) => {
        switch(sortBy) {
            case 'nombre-asc':
                return a.name.localeCompare(b.name);
            case 'nombre-desc':
                return b.name.localeCompare(a.name);
            case 'precio-asc':
                return a.price - b.price;
            case 'precio-desc':
                return b.price - a.price;
            default:
                return 0;
        }
    });
    
    displayProducts(filtered);
}

window.onload = function() {
    updateCartDisplay();
    displayProducts(allProducts);
};