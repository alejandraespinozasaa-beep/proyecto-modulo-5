// ==========================================
// CLASE TAREA
// Representa una tarea dentro de la aplicación
// ==========================================

export class Tarea {

    constructor(
        id,
        descripcion,
        prioridad = "media",
        estado = "pendiente",
        fechaLimite = null,
        fechaCreacion = new Date()
    ) {
        this.id = id;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.estado = estado;
        this.fechaLimite = fechaLimite;
        this.fechaCreacion = fechaCreacion;
    }


    // Cambia el estado actual de la tarea
    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }


    // Actualiza solamente los datos editables.
    // El estado NO se modifica desde el formulario:
    // cambia mediante los botones Iniciar / Completar.
    editar({
        descripcion,
        prioridad,
        fechaLimite
    }) {
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.fechaLimite = fechaLimite;
    }


    // Indica si la tarea está completada
    estaCompletada() {
        return this.estado === "completada";
    }
}