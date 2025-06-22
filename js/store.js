// store.js - Gestión centralizada del estado de plantillas

function createStore(initialState = []) {
    // Estado principal de la Store
    let state = initialState;
    
    // Array de funciones observadoras que se ejecutan cuando hay cambios
    const listeners = [];
    
    // Obtener el estado actual
    function getState() {
        return state;
    }
    
    // Establecer un nuevo estado (privado)
    function setState(newState) {
        state = newState;
        // Notificar a todos los observadores sobre el cambio
        notifyListeners();
    }
    
    // Agregar una nueva plantilla (inmutable)
    function addTemplate(newTemplate) {
        // Crear nuevo array sin mutar el original
        const newState = [...state, newTemplate];
        setState(newState);
    }
    
    // Eliminar una plantilla por índice (inmutable)
    function removeTemplate(index) {
        // Crear nuevo array filtrando el elemento a eliminar
        const newState = state.filter((_, i) => i !== index);
        setState(newState);
    }
    
    // Suscribir una función para que se ejecute cuando hay cambios
    function subscribe(listener) {
        listeners.push(listener);
        
        // Retornar función para desuscribirse
        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }
    
    // Notificar a todos los observadores
    function notifyListeners() {
        listeners.forEach(listener => listener(state));
    }
    
    // API pública de la Store
    return {
        getState,
        addTemplate,
        removeTemplate,
        subscribe
    };
}

// Plantillas de ejemplo para inicializar la Store
const initialTemplates = [
    new Template(
        "Bienvenida a Nuevos Clientes",
        "¡Hola {nombre}! 👋 Bienvenido/a a nuestra familia. Estamos emocionados de tenerte con nosotros. Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por elegirnos! 🎉",
        "#bienvenida #clientes"
    ),
    new Template(
        "Seguimiento de Pedido",
        "Hola {nombre}, tu pedido #{numero_pedido} está en camino 🚚. Llegará aproximadamente el {fecha_entrega}. Puedes rastrear tu envío en: {link_rastreo}. ¡Gracias por tu compra! 📦✨",
        "#pedidos #seguimiento #ventas"
    )
];

// Crear la instancia global de la Store
const templateStore = createStore(initialTemplates);

// Hacer la Store disponible globalmente
window.templateStore = templateStore;