// Cargar carrito desde localStorage
let cartItems = JSON.parse(localStorage.getItem('farmaciaCart')) || [];

function formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('es-CO');
}

function loadOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (cartItems.length === 0) {
        window.location.href = 'catalogo.html';
        return;
    }
    
    orderItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = '<div class="order-item-info"><p class="order-item-name">' + item.name + '</p><p class="order-item-qty">Cantidad: ' + item.quantity + '</p></div><p class="order-item-price">' + formatCurrency(itemTotal) + '</p>';
        
        orderItemsContainer.appendChild(orderItem);
    });
    
    const shipping = subtotal >= 100000 ? 0 : 5000;
    const total = subtotal + shipping;
    
    document.getElementById('checkoutSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'Gratis' : formatCurrency(shipping);
    document.getElementById('checkoutTotal').textContent = formatCurrency(total);
}

function finalizePurchase() {
    const form = document.getElementById('checkoutForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const paymentNames = {
        'tarjeta': 'Tarjeta de Crédito/Débito',
        'pse': 'PSE',
        'nequi': 'Nequi/Daviplata',
        'efectivo': 'Efectivo contra entrega'
    };
    
    const total = document.getElementById('checkoutTotal').textContent;
    
    if (confirm('¿Confirmar compra por ' + total + ' con ' + paymentNames[paymentMethod] + '?')) {
        localStorage.removeItem('farmaciaCart');
        
        alert('¡Compra realizada con éxito!\n\nRecibirás un correo de confirmación.\nTu pedido llegará en 2-3 días hábiles.');
        
        window.location.href = 'catalogo.html';
    }
}

window.onload = function() {
    loadOrderSummary();
};