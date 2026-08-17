// ==========================================
// MYFLOW - APLICACIÓN PRINCIPAL
// ==========================================

import { Tarea } from "./models/Tarea.js";
import { GestorTareas } from "./GestorTareas.js";

import {
    guardarTareas,
    obtenerTareas
} from "./services/storageService.js";

import {
    obtenerTareasAPI,
    guardarTareaAPI
} from "./services/apiService.js";

import {
    renderizarTareas,
    actualizarEstadisticas,
    mostrarNotificacion
} from "./ui.js";


// ==========================================
// INICIALIZACIÓN
// ==========================================

const gestor = new GestorTareas();


// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

const btnNuevaTarea =
    document.querySelector("#btnNuevaTarea");

const btnHeroNuevaTarea =
    document.querySelector("#btnHeroNuevaTarea");

const btnInspirame =
    document.querySelector("#btnInspirame");

const btnCerrarPanel =
    document.querySelector("#btnCerrarPanel");

const btnCancelar =
    document.querySelector("#btnCancelar");

const panelTarea =
    document.querySelector("#panelTarea");

const overlay =
    document.querySelector("#overlay");

const formTarea =
    document.querySelector("#formTarea");

const tareaId =
    document.querySelector("#tareaId");

const descripcion =
    document.querySelector("#descripcion");

const prioridad =
    document.querySelector("#prioridad");

const fechaLimite =
    document.querySelector("#fechaLimite");

const tituloFormulario =
    document.querySelector("#tituloFormulario");

const btnGuardarTarea =
    document.querySelector("#btnGuardarTarea");

const listaTareas =
    document.querySelector("#listaTareas");

const buscarTarea =
    document.querySelector("#buscarTarea");

const botonesFiltro =
    document.querySelectorAll(".filter-btn");

const estadoApi =
    document.querySelector("#estadoApi");

const btnContacto = document.querySelector("#btnContacto");
const panelContacto = document.querySelector("#panelContacto");
const btnCerrarContacto = document.querySelector("#btnCerrarContacto");
const btnCancelarContacto = document.querySelector("#btnCancelarContacto");
const formContacto = document.querySelector("#formContacto");


// ==========================================
// INSPÍRAME
// ==========================================

const panelInspiracion =
    document.querySelector("#panelInspiracion");

const categoriaInspiracion =
    document.querySelector("#categoriaInspiracion");

const textoInspiracion =
    document.querySelector("#textoInspiracion");

const btnMasInspiracion =
    document.querySelector("#btnMasInspiracion");

const btnCerrarInspiracion =
    document.querySelector("#btnCerrarInspiracion");

const btnCerrarConsejo =
    document.querySelector("#btnCerrarConsejo");


// ==========================================
// ESTADO INTERFAZ
// ==========================================

let filtroActual = "todas";
let textoBusqueda = "";
let indiceConsejoActual = -1;


// ==========================================
// CONSEJOS
// ==========================================

const consejos = [
    {
        categoria: "PLANIFICA",
        texto: "Define tus tres prioridades para mañana."
    },
    {
        categoria: "PRIORIZA",
        texto: "Empieza por la tarea de mayor impacto."
    },
    {
        categoria: "ENFÓCATE",
        texto: "Trabaja 25 minutos sin interrupciones."
    },
    {
        categoria: "ORGANIZA",
        texto: "Agrupa tareas similares y resuélvelas juntas."
    },
    {
        categoria: "AVANZA",
        texto: "Divide una tarea grande en un paso pequeño."
    },
    {
        categoria: "DESCANSA",
        texto: "Haz una pausa breve para recuperar concentración."
    },
    {
        categoria: "DECIDE",
        texto: "Si toma menos de dos minutos, hazlo ahora."
    },
    {
        categoria: "SIMPLIFICA",
        texto: "Elimina una tarea que ya no aporta a tu objetivo."
    }
];


// ==========================================
// LOCAL STORAGE
// ==========================================

const cargarTareasGuardadas = () => {

    const tareasGuardadas =
        obtenerTareas();


    gestor.tareas =
        tareasGuardadas.map((tarea) => {

            const {
                id,
                descripcion,
                prioridad,
                estado,
                fechaLimite,
                fechaCreacion
            } = tarea;


            return new Tarea(
                id,
                descripcion,
                prioridad,
                estado,
                fechaLimite,
                fechaCreacion
            );
        });
};


// ==========================================
// API
// ==========================================

