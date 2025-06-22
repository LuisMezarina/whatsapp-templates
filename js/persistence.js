// persistence.js - Manejo de persistencia con LocalStorage

// Guardar plantillas en localStorage
function guardarPlantillas(plantillas) {
    try {
        localStorage.setItem("templates", JSON.stringify(plantillas));
    } catch (error) {
        console.error("Error al guardar plantillas:", error);
    }
}

// Cargar plantillas desde localStorage
function cargarPlantillas() {
    try {
        const templates = localStorage.getItem("templates");
        // Usar operador ternario para simplificar la validación
        return templates ? JSON.parse(templates) : [];
    } catch (error) {
        console.error("Error al cargar plantillas:", error);
        return [];
    }
}

// Resetear todas las plantillas (eliminar del localStorage)
function resetearPlantillas() {
    try {
        localStorage.removeItem("templates");
    } catch (error) {
        console.error("Error al resetear plantillas:", error);
    }
}