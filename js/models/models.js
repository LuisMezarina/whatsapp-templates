// models/Template.js - Modelo para las plantillas de WhatsApp

class Template {
    constructor(titulo, mensaje, hashtag) {
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.hashtag = hashtag;
        this.fechaCreacion = new Date();
        this.id = this.generarId();
        this.vecesUsada = 0;
    }
    
    // Generar un ID único para cada plantilla
    generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Incrementar contador de uso
    incrementarUso() {
        this.vecesUsada++;
    }
    
    // Obtener hashtags como array
    getHashtagsAsArray() {
        return this.hashtag.split(' ').filter(tag => tag.trim() !== '');
    }
    
    // Validar que la plantilla tenga datos válidos
    esValida() {
        return this.titulo.trim() !== '' && 
               this.mensaje.trim() !== '' && 
               this.hashtag.trim() !== '';
    }
    
    // Obtener resumen de la plantilla
    getResumen(maxLength = 50) {
        return this.mensaje.length > maxLength 
            ? this.mensaje.substring(0, maxLength) + '...'
            : this.mensaje;
    }
}