const conectarAPI = async () => {

    try {

        estadoApi.textContent =
            "Conectando...";


        const tareasAPI =
            await obtenerTareasAPI();


        console.log(
            "Tareas recuperadas desde API:",
            tareasAPI
        );


        estadoApi.textContent =
            "API conectada";


        estadoApi.classList.remove(
            "api-status--offline"
        );


        estadoApi.classList.add(
            "api-status--online"
        );


        setTimeout(() => {

            estadoApi.classList.add(
                "hidden"
            );

        }, 3000);

    } catch (error) {

        console.error(
            "Error de conexión con la API:",
            error
        );


        estadoApi.textContent =
            "Modo local";


        estadoApi.classList.remove(
            "api-status--online"
        );


        estadoApi.classList.add(
            "api-status--offline"
        );


        setTimeout(() => {

            estadoApi.classList.add(
                "hidden"
            );

        }, 3000);
    }
};


// ==========================================
// RETARDO ASÍNCRONO
// ==========================================

const esperar = (milisegundos) => {

    return new Promise((resolve) => {

        setTimeout(
            resolve,
            milisegundos
        );
    });
};


// ==========================================
// CUENTA REGRESIVA
// ==========================================

const calcularTiempoRestante = (fecha) => {

    const ahora =
        new Date();

    const limite =
        new Date(fecha);


    const diferencia =
        limite - ahora;


    if (diferencia <= 0) {

        return {
            texto: "⚠ Vencida",
            tipo: "vencida"
        };
    }


    const minutos =
        Math.floor(
            diferencia / 60000
        );


    const horas =
        Math.floor(
            diferencia / 3600000
        );


    const dias =
        Math.ceil(
            diferencia / 86400000
        );


    if (minutos < 60) {

        return {
            texto:
                `⏱ ${Math.max(minutos, 1)} min restantes`,
            tipo: "urgente"
        };
    }


    if (horas < 24) {

        return {
            texto:
                `⏱ ${horas} h restantes`,
            tipo: "urgente"
        };
    }


    if (dias === 1) {

        return {
            texto:
                "⏱ 1 día restante",
            tipo: "proxima"
        };
    }


    return {
        texto:
            `⏱ ${dias} días restantes`,
        tipo: "normal"
    };
};


// ==========================================
// ACTUALIZAR VENCIMIENTOS
// ==========================================

const actualizarVencimientos = () => {

    const contadores =
        document.querySelectorAll(
            "[data-countdown-id]"
        );


    contadores.forEach((contador) => {

        const id =
            contador.dataset.countdownId;


        const tarea =
            gestor.obtenerTareaPorId(id);


        if (
            !tarea ||
            !tarea.fechaLimite ||
            tarea.estado === "completada"
        ) {
            return;
        }


        const resultado =
            calcularTiempoRestante(
                tarea.fechaLimite
            );


        contador.textContent =
            resultado.texto;


        contador.className =
            `task-card__countdown task-card__countdown--${resultado.tipo}`;
    });
};


// ==========================================
// ACTUALIZAR INTERFAZ
// ==========================================

const actualizarInterfaz = () => {

    let tareasAMostrar =
        gestor.filtrarPorEstado(
            filtroActual
        );


    if (textoBusqueda) {

        tareasAMostrar =
            tareasAMostrar.filter((tarea) =>

                tarea.descripcion
                    .toLowerCase()
                    .includes(
                        textoBusqueda.toLowerCase()
                    )
            );
    }


    renderizarTareas(
        tareasAMostrar
    );


    actualizarEstadisticas(
        gestor
    );


    actualizarVencimientos();
};


// ==========================================
// OVERLAY
// ==========================================

const mostrarOverlay = () => {

    overlay.classList.remove(
        "hidden"
    );
};


const ocultarOverlay = () => {

    overlay.classList.add(
        "hidden"
    );
};


// ==========================================
// PANEL TAREA
// ==========================================

const abrirPanelTarea = () => {

    panelInspiracion.classList.add(
        "hidden"
    );


    panelTarea.classList.remove(
        "hidden"
    );


    mostrarOverlay();


    descripcion.focus();
};


const cerrarPanelTarea = () => {

    panelTarea.classList.add(
        "hidden"
    );


    formTarea.reset();


    tareaId.value =
        "";


    prioridad.value =
        "media";


    tituloFormulario.textContent =
        "Nueva tarea";


    btnGuardarTarea.textContent =
        "Crear tarea";


    btnGuardarTarea.disabled =
        false;


    ocultarOverlay();
};


// ==========================================
// PREPARAR NUEVA TAREA
// ==========================================

const prepararNuevaTarea = () => {

    formTarea.reset();


    tareaId.value =
        "";


    prioridad.value =
        "media";


    tituloFormulario.textContent =
        "Nueva tarea";


    btnGuardarTarea.textContent =
        "Crear tarea";


    btnGuardarTarea.disabled =
        false;


    abrirPanelTarea();
};


// ==========================================
// INSPÍRAME
// ==========================================

const obtenerConsejoAleatorio = () => {

    let nuevoIndice;


    do {

        nuevoIndice =
            Math.floor(
                Math.random() *
                consejos.length
            );

    } while (
        nuevoIndice ===
        indiceConsejoActual &&
        consejos.length > 1
    );


    indiceConsejoActual =
        nuevoIndice;


    return consejos[
        nuevoIndice
    ];
};


