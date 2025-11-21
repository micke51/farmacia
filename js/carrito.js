// Cargar carrito desde localStorage
let cartItems = JSON.parse(localStorage.getItem('farmaciaCart')) || [];

function formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('es-CO');
}

function saveCart() {
    localStorage.setItem('farmaciaCart', JSON.stringify(cartItems));
}

function loadCartItems() {
    const cartItemsSection = document.querySelector('.cart-items-section');
    
    if (cartItems.length === 0) {
        cartItemsSection.innerHTML = '<div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px;"><h2 style="color: #1a472a; margin-bottom: 15px;">Tu carrito está vacío</h2><p style="color: #666; margin-bottom: 25px;">Agrega productos desde el catálogo para comenzar tu compra</p><a href="catalogo.html" class="btn btn-primary">Ir al catálogo</a></div>';
        return;
    }
    
    cartItemsSection.innerHTML = '';
    
    // Mapeo de nombres de productos a imágenes
    const imageMap = {
        'Acetaminofen': 'images/acetominofen.png',
        'Ibuprofeno': 'images/ibuprofeno.png',
        'Omeprazol': 'images/omeprazol.png',
        'Hidrocodona+Acetaminofen': 'images/hidrocodona.png',
        'Loratadina': 'images/caja-loratadina.png',
        'Esomeprazol': 'images/esomeprazol.png',
        'Naproxeno': 'images/naproxeno.png',
        'Suero electrolit': 'images/suero.png',
        'Vitamina D': 'images/vitamina.webp',
        'Tampetadol': 'images/tampetadol.png',
        'Solucion Salina': 'images/solucion_salina.png'

    };
    
    cartItems.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'cart-item-card';
        itemCard.dataset.price = item.price;
        itemCard.dataset.index = index;
        
        const imageSrc = imageMap[item.name] || 'images/logo.png';
        
        itemCard.innerHTML = '<img src="' + imageSrc + '" alt="' + item.name + '" class="cart-item-image"><div class="cart-item-info"><h3 class="cart-item-title">' + item.name + '</h3><p class="cart-item-subtitle">Producto</p></div><div class="cart-item-quantity"><button class="qty-btn" onclick="decreaseQuantity(this)">-</button><input type="number" value="' + item.quantity + '" class="qty-input" min="1" onchange="updateTotals()"><button class="qty-btn" onclick="increaseQuantity(this)">+</button></div><p class="cart-item-price">' + formatCurrency(item.price * item.quantity) + '</p><button class="remove-btn" onclick="removeItem(this)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>';
        
        cartItemsSection.appendChild(itemCard);
    });
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'cart-actions';
    actionsDiv.innerHTML = '<a href="catalogo.html" class="link-btn">Seguir comprando</a><a href="#" class="link-btn-right">Finalizar compra</a>';
    cartItemsSection.appendChild(actionsDiv);
}

function increaseQuantity(button) {
    const card = button.closest('.cart-item-card');
    const index = parseInt(card.dataset.index);
    const input = button.previousElementSibling;
    
    input.value = parseInt(input.value) + 1;
    cartItems[index].quantity = parseInt(input.value);
    
    saveCart();
    updateTotals();
}

function decreaseQuantity(button) {
    const card = button.closest('.cart-item-card');
    const index = parseInt(card.dataset.index);
    const input = button.nextElementSibling;
    
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        cartItems[index].quantity = parseInt(input.value);
        
        saveCart();
        updateTotals();
    }
}

function removeItem(button) {
    const card = button.closest('.cart-item-card');
    const index = parseInt(card.dataset.index);
    
    cartItems.splice(index, 1);
    saveCart();
    
    card.remove();
    updateTotals();
    checkEmptyCart();
}

function checkEmptyCart() {
    const items = document.querySelectorAll('.cart-item-card');
    if (items.length === 0) {
        loadCartItems();
    }
}

function updateTotals() {
    const items = document.querySelectorAll('.cart-item-card');
    let subtotal = 0;

    items.forEach((item, displayIndex) => {
        const index = parseInt(item.dataset.index);
        const price = parseInt(item.dataset.price);
        const quantity = parseInt(item.querySelector('.qty-input').value);
        const itemTotal = price * quantity;
        
        cartItems[index].quantity = quantity;
        
        item.querySelector('.cart-item-price').textContent = formatCurrency(itemTotal);
        subtotal += itemTotal;
    });
    
    saveCart();

    const shipping = subtotal >= 100000 ? 0 : 5000;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = shipping === 0 ? 'Gratis' : formatCurrency(shipping);
    document.getElementById('total').textContent = formatCurrency(total);

    const notice = document.getElementById('shippingNotice');
    if (subtotal >= 100000) {
        notice.innerHTML = '<p style="color: #2e7d32; font-weight: bold;">¡Envío GRATIS!</p>';
    } else {
        const remaining = 100000 - subtotal;
        notice.innerHTML = '<p>¡Agrega ' + formatCurrency(remaining) + ' más para envío GRATIS!</p>';
    }
}

window.onload = function() {
    loadCartItems();
    updateTotals();
};