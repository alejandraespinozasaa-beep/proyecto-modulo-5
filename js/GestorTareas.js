// ==========================================
// GESTOR DE TAREAS
// Administra la colección de tareas
// ==========================================

import { Tarea } from "./models/Tarea.js";

export class GestorTareas {

    constructor() {
        this.tareas = [];
    }

    // Crea una nueva tarea y la agrega a la colección
    agregarTarea({
        descripcion,
        prioridad = "media",
        estado = "pendiente",
        fechaLimite = null
    }) {
        const nuevaTarea = new Tarea(
            crypto.randomUUID(),
            descripcion,
            prioridad,
            estado,
            fechaLimite
        );

        this.tareas = [...this.tareas, nuevaTarea];

        return nuevaTarea;
    }

    // Busca una tarea específica por su id
    obtenerTareaPorId(id) {
        return this.tareas.find((tarea) => tarea.id === id);
    }

    // Edita una tarea existente
    editarTarea(id, datosActualizados) {
        const tarea = this.obtenerTareaPorId(id);

        if (!tarea) {
            return null;
        }

        tarea.editar(datosActualizados);

        return tarea;
    }

    // Elimina una tarea de la colección
    eliminarTarea(id) {
        this.tareas = this.tareas.filter((tarea) => tarea.id !== id);
    }

    // Cambia el estado de una tarea
    cambiarEstadoTarea(id, nuevoEstado) {
        const tarea = this.obtenerTareaPorId(id);

        if (!tarea) {
            return null;
        }

        tarea.cambiarEstado(nuevoEstado);

        return tarea;
    }

    // Busca tareas según el texto ingresado por el usuario
    buscarTareas(texto) {
        const termino = texto.trim().toLowerCase();

        return this.tareas.filter((tarea) =>
            tarea.descripcion.toLowerCase().includes(termino)
        );
    }

    // Filtra tareas por estado
    filtrarPorEstado(estado) {
        if (estado === "todas") {
            return [...this.tareas];
        }

        return this.tareas.filter((tarea) => tarea.estado === estado);
    }

    // Devuelve la cantidad total de tareas
    obtenerTotalTareas() {
        return this.tareas.length;
    }

    // Devuelve cuántas tareas están pendientes
    obtenerTotalPendientes() {
        return this.tareas.filter(
            (tarea) => tarea.estado === "pendiente"
        ).length;
    }

    // Devuelve cuántas tareas están en progreso
    obtenerTotalEnProgreso() {
        return this.tareas.filter(
            (tarea) => tarea.estado === "en-progreso"
        ).length;
    }

    // Devuelve cuántas tareas están completadas
    obtenerTotalCompletadas() {
        return this.tareas.filter(
            (tarea) => tarea.estado === "completada"
        ).length;
    }

    // Calcula el porcentaje de tareas completadas
    obtenerPorcentajeProgreso() {
        const total = this.obtenerTotalTareas();

        if (total === 0) {
            return 0;
        }

        const completadas = this.obtenerTotalCompletadas();

        return Math.round((completadas / total) * 100);
    }
}