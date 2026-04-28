const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            await handleRegister();
        });
    }
});

async function handleRegister() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!name || !email || !password) {
        showError('Por favor completa todos los campos');
        return;
    }

    const btn = document.querySelector('.btn-primary');
    btn.textContent = 'Creando cuenta...';
    btn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: name, email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Error al registrar');

        alert('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
        window.location.href = 'login.html';

    } catch (error) {
        showError(error.message);
        btn.textContent = 'Crear cuenta';
        btn.disabled = false;
    }
}

function showError(message) {
    let errorDiv = document.getElementById('register-error');
    if (!errorDiv) {
        errorDiv = document.createElement('p');
        errorDiv.id = 'register-error';
        errorDiv.style.cssText = 'color: red; text-align: center; margin-top: 10px;';
        document.querySelector('.auth-container').appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}