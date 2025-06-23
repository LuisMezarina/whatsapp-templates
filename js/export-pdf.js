// HU2: Funcionalidad para Exportar Plantillas a PDF
// Archivo: export-pdf.js
// Requiere: jsPDF library (https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)

/**
 * Función para obtener plantillas del localStorage (compatible con el HTML actual)
 */
function obtenerPlantillas() {
    try {
        // Intentar obtener desde window.templateStore si existe
        if (window.templateStore && typeof window.templateStore.getState === 'function') {
            return window.templateStore.getState();
        }
        
        // Fallback: obtener desde localStorage directamente
        const plantillas = localStorage.getItem('plantillas');
        return plantillas ? JSON.parse(plantillas) : [];
    } catch (error) {
        console.error('Error al obtener plantillas:', error);
        return [];
    }
}

/**
 * Función principal para exportar plantillas a PDF
 */
async function exportarPlantillasAPDF() {
    try {
        // Verificar que jsPDF esté disponible
        await verificarYCargarJsPDF();
        
        // Obtener las plantillas
        const plantillas = obtenerPlantillas();
        
        if (plantillas.length === 0) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Sin Plantillas',
                    text: 'No hay plantillas para exportar. Crea al menos una plantilla primero.',
                    icon: 'info',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3b82f6'
                });
            } else {
                alert('No hay plantillas para exportar. Crea al menos una plantilla primero.');
            }
            return;
        }
        
        // Mostrar loading si SweetAlert está disponible
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Generando PDF...',
                text: 'Por favor espera mientras se genera tu documento.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });
        }
        
        // Generar el PDF
        await generarDocumentoPDF(plantillas);
        
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Error de Exportación',
                text: 'No se pudo generar el archivo PDF. Verifica que tengas plantillas guardadas.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#ef4444'
            });
        } else {
            alert('Error al generar el PDF. Verifica que tengas plantillas guardadas.');
        }
    }
}

/**
 * Función para verificar y cargar jsPDF si es necesario
 */
async function verificarYCargarJsPDF() {
    // Verificar si jsPDF ya está disponible
    if (window.jspdf && window.jspdf.jsPDF) {
        return Promise.resolve();
    }
    
    // Si no está disponible, intentar cargarlo
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            if (window.jspdf && window.jspdf.jsPDF) {
                resolve();
            } else {
                reject(new Error('jsPDF no se cargó correctamente'));
            }
        };
        script.onerror = () => reject(new Error('Error al cargar jsPDF'));
        
        // Solo agregar el script si no existe ya
        const existingScript = document.querySelector('script[src*="jspdf"]');
        if (!existingScript) {
            document.head.appendChild(script);
        } else {
            // Si el script ya existe, esperar un poco y verificar
            setTimeout(() => {
                if (window.jspdf && window.jspdf.jsPDF) {
                    resolve();
                } else {
                    reject(new Error('jsPDF no está disponible'));
                }
            }, 1000);
        }
    });
}

/**
 * Función para generar el documento PDF
 * @param {Array} plantillas - Array de plantillas a exportar
 */
function generarDocumentoPDF(plantillas) {
    return new Promise((resolve, reject) => {
        try {
            // Crear nueva instancia de jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configuración de márgenes y posiciones
            const margenIzquierdo = 20;
            const margenDerecho = 20;
            const anchoUtil = doc.internal.pageSize.width - margenIzquierdo - margenDerecho;
            let posicionY = 30;
            
            // Configurar fuentes
            doc.setFont("helvetica");
            
            // Agregar encabezado del documento
            agregarEncabezadoPDF(doc, margenIzquierdo, posicionY);
            posicionY += 30;
            
            // Agregar cada plantilla
            plantillas.forEach((plantilla, index) => {
                // Verificar si necesitamos una nueva página
                if (posicionY > 250) {
                    doc.addPage();
                    posicionY = 30;
                }
                
                posicionY = agregarPlantillaPDF(doc, plantilla, index + 1, margenIzquierdo, anchoUtil, posicionY);
                posicionY += 15; // Espacio entre plantillas
            });
            
            // Agregar estadísticas al final
            if (posicionY > 220) {
                doc.addPage();
                posicionY = 30;
            }
            
            agregarEstadisticasPDF(doc, plantillas, margenIzquierdo, posicionY);
            
            // Generar nombre de archivo con fecha
            const fecha = new Date();
            const fechaFormateada = fecha.toISOString().split('T')[0];
            const nombreArchivo = `Plantillas_WhatsApp_${fechaFormateada}.pdf`;
            
            // Guardar el PDF
            doc.save(nombreArchivo);
            
            // Mostrar mensaje de éxito
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '¡PDF Generado!',
                    text: `El archivo "${nombreArchivo}" ha sido descargado exitosamente.`,
                    icon: 'success',
                    confirmButtonText: 'Perfecto',
                    confirmButtonColor: '#10b981',
                    timer: 5000,
                    timerProgressBar: true
                });
            } else {
                alert(`PDF generado exitosamente: ${nombreArchivo}`);
            }
            
            resolve();
            
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Función para agregar el encabezado al PDF
 * @param {jsPDF} doc - Instancia del documento PDF
 * @param {number} margenIzquierdo - Margen izquierdo
 * @param {number} posicionY - Posición Y inicial
 */
function agregarEncabezadoPDF(doc, margenIzquierdo, posicionY) {
    // Título principal
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94); // Verde WhatsApp
    doc.text("Mis Plantillas WhatsApp", margenIzquierdo, posicionY);
    
    // Fecha de generación
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128); // Gris
    const fechaActual = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.text(`Generado el: ${fechaActual}`, margenIzquierdo, posicionY + 10);
    
    // Línea separadora
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margenIzquierdo, posicionY + 15, doc.internal.pageSize.width - margenIzquierdo, posicionY + 15);
}

