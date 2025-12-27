// alternativasViaje.js - Lógica para buscar y seleccionar alternativas

let alternativaSeleccionada = null;

// Cargar alternativas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarAlternativas();
});

// Función para cargar alternativas desde la API
async function cargarAlternativas() {
    const loader = document.getElementById('loader');
    const errorContainer = document.getElementById('error-container');
    const incidenciasContainer = document.getElementById('incidencias-container');
    
    try {
        loader.style.display = 'block';
        errorContainer.style.display = 'none';
        
        const response = await fetch(`/api/incidencias/viaje/${usuarioId}/${viajeId}/`);
        
        if (!response.ok) {
            throw new Error('Error al cargar las alternativas');
        }
        
        const data = await response.json();
        
        loader.style.display = 'none';
        
        if (data.incidencias && data.incidencias.length > 0) {
            mostrarAlternativas(data);
        } else {
            mostrarMensaje('No se encontraron incidencias para este viaje.', 'info');
        }
        
    } catch (error) {
        console.error('Error:', error);
        loader.style.display = 'none';
        errorContainer.style.display = 'block';
        document.getElementById('error-text').textContent = 
            'No se pudieron cargar las alternativas. Por favor, inténtalo de nuevo más tarde.';
    }
}

// Función para mostrar las alternativas en la interfaz
function mostrarAlternativas(data) {
    const container = document.getElementById('incidencias-container');
    container.innerHTML = '';
    
    data.incidencias.forEach(incidencia => {
        const incidenciaDiv = document.createElement('div');
        incidenciaDiv.className = 'incidencia-section';
        
        // Alerta de incidencia
        const alerta = document.createElement('div');
        alerta.className = 'alert-incidencia';
        alerta.innerHTML = `
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
                <h3>Incidencia detectada en ${data.viaje.origen} → ${data.viaje.destino}</h3>
                <p>${incidencia.descripcion}</p>
            </div>
        `;
        incidenciaDiv.appendChild(alerta);
        
        // Contenedor de alternativas
        if (incidencia.hayAlternativas) {
            const alternativasDiv = document.createElement('div');
            alternativasDiv.className = 'alternativas-grid';
            
            incidencia.alternativas.forEach(alt => {
                const card = crearTarjetaAlternativa(alt, incidencia.id);
                alternativasDiv.appendChild(card);
            });
            
            incidenciaDiv.appendChild(alternativasDiv);
        } else {
            const noAlternativas = document.createElement('div');
            noAlternativas.className = 'no-alternativas';
            noAlternativas.innerHTML = `
                <p>Lo sentimos, no hay alternativas disponibles en este momento.</p>
                <p>Por favor, contacta con atención al cliente para más información.</p>
            `;
            incidenciaDiv.appendChild(noAlternativas);
        }
        
        container.appendChild(incidenciaDiv);
    });
}

// Función para crear una tarjeta de alternativa
function crearTarjetaAlternativa(alt, incId) {
    const card = document.createElement('div');
    card.className = 'alternativa-card';
    
    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${alt.origen} → ${alt.destino}</h3>
            <span class="badge-disponible">
                <i data-lucide="check-circle"></i>
                ${alt.estado}
            </span>
        </div>
        
        <div class="card-body">
            <div class="info-row">
                <i data-lucide="calendar"></i>
                <span>${alt.fecha}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="clock"></i>
                <span>${alt.horaSalida} - ${alt.horaLlegada}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="armchair"></i>
                <span>Asiento ${alt.asiento || 'None'}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="tag"></i>
                <span>${alt.clase || 'Turista Plus'}</span>
            </div>
            
            <div class="info-row">
                <i data-lucide="layers"></i>
                <span>Coche ${alt.coche || 'None'}</span>
            </div>
        </div>
        
        <button class="btn-ver-detalles">
            Seleccionar viaje
        </button>
    `;
    
    // Asignar evento click al botón usando closure para capturar el ID
    const btnVerDetalles = card.querySelector('.btn-ver-detalles');
    const viajeIdCapturado = alt.id;
    
    console.log('Configurando botón para viaje ID:', viajeIdCapturado);
    
    btnVerDetalles.addEventListener('click', function() {
        console.log('Click en botón - viajeIdCapturado:', viajeIdCapturado);
        seleccionarAlternativa(viajeIdCapturado, null, alt.origen, alt.horaSalida);
    });
    
    // Inicializar iconos de Lucide después de agregar el HTML
    setTimeout(() => {
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 0);
    
    return card;
}

// Función para seleccionar una alternativa
function seleccionarAlternativa(altId, incId, nombreTren, horaSalida) {
    console.log('seleccionarAlternativa llamada - altId:', altId, 'tipo:', typeof altId);
    alternativaSeleccionada = altId;
    console.log('alternativaSeleccionada asignada:', alternativaSeleccionada);
    
    const modal = document.getElementById('confirmModal');
    const detalle = document.getElementById('modal-detalle');
    
    detalle.innerHTML = `
        ¿El usuario desea confirmar la modificación del billete a
        "Próximo AVE Disponible"? El nuevo billete tendrá
        salida a las ${horaSalida}.
    `;
    
    modal.style.display = 'flex';
    
    // Inicializar iconos después de mostrar el modal
    setTimeout(() => {
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 0);
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('confirmModal').style.display = 'none';
    alternativaSeleccionada = null;
}

// Función para cerrar el modal de éxito
function cerrarModalExito() {
    document.getElementById('successModal').style.display = 'none';
}

// Función para ir a Mis Viajes
function irAMisViajes() {
    window.location.href = `/misViajes/${usuarioId}/`;
}

// Función para confirmar la selección
async function confirmarSeleccion() {
    console.log('confirmarSeleccion - alternativaSeleccionada:', alternativaSeleccionada, 'tipo:', typeof alternativaSeleccionada);
    
    if (!alternativaSeleccionada) {
        alert('Error: No se ha seleccionado ninguna alternativa');
        return;
    }
    
    // Guardar el ID antes de cerrar el modal
    const idAlternativa = alternativaSeleccionada;
    
    // Cerrar modal de confirmación
    cerrarModal();
    
    try {
        const response = await fetch(`/api/alternativa/aplicar/${usuarioId}/${idAlternativa}/${viajeId}/`, {
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
            alert('❌ Error: ' + (data.error || 'No se pudo aplicar la alternativa'));
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al aplicar la alternativa. Por favor, inténtalo de nuevo.');
    }
}
function mostrarMensaje(texto, tipo) {
    const container = document.getElementById('incidencias-container');
    container.innerHTML = `
        <div class="mensaje-${tipo}">
            <p>${texto}</p>
        </div>
    `;
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
