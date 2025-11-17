/* inicioUsuario.js
   Script para inicioUsuario.html - Navegación y accesibilidad
*/

document.addEventListener('DOMContentLoaded', function() {
  console.log('inicioUsuario.js cargado');
  
  // ===== CONFIGURACIÓN DE NAVEGACIÓN =====
  
  // Botón de Iniciar Sesión
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      window.location.href = '/loginUsuario';
    });
    
    // Navegación por Enter
    loginBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = '/loginUsuario';
      }
    });
  }
  
  // ===== NAVEGACIÓN DE TARJETAS =====
  
  // Seleccionar todas las tarjetas con atributo data-navigate
  const cards = document.querySelectorAll('.card[data-navigate]');
  
  cards.forEach(card => {
    const destination = card.getAttribute('data-navigate');
    
    // Click del mouse
    card.addEventListener('click', function() {
      navigateToPage(destination);
    });
    
    // Navegación por teclado (Enter y Espacio)
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateToPage(destination);
      }
    });
    
    // Efecto visual de hover accesible
    card.addEventListener('mouseenter', function() {
      card.style.cursor = 'pointer';
    });
  });
  
  // ===== FUNCIÓN DE NAVEGACIÓN =====
  
  function navigateToPage(page) {
    // Mapeo de páginas
    const pageMap = {
      'verRutas': '/verRutas',
      'avisos': '/avisos',
      'misViajes': '/misViajes',
      'inicioUsuario': '/inicioUsuario'
    };
    
    const url = pageMap[page];
    if (url) {
      window.location.href = url;
    } else {
      console.warn(`Página no encontrada: ${page}`);
    }
  }
  
  // ===== ACCESIBILIDAD: SKIP LINKS (opcional) =====
  
  // Añadir un skip link invisible que aparece al hacer focus (buena práctica WCAG)
  const skipLink = document.createElement('a');
  skipLink.href = '#main-heading';
  skipLink.textContent = 'Saltar al contenido principal';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #0056b3;
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
    border-radius: 0 0 4px 0;
  `;
  
  // Mostrar el skip link al hacer focus
  skipLink.addEventListener('focus', function() {
    this.style.top = '0';
  });
  
  skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // ===== NAVEGACIÓN MEJORADA DEL SIDEBAR =====
  
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    // Añadir indicador visual al hacer hover (ya está en CSS, pero reforzamos con JS)
    item.addEventListener('focus', function() {
      this.style.outline = '3px solid #0056b3';
      this.style.outlineOffset = '2px';
    });
    
    item.addEventListener('blur', function() {
      this.style.outline = '';
      this.style.outlineOffset = '';
    });
  });
  
  // ===== ANUNCIOS PARA LECTORES DE PANTALLA =====
  
  // Crear región ARIA live para anuncios dinámicos
  const ariaLiveRegion = document.createElement('div');
  ariaLiveRegion.setAttribute('role', 'status');
  ariaLiveRegion.setAttribute('aria-live', 'polite');
  ariaLiveRegion.setAttribute('aria-atomic', 'true');
  ariaLiveRegion.className = 'sr-only';
  ariaLiveRegion.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(ariaLiveRegion);
  
  // Función para anunciar mensajes
  window.announceToScreenReader = function(message) {
    ariaLiveRegion.textContent = message;
    setTimeout(() => {
      ariaLiveRegion.textContent = '';
    }, 1000);
  };
  
  // ===== MEJORAR ACCESIBILIDAD DE IMÁGENES =====
  
  // Verificar que todas las imágenes tengan alt text
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt || img.alt.trim() === '') {
      console.warn('Imagen sin texto alternativo:', img.src);
    }
  });
  
  // ===== MANEJO DE ERRORES DE NAVEGACIÓN =====
  
  window.addEventListener('error', function(e) {
    console.error('Error en la página:', e.message);
  });
  
  // ===== LOG DE ACCESIBILIDAD (DESARROLLO) =====
  
  console.log('✅ Accesibilidad inicializada:');
  console.log('  - Navegación por teclado habilitada');
  console.log('  - Skip links añadidos');
  console.log('  - ARIA live regions configuradas');
  console.log('  - Contraste de colores WCAG AAA aplicado');
});
