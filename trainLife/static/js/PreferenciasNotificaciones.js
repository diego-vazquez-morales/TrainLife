/* PreferenciasNotificaciones.js
   Script para PreferenciasNotificaciones.html
*/

document.addEventListener('DOMContentLoaded', function() {
  console.log('PreferenciasNotificaciones.js cargado');
  var toggles = document.querySelectorAll('.pref-toggle');
  toggles.forEach(function(t){
    t.addEventListener('change', function(){
      // aquí podrías enviar cambios al servidor via fetch
      console.log('Cambio de preferencia:', t.name, t.checked);
    });
  });
});
