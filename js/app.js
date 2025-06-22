// app.js - Lógica principal conectada al Store

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos
    setupEventListeners();
    
    // Suscribirse a cambios en la Store para actualizar la UI automáticamente
    window.templateStore.subscribe(function(plantillas) {
        renderizarUI(plantillas);
        actualizarEstadisticas(plantillas);
    });
    
    // Renderizar estado inicial
    const plantillasIniciales = window.templateStore.getState();
    renderizarUI(plantillasIniciales);
    actualizarEstadisticas(plantillasIniciales);
});

// Configurar todos los event listeners
function setupEventListeners() {
    // Botón guardar plantilla
    const btnSave = document.querySelector("#save-template-btn");
    btnSave.addEventListener("click", guardarPlantilla);
    
    // Botón limpiar formulario
    const btnClear = document.querySelector("#clear-form-btn");
    btnClear.addEventListener("click", limpiarFormulario);
    
    // Vista previa en tiempo real
    const inputMessage = document.querySelector("#template-message");
    inputMessage.addEventListener("input", actualizarVistaPrevia);
    
    // Contador de caracteres
    inputMessage.addEventListener("input", actualizarContadorCaracteres);
}

// Función para guardar una nueva plantilla
function guardarPlantilla() {
    // Capturar valores del formulario
    const inputTitle = document.querySelector("#template-title").value.trim();
    const inputHashtag = document.querySelector("#template-hashtag").value.trim();
    const inputMessage = document.querySelector("#template-message").value.trim();
    
    // Validar que todos los campos estén completos
    if (!inputTitle || !inputHashtag || !inputMessage) {
        alert("Por favor, completa todos los campos antes de guardar.");
        return;
    }
    
    // Crear nueva instancia de Template
    const newTemplate = new Template(inputTitle, inputMessage, inputHashtag);
    
    // Agregar a la Store (esto automáticamente actualizará la UI)
    window.templateStore.addTemplate(newTemplate);
    
    // Limpiar formulario después de guardar
    limpiarFormulario();
    
    // Feedback visual
    mostrarNotificacion("✅ Plantilla guardada exitosamente");
}

// Función para eliminar una plantilla
function eliminarPlantilla(index) {
    if (confirm("¿Estás seguro de que deseas eliminar esta plantilla?")) {
        // Eliminar de la Store (esto automáticamente actualizará la UI)
        window.templateStore.removeTemplate(index);
        
        // Feedback visual
        mostrarNotificacion("🗑️ Plantilla eliminada");
    }
}

// Función para renderizar la UI basada en el estado de la Store
function renderizarUI(plantillas) {
    const containerTemplate = document.querySelector("#templates-container");
    const emptyState = document.querySelector("#empty-templates-state");
    
    // Limpiar contenedor
    containerTemplate.innerHTML = "";
    
    // Mostrar estado vacío si no hay plantillas
    if (plantillas.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }
    
    // Ocultar estado vacío si hay plantillas
    emptyState.classList.add("hidden");
    
    // Renderizar cada plantilla
    plantillas.forEach((plantilla, index) => {
        containerTemplate.innerHTML += crearHTMLPlantilla(plantilla, index);
    });
}

// Función para crear el HTML de una plantilla
function crearHTMLPlantilla(plantilla, index) {
    return `
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-purple-300 transition duration-300 hover:shadow-md">
            <div class="flex flex-col lg:flex-row lg:items-start gap-4">
                <div class="flex-1">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-1">${plantilla.titulo}</h3>
                            <div class="flex gap-2 mb-2">
                                <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">${plantilla.hashtag}</span>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-calendar mr-1"></i>
                            Plantilla #${index + 1}
                        </div>
                    </div>
                    
                    <div class="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <p class="text-gray-700 text-sm leading-relaxed">
                            ${plantilla.mensaje}
                        </p>
                    </div>
                </div>
                
                <div class="flex flex-row lg:flex-col gap-2 lg:ml-4">
                    <button onclick="copiarPlantilla(${index})" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center gap-2 text-sm">
                        <i class="fas fa-copy"></i>
                        <span class="hidden sm:inline">Copiar</span>
                    </button>
                    <button onclick="editarPlantilla(${index})" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center gap-2 text-sm">
                        <i class="fas fa-edit"></i>
                        <span class="hidden sm:inline">Editar</span>
                    </button>
                    <button onclick="eliminarPlantilla(${index})" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center gap-2 text-sm">
                        <i class="fas fa-trash"></i>
                        <span class="hidden sm:inline">Eliminar</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.querySelector("#template-title").value = "";
    document.querySelector("#template-hashtag").value = "";
    document.querySelector("#template-message").value = "";
    document.querySelector("#preview-content").innerHTML = "La vista previa aparecerá aquí mientras escribes...";
    document.querySelector("#char-count").textContent = "0/1000 caracteres";
}

// Función para actualizar la vista previa
function actualizarVistaPrevia() {
    const mensaje = document.querySelector("#template-message").value;
    const previewContent = document.querySelector("#preview-content");
    
    if (mensaje.trim()) {
        previewContent.innerHTML = mensaje.replace(/\n/g, '<br>');
        previewContent.classList.remove("text-gray-400", "italic");
        previewContent.classList.add("text-gray-800");
    } else {
        previewContent.innerHTML = "La vista previa aparecerá aquí mientras escribes...";
        previewContent.classList.add("text-gray-400", "italic");
        previewContent.classList.remove("text-gray-800");
    }
}

// Función para actualizar contador de caracteres
function actualizarContadorCaracteres() {
    const mensaje = document.querySelector("#template-message").value;
    const charCount = document.querySelector("#char-count");
    const count = mensaje.length;
    
    charCount.textContent = `${count}/1000 caracteres`;
    
    if (count > 1000) {
        charCount.classList.add("text-red-500");
    } else {
        charCount.classList.remove("text-red-500");
    }
}

// Función para actualizar estadísticas
function actualizarEstadisticas(plantillas) {
    const totalTemplates = document.querySelector("#total-templates");
    const totalCategories = document.querySelector("#total-categories");
    
    totalTemplates.textContent = plantillas.length;
    
    // Contar categorías únicas
    const hashtags = plantillas.map(p => p.hashtag);
    const uniqueHashtags = [...new Set(hashtags.flatMap(h => h.split(' ')))];
    totalCategories.textContent = uniqueHashtags.length;
}

// Función para copiar plantilla al portapapeles
function copiarPlantilla(index) {
    const plantillas = window.templateStore.getState();
    const plantilla = plantillas[index];
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(plantilla.mensaje).then(() => {
            mostrarNotificacion("📋 Plantilla copiada al portapapeles");
        });
    } else {
        // Fallback para navegadores más antiguos
        const textarea = document.createElement('textarea');
        textarea.value = plantilla.mensaje;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        mostrarNotificacion("📋 Plantilla copiada al portapapeles");
    }
}

// Función placeholder para editar
function editarPlantilla(index) {
    mostrarNotificacion("🚧 Función de edición en desarrollo");
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = mensaje;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}