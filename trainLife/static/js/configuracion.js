// configuracion.js - Funcionalidad para página de Configuración

// Estado de los toggles
let notificationSettings = {
    travelNotifications: true,
    routeNotifications: false,
    generalNotifications: true
};

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeConfiguration();
    setupEventListeners();
    lucide.createIcons();
});

/**
 * Inicializa la configuración cargando datos guardados
 */
function initializeConfiguration() {
    // Cargar configuración guardada de localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
        notificationSettings = JSON.parse(savedSettings);
        applySettings();
    }

    // Cargar datos personales guardados
    const savedPersonalInfo = localStorage.getItem('personalInfo');
    if (savedPersonalInfo) {
        const info = JSON.parse(savedPersonalInfo);
        applyPersonalInfo(info);
    }

    console.log('Configuración inicializada:', notificationSettings);
}

/**
 * Aplica la configuración de notificaciones guardada
 */
function applySettings() {
    document.getElementById('travelToggle').checked = notificationSettings.travelNotifications;
    document.getElementById('routeToggle').checked = notificationSettings.routeNotifications;
    document.getElementById('generalToggle').checked = notificationSettings.generalNotifications;
}

/**
 * Aplica la información personal guardada
 */
function applyPersonalInfo(info) {
    if (info.nombre) document.getElementById('nombre').value = info.nombre;
    if (info.primerApellido) document.getElementById('primerApellido').value = info.primerApellido;
    if (info.segundoApellido) document.getElementById('segundoApellido').value = info.segundoApellido;
    if (info.telefono) document.getElementById('telefono').value = info.telefono;
    if (info.email) document.getElementById('email').value = info.email;
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // Toggle switches
    const toggles = ['travelToggle', 'routeToggle', 'generalToggle'];
    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('change', handleToggleChange);
            
            // También hacer que el wrapper sea clickeable
            const wrapper = toggle.closest('.toggle-switch-wrapper');
            if (wrapper) {
                wrapper.addEventListener('click', (e) => {
                    if (e.target !== toggle) {
                        toggle.checked = !toggle.checked;
                        handleToggleChange({ target: toggle });
                    }
                });
            }
        }
    });

    // Botón de guardar
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSaveChanges);
    }

    // Inputs del formulario
    const inputs = ['nombre', 'primerApellido', 'segundoApellido', 'telefono', 'email'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', handleInputChange);
        }
    });

    // Sidebar mobile toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Cerrar sidebar al hacer clic fuera en móvil
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // Cerrar sidebar al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && sidebar) {
            sidebar.classList.remove('active');
        }
    });
}

/**
 * Maneja cambios en los toggle switches
 */
function handleToggleChange(event) {
    const toggleId = event.target.id;
    const isChecked = event.target.checked;

    // Actualizar estado
    switch(toggleId) {
        case 'travelToggle':
            notificationSettings.travelNotifications = isChecked;
            console.log('Notificaciones de viajes:', isChecked ? 'activadas' : 'desactivadas');
            break;
        case 'routeToggle':
            notificationSettings.routeNotifications = isChecked;
            console.log('Notificaciones de rutas:', isChecked ? 'activadas' : 'desactivadas');
            break;
        case 'generalToggle':
            notificationSettings.generalNotifications = isChecked;
            console.log('Notificaciones generales:', isChecked ? 'activadas' : 'desactivadas');
            break;
    }

    // Guardar automáticamente en localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
}

/**
 * Maneja cambios en los inputs del formulario
 */
function handleInputChange(event) {
    console.log(`Campo ${event.target.id} modificado:`, event.target.value);
}

/**
 * Recopila los datos del formulario
 */
function getPersonalInfoData() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        primerApellido: document.getElementById('primerApellido').value.trim(),
        segundoApellido: document.getElementById('segundoApellido').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim()
    };
}

/**
 * Valida los datos del formulario
 */
function validatePersonalInfo(data) {
    const errors = [];

    if (!data.nombre) {
        errors.push('El nombre es obligatorio');
    }

    if (!data.primerApellido) {
        errors.push('El primer apellido es obligatorio');
    }

    if (!data.telefono) {
        errors.push('El teléfono es obligatorio');
    } else if (!/^\+?\d{9,15}$/.test(data.telefono.replace(/\s/g, ''))) {
        errors.push('El formato del teléfono no es válido');
    }

    if (!data.email) {
        errors.push('El correo electrónico es obligatorio');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('El formato del correo electrónico no es válido');
    }

    return errors;
}

/**
 * Maneja el guardado de cambios
 */
function handleSaveChanges(event) {
    // NO prevenir el comportamiento por defecto - permitir envío del formulario
    // event.preventDefault();

    // Recopilar datos para validación
    const personalInfo = getPersonalInfoData();

    // Validar datos
    const errors = validatePersonalInfo(personalInfo);
    
    if (errors.length > 0) {
        // Prevenir envío solo si hay errores
        event.preventDefault();
        
        // Mostrar modal de error
        if (window.showConfirmModal) {
            window.showConfirmModal({
                title: 'Errores de validación',
                message: 'Por favor, corrige los siguientes errores:\n\n' + errors.join('\n'),
                confirmText: 'Entendido',
                type: 'danger',
                onConfirm: () => {
                    console.log('Errores mostrados al usuario');
                }
            });
        } else {
            alert('Por favor, corrige los siguientes errores:\n\n' + errors.join('\n'));
        }
        return;
    }

    // Si no hay errores, el formulario se enviará normalmente al servidor
    console.log('Enviando formulario al servidor...');
}

/**
 * Muestra mensaje de éxito
 */
function showSuccessMessage() {
    // Crear mensaje temporal
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <i data-lucide="check-circle"></i>
        <span>Cambios guardados exitosamente</span>
    `;
    
    // Agregar estilos inline
    message.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(message);
    
    // Inicializar iconos de Lucide para el nuevo elemento
    lucide.createIcons();

    // Eliminar después de 3 segundos
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Debug: Log en consola
console.log('configuracion.js cargado correctamente');
