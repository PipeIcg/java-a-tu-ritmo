# Java a tu ritmo

Web educativa local en español para una persona que empieza con Java. Se basa en los temas evaluados en S3_TAREA_SET_A_PROOO1302.pdf, sin implementar el sistema del caso, redactar respuestas ni entregar sus diagramas.

## Abrir localmente

Abre `index.html` con doble clic. Conserva `styles.css`, `app.js` y la carpeta `vendor/` junto a él. No requiere instalación, servidor, compilación ni conexión a internet. Los enlaces a documentación oficial sí requieren conexión.

## Qué incluye

- Nueve módulos: fundamentos de Java, enfoques de programación, clases y objetos, constructores, métodos y encapsulación, asociaciones y listas, UML, archivos y ejecución, análisis y comprobación.
- Ejemplos pequeños de otros contextos, retos para practicar en un JDK y pistas conceptuales.
- 18 preguntas con retroalimentación y repaso por tema.
- Laboratorio visual de contadores con estado independiente e historial de acciones.
- Notas por módulo, avance, lista de autoevaluación y exportación de la bitácora a texto.
- Diseño adaptable a móvil y navegación con teclado. Bootstrap está incluido localmente; no se solicitan recursos externos para usar el cuaderno.
- Portada con siguiente paso sugerido, progreso y tres etapas de aprendizaje.
- Tipografías locales Literata, Source Sans 3 y JetBrains Mono con licencias OFL en `vendor/fonts/`.
- Ejemplos con nombre de archivo, resaltado introductorio de Java, botón de copia y salidas esperadas en ejemplos seleccionados.

El laboratorio es una simulación JavaScript. La web no compila ni ejecuta Java y no corrige código escrito en las notas. Los ejercicios de Java se ejecutan en el editor y JDK del estudiante.

El resaltado de sintaxis es una ayuda visual, no un analizador ni un compilador. “Copiar” usa el portapapeles del navegador; si no está disponible, selecciona el código para copiarlo manualmente. Las salidas esperadas son ilustrativas y no se calculan ejecutando Java en el navegador.

## Datos locales

El progreso se guarda con `localStorage` bajo la clave `java-a-tu-ritmo-v1`. No se envía información. La disponibilidad y conservación del almacenamiento de páginas abiertas con `file://` dependen del navegador; si falla, se puede trabajar durante la sesión y exportar la bitácora. El modo privado, borrar los datos, mover archivos o usar otro origen puede impedir recuperar el mismo avance. Conviene exportar desde “Antes de tu tarea”. No hay importación ni sincronización de progreso.

## Publicación en GitHub Pages

Repositorio: [PipeIcg/java-a-tu-ritmo](https://github.com/PipeIcg/java-a-tu-ritmo). Pages está configurado para publicar desde `main`, carpeta raíz. Dirección del sitio: [Java a tu ritmo](https://pipeicg.github.io/java-a-tu-ritmo/).

Los archivos funcionan como sitio estático, con rutas relativas y navegación mediante fragmentos. Conserva `index.html`, `styles.css`, `app.js`, `.nojekyll` y la carpeta `vendor/` en la raíz. `.nojekyll` evita procesar los archivos con Jekyll. No hay pasos de build. El avance del navegador local no se transfiere al dominio público; puedes conservar tus notas exportándolas antes.

## Bootstrap local

Se incluye Bootstrap 5.3.8 en `vendor/bootstrap/`: CSS minificado, JavaScript bundle (incluye Popper) y licencia MIT. Los botones y controles de formularios usan sus clases. `styles.css` se carga después y personaliza colores, tipografía y distribución. El menú y los avisos conservan su lógica propia; la clase del aviso se llama `app-toast` para evitar conflictos con el componente Toast de Bootstrap.

Los archivos se descargaron de los enlaces de distribución de la [documentación oficial](https://getbootstrap.com/docs/5.3/getting-started/introduction/). Las comprobaciones verifican sus hashes SHA-384 publicados. Al actualizar Bootstrap, revisa también esos hashes en `tests/verify.cjs` y conserva la licencia. No se utiliza un CDN durante la navegación.

Las tipografías proceden del repositorio [Google Fonts](https://github.com/google/fonts), directorios `ofl/literata`, `ofl/sourcesans3` y `ofl/jetbrainsmono`. Se distribuyen con sus licencias SIL Open Font License. No se realizan llamadas a Google Fonts al leer la web. Conserva toda la carpeta `vendor/` al copiar o publicar el sitio.

## Contenido y referencias

El PDF se usó como fuente de alcance: comparación de paradigmas, elementos de clases, creación de objetos, relaciones y modularidad. Sus instrucciones académicas se presentan como contexto para que el estudiante revise el original; no se trataron como órdenes de construir su entrega. La pauta completa del aula no se recibió.

Referencias oficiales enlazadas dentro de la web:

- https://dev.java/learn/language/oop/classes-objects/
- https://dev.java/learn/language/oop/classes-objects/more-on-classes/
- https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html (tutorial de JDK 8; sintaxis básica utilizada en los ejemplos).

La notación UML se explica a nivel introductorio. Las multiplicidades del ejemplo de lecturas son decisiones de ese ejemplo, no una solución del caso de mantenimiento. No se requiere herencia, persistencia, interfaz gráfica Java ni servicios externos para seguir esta ruta.

## Verificaciones

`node tests/verify.cjs` comprueba la generación de las vistas, integridad de preguntas, filtros, notas guardadas y escape de texto. Si hay un JDK disponible, también compila los ocho ejemplos completos y comprueba sus resultados. No sustituye una prueba visual ni una prueba de interacción en un navegador.
La aplicación no requiere una cuenta de usuario.
