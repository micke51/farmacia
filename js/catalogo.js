// Cargar carrito desde localStorage al iniciar
let cartItems = JSON.parse(localStorage.getItem('farmaciaCart')) || [];

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

window.onload = function() {
    updateCartDisplay();
};
// TEMPORAL - PARA DEBUGGING
console.log('Carrito cargado:', cartItems);
console.log('LocalStorage:', localStorage.getItem('farmaciaCart'));