/* login.js
   Script de interacción para login.html
   Incluye validación de formulario, toggle de contraseña y navegación
*/

// Estado del formulario
let showPassword = false;
let hasError = false;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
  console.log('login.js cargado');
  
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
  const errorMessageEmail = document.getElementById('errorMessageEmail');
  const errorTextEmail = document.getElementById('errorTextEmail');
  const errorMessagePassword = document.getElementById('errorMessagePassword');
  const errorTextPassword = document.getElementById('errorTextPassword');


  
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
      clearEmailError();
    });
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      clearPasswordError();
    });
  }
  
  // === Manejo del submit del formulario ===
  if (form) {
    form.addEventListener('submit', function (e) {
      // Limpiar errores previos
      clearAllErrors();
      
      // Obtener valores
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';
      
      let hasValidationError = false;
      
      // Validación de email
      if (!email) {
        e.preventDefault();
        showEmailError('El correo electrónico es requerido');
        hasValidationError = true;
        if (!hasValidationError) emailInput.focus();
      } else if (!isValidEmail(email)) {
        e.preventDefault();
        showEmailError('Por favor, introduce un correo electrónico válido');
        hasValidationError = true;
        if (!password) emailInput.focus();
      }
      
      // Validación de contraseña
      if (!password) {
        e.preventDefault();
        showPasswordError('La contraseña es requerida');
        hasValidationError = true;
        if (!email || isValidEmail(email)) passwordInput.focus();
      } else if (password.length < 6) {
        e.preventDefault();
        showPasswordError('La contraseña debe tener al menos 6 caracteres');
        hasValidationError = true;
      }
      
      // Si hay errores, detener el envío
      if (hasValidationError) {
        return;
      }
      
      // Si todo está bien, el formulario se enviará a Django
      console.log('Enviando formulario al servidor...');
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
   * Muestra mensaje de error para el campo de email
   */
  function showEmailError(message) {
    if (errorMessageEmail && errorTextEmail) {
      errorTextEmail.textContent = message;
      errorMessageEmail.style.display = 'flex';
    }
    
    if (emailInput) {
      emailInput.classList.add('is-invalid');
      const emailWrapper = emailInput.closest('.input-icon-wrapper');
      if (emailWrapper) {
        emailWrapper.classList.add('is-invalid');
      }
    }
  }
  
  /**
   * Muestra mensaje de error para el campo de contraseña
   */
  function showPasswordError(message) {
    if (errorMessagePassword && errorTextPassword) {
      errorTextPassword.textContent = message;
      errorMessagePassword.style.display = 'flex';
    }
    
    if (passwordInput) {
      passwordInput.classList.add('is-invalid');
      const passwordWrapper = passwordInput.closest('.input-icon-wrapper');
      if (passwordWrapper) {
        passwordWrapper.classList.add('is-invalid');
      }
    }
  }
  
  /**
   * Limpia el mensaje de error del email
   */
  function clearEmailError() {
    if (errorMessageEmail) {
      errorMessageEmail.style.display = 'none';
    }
    
    if (errorTextEmail) {
      errorTextEmail.textContent = '';
    }
    
    if (emailInput) {
      emailInput.classList.remove('is-invalid');
      const emailWrapper = emailInput.closest('.input-icon-wrapper');
      if (emailWrapper) {
        emailWrapper.classList.remove('is-invalid');
      }
    }
  }
  
  /**
   * Limpia el mensaje de error de la contraseña
   */
  function clearPasswordError() {
    if (errorMessagePassword) {
      errorMessagePassword.style.display = 'none';
    }
    
    if (errorTextPassword) {
      errorTextPassword.textContent = '';
    }
    
    if (passwordInput) {
      passwordInput.classList.remove('is-invalid');
      const passwordWrapper = passwordInput.closest('.input-icon-wrapper');
      if (passwordWrapper) {
        passwordWrapper.classList.remove('is-invalid');
      }
    }
  }
  
  /**
   * Limpia todos los mensajes de error
   */
  function clearAllErrors() {
    clearEmailError();
    clearPasswordError();
  }
});
