// ==========================================
// SERVICIO DE ALMACENAMIENTO
// Guarda y recupera tareas desde localStorage
// ==========================================

const STORAGE_KEY = "tareas";


// Guarda la lista de tareas
export const guardarTareas = (tareas) => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tareas)
    );
};


// Recupera las tareas guardadas
export const obtenerTareas = () => {
    const tareasGuardadas = localStorage.getItem(STORAGE_KEY);

    if (!tareasGuardadas) {
        return [];
    }

    try {
        return JSON.parse(tareasGuardadas);
    } catch (error) {
        console.error("Error al recuperar las tareas:", error);

        return [];
    }
};


// Elimina todas las tareas almacenadas
export const limpiarTareas = () => {
    localStorage.removeItem(STORAGE_KEY);
};