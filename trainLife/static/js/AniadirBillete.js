// AniadirBillete.js - Funcionalidad para añadir billetes

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar iconos de Lucide
    lucide.createIcons();

    // Configurar fecha mínima (hoy)
    const fechaInput = document.getElementById('fechaViaje');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', today);
        
        // Si no hay fecha seleccionada, establecer hoy como default
        if (!fechaInput.value) {
            fechaInput.value = today;
        }
    }

    // Validación del formulario
    const form = document.getElementById('billeteForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Validar que la hora de llegada sea posterior a la hora de salida
            const horaSalida = document.getElementById('horaSalidaOrigen').value;
            const horaLlegada = document.getElementById('horaLlegadaDestino').value;
            
            if (horaSalida && horaLlegada) {
                const [horaSalidaH, horaSalidaM] = horaSalida.split(':').map(Number);
                const [horaLlegadaH, horaLlegadaM] = horaLlegada.split(':').map(Number);
                
                const minutosHoraSalida = horaSalidaH * 60 + horaSalidaM;
                const minutosHoraLlegada = horaLlegadaH * 60 + horaLlegadaM;
                
                if (minutosHoraLlegada <= minutosHoraSalida) {
                    e.preventDefault();
                    alert('La hora de llegada debe ser posterior a la hora de salida.');
                    return false;
                }
            }
        });
    }

    // Auto-capitalizar primera letra de las estaciones
    const origenInput = document.getElementById('origenEstacion');
    const destinoInput = document.getElementById('destinoEstacion');
    
    function capitalizeFirstLetter(input) {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value) {
                    this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
                }
            });
        }
    }
    
    capitalizeFirstLetter(origenInput);
    capitalizeFirstLetter(destinoInput);

    // Sidebar toggle para móvil
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });

        // Cerrar sidebar al hacer click fuera (solo móvil)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // Formatear valores de coche y asiento
    const cocheInput = document.getElementById('coche');
    const asientoInput = document.getElementById('asiento');
    
    if (cocheInput) {
        cocheInput.addEventListener('blur', function() {
            if (this.value && !isNaN(this.value)) {
                // Formatear como "01", "02", etc.
                this.value = this.value.padStart(2, '0');
            }
        });
    }
    
    if (asientoInput) {
        asientoInput.addEventListener('input', function() {
            // Convertir a mayúsculas automáticamente
            this.value = this.value.toUpperCase();
        });
    }
});
