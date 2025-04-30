# Sistema de Consulta de Movimientos de Almacén

Aplicación web para consultar y visualizar movimientos de inventario y sus ubicaciones en almacén.

## Descripción

Este sistema permite realizar consultas de movimientos de almacén mediante filtros de fecha, tipo de movimiento y número de documento. Los resultados se muestran en dos tablas relacionadas:
- Tabla de Movimientos de Inventario (principal)
- Tabla de Ubicaciones (detalles)

## Características

- Filtrado por rango de fechas
- Filtrado por tipo de movimiento
- Filtrado por número de documento
- Visualización detallada al seleccionar un movimiento
- Interfaz responsiva y amigable

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- API REST

## Instalación

1. Clona este repositorio
2. Asegúrate de tener el backend en funcionamiento en `http://localhost:5288/api/`
3. Abre el archivo `index.html` en tu navegador

## Uso

1. Selecciona la fecha de inicio y fin para tu consulta
2. Opcionalmente, ingresa un tipo de movimiento o número de documento
3. Haz clic en "Consultar"
4. Los resultados se mostrarán en la primera tabla
5. Haz clic en cualquier fila para ver los detalles de ubicación en la segunda tabla

## Estructura del proyecto

- `index.html`: Estructura de la página y formulario de consulta
- `index.js`: Lógica de consulta y visualización de datos
- `styles.css`: Estilos de la aplicación

## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- Conexión al servidor de API en ejecución