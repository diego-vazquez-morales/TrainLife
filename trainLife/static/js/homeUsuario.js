/* homeUsuario.js
   Script para homeUsuario.html - Dashboard de usuario con navegación completa
*/

document.addEventListener('DOMContentLoaded', function () {
  console.log('homeUsuario.js cargado');
  
  // Inicializar iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // === NAVEGACIÓN DE TARJETAS ===
  
  // Seleccionar todas las tarjetas con data-navigate
  const actionCards = document.querySelectorAll('.action-card[data-navigate]');
  
  actionCards.forEach(card => {
    const destination = card.getAttribute('data-navigate');
    
    // Click con mouse
    card.addEventListener('click', function() {
      handleCardClick(destination);
    });
    
    // Navegación con teclado (Enter y Espacio)
    card.addEventListener('keydown', function(e) {
      handleKeyDown(e, destination);
    });
  });
  
  // === NAVEGACIÓN DE BOTONES ===
  
  // Seleccionar todos los botones con data-navigate
  const navButtons = document.querySelectorAll('button[data-navigate]');
  
  navButtons.forEach(button => {
    const destination = button.getAttribute('data-navigate');
    
    button.addEventListener('click', function() {
      handleCardClick(destination);
    });
  });
  
  // === FUNCIÓN DE NAVEGACIÓN ===
  
  function handleCardClick(path) {
    console.log('Navegando a:', path);
    window.location.href = path;
  }
  
  function handleKeyDown(e, path) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(path);
    }
  }
  
  // === SIDEBAR MÓVIL ===
  
  const sidebar = document.getElementById('sidebar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  
  if (mobileMenuToggle && sidebar) {
    // Toggle del menú móvil
    mobileMenuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
    
    // Cerrar sidebar al hacer click fuera en móvil
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      }
    });
    
    // Cerrar sidebar al navegar en móvil
    const navItems = sidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('active');
        }
      });
    });
  }
  
  // === LOGOUT ===
  
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Limpiar sesión
      sessionStorage.clear();
      localStorage.clear();
      
      // Redirigir al login
      window.location.href = '/login';
    });
  }
  
  // === VERIFICAR SESIÓN ===
  
  // Verificar si el usuario está logueado (opcional)
  function checkSession() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
      // Si no está logueado, redirigir al login
      // Comentado para permitir acceso libre, descomentar si se requiere autenticación
      // window.location.href = '/login';
    }
  }
  
  // Ejecutar verificación de sesión
  // checkSession();
  
  // === CARGAR NOMBRE DE USUARIO ===
  
  const userName = document.querySelector('.user-name');
  
  if (userName) {
    const userEmail = sessionStorage.getItem('userEmail');
    
    if (userEmail) {
      // Extraer nombre del email o usar nombre guardado
      const name = userEmail.split('@')[0];
      userName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
  
  // === ANIMACIONES AL SCROLL (opcional) ===
  
  // Observador de intersección para animar elementos al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observar secciones
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
  });
  
  // === ACCESIBILIDAD ===
  
  // Mejorar navegación por teclado en tarjetas
  actionCards.forEach(card => {
    card.addEventListener('focus', function() {
      this.style.outline = '2px solid var(--primary-color)';
      this.style.outlineOffset = '2px';
    });
    
    card.addEventListener('blur', function() {
      this.style.outline = 'none';
    });
  });
  
  // === DETECCIÓN DE ANCHO DE PANTALLA ===
  
  let isDesktop = window.innerWidth > 1024;
  
  window.addEventListener('resize', function() {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth > 1024;
    
    // Si cambiamos de móvil a desktop, asegurar que el sidebar esté visible
    if (!wasDesktop && isDesktop) {
      sidebar.classList.remove('active');
    }
  });
  
  // === LOGS DE DEBUGGING (opcional, comentar en producción) ===
  
  console.log('Dashboard inicializado correctamente');
  console.log('Tarjetas navegables:', actionCards.length);
  console.log('Botones de navegación:', navButtons.length);
  
  // === EVENTO PERSONALIZADO: Dashboard Ready ===
  
  // Disparar evento cuando el dashboard esté listo
  const dashboardReadyEvent = new CustomEvent('dashboardReady', {
    detail: {
      timestamp: new Date(),
      cardsCount: actionCards.length,
      buttonsCount: navButtons.length
    }
  });
  
  document.dispatchEvent(dashboardReadyEvent);
  
  // === MANEJO DE ERRORES GLOBAL ===
  
  window.addEventListener('error', function(e) {
    console.error('Error en homeUsuario.js:', e.error);
  });
  
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rechazada:', e.reason);
  });
});

// === FUNCIONES AUXILIARES ===

/**
 * Navegar a una página específica
 * @param {string} path - Ruta de destino
 */
function navigateTo(path) {
  window.location.href = path;
}

/**
 * Mostrar notificación (para futuras implementaciones)
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info)
 */
function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Aquí se puede implementar un sistema de notificaciones toast
}

/**
 * Obtener datos del usuario desde sessionStorage
 * @returns {Object} Datos del usuario
 */
function getUserData() {
  return {
    email: sessionStorage.getItem('userEmail'),
    isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true'
  };
}

/**
 * Formatear fecha para mostrar
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

// Exponer funciones globalmente si es necesario
window.TrainLifeDashboard = {
  navigateTo,
  showNotification,
  getUserData,
  formatDate
};
