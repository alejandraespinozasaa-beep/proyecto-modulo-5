// ==========================================
// MYFLOW - INTERFAZ DE USUARIO
// ==========================================


// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

const listaTareas =
    document.querySelector("#listaTareas");


const totalTareas =
    document.querySelector("#totalTareas");

const totalPendientes =
    document.querySelector("#totalPendientes");

const totalProgreso =
    document.querySelector("#totalProgreso");

const totalCompletadas =
    document.querySelector("#totalCompletadas");


const resumenTotal =
    document.querySelector("#resumenTotal");

const resumenPendientes =
    document.querySelector("#resumenPendientes");

const resumenEnProgreso =
    document.querySelector("#resumenEnProgreso");

const resumenCompletadas =
    document.querySelector("#resumenCompletadas");


const porcentajeProgreso =
    document.querySelector("#porcentajeProgreso");

const textoProgreso =
    document.querySelector("#textoProgreso");

const barraProgreso =
    document.querySelector("#barraProgreso");

const donutProgreso =
    document.querySelector("#donutProgreso");


// ==========================================
// TEXTO DE ESTADOS
// ==========================================

const obtenerTextoEstado = (estado) => {

    const estados = {
        pendiente: "Por iniciar",
        "en-progreso": "En curso",
        completada: "Completada"
    };

    return estados[estado] ?? estado;
};


// ==========================================
// FORMATEAR FECHA
// ==========================================

const formatearFecha = (fecha) => {

    if (!fecha) {
        return "Sin fecha límite";
    }


    const fechaFormateada =
        new Date(fecha);


    return fechaFormateada.toLocaleString(
        "es-CL",
        {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
};


// ==========================================
// BOTÓN PRINCIPAL SEGÚN ESTADO
// ==========================================

const crearBotonEstado = (tarea) => {

    // --------------------------------------
    // POR INICIAR
    // --------------------------------------

    if (tarea.estado === "pendiente") {

        return `
            <button
                type="button"
                class="task-action task-action--advance"
                data-action="iniciar"
                data-id="${tarea.id}"
            >
                ▶ Iniciar tarea
            </button>
        `;
    }


    // --------------------------------------
    // EN CURSO
    // --------------------------------------

    if (tarea.estado === "en-progreso") {

        return `
            <button
                type="button"
                class="task-action task-action--advance"
                data-action="completar"
                data-id="${tarea.id}"
            >
                ✓ Completar tarea
            </button>
        `;
    }


    // --------------------------------------
    // COMPLETADA
    // --------------------------------------

    return `
        <span class="task-finished">
            ✓ Finalizada
        </span>
    `;
};


// ==========================================
// CREAR TARJETA
// ==========================================

const crearTarjetaTarea = (tarea) => {

    const {
        id,
        descripcion,
        prioridad,
        estado,
        fechaLimite
    } = tarea;


    const completada =
        estado === "completada";


    return `
        <article
            class="
                task-card
                ${completada ? "task-card--completed" : ""}
            "
            data-id="${id}"
        >

            <div class="task-card__top">

                <span
                    class="
                        task-card__priority
                        task-card__priority--${prioridad}
                    "
                >
                    ${prioridad}
                </span>


                <div class="task-card__content">

                    <h3 class="task-card__title">
                        ${descripcion}
                    </h3>


                    <div class="task-card__details">

                        <span class="task-card__date">
                            📅 ${formatearFecha(fechaLimite)}
                        </span>

                    </div>

                </div>

            </div>


            <span
                class="
                    task-card__status
                    task-card__status--${estado}
                "
            >
                ${obtenerTextoEstado(estado)}
            </span>


            <div class="task-card__bottom">

                ${
                    completada
                        ? `
                            <span
                                class="
                                    task-card__countdown
                                    task-card__countdown--normal
                                "
                            >
                                ✓ Tarea finalizada
                            </span>
                        `
                        : `
                            <span
                                class="task-card__countdown"
                                data-countdown-id="${id}"
                            >
                                Calculando vencimiento...
                            </span>
                        `
                }


                <div class="task-card__actions">

                    <button
                        type="button"
                        class="task-action"
                        data-action="editar"
                        data-id="${id}"
                    >
                        ✎ Editar
                    </button>


                    ${crearBotonEstado(tarea)}


                    <button
                        type="button"
                        class="
                            task-action
                            task-action--delete
                        "
                        data-action="eliminar"
                        data-id="${id}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        </article>
    `;
};


// ==========================================
// RENDERIZAR
// ==========================================

export const renderizarTareas = (tareas) => {

    if (tareas.length === 0) {

        listaTareas.innerHTML = `
            <div class="empty-state">

                <img
                    src="./assets/img/empty-notebook.svg"
                    alt=""
                    class="empty-state__image"
                    aria-hidden="true"
                >

                <h3>
                    Aún no tienes tareas
                </h3>

                <p>
                    Crea una tarea y empieza
                    a organizar tu día.
                </p>

            </div>
        `;

        return;
    }


    listaTareas.innerHTML =
        tareas
            .map(
                (tarea) =>
                    crearTarjetaTarea(tarea)
            )
            .join("");
};


// ==========================================
// ESTADÍSTICAS
// ==========================================

export const actualizarEstadisticas = (gestor) => {

    const tareas =
        gestor.tareas;


    const total =
        tareas.length;


    const pendientes =
        tareas.filter(
            (tarea) =>
                tarea.estado === "pendiente"
        ).length;


    const enProgreso =
        tareas.filter(
            (tarea) =>
                tarea.estado === "en-progreso"
        ).length;


    const completadas =
        tareas.filter(
            (tarea) =>
                tarea.estado === "completada"
        ).length;


    const porcentaje =
        total === 0
            ? 0
            : Math.round(
                (completadas / total) * 100
            );


    // ======================================
    // PANEL DERECHO
    // ======================================

    totalTareas.textContent =
        total;

    totalPendientes.textContent =
        pendientes;

    totalProgreso.textContent =
        enProgreso;

    totalCompletadas.textContent =
        completadas;


    // ======================================
    // RESUMEN SUPERIOR
    // ======================================

    resumenTotal.textContent =
        total;

    resumenPendientes.textContent =
        pendientes;

    resumenEnProgreso.textContent =
        enProgreso;

    resumenCompletadas.textContent =
        completadas;


    // ======================================
    // PORCENTAJE
    // ======================================

    porcentajeProgreso.textContent =
        `${porcentaje}%`;


    textoProgreso.textContent =
        `${completadas} de ${total} completadas`;


    barraProgreso.style.width =
        `${porcentaje}%`;


    // ======================================
    // DONUT
    // ======================================

    const grados =
        (porcentaje / 100) * 360;


    donutProgreso.style.setProperty(
        "--progress",
        `${grados}deg`
    );
};


// ==========================================
// NOTIFICACIONES
// ==========================================

export const mostrarNotificacion = (
    mensaje,
    tipo = "success"
) => {

    const notificacion =
        document.querySelector(
            "#notificacion"
        );


    notificacion.textContent =
        mensaje;


    notificacion.className =
        `notification notification--${tipo}`;


    setTimeout(() => {

        notificacion.classList.add(
            "hidden"
        );

    }, 2000);
};