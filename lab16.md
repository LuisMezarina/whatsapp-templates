# Explicacion Lab 16

## Agrega una breve explicación sobre cómo implementaste la sincronización y persistencia

La sincronización en esta aplicación funciona mediante un patrón de observador que mantiene todos los componentes actualizados automáticamente. Cuando el usuario realiza cualquier acción como crear, editar o eliminar una plantilla, el sistema inmediatamente notifica a todas las partes de la aplicación que necesitan actualizarse.

El corazón de la sincronización está en el store, que funciona como un centro de control de datos. Este store mantiene una lista de funciones observadoras que están constantemente vigilando los cambios. Cada vez que el estado de los datos cambia, se ejecuta automáticamente la función setState que se encarga de notificar a todos los observadores registrados. Esto significa que la interfaz de usuario y el sistema de persistencia se mantienen siempre sincronizados con los datos más recientes.

Para la persistencia, implementé un sistema que se integra perfectamente con la sincronización. La función savePersistenceData se suscribe a los cambios del store, lo que significa que cada vez que hay una modificación en los datos, automáticamente se guardan en el localStorage del navegador. Esta persistencia no es solo guardado temporal, sino que mantiene los datos disponibles incluso después de cerrar y reabrir la aplicación.

La inicialización de la aplicación también forma parte del sistema de persistencia. Cuando se carga la página, el store se inicializa automáticamente con los datos recuperados del localStorage mediante getPersistenceData. Esto garantiza que los usuarios siempre encuentren sus plantillas tal como las dejaron en su última sesión.

El resultado es un sistema completamente reactivo donde cualquier cambio se propaga inmediatamente a través de toda la aplicación. Los usuarios ven sus cambios reflejados instantáneamente en la interfaz, mientras que el sistema garantiza que nada se pierda gracias a la persistencia automática que ocurre en segundo plano sin requerir intervención manual.