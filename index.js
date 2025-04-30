// URL base de la API (ya configurada para tu entorno local)
const API_BASE_URL = 'http://localhost:5288/api/';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const btnConsultar = document.getElementById('btn');
    const inputFechaInicio = document.getElementById('input');
    const inputFechaFin = document.getElementById('input2');
    const inputTipoMovimiento = document.getElementById('input3');
    const inputNumDocumento = document.getElementById('input4');

    // Obtener referencias a las tablas
    const tablaCabecera = document.getElementById('table-body-1');
    const tablaDetalles = document.getElementById('table-body-2');

    // Variable para almacenar todos los datos de movimientos recibidos de la API
    let todosLosMovimientos = [];

    // Configurar fecha actual por defecto en los inputs de fecha
    const hoy = new Date().toISOString().split('T')[0];
    inputFechaInicio.value = hoy;
    inputFechaFin.value = hoy;

    // Manejar envío del formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        consultarMovimientos();
    });

    // Función para consultar movimientos según los filtros
    async function consultarMovimientos() {
        try {
            // Mostrar mensaje de carga
            tablaCabecera.innerHTML = '<tr><td colspan="10">Cargando datos...</td></tr>';
            tablaDetalles.innerHTML = '<tr><td colspan="15">Cargando detalles...</td></tr>';

            // Formatear las fechas correctamente (solo la fecha sin horas)
            const fechaInicio = inputFechaInicio.value; // Ya está en formato YYYY-MM-DD
            const fechaFin = inputFechaFin.value; // Ya está en formato YYYY-MM-DD

            // Preparar datos para la petición con el formato exacto que espera la API
            const filtroRequest = {
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                tipoMovimiento: inputTipoMovimiento.value || null,
                nroDocumento: inputNumDocumento.value || null
            };

            console.log("Enviando filtro:", filtroRequest);

            // Endpoint para filtrar por fechas usando POST
            const endpoint = `${API_BASE_URL}MovInventarios/FiltrarMovimientos`;

            // Realizar la petición POST a la API
            try {
                console.log(`Intentando conectar a: ${endpoint}`);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(filtroRequest)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error al consultar datos: ${response.status} - ${response.statusText} - ${errorText}`);
                }

                const datos = await response.json();
                console.log("Datos recibidos:", datos);

                // Verificar la estructura de la respuesta
                if (!datos || !datos.movimientos) {
                    tablaCabecera.innerHTML = '<tr><td colspan="10">Error en formato de datos</td></tr>';
                    tablaDetalles.innerHTML = '<tr><td colspan="15">No se pudieron procesar los datos</td></tr>';
                    console.error("Estructura de datos inesperada:", datos);
                    return;
                }

                // Extraer los movimientos y guardarlos en la variable global
                todosLosMovimientos = datos.movimientos;

                if (todosLosMovimientos.length === 0) {
                    tablaCabecera.innerHTML = '<tr><td colspan="10">No se encontraron resultados</td></tr>';
                    tablaDetalles.innerHTML = '<tr><td colspan="15">No hay datos disponibles</td></tr>';
                    return;
                }

                // Preparar estructura de datos para la tabla de cabeceras
                const cabecerasTabla = prepararCabeceras(todosLosMovimientos);

                // Mostrar datos en la tabla de cabeceras (primera tabla)
                mostrarCabecerasMovimientos(cabecerasTabla);

                // Inicialmente, la tabla de detalles muestra un mensaje informativo
                tablaDetalles.innerHTML = '<tr><td colspan="15">Seleccione un movimiento para ver sus detalles</td></tr>';

            } catch (error) {
                console.error('Error completo:', error);
                console.error('Error detallado:', {
                    mensaje: error.message,
                    nombre: error.name,
                    stack: error.stack
                });
                tablaCabecera.innerHTML = `<tr><td colspan="10">Error: ${error.message}</td></tr>`;
                tablaDetalles.innerHTML = `<tr><td colspan="15">Error: ${error.message}</td></tr>`;
                alert('Hubo un problema al consultar los datos: ' + error.message);
            }
        } catch (error) {
            console.error('Error general:', error);
            tablaCabecera.innerHTML = `<tr><td colspan="10">Error general: ${error.message}</td></tr>`;
            tablaDetalles.innerHTML = `<tr><td colspan="15">Error general: ${error.message}</td></tr>`;
            alert('Error general: ' + error.message);
        }
    }

    // Función para preparar datos de cabecera a partir de los resultados
    function prepararCabeceras(datos) {
        // Adaptamos los nombres de campo según la estructura de la BD
        return datos.map((movimiento, indice) => {
            // Normalizar nombres de propiedades (pueden ser en camelCase o mayúsculas)
            return {
                COD_CIA: movimiento.codCia || movimiento.COD_CIA || '',
                COMPANIA_VENTA_3: movimiento.companiaVenta3 || movimiento.COMPANIA_VENTA_3 || '',
                ALMACEN_VENTA: movimiento.almacenVenta || movimiento.ALMACEN_VENTA || '',
                TIPO_MOVIMIENTO: movimiento.tipoMovimiento || movimiento.TIPO_MOVIMIENTO || '',
                TIPO_DOCUMENTO: movimiento.tipoDocumento || movimiento.TIPO_DOCUMENTO || '',
                NRO_DOCUMENTO: movimiento.nroDocumento || movimiento.NRO_DOCUMENTO || '',
                FECHA_TRANSACCION: movimiento.fechaTransaccion || movimiento.FECHA_TRANSACCION || '',
                COD_ITEM_2: movimiento.codItem2 || movimiento.COD_ITEM_2 || '',
                UM_ITEM_3: movimiento.umItem3 || movimiento.UM_ITEM_3 || '',
                CANTIDAD: movimiento.cantidad || movimiento.CANTIDAD || '',
                _indice: indice  // Añadimos el índice para referencia al hacer clic
            };
        });
    }

    // Función para preparar datos de detalles a partir de un movimiento específico
    function prepararDetallesPorMovimiento(movimiento) {
        let detalles = [];

        if (!movimiento) return detalles;

        const mov = {
            codCia: movimiento.codCia || movimiento.COD_CIA || '',
            companiaVenta3: movimiento.companiaVenta3 || movimiento.COMPANIA_VENTA_3 || '',
            almacenVenta: movimiento.almacenVenta || movimiento.ALMACEN_VENTA || '',
            tipoMovimiento: movimiento.tipoMovimiento || movimiento.TIPO_MOVIMIENTO || '',
            tipoDocumento: movimiento.tipoDocumento || movimiento.TIPO_DOCUMENTO || '',
            nroDocumento: movimiento.nroDocumento || movimiento.NRO_DOCUMENTO || '',
            codItem2: movimiento.codItem2 || movimiento.COD_ITEM_2 || ''
        };

        const ubicaciones = movimiento.ubicaciones || [];

        if (ubicaciones.length > 0) {
            // Si hay ubicaciones, crear una fila por cada ubicación
            ubicaciones.forEach(ubicacion => {
                detalles.push({
                    COD_CIA: mov.codCia,
                    COMPANIA_VENTA_3: mov.companiaVenta3,
                    ALMACEN_VENTA: mov.almacenVenta,
                    TIPO_MOVIMIENTO: mov.tipoMovimiento,
                    TIPO_DOCUMENTO: mov.tipoDocumento,
                    NRO_DOCUMENTO: mov.nroDocumento,
                    COD_ITEM_2: mov.codItem2,
                    ZONA: ubicacion.zona || ubicacion.ZONA || '',
                    RACK: ubicacion.rack || ubicacion.RACK || '',
                    NIVEL: ubicacion.nivel || ubicacion.NIVEL || '',
                    CASILLERO: ubicacion.casillero || ubicacion.CASILLERO || '',
                    COD_LOTE: ubicacion.codLote || ubicacion.COD_LOTE || '',
                    COD_ESTADO: ubicacion.codEstado || ubicacion.COD_ESTADO || '',
                    UM_MOV: ubicacion.umMov || ubicacion.UM_MOV || '',
                    CANTIDAD: ubicacion.cantidad || ubicacion.CANTIDAD || ''
                });
            });
        } else {
            // Si no hay ubicaciones, agregar una fila sin información de ubicación
            detalles.push({
                COD_CIA: mov.codCia,
                COMPANIA_VENTA_3: mov.companiaVenta3,
                ALMACEN_VENTA: mov.almacenVenta,
                TIPO_MOVIMIENTO: mov.tipoMovimiento,
                TIPO_DOCUMENTO: mov.tipoDocumento,
                NRO_DOCUMENTO: mov.nroDocumento,
                COD_ITEM_2: mov.codItem2,
                ZONA: '',
                RACK: '',
                NIVEL: '',
                CASILLERO: '',
                COD_LOTE: '',
                COD_ESTADO: '',
                UM_MOV: '',
                CANTIDAD: ''
            });
        }

        return detalles;
    }

    // Función para mostrar cabeceras de movimientos
    function mostrarCabecerasMovimientos(cabeceras) {
        tablaCabecera.innerHTML = '';

        if (cabeceras.length === 0) {
            tablaCabecera.innerHTML = '<tr><td colspan="10">No se encontraron resultados</td></tr>';
            return;
        }

        cabeceras.forEach(cabecera => {
            const fila = document.createElement('tr');

            // Agregar clase para identificar visualmente la fila
            fila.classList.add('fila-movimiento');

            // Almacenar el índice como atributo de datos para recuperarlo al hacer clic
            fila.dataset.indice = cabecera._indice;

            // Crear celdas para la tabla de cabeceras en orden exacto según el HTML
            const celdas = [
                { valor: cabecera.COD_CIA },
                { valor: cabecera.COMPANIA_VENTA_3 },
                { valor: cabecera.ALMACEN_VENTA },
                { valor: cabecera.TIPO_MOVIMIENTO },
                { valor: cabecera.TIPO_DOCUMENTO },
                { valor: cabecera.NRO_DOCUMENTO },
                { valor: formatearFecha(cabecera.FECHA_TRANSACCION) },
                { valor: cabecera.COD_ITEM_2 },
                { valor: cabecera.UM_ITEM_3 },
                { valor: cabecera.CANTIDAD }
            ];

            // Agregar todas las celdas a la fila
            celdas.forEach(info => {
                const celda = document.createElement('td');
                celda.textContent = info.valor || '';
                fila.appendChild(celda);
            });

            // Agregar evento de clic a la fila para mostrar los detalles
            fila.addEventListener('click', function () {
                // Remover clase 'seleccionada' de todas las filas
                document.querySelectorAll('.fila-movimiento').forEach(f => {
                    f.classList.remove('seleccionada');
                });

                // Agregar clase 'seleccionada' a esta fila
                this.classList.add('seleccionada');

                // Obtener el índice del movimiento
                const indice = parseInt(this.dataset.indice);

                // Mostrar detalles solo para este movimiento
                mostrarDetalleDeMovimiento(indice);
            });

            // Agregar fila a la tabla
            tablaCabecera.appendChild(fila);
        });
    }

    // Función para mostrar detalles de un movimiento específico
    function mostrarDetalleDeMovimiento(indice) {
        // Obtener el movimiento seleccionado
        const movimientoSeleccionado = todosLosMovimientos[indice];

        if (!movimientoSeleccionado) {
            tablaDetalles.innerHTML = '<tr><td colspan="15">No se encontró información del movimiento seleccionado</td></tr>';
            return;
        }

        console.log("Mostrando detalles del movimiento:", movimientoSeleccionado);

        // Preparar los detalles solo para este movimiento
        const detallesMovimiento = prepararDetallesPorMovimiento(movimientoSeleccionado);

        // Mostrar los detalles en la tabla
        mostrarDetallesMovimientos(detallesMovimiento);
    }

    // Función para mostrar detalles de movimientos
    function mostrarDetallesMovimientos(detalles) {
        tablaDetalles.innerHTML = '';

        if (detalles.length === 0) {
            tablaDetalles.innerHTML = '<tr><td colspan="15">Este movimiento no tiene detalles de ubicación</td></tr>';
            return;
        }

        detalles.forEach(detalle => {
            const fila = document.createElement('tr');

            // Crear celdas para la tabla de detalles en orden exacto según el HTML
            const celdas = [
                { valor: detalle.COD_CIA },
                { valor: detalle.COMPANIA_VENTA_3 },
                { valor: detalle.ALMACEN_VENTA },
                { valor: detalle.TIPO_MOVIMIENTO },
                { valor: detalle.TIPO_DOCUMENTO },
                { valor: detalle.NRO_DOCUMENTO },
                { valor: detalle.COD_ITEM_2 },
                { valor: detalle.ZONA },
                { valor: detalle.RACK },
                { valor: detalle.NIVEL },
                { valor: detalle.CASILLERO },
                { valor: detalle.COD_LOTE },
                { valor: detalle.COD_ESTADO },
                { valor: detalle.UM_MOV },
                { valor: detalle.CANTIDAD }
            ];

            // Agregar todas las celdas a la fila
            celdas.forEach(info => {
                const celda = document.createElement('td');
                celda.textContent = info.valor || '';
                fila.appendChild(celda);
            });

            // Agregar fila a la tabla
            tablaDetalles.appendChild(fila);
        });
    }

    // Función para formatear fecha
    function formatearFecha(fechaStr) {
        if (!fechaStr) return '';

        try {
            const fecha = new Date(fechaStr);
            if (isNaN(fecha)) return fechaStr;

            return fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return fechaStr;
        }
    }
});