const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            await handleLogin();
        });
    }
});

async function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showError('Por favor completa todos los campos');
        return;
    }

    const btn = document.querySelector('.btn-primary');
    btn.textContent = 'Ingresando...';
    btn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Credenciales inválidas');
        }

        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirigir al catálogo
        window.location.href = 'catalogo.html';

    } catch (error) {
        showError(error.message);
        btn.textContent = 'Ingresar';
        btn.disabled = false;
    }
}

function showError(message) {
    let errorDiv = document.getElementById('login-error');
    if (!errorDiv) {
        errorDiv = document.createElement('p');
        errorDiv.id = 'login-error';
        errorDiv.style.cssText = 'color: red; text-align: center; margin-top: 10px;';
        document.querySelector('.auth-container').appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}