const mostrarNuevoConsejo = () => {

    const consejo =
        obtenerConsejoAleatorio();


    categoriaInspiracion.textContent =
        consejo.categoria;


    textoInspiracion.textContent =
        consejo.texto;
};


const abrirInspiracion = () => {

    panelTarea.classList.add(
        "hidden"
    );


    mostrarNuevoConsejo();


    panelInspiracion.classList.remove(
        "hidden"
    );


    mostrarOverlay();
};


const cerrarInspiracion = () => {

    panelInspiracion.classList.add(
        "hidden"
    );

    if (panelContacto) panelContacto.classList.add("hidden");

    ocultarOverlay();
};


// ==========================================
// CERRAR PANEL ACTIVO
// ==========================================

const cerrarPanelActivo = () => {

    panelTarea.classList.add(
        "hidden"
    );


    panelInspiracion.classList.add(
        "hidden"
    );


    ocultarOverlay();
};


// ==========================================
// EDITAR TAREA
// ==========================================

const prepararEdicion = (id) => {

    const tarea =
        gestor.obtenerTareaPorId(id);


    if (!tarea) {

        mostrarNotificacion(
            "No fue posible encontrar la tarea.",
            "error"
        );

        return;
    }


    tareaId.value =
        tarea.id;


    descripcion.value =
        tarea.descripcion;


    prioridad.value =
        tarea.prioridad;


    fechaLimite.value =
        tarea.fechaLimite ?? "";


    tituloFormulario.textContent =
        "Editar tarea";


    btnGuardarTarea.textContent =
        "Guardar cambios";


    abrirPanelTarea();
};


// ==========================================
// VALIDACIÓN
// ==========================================

const validarFormulario = () => {

    if (!descripcion.value.trim()) {

        mostrarNotificacion(
            "Completa la descripción de la tarea.",
            "error"
        );


        descripcion.focus();


        return false;
    }


    if (!fechaLimite.value) {

        mostrarNotificacion(
            "Selecciona una fecha límite.",
            "error"
        );


        fechaLimite.focus();


        return false;
    }


    return true;
};


// ==========================================
// CREAR / EDITAR
// ==========================================

const manejarFormulario =
    async (evento) => {

        evento.preventDefault();


        if (!validarFormulario()) {
            return;
        }


        // Datos editables
        const datosTarea = {

            descripcion:
                descripcion.value.trim(),

            prioridad:
                prioridad.value,

            fechaLimite:
                fechaLimite.value
        };


        // ======================================
        // EDITAR
        // ======================================

        if (tareaId.value) {

            gestor.editarTarea(
                tareaId.value,
                datosTarea
            );


            guardarTareas(
                gestor.tareas
            );


            actualizarInterfaz();


            cerrarPanelTarea();


            mostrarNotificacion(
                "Tarea editada correctamente."
            );


            return;
        }


        // ======================================
        // CREAR
        // Siempre comienza POR INICIAR
        // ======================================

        btnGuardarTarea.disabled =
            true;


        btnGuardarTarea.textContent =
            "Guardando...";


        await esperar(700);


        const nuevaTarea =
            gestor.agregarTarea({

                ...datosTarea,

                estado:
                    "pendiente"
            });


        guardarTareas(
            gestor.tareas
        );


        actualizarInterfaz();


        cerrarPanelTarea();


        setTimeout(() => {

            mostrarNotificacion(
                "Tarea creada correctamente."
            );

        }, 2000);


        // ======================================
        // POST API
        // ======================================

        try {

            const respuestaAPI =
                await guardarTareaAPI({

                    title:
                        nuevaTarea.descripcion,

                    completed:
                        nuevaTarea
                            .estaCompletada(),

                    userId: 1
                });


            console.log(
                "Tarea enviada a la API:",
                respuestaAPI
            );

        } catch (error) {

            console.error(
                "La tarea se guardó localmente, pero no pudo sincronizarse con la API.",
                error
            );
        }
    };


// ==========================================
// ACCIONES DE TAREA
// ==========================================

