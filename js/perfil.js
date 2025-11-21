function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.profile-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById('section-' + sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Actualizar navegación activa
    const navItems = document.querySelectorAll('.profile-nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNav = document.querySelector('[href="#' + sectionName + '"]');
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Evitar que el enlace cambie la URL
    return false;
}

function saveChanges(section) {
    let message = '';
    
    switch(section) {
        case 'datos':
            message = 'Datos personales actualizados correctamente';
            break;
        case 'direccion':
            message = 'Dirección de envío actualizada correctamente';
            break;
        case 'seguridad':
            message = 'Contraseña cambiada correctamente';
            break;
        default:
            message = 'Cambios guardados correctamente';
    }
    
    alert(message);
}

function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        // Opcional: Limpiar el carrito al cerrar sesión
        // localStorage.removeItem('farmaciaCart');
        
        alert('Sesión cerrada correctamente');
        window.location.href = 'index.html';
    }
}

// Prevenir que los enlaces # recarguen la página
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.profile-nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
});