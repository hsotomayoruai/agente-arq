# ReciclApp — Arquitectura aprobada para MVP

## 1. Objetivo

ReciclApp es una aplicación orientada principalmente a tablets instaladas en centros de reciclaje.

La aplicación debe permitir identificar a un cliente, fotografiar un residuo, clasificarlo mediante inteligencia artificial, indicar gráficamente el contenedor correspondiente y asignar puntos cuando exista un cliente identificado.

El objetivo de esta etapa es construir un MVP funcional que pueda ejecutarse y probarse localmente.

---

## 2. Principios arquitectónicos

La solución debe priorizar:

- simplicidad;
- rapidez de implementación;
- mantenibilidad;
- seguridad;
- facilidad de ejecución local;
- capacidad de evolucionar posteriormente.

Esta etapa corresponde a un MVP.

No se deben utilizar microservicios, API Gateway, colas de mensajería ni infraestructura distribuida.

---

## 3. Arquitectura lógica

La arquitectura aprobada es:

Tablet Application
        |
        v
Modular Backend API
        |
        +-- Session / Customer Module
        |
        +-- Classification Module
        |
        +-- Recycling Rules Module
        |
        +-- Points Module
        |
        +-- Persistence Module
        |
        +-- AI Provider Interface
                  |
                  v
          Simulated AI Provider

La aplicación cliente nunca debe comunicarse directamente con el proveedor de IA.

---

## 4. Aplicación Tablet

La aplicación debe estar diseñada principalmente para una experiencia táctil en tablet.

Debe permitir:

1. Iniciar una sesión.
2. Identificar al cliente mediante QR.
3. Continuar como invitado mediante la opción "No tengo cuenta".
4. Acceder a la cámara del dispositivo.
5. Permitir cargar una imagen como alternativa cuando la cámara no esté disponible.
6. Enviar la imagen al backend.
7. Mostrar el estado mientras se procesa la imagen.
8. Mostrar el residuo identificado.
9. Mostrar gráficamente el contenedor correspondiente.
10. Mostrar los puntos obtenidos cuando corresponda.
11. Permitir clasificar otro residuo dentro de la misma sesión.
12. Mostrar un resumen de la sesión.

La interfaz debe contemplar estados de:

- carga;
- éxito;
- error;
- reintento.

---

## 5. Backend

Se utilizará un único backend modular.

Los módulos deben estar separados lógicamente, pero deben ejecutarse como una sola aplicación.

### Session / Customer Module

Responsable de:

- crear y mantener una sesión;
- asociar una sesión a un cliente;
- soportar sesiones de invitados;
- impedir que un cliente pueda atribuir puntos arbitrariamente a otro cliente.

### Classification Module

Responsable de:

- recibir la imagen;
- validar formato y tamaño;
- invocar al proveedor de IA;
- validar la respuesta;
- gestionar errores, timeout y clasificaciones inválidas.

### Recycling Rules Module

Responsable de transformar:

tipo de residuo → contenedor

Las reglas no deben estar codificadas directamente en la interfaz de usuario.

### Points Module

Responsable de:

- determinar los puntos correspondientes;
- asignarlos únicamente a clientes identificados;
- registrar el movimiento;
- devolver el resultado actualizado.

### Persistence Module

Responsable de almacenar como mínimo:

- clientes;
- sesiones;
- clasificaciones;
- movimientos de puntos.

La tecnología de persistencia puede ser seleccionada por el desarrollador, pero debe ser apropiada para un MVP ejecutable localmente.

---

## 6. Proveedor de Inteligencia Artificial

La integración con IA debe implementarse mediante una interfaz o abstracción independiente de un proveedor específico.

Para esta versión se utilizará un:

Simulated AI Provider

El proveedor simulado debe retornar al menos:

- tipo de residuo;
- nivel de confianza.

Debe permitir probar diferentes resultados sin utilizar credenciales ni consumir una API externa.

