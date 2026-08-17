// ==========================================
// SERVICIO API
// Maneja la comunicación con la API externa
// ==========================================

const API_URL =
    "https://jsonplaceholder.typicode.com/todos";


// ==========================================
// GET
// Recupera tareas desde la API
// ==========================================

export const obtenerTareasAPI = async () => {

    try {

        const respuesta = await fetch(
            `${API_URL}?_limit=3`
        );

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );
        }

        const datos =
            await respuesta.json();

        return datos;

    } catch (error) {

        console.error(
            "Error al recuperar tareas desde la API:",
            error
        );

        throw error;
    }
};


// ==========================================
// POST
// Envía una tarea a la API
// ==========================================

export const guardarTareaAPI = async (tarea) => {

    try {

        const respuesta = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(tarea)
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );
        }

        const datos =
            await respuesta.json();

        return datos;

    } catch (error) {

        console.error(
            "Error al guardar la tarea en la API:",
            error
        );

        throw error;
    }
};