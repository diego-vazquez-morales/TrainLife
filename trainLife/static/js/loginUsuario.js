/* loginUsuario.js
   Script de interacción para loginUsuario.html
   Incluye validación de formulario, toggle de contraseña y navegación
*/

// Usuarios simulados para pruebas (en producción esto vendría del backend)
const MOCK_USERS = [
  { email: 'usuario@trainlife.com', password: 'password123' },
  { email: 'test@test.com', password: 'test123' }
];

// Estado del formulario
let showPassword = false;
let hasError = false;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('loginUsuario.js cargado');
  
  // Inicializar iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Obtener elementos del DOM
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleIcon = document.getElementById('toggleIcon');
  const errorMessage = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  
  // === Toggle Password Visibility ===
  if (togglePasswordBtn && passwordInput && toggleIcon) {
    togglePasswordBtn.addEventListener('click', function () {
      showPassword = !showPassword;
      
      // Cambiar tipo de input
      passwordInput.type = showPassword ? 'text' : 'password';
      
      // Cambiar icono
      toggleIcon.setAttribute('data-lucide', showPassword ? 'eye-off' : 'eye');
      
      // Actualizar aria-label
      togglePasswordBtn.setAttribute('aria-label', showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
      
      // Recrear iconos de Lucide
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }
  
  // === Limpiar errores al escribir ===
  if (emailInput) {
    emailInput.addEventListener('input', function () {
      if (hasError) {
        clearError();
      }
    });
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      if (hasError) {
        clearError();
      }
    });
  }
  
  // === Manejo del submit del formulario ===
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Limpiar errores previos
      clearError();
      
      // Obtener valores
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';
      
      // Validaciones
      if (!email) {
        showError('El correo electrónico es requerido');
        emailInput.focus();
        return;
      }
      
      if (!isValidEmail(email)) {
        showError('Por favor, introduce un correo electrónico válido');
        emailInput.focus();
        return;
      }
      
      if (!password) {
        showError('La contraseña es requerida');
        passwordInput.focus();
        return;
      }
      
      if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        passwordInput.focus();
        return;
      }
      
      // Intentar login
      const success = attemptLogin(email, password);
      
      if (success) {
        // Login exitoso - redirigir a home
        console.log('Login exitoso');
        
        // Guardar datos de sesión (en producción usar tokens seguros)
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('isLoggedIn', 'true');
        
        // Redirigir a home
        window.location.href = '/home';
      } else {
        // Login fallido
        showError('Usuario o contraseña incorrectos');
      }
    });
  }
  
  // === Funciones auxiliares ===
  
  /**
   * Valida formato de email
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Intenta hacer login con las credenciales
   * En producción, esto haría una llamada al backend
   */
  function attemptLogin(email, password) {
    // Simulación de login - en producción hacer POST al backend
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    return !!user;
  }
  
  /**
   * Muestra mensaje de error
   */
  function showError(message) {
    hasError = true;
    
    // Mostrar mensaje de error
    if (errorMessage && errorText) {
      errorText.textContent = message;
      errorMessage.style.display = 'flex';
    }
    
    // Añadir clase de error a los inputs
    if (emailInput) {
      emailInput.classList.add('is-invalid');
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.setAttribute('aria-describedby', 'errorMessage');
      const emailWrapper = emailInput.closest('.input-icon-wrapper');
      if (emailWrapper) {
        emailWrapper.classList.add('is-invalid');
      }
    }
    
    if (passwordInput) {
      passwordInput.classList.add('is-invalid');
      passwordInput.setAttribute('aria-invalid', 'true');
      passwordInput.setAttribute('aria-describedby', 'errorMessage');
      const passwordWrapper = passwordInput.closest('.input-icon-wrapper');
      if (passwordWrapper) {
        passwordWrapper.classList.add('is-invalid');
      }
    }
  }
  
  /**
   * Limpia los mensajes de error
   */
  function clearError() {
    hasError = false;
    
    // Ocultar mensaje de error
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
    
    if (errorText) {
      errorText.textContent = '';
    }
    
    // Quitar clase de error de los inputs
    if (emailInput) {
      emailInput.classList.remove('is-invalid');
      emailInput.setAttribute('aria-invalid', 'false');
      emailInput.removeAttribute('aria-describedby');
      const emailWrapper = emailInput.closest('.input-icon-wrapper');
      if (emailWrapper) {
        emailWrapper.classList.remove('is-invalid');
      }
    }
    
    if (passwordInput) {
      passwordInput.classList.remove('is-invalid');
      passwordInput.setAttribute('aria-invalid', 'false');
      passwordInput.removeAttribute('aria-describedby');
      const passwordWrapper = passwordInput.closest('.input-icon-wrapper');
      if (passwordWrapper) {
        passwordWrapper.classList.remove('is-invalid');
      }
    }
  }
});

// Verificar si el usuario ya está logueado al cargar la página
window.addEventListener('load', function() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    // Si ya está logueado, redirigir a home
    // Comentado para permitir pruebas, descomentar en producción si se desea
    // window.location.href = '/home';
  }
});