La arquitectura debe permitir reemplazar posteriormente el proveedor simulado por un servicio real sin modificar la lógica principal de negocio.

---

## 7. Categorías iniciales

El MVP debe soportar como mínimo:

- plástico;
- vidrio;
- papel/cartón;
- metal;
- orgánico.

Cada categoría debe estar asociada a un contenedor.

La representación visual queda a criterio del desarrollador.

---

## 8. QR e identificación

Debe existir un mecanismo funcional de identificación mediante QR.

El QR debe representar un identificador o token que permita asociar la sesión con un cliente.

La solución debe impedir que la simple modificación de un identificador enviado desde el frontend permita acreditar puntos a otro cliente.

También debe existir:

"No tengo cuenta"

En ese caso se crea una sesión de invitado y no se acumulan puntos persistentes.

---

## 9. Seguridad

Como mínimo:

- no almacenar secretos en el código fuente;
- utilizar variables de entorno para configuración sensible;
- validar datos recibidos por el backend;
- limitar tamaño y tipo de imágenes;
- evitar exposición directa del proveedor de IA;
- impedir manipulación arbitraria de puntos desde el frontend;
- manejar correctamente sesiones;
- minimizar almacenamiento de información personal;
- no almacenar imágenes permanentemente salvo necesidad explícita.

---

## 10. Manejo de errores

La solución debe manejar al menos:

- cámara no disponible;
- permiso de cámara rechazado;
- imagen inválida;
- archivo demasiado grande;
- error de red;
- error del backend;
- error del proveedor de IA;
- clasificación desconocida;
- nivel de confianza insuficiente;
- sesión inválida.

El usuario debe recibir mensajes comprensibles y disponer de una opción de reintento cuando corresponda.

---

## 11. Pruebas

La solución debe incluir pruebas automatizadas.

Como mínimo:

### Backend

- sesiones;
- clasificación;
- reglas residuo → contenedor;
- asignación de puntos;
- proveedor de IA simulado;
- manejo de errores;
- endpoints principales.

### Frontend

Pruebas de los componentes o flujos principales cuando la tecnología seleccionada lo permita razonablemente.

Las pruebas deben poder ejecutarse mediante comandos documentados.

No se deben eliminar o deshabilitar pruebas para conseguir una ejecución exitosa.

---

## 12. Documentación

Debe existir un README que indique:

- arquitectura utilizada;
- tecnologías seleccionadas;
- requisitos;
- instalación;
- configuración;
- variables de entorno;
- ejecución del backend;
- ejecución del frontend;
- ejecución de pruebas;
- funcionamiento del proveedor de IA simulado.

---

## 13. Restricciones

Para esta versión no implementar:

- microservicios;
- API Gateway;
- Kubernetes;
- colas de mensajería;
- infraestructura cloud;
- integración con una IA real;
- sistemas empresariales externos.

Estas capacidades pertenecen a una evolución posterior.

---

## 14. Decisiones que puede tomar el desarrollador

El desarrollador puede seleccionar:

- lenguaje;
- framework frontend;
- framework backend;
- mecanismo de persistencia;
- librería QR;
- librería de cámara;
- framework de pruebas;
- estructura interna del proyecto.

Las decisiones deben ser justificadas y coherentes con un MVP.

---

## 15. Criterios de aceptación

La implementación se considera funcional cuando:

1. Puede ejecutarse localmente siguiendo el README.
2. Permite iniciar una sesión identificada o invitada.
3. El mecanismo QR es funcional.
4. Permite capturar o seleccionar una imagen.
5. La imagen es procesada por el backend.
6. El proveedor simulado devuelve una clasificación.
7. La clasificación determina un contenedor.
8. El contenedor se muestra gráficamente.
9. Los clientes identificados reciben puntos.
10. Los invitados no acumulan puntos persistentes.
11. Es posible procesar más de un residuo.
12. Los principales errores son manejados.
13. Existen pruebas automatizadas.
14. Las pruebas pueden ejecutarse.
15. No existen credenciales reales en el repositorio.