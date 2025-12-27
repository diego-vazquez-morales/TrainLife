// AniadirBillete.js - Lógica para comprar billetes (mostrar viajes disponibles)

let viajeSeleccionado = null;

// Cargar viajes disponibles al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha mínima (hoy)
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', today);
    }
    
    cargarViajesDisponibles();
});

// Función para buscar viajes con filtros
function buscarViajes() {
    cargarViajesDisponibles();
}

// Función para limpiar filtros
function limpiarFiltros() {
    document.getElementById('origen').value = '';
    document.getElementById('destino').value = '';
    document.getElementById('fecha').value = '';
    cargarViajesDisponibles();
}

// Función para cargar viajes disponibles desde la API
async function cargarViajesDisponibles() {
    const loader = document.getElementById('loader');
    const errorContainer = document.getElementById('error-container');
    const viajesGrid = document.getElementById('viajes-grid');
    
    // Obtener valores de los filtros
    const origen = document.getElementById('origen').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const fecha = document.getElementById('fecha').value;
    
    // Construir query string
    let queryParams = [];
    if (origen) queryParams.push(`origen=${encodeURIComponent(origen)}`);
    if (destino) queryParams.push(`destino=${encodeURIComponent(destino)}`);
    if (fecha) queryParams.push(`fecha=${fecha}`);
    const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
    
    try {
        loader.style.display = 'block';
        errorContainer.style.display = 'none';
        viajesGrid.innerHTML = '';
        
        const url = `/api/viajes-disponibles/${usuarioId}/${queryString}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error al cargar los viajes disponibles');
        }
        
        const data = await response.json();
        loader.style.display = 'none';
        
        if (data.viajes && data.viajes.length > 0) {
            mostrarViajes(data.viajes);
        } else {
            mostrarMensaje('No hay viajes disponibles en este momento.', 'info');
        }
        
    } catch (error) {
        console.error('Error:', error);
        loader.style.display = 'none';
        errorContainer.style.display = 'block';
        document.getElementById('error-text').textContent = 
            'No se pudieron cargar los viajes disponibles. Por favor, inténtalo de nuevo más tarde.';
    }
}

// Función para mostrar los viajes en el grid
function mostrarViajes(viajes) {
    const grid = document.getElementById('viajes-grid');
    grid.innerHTML = '';
    
    viajes.forEach(viaje => {
        const card = crearTarjetaViaje(viaje);
        grid.appendChild(card);
    });
}

// Función para crear una tarjeta de viaje
function crearTarjetaViaje(viaje) {
    const card = document.createElement('div');
    card.className = 'viaje-card';
    
    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${viaje.origen} → ${viaje.destino}</h3>
            <span class="badge-disponible">
                <i data-lucide="check-circle"></i>
                ${viaje.estado}
            </span>
        </div>
        
        <div class="card-body">
            <div class="info-row">
                <i data-lucide="calendar"></i>
                <span>${viaje.fecha}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="clock"></i>
                <span>${viaje.horaSalida} - ${viaje.horaLlegada}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="timer"></i>
                <span>Duración: ${viaje.duracion}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="armchair"></i>
                <span>Asiento ${viaje.asiento}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="tag"></i>
                <span>${viaje.clase}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="layers"></i>
                <span>Coche ${viaje.coche}</span>
            </div>
        </div>
        
        <button class="btn-comprar">
            <i data-lucide="shopping-cart"></i>
            Comprar Billete
        </button>
    `;
    
    // Asignar evento click al botón usando closure
    const btnComprar = card.querySelector('.btn-comprar');
    const viajeIdCapturado = viaje.id;
    
    btnComprar.addEventListener('click', function() {
        seleccionarViaje(viajeIdCapturado, viaje);
    });
    
    // Inicializar iconos de Lucide
    setTimeout(() => {
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 0);
    
    return card;
}

// Función para seleccionar un viaje
function seleccionarViaje(viajeId, datosViaje) {
    viajeSeleccionado = viajeId;
    
    const modal = document.getElementById('confirmModal');
    const detalle = document.getElementById('modal-detalle');
    
    detalle.innerHTML = `
        ¿Desea confirmar la compra del billete de <strong>${datosViaje.origen}</strong> a 
        <strong>${datosViaje.destino}</strong>?<br><br>
        Fecha: ${datosViaje.fecha}<br>
        Horario: ${datosViaje.horaSalida} - ${datosViaje.horaLlegada}<br>
        Asiento: ${datosViaje.asiento} | Coche: ${datosViaje.coche}<br>
        Clase: ${datosViaje.clase}
    `;
    
    modal.style.display = 'flex';
    
    // Inicializar iconos
    setTimeout(() => {
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 0);
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('confirmModal').style.display = 'none';
    viajeSeleccionado = null;
}

// Función para cerrar el modal de éxito
function cerrarModalExito() {
    document.getElementById('successModal').style.display = 'none';
}

// Función para ir a Mis Viajes
function irAMisViajes() {
    window.location.href = `/misViajes/${usuarioId}/`;
}

// Función para confirmar la compra
async function confirmarCompra() {
    if (!viajeSeleccionado) {
        alert('Error: No se ha seleccionado ningún viaje');
        return;
    }
    
    // Guardar el ID antes de cerrar el modal
    const idViaje = viajeSeleccionado;
    
    // Cerrar modal de confirmación
    cerrarModal();
    
    try {
        const response = await fetch(`/api/comprar-viaje/${usuarioId}/${idViaje}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Mostrar modal de éxito
            const successModal = document.getElementById('successModal');
            successModal.style.display = 'flex';
            
            // Inicializar iconos
            setTimeout(() => {
                if (window.lucide) {
                    lucide.createIcons();
                }
            }, 0);
        } else {
            alert('❌ Error: ' + (data.error || 'No se pudo comprar el billete'));
            // Recargar viajes disponibles
            cargarViajesDisponibles();
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al comprar el billete. Por favor, inténtalo de nuevo.');
        // Recargar viajes disponibles
        cargarViajesDisponibles();
    }
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    const grid = document.getElementById('viajes-grid');
    grid.innerHTML = `
        <div class="mensaje-${tipo}">
            <i data-lucide="info"></i>
            <p>${texto}</p>
        </div>
    `;
    
    // Inicializar iconos
    setTimeout(() => {
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 0);
}

// Función auxiliar para obtener el CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