/**
 * Función para agregar una plantilla individual al PDF
 * @param {jsPDF} doc - Instancia del documento PDF
 * @param {Object} plantilla - Objeto plantilla
 * @param {number} numero - Número de la plantilla
 * @param {number} margenIzquierdo - Margen izquierdo
 * @param {number} anchoUtil - Ancho útil de la página
 * @param {number} posicionY - Posición Y actual
 * @returns {number} Nueva posición Y
 */
function agregarPlantillaPDF(doc, plantilla, numero, margenIzquierdo, anchoUtil, posicionY) {
    // Obtener propiedades de la plantilla (compatible con diferentes estructuras)
    const titulo = plantilla.titulo || plantilla.nombre || `Plantilla ${numero}`;
    const hashtag = plantilla.hashtag || plantilla.hashtags || '';
    const mensaje = plantilla.mensaje || plantilla.contenido || '';
    
    // Título de la plantilla
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55); // Gris oscuro
    doc.text(`${numero}. ${titulo}`, margenIzquierdo, posicionY);
    posicionY += 10;
    
    // Hashtags
    if (hashtag && hashtag.trim() !== '') {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(16, 185, 129); // Verde
        doc.text(`${hashtag}`, margenIzquierdo, posicionY);
        posicionY += 8;
    }
    
    // Mensaje (con salto de línea automático)
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81); // Gris medio
    
    // Dividir el mensaje en líneas que quepan en el ancho disponible
    const lineasMensaje = doc.splitTextToSize(mensaje, anchoUtil - 10);
    doc.text(lineasMensaje, margenIzquierdo + 5, posicionY);
    
    // Calcular nueva posición Y basada en el número de líneas
    posicionY += (lineasMensaje.length * 5) + 5;
    
    // Línea separadora sutil
    doc.setDrawColor(243, 244, 246);
    doc.setLineWidth(0.3);
    doc.line(margenIzquierdo, posicionY, doc.internal.pageSize.width - margenIzquierdo, posicionY);
    
    return posicionY + 5;
}

/**
 * Función para agregar estadísticas al PDF
 * @param {jsPDF} doc - Instancia del documento PDF
 * @param {Array} plantillas - Array de plantillas
 * @param {number} margenIzquierdo - Margen izquierdo
 * @param {number} posicionY - Posición Y actual
 */
function agregarEstadisticasPDF(doc, plantillas, margenIzquierdo, posicionY) {
    // Título de estadísticas
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text("Estadísticas", margenIzquierdo, posicionY);
    posicionY += 15;
    
    // Calcular estadísticas
    const totalPlantillas = plantillas.length;
    const hashtags = new Set();
    let caracteresTotales = 0;
    
    plantillas.forEach(plantilla => {
        const hashtagsPlantilla = plantilla.hashtag || plantilla.hashtags || '';
        if (hashtagsPlantilla) {
            hashtagsPlantilla.split(' ').forEach(tag => {
                if (tag.trim() !== '') hashtags.add(tag.trim());
            });
        }
        const mensaje = plantilla.mensaje || plantilla.contenido || '';
        caracteresTotales += mensaje.length;
    });
    
    const caracteresPromedio = totalPlantillas > 0 ? Math.round(caracteresTotales / totalPlantillas) : 0;
    
    // Mostrar estadísticas
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    
    const estadisticas = [
        `• Total de plantillas: ${totalPlantillas}`,
        `• Categorías únicas: ${hashtags.size}`,
        `• Caracteres promedio por plantilla: ${caracteresPromedio}`,
        `• Total de caracteres: ${caracteresTotales.toLocaleString()}`
    ];
    
    estadisticas.forEach((stat, index) => {
        doc.text(stat, margenIzquierdo, posicionY + (index * 7));
    });
}

/**
 * Función para agregar el botón de exportar PDF a la interfaz
 */
function agregarBotonExportarPDF() {
    // Verificar si el botón ya existe
    if (document.getElementById('export-pdf-btn')) {
        return;
    }
    
    // Buscar la sección de estadísticas para añadir el botón
    const seccionEstadisticas = document.querySelector('.mt-8.bg-white.rounded-xl.shadow-xl.p-6');
    
    if (seccionEstadisticas) {
        // Crear el botón de exportar
        const botonExportar = document.createElement('div');
        botonExportar.className = 'mt-6 text-center';
        botonExportar.innerHTML = `
            <button 
                id="export-pdf-btn" 
                class="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition duration-300 flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
            >
                <i class="fas fa-file-pdf text-xl"></i>
                <span>Exportar Plantillas a PDF</span>
            </button>
        `;
        
        seccionEstadisticas.appendChild(botonExportar);
        
        // Agregar event listener
        document.getElementById('export-pdf-btn').addEventListener('click', exportarPlantillasAPDF);
    }
}

/**
 * Función de inicialización para la funcionalidad de exportar PDF
 */
async function inicializarExportarPDF() {
    try {
        // Agregar botón a la interfaz
        agregarBotonExportarPDF();
        
        console.log('Funcionalidad de exportar PDF inicializada');
        
    } catch (error) {
        console.error('Error al inicializar exportar PDF:', error);
    }
}

// Manejar tanto DOMContentLoaded como carga diferida
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(inicializarExportarPDF, 500);
    });
} else {
    // El DOM ya está cargado
    setTimeout(inicializarExportarPDF, 500);
}

// También hacer la función disponible globalmente para compatibilidad
window.exportarPlantillasAPDF = exportarPlantillasAPDF;

// Exportar funciones si se usa en un entorno de módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exportarPlantillasAPDF,
        inicializarExportarPDF,
        agregarBotonExportarPDF
    };
}