const manejarAccionesTarea = (evento) => {

    const boton =
        evento.target.closest(
            "[data-action]"
        );


    if (!boton) {
        return;
    }


    const {
        action,
        id
    } = boton.dataset;


    // ======================================
    // EDITAR
    // ======================================

    if (action === "editar") {

        prepararEdicion(id);

        return;
    }


    // ======================================
    // INICIAR
    // POR INICIAR → EN CURSO
    // ======================================

    if (action === "iniciar") {

        gestor.cambiarEstadoTarea(
            id,
            "en-progreso"
        );


        guardarTareas(
            gestor.tareas
        );


        actualizarInterfaz();


        mostrarNotificacion(
            "Tarea iniciada."
        );


        return;
    }


    // ======================================
    // COMPLETAR
    // EN CURSO → COMPLETADA
    // ======================================

    if (action === "completar") {

        gestor.cambiarEstadoTarea(
            id,
            "completada"
        );


        guardarTareas(
            gestor.tareas
        );


        actualizarInterfaz();


        mostrarNotificacion(
            "¡Tarea completada!"
        );


        return;
    }


    // ======================================
    // ELIMINAR
    // ======================================

    if (action === "eliminar") {

        const confirmar =
            confirm(
                "¿Seguro que quieres eliminar esta tarea?"
            );


        if (!confirmar) {
            return;
        }


        gestor.eliminarTarea(id);


        guardarTareas(
            gestor.tareas
        );


        actualizarInterfaz();


        mostrarNotificacion(
            "Tarea eliminada correctamente."
        );
    }
};


// ==========================================
// BUSCADOR
// ==========================================

const manejarBusqueda = (evento) => {

    textoBusqueda =
        evento.target.value.trim();


    actualizarInterfaz();
};


// ==========================================
// FILTROS
// ==========================================

const manejarFiltro = (evento) => {

    const boton =
        evento.currentTarget;


    filtroActual =
        boton.dataset.filter;


    botonesFiltro.forEach((btn) => {

        btn.classList.remove(
            "filter-btn--active"
        );
    });


    boton.classList.add(
        "filter-btn--active"
    );


    actualizarInterfaz();
};


// ==========================================
// MOUSEOVER
// ==========================================

const manejarMouseover = (evento) => {

    const tarjeta =
        evento.target.closest(
            ".task-card"
        );


    if (!tarjeta) {
        return;
    }


    tarjeta.classList.add(
        "task-card--hover"
    );
};


// ==========================================
// MOUSEOUT
// ==========================================

const manejarMouseout = (evento) => {

    const tarjeta =
        evento.target.closest(
            ".task-card"
        );


    if (!tarjeta) {
        return;
    }


    tarjeta.classList.remove(
        "task-card--hover"
    );
};


// ==========================================
// EVENTOS
// ==========================================

btnNuevaTarea.addEventListener(
    "click",
    prepararNuevaTarea
);


btnHeroNuevaTarea.addEventListener(
    "click",
    prepararNuevaTarea
);


btnInspirame.addEventListener(
    "click",
    abrirInspiracion
);


btnCerrarPanel.addEventListener(
    "click",
    cerrarPanelTarea
);


btnCancelar.addEventListener(
    "click",
    cerrarPanelTarea
);


overlay.addEventListener(
    "click",
    cerrarPanelActivo
);


formTarea.addEventListener(
    "submit",
    manejarFormulario
);


btnMasInspiracion.addEventListener(
    "click",
    mostrarNuevoConsejo
);


btnCerrarInspiracion.addEventListener(
    "click",
    cerrarInspiracion
);


btnCerrarConsejo.addEventListener(
    "click",
    cerrarInspiracion
);


listaTareas.addEventListener(
    "click",
    manejarAccionesTarea
);


buscarTarea.addEventListener(
    "keyup",
    manejarBusqueda
);


listaTareas.addEventListener(
    "mouseover",
    manejarMouseover
);


listaTareas.addEventListener(
    "mouseout",
    manejarMouseout
);


botonesFiltro.forEach((boton) => {

    boton.addEventListener(
        "click",
        manejarFiltro
    );
});




// ==========================================
// CONTACTO
// ==========================================

if (btnContacto) {
    btnContacto.addEventListener("click", () => {
        panelContacto.classList.remove("hidden");
        mostrarOverlay();
    });
}

[btnCerrarContacto, btnCancelarContacto].forEach((boton) => {
    if (boton) boton.addEventListener("click", () => {
        panelContacto.classList.add("hidden");
        ocultarOverlay();
    });
});

if (formContacto) {
    formContacto.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!formContacto.checkValidity()) {
            formContacto.reportValidity();
            return;
        }

        const botonEnviar = formContacto.querySelector('button[type="submit"]');

        if (botonEnviar) {
            botonEnviar.disabled = true;
            botonEnviar.textContent = "Enviando...";
        }

        setTimeout(() => {
            formContacto.reset();
            panelContacto.classList.add("hidden");
            ocultarOverlay();
            mostrarNotificacion("Mensaje enviado correctamente ✓");

            if (botonEnviar) {
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Enviar mensaje";
            }
        }, 450);
    });
}

// ==========================================
// ACTUALIZAR DEADLINES CADA MINUTO
// ==========================================

setInterval(
    actualizarVencimientos,
    60000
);


// ==========================================
// INICIAR MYFLOW
// ==========================================

cargarTareasGuardadas();

actualizarInterfaz();

conectarAPI();