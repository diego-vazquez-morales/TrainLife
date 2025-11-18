// Configuración de Tailwind
window.tailwind = window.tailwind || {};
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#137fec",
                "background-light": "#f6f7f8",
                "background-dark": "#101922",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
};

// Lógica de cierre de sesión
document.addEventListener('DOMContentLoaded', function() {
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    const btnCancelar = document.getElementById('btnCancelar');
    const modalExito = document.getElementById('modalExito');
    const modalConfirmacion = document.querySelector('[role="dialog"]:not(#modalExito)');
    
    // Botón "Sí, cerrar sesión"
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            // Ocultar modal de confirmación
            if (modalConfirmacion) {
                modalConfirmacion.style.display = 'none';
            }
            
            // Mostrar modal de éxito
            if (modalExito) {
                modalExito.style.display = 'block';
            }
            
            // Limpiar sesión
            sessionStorage.clear();
            localStorage.clear();
            
            // Redirigir al home después de 2 segundos
            setTimeout(function() {
                window.location.href = '/';
            }, 2000);
        });
    }
    
    // Botón "Cancelar"
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            // Volver a la página anterior
            window.history.back();
        });
    }
});