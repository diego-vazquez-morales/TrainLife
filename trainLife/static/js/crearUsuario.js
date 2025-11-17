/* crearUsuario.js
   Script para crearUsuario.html
*/

document.addEventListener('DOMContentLoaded', function () {
  console.log('crearUsuario.js cargado');
  var form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var username = form.querySelector('[name="new_username"]');
      if (username && username.value.trim() === '') {
        e.preventDefault();
        alert('Nombre de usuario requerido');
        username.focus();
      }
    });
  }
});
