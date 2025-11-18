/* crearUsuario.js
   Script para crearUsuario.html - Funcionalidad de validación, toggle de contraseñas y modal de confirmación
*/

document.addEventListener('DOMContentLoaded', function () {
  console.log('crearUsuario.js cargado');
  
  // Variables para el modal
  const modal = document.getElementById('confirmModal');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const btnCancelar = document.getElementById('btnCancelar');
  let formToSubmit = null;
  
  // Toggle para mostrar/ocultar contraseñas
  const toggleButtons = document.querySelectorAll('.toggle-password-button');
  
  toggleButtons.forEach((button) => {
    button.addEventListener('click', function() {
      const passwordInput = this.previousElementSibling;
      const icon = this.querySelector('.icon-visibility');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = 'visibility_off';
      } else {
        passwordInput.type = 'password';
        icon.textContent = 'visibility';
      }
    });
  });
  
  // Validación del formulario
  const form = document.querySelector('.form-layout');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Siempre prevenir el envío por defecto
      e.preventDefault();
      
      const nombre = form.querySelector('[name="nombre"]');
      const apellido1 = form.querySelector('[name="apellido1"]');
      const email = form.querySelector('[name="email"]');
      const contrasenia = form.querySelector('[name="contrasenia"]');
      const confirmarContrasenia = form.querySelector('[name="confirmar_contrasenia"]');
      const terminos = form.querySelector('[name="terminos"]');
      
      let errores = [];
      
      // Validar campos requeridos
      if (!nombre || nombre.value.trim() === '') {
        errores.push('El nombre es obligatorio');
      }
      
      if (!apellido1 || apellido1.value.trim() === '') {
        errores.push('El primer apellido es obligatorio');
      }
      
      if (!email || email.value.trim() === '') {
        errores.push('El correo electrónico es obligatorio');
      }
      
      if (!contrasenia || contrasenia.value.trim() === '') {
        errores.push('La contraseña es obligatoria');
      }
      
      // Validar longitud de contraseña
      if (contrasenia && contrasenia.value.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres');
      }
      
      // Validar que las contraseñas coincidan
      if (contrasenia && confirmarContrasenia && contrasenia.value !== confirmarContrasenia.value) {
        errores.push('Las contraseñas no coinciden');
      }
      
      // Validar términos aceptados
      if (!terminos || !terminos.checked) {
        errores.push('Debes aceptar los términos y condiciones');
      }
      
      // Si hay errores, mostrar alerta y no continuar
      if (errores.length > 0) {
        alert(errores.join('\n'));
        return false;
      }
      
      // Si no hay errores, mostrar modal de confirmación
      formToSubmit = form;
      modal.style.display = 'flex';
    });
  }
  
  // Botón Confirmar en el modal
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', function() {
      if (formToSubmit) {
        modal.style.display = 'none';
        // Enviar el formulario
        formToSubmit.submit();
      }
    });
  }
  
  // Botón Cancelar en el modal
  if (btnCancelar) {
    btnCancelar.addEventListener('click', function() {
      modal.style.display = 'none';
      // Redirigir al login sin crear la cuenta
      window.location.href = btnCancelar.closest('body').querySelector('.footer-link').href;
    });
  }
  
  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        // Redirigir al login
        window.location.href = modal.closest('body').querySelector('.footer-link').href;
      }
    });
  }
});
