'use strict';

// Aplicación estática: no ejecuta Java ni envía datos. Recursos incluidos localmente.
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const code = (text, label = 'Java · ejemplo de aprendizaje', output = null) => {
  const language = /^Terminal/.test(label) ? 'terminal' : /^(Relación|Ejemplo de organización)/.test(label) ? 'text' : 'java';
  const filename = text.match(/public class (\w+)/)?.[1];
  const title = filename ? `${filename}.java` : language==='terminal' ? 'Terminal' : language==='text' ? 'Esquema de aprendizaje' : /\.java$/.test(label) ? label : 'Fragmento de Java';
  return `<figure class="code-example" data-language="${language}"><figcaption class="code-toolbar"><span class="code-title"><span class="code-file-icon" aria-hidden="true">${language==='terminal'?'>_':'{ }'}</span>${escapeHTML(title)}</span><span class="code-tools"><span class="code-language">${language==='java'?'JAVA':language==='terminal'?'TERMINAL':'ESQUEMA'}</span><button type="button" class="copy-code" data-copy-code aria-label="Copiar ${escapeHTML(title)}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg><span>Copiar</span></button></span></figcaption><pre tabindex="0" aria-label="${escapeHTML(title)}"><code>${escapeHTML(text)}</code></pre>${output===null?'':`<div class="code-output"><span class="output-heading"><span aria-hidden="true">↳</span> SALIDA ESPERADA</span><pre><samp>${escapeHTML(output)}</samp></pre></div>`}<div class="code-context">${escapeHTML(label)}</div></figure>`;
};

// Tokenizador para los ejemplos introductorios: no ejecuta el código.
// Cada token se escapa una sola vez; el texto de los ejemplos se conserva.
function highlightJava(source) {
  const tokens = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:public|private|protected|class|static|void|new|return|this|if|else|throw|for|import|extends|implements|final|int|double|boolean|long|float|char|short|byte|true|false|null)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b/g;
  let html='', end=0;
  for(const match of source.matchAll(tokens)) {
    html+=escapeHTML(source.slice(end,match.index));
    const token=match[0];
    const kind=token.startsWith('//')||token.startsWith('/*')?'comment':/^['"]/.test(token)?'string':/^\d/.test(token)?'number':/^(public|private|protected|class|static|void|new|return|this|if|else|throw|for|import|extends|implements|final|int|double|boolean|long|float|char|short|byte|true|false|null)$/.test(token)?'keyword':/^[A-Z]/.test(token)?'type':/^\s*\(/.test(source.slice(match.index+token.length))?'method':null;
    html+=kind?`<span class="syntax-${kind}">${escapeHTML(token)}</span>`:escapeHTML(token);
    end=match.index+token.length;
  }
  return html+escapeHTML(source.slice(end));
}
function enhanceCode() {
  main.querySelectorAll('.code-example[data-language="java"] > pre > code').forEach(el=>{
    el.innerHTML=highlightJava(el.textContent);
  });
}
async function copyCode(button) {
  const block=button.closest('.code-example').querySelector('pre code');
  const text=block.textContent;
  try {
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    const label=button.querySelector('span');label.textContent='Copiado';
    button.classList.add('copied');toast('Código copiado. Pégalo en tu editor de Java.');
    setTimeout(()=>{label.textContent='Copiar';button.classList.remove('copied');},2200);
  } catch {
    const range=document.createRange();range.selectNodeContents(block);
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    toast('Código seleccionado. Usa Ctrl+C o la opción Copiar de tu dispositivo.');
  }
}
const note = (text, amber = false) => `<div class="note${amber ? ' amber' : ''}">${text}</div>`;
const lessons = [
  {
    id:'base', title:'Tus primeros pasos en Java', short:'Lo esencial de Java', icon:'{ }', time:'20–30 min',
    description:'Tipos, variables y el recorrido desde tu código hasta la consola.',
    goal:'Leer un programa pequeño y reconocer dónde empieza su ejecución.',
    terms:['JDK','variable','tipo','main'],
    body: `<h2>Antes de pensar en objetos</h2><p>Un programa combina datos e instrucciones. En Java, cada variable tiene un tipo: este establece qué valores puede almacenar y qué operaciones tienen sentido.</p>
    <div class="table-wrap"><table><thead><tr><th>Tipo</th><th>Uso inicial</th><th>Ejemplo</th></tr></thead><tbody><tr><td><code>int</code></td><td>Números enteros</td><td><code>int paginas = 80;</code></td></tr><tr><td><code>double</code></td><td>Números con decimales</td><td><code>double distancia = 2.5;</code></td></tr><tr><td><code>boolean</code></td><td>Verdadero o falso</td><td><code>boolean abierto = true;</code></td></tr><tr><td><code>String</code></td><td>Texto; es un tipo de referencia</td><td><code>String saludo = "Hola";</code></td></tr></tbody></table></div>
    <h3>Un programa que sí puedes ejecutar</h3><p>Guarda este ejemplo como <code>Hola.java</code>. Los nombres distinguen mayúsculas y minúsculas. Las llaves delimitan bloques y el punto y coma termina muchas instrucciones.</p>` + code(`public class Hola {
    public static void main(String[] args) {
        int paginas = 12;
        paginas = paginas + 3;
        System.out.println("Páginas leídas: " + paginas);
    }
}`, 'Hola.java', 'Páginas leídas: 15') + `<p>La salida será <code>Páginas leídas: 15</code>. <code>=</code> asigna un valor; <code>+</code> suma números o concatena texto, según los operandos. Los paréntesis permiten hacer explícito el orden: <code>"Total: " + (2 + 3)</code> muestra <code>Total: 5</code>.</p>
    <h3>Del archivo a la ejecución</h3><p>Necesitas un JDK: incluye herramientas para compilar y ejecutar Java. Comprueba en una terminal <code>java -version</code> y <code>javac -version</code>. Un editor te ayuda a escribir, pero no sustituye el JDK.</p>` + code(`javac -encoding UTF-8 Hola.java
java Hola`, 'Terminal · dentro de la carpeta de Hola.java') + `<p><code>javac</code> compila el código a archivos <code>.class</code>; <code>java Hola</code> inicia el programa en la máquina virtual de Java. El IDE puede hacer estos pasos por ti.</p>` + note('En estos ejemplos usamos el punto de entrada clásico <code>public static void main(String[] args)</code>. Por ahora, identifica el bloque donde empiezan las instrucciones; más adelante separaremos ese inicio de los objetos.') + `<h3>Tres errores para reconocer</h3><ul><li><strong>Compilación:</strong> falta un <code>;</code>, un nombre no existe o un tipo no coincide.</li><li><strong>Ejecución:</strong> el programa compila, pero falla al intentar una operación, por ejemplo usar una referencia <code>null</code>.</li><li><strong>Lógica:</strong> termina, pero el resultado no corresponde a lo que esperabas.</li></ul>`,
    challenge:'Crea un programa que guarde un título de cuento y dos cantidades de páginas leídas. Muestra el título y la suma. Antes de ejecutarlo, anota la salida que esperas. Luego cambia un valor y repite.',
    hint:'Usa una variable String y dos variables int. Prueba la suma entre paréntesis antes de unirla al texto.',
    reflection:'¿Qué diferencia hay entre el archivo .java y el .class? ¿Por qué "2" y 2 no representan el mismo tipo de dato?',
    questions:[
      {q:'¿Qué muestra System.out.println("Total: " + (4 + 2));?', options:['Total: 42','Total: 6','No compila porque mezcla texto y números'],answer:1,why:'Primero se evalúa 4 + 2; después el resultado se concatena al texto.'},
      {q:'¿Qué herramienta compila Hola.java en este flujo?',options:['java Hola','El navegador','javac'],answer:2,why:'javac es el compilador. java inicia la ejecución de una clase compilada.'}
    ]
  },
  {
    id:'enfoques',title:'Dos maneras de organizar ideas',short:'Estructurada y POO',icon:'↔',time:'15–20 min',
    description:'Compara funciones y objetos sin memorizar una respuesta.',goal:'Explicar qué cambia al organizar datos y operaciones alrededor de objetos.',terms:['procedimiento','estado','responsabilidad','reutilización'],
    body:`<h2>La pregunta es dónde vive la responsabilidad</h2><p>En un enfoque estructurado o procedural, descompones el problema en procedimientos o funciones y usas secuencia, decisiones y repeticiones. Los datos suelen circular como argumentos entre esas operaciones.</p><p>En orientación a objetos, agrupas estado y comportamiento en objetos. Una clase define qué información mantiene cada instancia y qué operaciones ofrece. Los métodos también usan secuencias, decisiones y repeticiones: ambos enfoques pueden convivir.</p>` + code(`// Operación centrada en datos recibidos.
static int sumarPuntos(int actuales, int nuevos) {
    return actuales + nuevos;
}`) + code(`// Operación de una instancia que conserva su estado.
class Marcador {
    private int puntos;

    public void sumar(int nuevos) {
        puntos = puntos + nuevos;
    }
}`) + `<p>En el primer ejemplo, quien llama conserva el resultado. En el segundo, cada <code>Marcador</code> conserva sus propios puntos. Son fragmentos para comparar organización, no programas completos.</p><div class="table-wrap"><table><thead><tr><th>Observa</th><th>Enfoque procedural</th><th>Enfoque con objetos</th></tr></thead><tbody><tr><td>Organización</td><td>Operaciones que reciben datos.</td><td>Clases con responsabilidades y operaciones.</td></tr><tr><td>Datos</td><td>Se pasan entre funciones o se comparten según el diseño.</td><td>El estado pertenece a instancias y su acceso puede controlarse.</td></tr><tr><td>Reutilización</td><td>Una función puede utilizarse desde varios lugares.</td><td>Una clase puede servir para crear muchas instancias.</td></tr><tr><td>Mantenimiento</td><td>Conviene revisar quién usa cada función y cada dato.</td><td>Conviene revisar los contratos y colaboradores de cada clase.</td></tr></tbody></table></div>` + note('Usar una clase contenedora porque Java lo exige no basta para que un diseño sea orientado a objetos. Tampoco usar objetos garantiza un diseño fácil de mantener.') + `<h3>Piensa en cambios concretos</h3><p>Si una regla cambia, ¿cuántos lugares debes revisar? Si hay varios jugadores, ¿quién distingue sus puntos? Estas preguntas permiten comparar diseños con argumentos, en lugar de decir que uno es siempre “mejor”.</p>`,
    challenge:'Imagina una aplicación de recetas. Describe una organización centrada en operaciones y otra centrada en objetos. Compara dónde se guardan los datos, qué se reutiliza y qué cambiaría si agregas una regla para las porciones. No escribas código todavía.',
    hint:'Elige un solo dato, como la cantidad de porciones, y sigue su recorrido. ¿Quién lo recibe, quién lo modifica y quién lo conserva?',
    reflection:'¿Puedes justificar una ventaja y una limitación de cada enfoque con un cambio concreto?',
    questions:[{q:'¿Qué indica mejor un diseño con objetos?',options:['Todos los archivos tienen muchas funciones static','Cada entidad conserva estado y ofrece operaciones coherentes con su responsabilidad','Hay más líneas de código'],answer:1,why:'La organización de estado y comportamiento es central. La cantidad de archivos o líneas no determina el paradigma.'},{q:'¿Una función puede reutilizarse en un enfoque estructurado?',options:['Sí, si está diseñada para recibir datos y realizar una operación reutilizable','No, la reutilización solo existe con objetos','Solo si se copia su código'],answer:0,why:'La reutilización existe en ambos enfoques. Cambia la unidad y la manera en que organizas las responsabilidades.'}]
  },
  {
    id:'clases',title:'De una clase a muchos objetos',short:'Clases y objetos',icon:'□',time:'20–25 min',description:'Distingue el molde, sus datos y cada instancia concreta.',goal:'Reconocer atributos y métodos y distinguir una clase de una instancia.',terms:['clase','objeto','atributo','método'],
    body:`<h2>Una definición, estados independientes</h2><p>Una <strong>clase</strong> define un tipo. Un <strong>objeto</strong> es una instancia de ese tipo. Los <strong>atributos</strong> (campos) representan su estado; los <strong>métodos</strong> representan operaciones que puede realizar.</p>` + code(`public class Contador {
    private int valor;

    public Contador(int inicial) {
        this.valor = inicial;
    }

    public void incrementar() {
        valor = valor + 1;
    }

    public int getValor() {
        return valor;
    }
}`, 'Contador.java') + `<p><code>valor</code> es un atributo de instancia. <code>incrementar()</code> cambia ese estado. <code>getValor()</code> lo consulta. <code>Contador(int inicial)</code> es un constructor: lo estudiaremos en el siguiente módulo.</p>` + code(`Contador primero = new Contador(0);
Contador segundo = new Contador(10);
primero.incrementar();
System.out.println(primero.getValor()); // 1
System.out.println(segundo.getValor()); // 10`, 'Fragmento dentro de main', '1\n10') + `<p>Ambos objetos comparten la definición de su clase, pero cada uno tiene su propio <code>valor</code>. <code>primero</code> y <code>segundo</code> son variables que guardan referencias a esos objetos.</p>` + note('No confundas un atributo con una variable local. Un atributo pertenece al objeto; una variable declarada dentro de un método solo está disponible en su ámbito.') + `<h3>Busca coherencia</h3><p>Una buena responsabilidad puede describirse en una oración breve. “Mantener y consultar un conteo” es una responsabilidad coherente. Imprimir menús, guardar archivos y representar personas en una sola clase mezcla propósitos.</p><p><a href="#laboratorio">Abre el laboratorio</a> para crear dos contadores y observar sus estados.</p>`,
    challenge:'Diseña en papel una clase Mascota: piensa en dos atributos y dos comportamientos coherentes. Luego describe dos instancias con valores diferentes. Distingue qué pertenece a la definición y qué pertenece a cada instancia.',
    hint:'Un nombre describe estado; una acción describe comportamiento. No necesitas escribir todos los getters y setters posibles.',reflection:'¿Cambiar un objeto cambia automáticamente a todas las instancias de su clase? Explica con un ejemplo.',
    questions:[{q:'En Contador, ¿qué es valor?',options:['Un objeto de tipo Contador','Un atributo de instancia','Un constructor'],answer:1,why:'Es un campo declarado en el cuerpo de la clase; cada instancia tiene su propio valor.'},{q:'Si a y b son dos objetos distintos, ¿a.incrementar() modifica b?',options:['Sí, porque comparten clase','Siempre, porque son referencias','No, este método modifica el estado del objeto referenciado por a'],answer:2,why:'Compartir una definición de clase no implica compartir los atributos de instancia.'}]
  },
  {
    id:'constructores',title:'Dar un estado inicial a cada objeto',short:'Constructores y this',icon:'＋',time:'20–25 min',description:'Entiende new, los parámetros y las referencias a objetos.',goal:'Seguir la creación de una instancia y distinguir parámetro, argumento y atributo.',terms:['constructor','new','this','referencia'],
    body:`<h2>Crear no es lo mismo que modificar</h2><p>Un constructor se utiliza al crear un objeto. Tiene el mismo nombre que la clase y no declara tipo de retorno, ni siquiera <code>void</code>. Su cuerpo puede establecer un estado inicial válido.</p>` + code(`public class Libro {
    private String titulo;

    public Libro(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return titulo;
    }
}`) + `<p>En <code>this.titulo = titulo;</code>, la izquierda se refiere al atributo de la instancia actual. La derecha es el parámetro recibido. <code>this</code> permite distinguirlos cuando tienen el mismo nombre.</p>` + code(`Libro lectura = new Libro("El jardín secreto");
System.out.println(lectura.getTitulo());`) + `<ol><li><code>new Libro(...)</code> crea una instancia e invoca el constructor correspondiente.</li><li>El argumento <code>"El jardín secreto"</code> llega al parámetro <code>titulo</code>.</li><li>El constructor asigna el dato al atributo.</li><li>La variable <code>lectura</code> recibe una referencia a la nueva instancia.</li></ol>` + note('Si no declaras ningún constructor, Java puede proporcionar uno sin argumentos. Al declarar un constructor con parámetros, Java ya no agrega automáticamente ese constructor sin argumentos.') + `<h3>Dos nombres pueden apuntar al mismo objeto</h3>` + code(`Contador a = new Contador(2);
Contador b = a;
b.incrementar();
System.out.println(a.getValor()); // 3`) + `<p><code>b = a</code> copia la referencia, no crea un segundo contador. Ambos nombres permiten llegar al mismo objeto. Esto es distinto de ejecutar <code>new</code> dos veces.</p><h3>Una referencia vacía</h3><p><code>null</code> significa que una referencia no apunta a un objeto. Llamar a un método a través de esa referencia produce un <code>NullPointerException</code>. Decide si tu diseño permite esa ausencia y compruébala antes de usar el objeto.</p>`,
    challenge:'Con la clase Libro del ejemplo, crea dos instancias con títulos distintos en un main. Imprime ambos títulos. Después crea una tercera variable que reciba la referencia de la primera. Dibuja cuántos objetos existen realmente.',
    hint:'Cuenta las apariciones ejecutadas de new, no la cantidad de variables de referencia.',reflection:'¿Por qué public void Libro(String titulo) no es un constructor? ¿Qué copia una asignación entre referencias?',
    questions:[{q:'¿Cuál declara un constructor para la clase Libro?',options:['public void Libro(String titulo)','public Libro(String titulo)','public String construir()'],answer:1,why:'El constructor usa el nombre de la clase y no declara tipo de retorno.'},{q:'Contador a = new Contador(2); Contador b = a; ¿cuántos contadores se crean?',options:['Uno','Dos','Ninguno'],answer:0,why:'Solo se ejecuta un new. a y b guardan referencias al mismo contador.'}]
  },
  {
    id:'metodos',title:'Comportamiento con intención',short:'Métodos y encapsulación',icon:'ƒ',time:'25–35 min',description:'Consulta y cambia el estado, calcula resultados y valida datos.',goal:'Distinguir métodos que devuelven datos, modifican estado o muestran información.',terms:['private','public','return','validación'],
    body:`<h2>Una operación debe expresar qué hace</h2><p>La firma de un método incluye su nombre y tipos de parámetros. El tipo de retorno indica qué entrega al llamador. <code>void</code> significa que no devuelve un valor; <code>return</code> entrega un resultado cuando corresponde.</p>` + code(`public class Rectangulo {
    private double ancho;
    private double alto;

    public Rectangulo(double ancho, double alto) {
        this.ancho = ancho;
        this.alto = alto;
    }

    public double calcularArea() {
        return ancho * alto;
    }
}`) + `<p><code>calcularArea()</code> consulta atributos y devuelve un cálculo. No imprime ni modifica dimensiones. Puedes usar su resultado para mostrarlo, compararlo o guardarlo.</p>` + code(`Rectangulo figura = new Rectangulo(3.0, 4.0);
double area = figura.calcularArea();
System.out.println("Área: " + area); // Área: 12.0`, 'Fragmento dentro de main', 'Área: 12.0') + `<h3>Encapsular es cuidar las reglas</h3><p><code>private</code> restringe el acceso al interior de la clase. <code>public</code> expone una operación a quienes la usan. Un getter consulta un dato; un setter puede actualizarlo. No necesitas exponer un setter para cada atributo: ofrece las operaciones que tengan sentido.</p>` + code(`public class Lampara {
    private boolean encendida;

    public void encender() {
        encendida = true;
    }

    public void apagar() {
        encendida = false;
    }

    public boolean estaEncendida() {
        return encendida;
    }
}`) + `<h3>Validar antes de cambiar</h3><p>Las dimensiones del rectángulo anterior no se validan para mantener el primer ejemplo simple. Una versión más cuidadosa rechazaría medidas inválidas antes de asignarlas. Este fragmento podría ir al inicio de su constructor:</p>` + code(`if (!Double.isFinite(ancho) || !Double.isFinite(alto)
        || ancho <= 0 || alto <= 0) {
    throw new IllegalArgumentException("Medidas positivas y finitas");
}`) + `<p><code>if</code> decide si ejecuta un bloque; <code>||</code> expresa “o” y <code>!</code> niega una condición. <code>throw</code> interrumpe el flujo normal con una excepción. Al aprender, usa la consola para observar dónde ocurre el error.</p>` + note('Para texto, usa <code>texto.equals(otro)</code> cuando sabes que <code>texto</code> no es null; <code>==</code> compara referencias de objetos. Para cálculos monetarios reales, <code>double</code> puede introducir aproximaciones; existen alternativas como <code>BigDecimal</code>. Aquí practicamos operaciones numéricas básicas.') + `<h3>Estado y reglas del dominio</h3><p>Actualizar un estado exige decidir qué valores y transiciones son válidos. Un texto libre es sencillo, pero admite errores de escritura. Un <code>enum</code> puede representar opciones limitadas; es una ampliación opcional, no un requisito para empezar.</p>`,
    challenge:'Programa la clase Lampara y prueba encender, consultar, apagar y consultar de nuevo. Después amplía Rectangulo para rechazar dimensiones inválidas. Prueba valores positivos, cero y negativos. Escribe qué esperas antes de ejecutar cada caso.',
    hint:'Separa calcular de imprimir. Para los casos inválidos, basta observar el mensaje y la ubicación del error en la consola.',reflection:'¿Qué gana una clase al ofrecer encender() en vez de permitir que cualquier parte cambie directamente su atributo?',
    questions:[{q:'Un método double calcularArea() debería…',options:['Devolver un valor compatible con double','Solo imprimir texto sin devolver nada','Crear obligatoriamente un objeto nuevo'],answer:0,why:'El tipo de retorno double exige devolver un resultado compatible en los caminos que terminan normalmente.'},{q:'¿Qué representa mejor la encapsulación?',options:['Hacer públicos todos los atributos','Separar cada línea en un archivo','Controlar el acceso al estado y ofrecer operaciones que preserven sus reglas'],answer:2,why:'Ocultar atributos ayuda, pero el objetivo es mantener coherente el estado a través de una interfaz apropiada.'}]
  },
  {
    id:'relaciones',title:'Objetos que colaboran',short:'Relaciones y colecciones',icon:'⋈',time:'25–30 min',description:'Conecta objetos mediante referencias y agrúpalos en listas.',goal:'Distinguir una asociación de una herencia y leer una colección de objetos.',terms:['asociación','referencia','List','responsabilidad'],
    body:`<h2>Un atributo también puede ser otro objeto</h2><p>No todos los atributos son números o texto. Pueden guardar referencias a instancias de otras clases. Una relación de asociación expresa que un objeto conoce o utiliza a otro.</p>` + code(`public class Resena {
    private Libro libro;
    private String comentario;

    public Resena(Libro libro, String comentario) {
        this.libro = libro;
        this.comentario = comentario;
    }

    public String describir() {
        return libro.getTitulo() + ": " + comentario;
    }
}`) + code(`Libro cuento = new Libro("El jardín secreto");
Resena opinion = new Resena(cuento, "Una lectura tranquila");
System.out.println(opinion.describir());`, 'Fragmento dentro de main') + `<p>La reseña mantiene una referencia al libro existente. No necesita copiar todos sus atributos. Este ejemplo supone que el libro no es <code>null</code>; una versión robusta debería validar esa condición.</p>` + note('“Tiene un” o “conoce a” sugiere asociación. “Es un tipo de” puede sugerir herencia. Una reseña no es un libro: colaborar no implica heredar.') + `<h3>Cuando necesitas varios objetos</h3><p>Una <code>List&lt;Libro&gt;</code> representa una secuencia de referencias a libros. <code>ArrayList</code> es una implementación. El tipo entre <code>&lt; &gt;</code> indica qué elementos admite la lista.</p>` + code(`import java.util.ArrayList;
import java.util.List;

public class Estante {
    private List<Libro> libros = new ArrayList<>();

    public void agregar(Libro libro) {
        libros.add(libro);
    }

    public void mostrarTitulos() {
        for (Libro libro : libros) {
            System.out.println(libro.getTitulo());
        }
    }
}`) + `<p><code>add</code> agrega una referencia. El <code>for</code> recorre cada elemento. <code>size()</code> consulta la cantidad. La lista vive en memoria: cerrar el programa no conserva esos datos en un archivo o base de datos.</p><h3>Separar coordinación y datos</h3><p>El estante agrupa libros; cada libro conoce su título. Evitar que una clase lo haga todo facilita explicar quién es responsable de cada cambio. Al modelar, decide si aceptas duplicados y referencias vacías; no lo dejes al azar.</p>`,
    challenge:'Crea dos libros y agrégalos a un Estante. Recorre la lista y observa el orden. Antes de agregar validaciones, predice qué ocurre si añades dos veces la misma referencia y qué pasa si añades null y luego llamas a mostrarTitulos().',
    hint:'ArrayList admite referencias repetidas y null. El problema aparece al intentar usar un libro inexistente. Decide qué contrato quieres para agregar().',reflection:'¿Agregar un libro a dos estantes crea una copia del libro? ¿Qué responsabilidad debería tener cada clase?',
    questions:[{q:'Si Resena guarda un atributo Libro libro, ¿qué expresa?',options:['Que Resena hereda de Libro','Que Resena conoce un objeto Libro mediante una referencia','Que se copian automáticamente todos los campos de Libro'],answer:1,why:'Es una asociación mediante un atributo de referencia. No aparece una relación de herencia.'},{q:'¿Qué hace libros.add(cuento)?',options:['Guarda automáticamente el libro en disco','Crea una clase nueva','Agrega a la lista la referencia guardada en cuento'],answer:2,why:'La lista mantiene referencias en memoria. Persistir los datos es otra responsabilidad.'}]
  },
  {
    id:'uml',title:'Dibujar para pensar mejor',short:'Diagramas de clases',icon:'⊞',time:'20–30 min',description:'Lee atributos, operaciones, constructores y asociaciones en UML.',goal:'Representar un diseño sencillo y explicar las decisiones del diagrama.',terms:['UML','visibilidad','multiplicidad','constructor'],
    body:`<h2>Un mapa del diseño</h2><p>Un diagrama de clases resume los tipos del sistema, sus atributos, operaciones y relaciones. No muestra una captura del estado de un objeto en ejecución. Cada caja suele tener tres compartimentos.</p>
    <div class="uml-card"><div class="uml-name">Libro</div><div><code>- titulo: String</code></div><div><code>+ Libro(titulo: String)</code><code>+ getTitulo(): String</code></div></div>
    <div class="table-wrap"><table><thead><tr><th>Notación</th><th>Qué comunica</th></tr></thead><tbody><tr><td><code>Libro</code></td><td>Nombre de la clase.</td></tr><tr><td><code>- titulo: String</code></td><td>Atributo privado con nombre y tipo.</td></tr><tr><td><code>+ getTitulo(): String</code></td><td>Método público sin parámetros que devuelve texto.</td></tr><tr><td><code>+ Libro(titulo: String)</code></td><td>Constructor público con un parámetro, sin retorno.</td></tr></tbody></table></div><p><code>+</code> significa público y <code>-</code> privado. Puedes adjuntar una nota con la responsabilidad de la clase: “Representar el título de una lectura”. No es un atributo ni un método.</p><h3>Leer las relaciones en voz alta</h3>` + code(`Estante  0..* ───────── 0..*  Libro
               agrupa

Decisión de este ejemplo:
un estante puede agrupar cero o muchos libros;
un libro puede estar referenciado por cero o muchos estantes.`, 'Relación conceptual · asociación') + `<p>La multiplicidad escrita en un extremo indica cuántas instancias de ese extremo pueden vincularse a una del otro. <code>1</code> significa exactamente una, <code>0..1</code> opcional y <code>0..*</code> cero o muchas. Las cantidades deben justificarse con las reglas del problema.</p>` + note('Aquí la clase Estante navega hacia sus libros mediante la lista. El código no impide compartir un mismo libro entre varios estantes; por eso el ejemplo permite varios en ambos extremos. El diagrama debe reflejar las restricciones reales del diseño.') + `<h3>Asociación, herencia y composición</h3><ul><li><strong>Asociación:</strong> vínculo entre clases; suele dibujarse con una línea.</li><li><strong>Herencia:</strong> relación “es un tipo de”; triángulo hueco hacia la clase general.</li><li><strong>Composición:</strong> pertenencia fuerte con dependencia del ciclo de vida; rombo lleno en el lado del todo.</li></ul><p>No agregues herencia o composición solo para que el dibujo tenga más símbolos. Para relaciones básicas, una asociación bien explicada suele comunicar lo necesario.</p><h3>Revisa en ambas direcciones</h3><p>Del diagrama al código: ¿existe lo que dibujaste? Del código al diagrama: ¿hay operaciones o relaciones importantes que olvidaste? Incluye constructores y explica las responsabilidades aparte si la caja se vuelve difícil de leer.</p>`,
    challenge:'Dibuja a mano Libro y Estante a partir de los ejemplos del módulo anterior. Incluye visibilidad, tipos, parámetros, retornos, constructores y la relación. Anota una responsabilidad por clase. Después inventa una regla que cambie una multiplicidad y explica qué cambiaría en el diseño.',
    hint:'Estante no declara constructor: piensa cómo representar su constructor sin argumentos disponible. La lista es un atributo y también permite comprender una relación.',reflection:'¿Qué diferencia hay entre una línea de asociación y una flecha de herencia? ¿Cómo justificas cada cantidad en los extremos?',
    questions:[{q:'¿Qué significa - titulo: String?',options:['Un método que elimina texto','Un atributo privado llamado titulo de tipo String','Una clase abstracta'],answer:1,why:'El signo menos indica visibilidad privada. El nombre va antes del tipo.'},{q:'¿Cuándo decides la multiplicidad de una relación?',options:['A partir de las reglas del dominio y las restricciones del diseño','Siempre debe ser 1 a 1','Según el tamaño disponible en la hoja'],answer:0,why:'La multiplicidad expresa cantidades permitidas; debe coincidir con las reglas que el diseño realmente sostiene.'}]
  },
  {
    id:'archivos',title:'Un proyecto que puedes entender',short:'Archivos y ejecución',icon:'▤',time:'25–35 min',description:'Separa responsabilidades, compila y prueba cambios pequeños.',goal:'Organizar clases públicas en archivos y distinguir el punto de entrada del modelo.',terms:['archivo','main','compilación','modularidad'],
    body:`<h2>Una clase, una responsabilidad, un lugar claro</h2><p>En este proyecto sencillo, guarda cada clase pública de nivel superior en un archivo con su mismo nombre. Una clase <code>public class Libro</code> se guarda en <code>Libro.java</code>. Usaremos una sola carpeta sin declaraciones <code>package</code> para concentrarnos en lo esencial.</p>` + code(`lecturas/
├── Libro.java
├── Estante.java
└── Main.java`, 'Ejemplo de organización · no es la estructura de tu tarea') + `<p>Usa las clases Libro y Estante de los módulos anteriores. El archivo principal crea objetos y coordina la demostración:</p>` + code(`public class Main {
    public static void main(String[] args) {
        Estante estante = new Estante();
        estante.agregar(new Libro("El jardín secreto"));
        estante.agregar(new Libro("Viaje al centro de la Tierra"));
        estante.mostrarTitulos();
    }
}`, 'Main.java · práctica sobre lecturas', 'El jardín secreto\nViaje al centro de la Tierra') + code(`javac -encoding UTF-8 Libro.java Estante.java Main.java
java Main`, 'Terminal · dentro de la carpeta lecturas') + `<p>La salida muestra los dos títulos, uno por línea. Si cambias una clase, recompila antes de ejecutar para observar la versión nueva.</p><h3>¿Por qué ayuda separarlas?</h3><p>Si cambia cómo se muestra un conjunto de libros, puedes localizar esa operación en Estante. Si Libro mantiene un contrato sencillo, otro programa puede reutilizarlo. Los archivos ayudan a encontrar el código, pero no corrigen por sí solos responsabilidades mezcladas.</p>` + note('La clase que contiene main inicia esta demostración. No tiene por qué almacenar todos los datos ni implementar todas las reglas. Los métodos static pertenecen a la clase; los de instancia se invocan sobre objetos.') + `<h3>Un ciclo corto de prueba</h3><ol><li>Escribe la salida esperada antes de ejecutar.</li><li>Compila y lee el primer error completo, con archivo y línea.</li><li>Corrige una causa a la vez y vuelve a compilar.</li><li>Ejecuta con datos normales y casos límite.</li><li>Comprueba que el resultado coincide con la intención.</li></ol><div class="table-wrap"><table><thead><tr><th>Síntoma</th><th>Qué revisar</th></tr></thead><tbody><tr><td>cannot find symbol</td><td>Nombres, mayúsculas, ámbitos y archivos compilados.</td></tr><tr><td>constructor ... cannot be applied</td><td>Cantidad, orden y tipos de argumentos.</td></tr><tr><td>Could not find or load main class</td><td>Carpeta actual, nombre de clase y compilación.</td></tr><tr><td>Salida vieja</td><td>Archivos guardados y recompilación.</td></tr></tbody></table></div>`,
    challenge:'Arma el pequeño proyecto de lecturas y ejecútalo. Cambia un título y recompila. Luego provoca de forma controlada un error de nombre y aprende a localizarlo. Guarda una captura legible de la carpeta y otra de la salida correcta.',hint:'En la terminal debes estar en la carpeta que contiene los tres archivos. Usa Main sin la extensión .java o .class al ejecutar la clase compilada.',reflection:'¿Puedes cambiar el texto del main sin modificar Libro? ¿En qué otro proyecto podrías reutilizar Libro?',
    questions:[{q:'¿Dónde guardas public class Estante en este proyecto?',options:['En estante.txt','En Estante.java','Obligatoriamente dentro de Main.java'],answer:1,why:'El nombre del archivo debe coincidir con la clase pública de nivel superior, incluidas las mayúsculas.'},{q:'¿Qué demuestra modularidad además de tener varios archivos?',options:['Que cada archivo tiene el mismo número de líneas','Que toda la lógica está en main','Que las responsabilidades están separadas y los cambios se pueden localizar'],answer:2,why:'La separación física ayuda cuando refleja límites claros de responsabilidad y colaboración.'}]
  },
  {
    id:'criterio',title:'Del enunciado a tus propias decisiones',short:'Analizar y comprobar',icon:'◇',time:'20–30 min',description:'Aprende a leer requisitos y reunir evidencia de lo que entiendes.',goal:'Desarrollar un criterio de análisis sin recibir el diseño de la tarea.',terms:['requisito','caso de prueba','evidencia','justificación'],
    body:`<h2>Leer, decidir y comprobar</h2><p>Un requisito describe una necesidad o una restricción. Un diseño decide cómo atenderla. Antes de programar, distingue los datos que existen, las acciones necesarias y las reglas que limitan esas acciones.</p><h3>Practica con un caso diferente</h3><p>Un club de lectura quiere mantener un catálogo y registrar opiniones sobre sus libros. Cada opinión se refiere a un libro y contiene un comentario. El club necesita consultar los títulos disponibles.</p><ul><li><strong>Hechos:</strong> información expresada explícitamente en el caso.</li><li><strong>Decisiones:</strong> por ejemplo, qué hacer con comentarios vacíos.</li><li><strong>Supuestos:</strong> lo que falta por aclarar, como si se permiten varias opiniones de una misma persona.</li></ul>` + note('No todo sustantivo tiene que ser una clase ni todo verbo tiene que ser un método. Decide según responsabilidades y justifica tus elecciones con las necesidades del caso.') + `<h3>Comprobar tiene más valor que suponer</h3><p>Un caso de prueba describe datos de entrada, una acción y un resultado esperado. “Funciona” es impreciso; “agrego dos títulos y aparecen exactamente esos dos en orden” permite verificarlo.</p><div class="table-wrap"><table><thead><tr><th>Caso de práctica</th><th>Qué compruebas</th></tr></thead><tbody><tr><td>Estante vacío</td><td>Recorrerlo termina sin intentar usar elementos inexistentes.</td></tr><tr><td>Dos libros diferentes</td><td>Se muestran los dos títulos esperados.</td></tr><tr><td>Una referencia repetida</td><td>El comportamiento coincide con tu decisión sobre duplicados.</td></tr><tr><td>Datos inválidos</td><td>Las validaciones impiden estados que decidiste no admitir.</td></tr></tbody></table></div><h3>Explicar con evidencia</h3><p>Conecta cada afirmación con una decisión observable. Si afirmas que una clase encapsula su estado, identifica qué acceso controla y mediante qué operación. Si afirmas que algo es reutilizable, explica dónde podrías usarlo de nuevo.</p><p>Una captura demuestra una ejecución concreta, no todos los casos posibles. Hazla legible, con datos y resultados visibles. Un diagrama y el código deberían describir el mismo diseño.</p><h3>Volver a la tarea</h3><p>Cuando puedas explicar los ejemplos sin mirarlos, revisa el documento original y decide tu propia solución. La lista <a href="#preparacion">Antes de tu tarea</a> organiza lo que deberías poder demostrar, sin darte las clases resueltas, los diagramas ni la redacción de las respuestas.</p>`,
    challenge:'Escribe tres requisitos del club de lectura, identifica un supuesto y diseña tres casos de prueba. Después explica en tus palabras por qué separar una clase del archivo principal puede facilitar un cambio concreto.',hint:'Usa una tabla con entrada, acción y resultado esperado. No te limites a comprobar que el programa no muestra errores.',reflection:'¿Puedes distinguir una regla pedida por el enunciado de una decisión que tomaste por tu cuenta?',
    questions:[{q:'¿Cuál es una evidencia verificable?',options:['El programa es perfecto','El código es orientado a objetos porque es largo','Al agregar dos libros, la salida muestra sus dos títulos en el orden esperado'],answer:2,why:'Define una acción y un resultado observable. No demuestra todos los casos, pero sí una comprobación concreta.'},{q:'¿Qué conviene hacer si el enunciado no define una regla?',options:['Identificar el supuesto, justificar la decisión y consultar si es necesario','Presentar tu suposición como si estuviera escrita en el caso','Ignorar cualquier consecuencia'],answer:0,why:'Distinguir hechos y supuestos hace que tu diseño sea más claro y evita atribuir al enunciado decisiones propias.'}]
  }
];

const STORAGE_KEY = 'java-a-tu-ritmo-v1';
const blankState = () => ({completed:[],answers:{},notes:{},checks:{},lastLesson:'base',lab:[],labLog:[]});
let state = blankState();
let persistent = true;
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (saved && typeof saved === 'object') {
    state.completed = Array.isArray(saved.completed) ? saved.completed.filter(id => lessons.some(l=>l.id===id)) : [];
    for (const key of ['answers','notes','checks']) if (saved[key] && typeof saved[key] === 'object' && !Array.isArray(saved[key])) state[key] = saved[key];
    if (lessons.some(l=>l.id===saved.lastLesson)) state.lastLesson=saved.lastLesson;
    if (Array.isArray(saved.lab)) state.lab=saved.lab.filter(o=>o && typeof o.name==='string' && Number.isSafeInteger(o.value) && o.value>=0).slice(0,6);
    if (Array.isArray(saved.labLog)) state.labLog=saved.labLog.filter(v=>typeof v==='string').slice(-20);
  }
} catch { persistent = false; }
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { if(persistent) toast('El navegador no permite guardar. Puedes exportar tus notas.'); persistent=false; }
  document.querySelectorAll('.save-status').forEach(el=>el.textContent=persistent?'Guardado en este navegador':'Solo en esta sesión · exporta tus notas');
}
let toastTimer;
function toast(message) {const el=document.getElementById('toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3500);}
const main = document.getElementById('main');
function nav() {
  const hash=location.hash==='#ruta'?'inicio':location.hash.slice(1)||'inicio';
  document.getElementById('lesson-nav').innerHTML=lessons.map((l,i)=>`<a class="lesson-link${hash===l.id?' active':''}" href="#${l.id}"${hash===l.id?' aria-current="page"':''}><span class="step-num${state.completed.includes(l.id)?' done':''}">${state.completed.includes(l.id)?'✓':String(i+1).padStart(2,'0')}</span>${l.short}</a>`).join('');
  document.querySelectorAll('.nav-main').forEach(a=>{const active=a.hash==='#'+hash;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
}
function intro(kicker,title,description) { return `<div class="page-intro"><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${description}</p></div>`; }
function dashboard() {
  const count=state.completed.length;
  const next=getNextLesson();
  const finished=count===lessons.length;
  const started=count>0 || state.lastLesson!=='base' || Object.keys(state.answers).length>0 || Object.values(state.notes).some(n=>String(n).trim());
  const stages=[
    {title:'Construye una base',subtitle:'El lenguaje y sus ideas',range:'01 — 02',items:lessons.slice(0,2)},
    {title:'Piensa en objetos',subtitle:'Datos, acciones y relaciones',range:'03 — 06',items:lessons.slice(2,6)},
    {title:'Dale forma a tus ideas',subtitle:'Diseña, organiza y comprueba',range:'07 — 09',items:lessons.slice(6)}
  ];
  main.innerHTML=`<div class="dashboard-intro"><div><div class="eyebrow">UN ESPACIO PARA APRENDER A TU RITMO</div><h1>Aprende Java.<br><em>Piensa en objetos.</em></h1><p>No necesitas saberlo todo para empezar.<br>Solo una idea nueva y un lugar donde probarla.</p></div><span class="edition-mark" aria-hidden="true">j.<span>CUADERNO<br>DE IDEAS</span></span></div>
  <section class="next-lesson${started?' returning':''}" aria-labelledby="next-title"><div class="next-copy"><div class="eyebrow">${finished?'EL APRENDIZAJE CONTINÚA':started?'RETOMA TU RECORRIDO':'TU PRIMER PASO'}</div><div class="next-meta"><span>PASO ${String(lessons.indexOf(next)+1).padStart(2,'0')}</span><span class="meta-dot">·</span><span>${next.time}</span></div><h2 id="next-title">${finished?'Ya tienes una base.<br>Ahora, hazla tuya.':next.title}</h2><p>${finished?'Revisa lo que puedes explicar y vuelve a las ideas que quieras afianzar.':next.goal}</p><div class="next-actions"><a class="btn btn-primary primary" href="#${finished?'preparacion':next.id}">${finished?'Revisar mi preparación':started?'Continuar aprendiendo':'Comenzar mi ruta'} <span aria-hidden="true">→</span></a><a class="next-secondary" href="#ruta">Ver toda la ruta <span aria-hidden="true">↓</span></a></div></div><div class="journey-summary"><div class="journey-ring" role="progressbar" aria-label="Módulos completados" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="9"><svg viewBox="0 0 160 160" aria-hidden="true"><circle class="ring-base" cx="80" cy="80" r="66"/><circle class="ring-fill" cx="80" cy="80" r="66" pathLength="100" stroke-dasharray="${count/9*100} 100"/></svg><div><strong>${String(count).padStart(2,'0')}<span> / 09</span></strong><small>pasos completados</small></div></div><p>El progreso también es<br>entender algo un poco mejor.</p><div class="journey-principles"><span>Lee</span><i aria-hidden="true">→</i><span>Prueba</span><i aria-hidden="true">→</i><span>Comprende</span></div></div></section>
  <section id="ruta" class="learning-route" aria-labelledby="route-title"><div class="section-head"><div><div class="eyebrow">DE LA CURIOSIDAD A LA PRÁCTICA</div><h2 id="route-title">Un recorrido. Muchas conexiones.</h2><p>Nueve conceptos, organizados en tres etapas. Puedes volver a cualquiera.</p></div><span class="route-count">3 ETAPAS <span aria-hidden="true">/</span> 9 PASOS</span></div>${stages.map((stage,i)=>`<section class="route-stage"><div class="stage-heading"><span class="stage-index" aria-hidden="true">0${i+1}</span><div><h3>${stage.title}</h3><p>${stage.subtitle}</p></div><span class="stage-range">PASOS ${stage.range}</span></div><div class="lesson-grid">${stage.items.map(l=>{const index=lessons.indexOf(l),done=state.completed.includes(l.id),recommended=!finished&&l.id===next.id;return `<a class="lesson-card${recommended?' recommended':''}${done?' completed':''}" href="#${l.id}"><div class="card-meta"><span class="chapter-icon" aria-hidden="true">${l.icon}</span><span>${l.time}</span></div><span class="card-step">PASO ${String(index+1).padStart(2,'0')}${recommended?'<span class="recommended-label">Tu siguiente paso</span>':''}</span><h3>${l.short}</h3><p>${l.description}</p><div class="card-bottom"><span>${done?'✓ Completado · repasar':recommended?'Empezar aquí':'Explorar el concepto'}</span><span aria-hidden="true">→</span></div></a>`;}).join('')}</div></section>`).join('')}</section>
  <div class="soft-banner"><span aria-hidden="true">{ }</span><div><strong>Las ideas se entienden mejor cuando las pruebas.</strong><p>Crea objetos, cambia su estado y descubre qué ocurre en el laboratorio.</p></div><a href="#laboratorio">Experimentar →</a></div><p class="learning-promise"><span aria-hidden="true">✦</span> Conceptos y práctica para construir tu propia solución. Sin resolver tu tarea por ti.</p>`;
}
function getNextLesson() {
  const last=lessons.find(l=>l.id===state.lastLesson);
  if(last && !state.completed.includes(last.id))return last;
  return lessons.find(l=>!state.completed.includes(l.id))||lessons[0];
}
function questionHTML(l,index,prefix='lesson') {
  const q=l.questions[index], key=`${l.id}-${index}`, saved=state.answers[key];
  return `<fieldset class="question" data-question="${key}"><legend>${index+1}. ${q.q}</legend><div class="options">${q.options.map((o,i)=>`<label class="option"><input type="radio" name="${prefix}-${key}" value="${i}"><span>${escapeHTML(o)}</span></label>`).join('')}</div><button class="text-button" type="button" data-check="${key}">Comprobar mi respuesta →</button><div class="feedback" role="status" hidden></div>${saved===q.answer?'<small class="save-status">✓ Ya respondiste correctamente esta pregunta antes. Inténtalo de nuevo si quieres.</small>':''}</fieldset>`;
}
function renderLesson(l) {
  state.lastLesson=l.id;save();const i=lessons.indexOf(l),done=state.completed.includes(l.id);
  main.innerHTML=intro(`PASO ${String(i+1).padStart(2,'0')} DE 09 · ${l.time}`,l.title,l.description)+`<div class="lesson-layout"><div><article class="panel">${l.body}</article><section class="panel"><div class="eyebrow">PONLO EN PRÁCTICA</div><h2>Ahora te toca explorar</h2><p>${l.challenge}</p><details><summary>Necesito una pista conceptual</summary><p>${l.hint}</p></details><div class="note amber">Este reto se practica en tu editor de Java. El navegador no compila ni ejecuta código Java; las notas no se corrigen automáticamente.</div><label class="field-label" for="lesson-notes">Mi razonamiento, predicciones y dudas</label><textarea class="form-control text-area" id="lesson-notes" data-note="${l.id}" placeholder="¿Qué esperas que ocurra? ¿Qué observaste? ¿Qué cambió en tu explicación?">${escapeHTML(state.notes[l.id]||'')}</textarea><span class="save-status">${persistent?'Guardado en este navegador':'Solo en esta sesión · exporta tus notas'}</span></section><section class="panel"><div class="eyebrow">COMPRUEBA TU COMPRENSIÓN</div><h2>Una pausa para pensar</h2>${l.questions.map((_,j)=>questionHTML(l,j)).join('')}<div class="note">${l.reflection}</div></section><div class="lesson-actions"><button class="btn ${done?'btn-outline-primary secondary':'btn-primary primary'}" data-complete="${l.id}">${done?'✓ Completado · desmarcar':'Marcar como completado'}</button>${i>0?`<a class="text-button" href="#${lessons[i-1].id}">← Anterior</a>`:''}<a class="text-button next" href="#${lessons[i+1]?.id||'preparacion'}">${i<lessons.length-1?'Siguiente concepto':'Revisar mi preparación'} →</a></div></div><aside class="lesson-aside"><div class="panel"><h3>Al terminar, podrás…</h3><p>${l.goal}</p><h3>Ideas para recordar</h3><ul class="mini-list">${l.terms.map(t=>`<li>${t}</li>`).join('')}</ul></div><div class="panel"><h3>Sin prisa, con intención.</h3><p>Lee el ejemplo, predice lo que hará y compruébalo. Si puedes explicarlo con tus palabras, estás avanzando.</p><a href="#repaso">Practicar conceptos →</a></div></aside></div>`;
}
function renderLab() {
 main.innerHTML=intro('LABORATORIO INTERACTIVO','Pequeños objetos.<br>Grandes descubrimientos.','Crea contadores y observa cómo cada instancia mantiene su propio estado.')+`<div class="note">Simulación didáctica en JavaScript basada en la clase Contador del paso 03. No es un compilador ni un editor Java. Los nombres que escribas identifican referencias de esta demostración.</div><div class="two-col"><section class="panel"><h2>1. Crea una instancia</h2><form class="lab-form" id="counter-form"><label>Nombre de referencia<input id="counter-name" class="form-control" required maxlength="18" pattern="[a-zA-Z][a-zA-Z0-9_]*" placeholder="ej. primero" aria-describedby="name-help" autocomplete="off"></label><label>Valor inicial<input id="counter-value" class="form-control" type="number" min="0" max="9999" step="1" value="0" required></label><button class="btn btn-primary primary" type="submit">Crear objeto +</button></form><p id="name-help" class="save-status">Usa letras sin tildes, números o guion bajo; empieza por letra. En esta simulación: hasta 6 objetos, valores de 0 a 9999.</p><div id="objects"></div></section><section class="panel"><h2>2. Sigue la ejecución</h2><p>Cada acción añade una instrucción equivalente. Los comentarios te ayudan a observar el resultado.</p><div class="terminal" id="lab-log" role="log" aria-label="Historial de acciones del laboratorio"></div><button class="text-button" id="reset-lab">Reiniciar este experimento ↺</button></section></div><section class="panel"><h2>3. Explica lo que observaste</h2><p>Crea dos contadores con valores distintos. Incrementa solo uno. ¿Qué cambia y qué permanece? ¿Qué parte es la clase, cuáles son objetos y qué nombres guardan referencias?</p><details><summary>Una pregunta más difícil</summary><p>En el laboratorio cada creación representa un <code>new</code>. Si en Java escribieras <code>Contador b = a;</code>, tendrías dos referencias al mismo objeto. Modificarlo mediante b se observaría también mediante a. Vuelve al paso 04 y dibuja las referencias.</p></details><label for="lab-notes" class="field-label">Mis conclusiones</label><textarea id="lab-notes" class="form-control text-area" data-note="laboratorio">${escapeHTML(state.notes.laboratorio||'')}</textarea><span class="save-status">${persistent?'Guardado en este navegador':'Solo en esta sesión · exporta tus notas'}</span></section>`;
 drawObjects();
}
function drawObjects(){
 document.getElementById('objects').innerHTML=state.lab.length?`<div class="object-grid">${state.lab.map((o,i)=>`<div class="object"><h3>${escapeHTML(o.name)} <small>: Contador</small></h3><small>valor</small><br><strong>${o.value}</strong><button class="btn btn-outline-primary secondary" data-increment="${i}"${o.value>=9999?' disabled':''}>incrementar() +1</button></div>`).join('')}</div>`:'<div class="empty-state">Todavía no hay objetos.<br>Una clase puede existir sin que hayas creado instancias.</div>';
 document.getElementById('lab-log').textContent=state.labLog.length?state.labLog.join('\n'):'// Crea tu primer objeto para empezar.';
}
function renderReview(filter='all') {
 main.innerHTML=intro('PRÁCTICA CON RETROALIMENTACIÓN','Entender también<br>es volver a intentarlo.','Predice, elige y revisa el porqué. Puedes repetir cada pregunta sin límite.')+`<div class="quiz-toolbar"><label for="review-filter">Elige un concepto <select id="review-filter" class="form-select"><option value="all">Todos los módulos</option>${lessons.map(l=>`<option value="${l.id}"${filter===l.id?' selected':''}>${l.short}</option>`).join('')}</select></label><span id="review-score" class="save-status"></span></div><div id="review-questions">${lessons.filter(l=>filter==='all'||l.id===filter).map(l=>`<section class="panel"><h2>${l.short}</h2>${l.questions.map((_,i)=>questionHTML(l,i,'review')).join('')}<a class="text-button" href="#${l.id}">Volver a la explicación →</a></section>`).join('')}</div>`;
 updateScore();
}
function updateScore(){const score=document.getElementById('review-score');if(score){const count=lessons.reduce((sum,l)=>sum+l.questions.filter((q,i)=>state.answers[`${l.id}-${i}`]===q.answer).length,0);score.textContent=`${count} de 18 conceptos respondidos correctamente · historial global`;}}
const checkGroups=[
 {title:'Comprender y comparar',items:[['enfoques','Puedo comparar ambos enfoques con mis palabras.','Considero organización, datos, reutilización y mantenimiento.'],['elementos','Distingo clase, objeto, atributo, método y constructor.','Puedo reconocer cada elemento en un ejemplo nuevo.']]},
 {title:'Modelar y relacionar',items:[['responsabilidades','Puedo justificar la responsabilidad de cada clase.','Distingo datos, operaciones y coordinación.'],['diagramas','Puedo dibujar atributos, métodos y constructores.','Uso tipos, parámetros, retornos y visibilidad de forma coherente.'],['asociaciones','Puedo explicar las relaciones y sus cantidades.','Distingo referencias a objetos de copiar sus datos o heredar.']]},
 {title:'Programar y verificar',items:[['crear','Puedo crear instancias mediante constructores.','Sé explicar los argumentos y el estado inicial resultante.'],['operar','Puedo asociar objetos, invocar métodos y consultar resultados.','Sé seguir el recorrido de los datos y comprobar un cálculo por mi cuenta.'],['estado','Puedo actualizar un estado de forma coherente.','He pensado qué datos y transiciones admito.'],['modular','Puedo separar clases y ejecutar un archivo principal.','Sé explicar un beneficio concreto para corregir, actualizar o reutilizar.'],['pruebas','Puedo mostrar resultados y explicar mis pruebas.','Comparo salida esperada y real; no me limito a “no dio error”.']]},
 {title:'Preparar una entrega propia',items:[['coherencia','Mis diagramas y mi programa describen el mismo diseño.','Reviso nombres, firmas, constructores, relaciones y responsabilidades.'],['evidencia','Mis capturas son legibles y muestran lo que afirmo.','Incluyo la ejecución y la separación de archivos que pide el documento.'],['fuentes','Revisé las instrucciones de entrega y las fuentes que utilicé.','Confirmo plantilla, formato, referencias y pauta disponible en el aula.']]}
];
function renderReady(){main.innerHTML=intro('AUTOEVALUACIÓN · SIN SOLUCIONARIO','Tu criterio es<br>el siguiente paso.','Una lista para reconocer lo que ya puedes hacer y lo que necesitas practicar antes de desarrollar tu tarea.')+`<div class="note amber">Esta lista no califica tu trabajo ni garantiza un resultado. Marca solo lo que puedes explicar o demostrar sin copiar un ejemplo. La pauta completa del aula no forma parte del PDF revisado.</div><div class="lesson-layout"><div><section class="panel"><h2>¿Qué puedes demostrar?</h2><div id="readiness-status" class="readiness" role="status"></div>${checkGroups.map(g=>`<div class="check-group"><h3>${g.title}</h3>${g.items.map(([id,title,detail])=>`<label class="check-item"><input type="checkbox" data-ready="${id}"${state.checks[id]?' checked':''}><span>${title}<small>${detail}</small></span></label>`).join('')}</div>`).join('')}</section><section class="panel"><h2>Tu bitácora personal</h2><p>Anota dudas o decisiones que quieras comprobar. No hay una respuesta automática para estas notas.</p><label class="field-label" for="final-notes">Qué entiendo, qué falta y qué voy a probar</label><textarea class="form-control text-area" id="final-notes" data-note="preparacion">${escapeHTML(state.notes.preparacion||'')}</textarea><span class="save-status">${persistent?'Guardado en este navegador':'Solo en esta sesión · exporta tus notas'}</span><div class="lesson-actions"><button class="btn btn-primary primary" id="export-notes">Exportar mi bitácora (.txt) ↓</button></div><p class="save-status">La exportación incluye notas, módulos marcados, historial de práctica y autoevaluación. Guarda el archivo antes de borrar los datos del navegador. El modo privado o abrir el sitio con otra dirección puede cambiar dónde se guarda el avance.</p><button class="danger" id="reset-progress">Borrar todo mi progreso local</button></section><section class="panel sources"><h2>Para seguir aprendiendo</h2><p>Referencias oficiales de Java consultadas para orientar los conceptos. Los enlaces necesitan conexión; el cuaderno y sus actividades funcionan sin internet.</p><ul><li><a href="https://dev.java/learn/language/oop/classes-objects/" target="_blank" rel="noopener noreferrer">Dev.java · Clases y objetos</a></li><li><a href="https://dev.java/learn/language/oop/classes-objects/more-on-classes/" target="_blank" rel="noopener noreferrer">Dev.java · this, acceso y miembros de clase</a></li><li><a href="https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html" target="_blank" rel="noopener noreferrer">Oracle · Constructores (tutorial de JDK 8)</a></li></ul><p>La selección de temas se basa en las cinco preguntas y los indicadores del documento <strong>S3_TAREA_SET_A_PROOO1302.pdf</strong> (IACC, 2026). Se utiliza como contexto de estudio, no como instrucciones para resolver la tarea dentro de esta web. No se incluye una copia del PDF ni un solucionario. Consulta el documento original y la pauta del aula al preparar tu entrega.</p></section></div><aside class="lesson-aside"><div class="panel"><h3>Si todavía hay dudas</h3><p>No hace falta releerlo todo. Vuelve al concepto que no puedes explicar, prueba otro dato y escribe qué ocurrió.</p><a href="#inicio">Volver a mi ruta →</a></div><div class="panel"><h3>Una buena señal</h3><p>Puedes cambiar un ejemplo, predecir el resultado y justificar por qué cambia. Eso vale más que repetir su código de memoria.</p></div></aside></div>`;updateReadiness();}
function updateReadiness(){const el=document.getElementById('readiness-status');if(el){const items=checkGroups.flatMap(g=>g.items);const count=items.filter(([id])=>state.checks[id]).length;el.textContent=`${count} de ${items.length} capacidades revisadas. ${count===items.length?'Vuelve al documento original y comprueba tu trabajo con la pauta del aula.':'Puedes volver a los módulos tantas veces como necesites.'}`;}}
function render(focus=false){
 const id=location.hash.slice(1)||'inicio',lesson=lessons.find(l=>l.id===id);
 document.getElementById('breadcrumb').textContent=lesson?lesson.short:({inicio:'Mi ruta',laboratorio:'Laboratorio de objetos',repaso:'Practicar conceptos',preparacion:'Antes de tu tarea'}[id]||'Mi ruta');
 document.title=`${document.getElementById('breadcrumb').textContent} · Java a tu ritmo`;
 if(lesson)renderLesson(lesson);else if(id==='laboratorio')renderLab();else if(id==='repaso')renderReview();else if(id==='preparacion')renderReady();else dashboard();
 nav();setMenu(false);enhanceCode();
 if(focus){main.focus({preventScroll:true});if(id==='ruta')document.getElementById('ruta')?.scrollIntoView?.({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});else window.scrollTo({top:0,behavior:'instant'});}
}
main.addEventListener('input',e=>{if(e.target.matches('[data-note]')){state.notes[e.target.dataset.note]=e.target.value;save();}});
main.addEventListener('change',e=>{if(e.target.matches('[data-ready]')){state.checks[e.target.dataset.ready]=e.target.checked;save();updateReadiness();}if(e.target.id==='review-filter')renderReview(e.target.value);});
main.addEventListener('click',e=>{
 const copy=e.target.closest('[data-copy-code]');
 if(copy){copyCode(copy);return;}
 const check=e.target.closest('[data-check]');
 if(check){const field=check.closest('fieldset'),selected=field.querySelector('input:checked'),feedback=field.querySelector('.feedback');feedback.hidden=false;if(!selected){feedback.textContent='Elige una opción para comprobar tu razonamiento.';feedback.classList.remove('correct');return;}const [id,index]=check.dataset.check.split('-'),q=lessons.find(l=>l.id===id).questions[Number(index)],answer=Number(selected.value),correct=answer===q.answer;state.answers[check.dataset.check]=answer;save();feedback.classList.toggle('correct',correct);feedback.textContent=(correct?'✓ Bien razonado. ':'Vuelve a pensarlo. ')+q.why;updateScore();return;}
 const complete=e.target.closest('[data-complete]');
 if(complete){const id=complete.dataset.complete;if(state.completed.includes(id))state.completed=state.completed.filter(v=>v!==id);else state.completed.push(id);save();complete.textContent=state.completed.includes(id)?'✓ Completado · desmarcar':'Marcar como completado';complete.className=state.completed.includes(id)?'btn btn-outline-primary secondary':'btn btn-primary primary';nav();toast(state.completed.includes(id)?'Módulo marcado. Sigue a tu ritmo.':'Módulo desmarcado. Puedes retomarlo cuando quieras.');return;}
 const increment=e.target.closest('[data-increment]');
 if(increment){const obj=state.lab[Number(increment.dataset.increment)];if(obj && obj.value<9999){obj.value++;state.labLog.push(`${obj.name}.incrementar(); // valor = ${obj.value}`);state.labLog=state.labLog.slice(-20);save();drawObjects();const button=main.querySelector(`[data-increment="${increment.dataset.increment}"]`);button?.focus();}return;}
 if(e.target.id==='reset-lab'){state.lab=[];state.labLog=[];save();drawObjects();toast('Experimento reiniciado. Tus notas se conservan.');}
 if(e.target.id==='export-notes')exportNotes();
 if(e.target.id==='reset-progress' && window.confirm('¿Borrar módulos, respuestas, notas, autoevaluación y laboratorio de este navegador? Exporta primero si quieres conservarlos.')){state=blankState();save();render();toast('Progreso local borrado. Puedes comenzar otra vez.');}
});
main.addEventListener('submit',e=>{if(e.target.id!=='counter-form')return;e.preventDefault();const nameField=document.getElementById('counter-name'),valueField=document.getElementById('counter-value'),name=nameField.value.trim(),value=Number(valueField.value);nameField.setCustomValidity('');if(state.lab.length>=6){toast('Ya hay seis objetos. Reinicia el experimento para crear otros.');return;}if(state.lab.some(o=>o.name===name)){nameField.setCustomValidity('Esta referencia ya existe. Elige otro nombre.');nameField.reportValidity();return;}if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)||!Number.isInteger(value)||value<0||value>9999)return;state.lab.push({name,value});state.labLog.push(`Contador ${name} = new Contador(${value});`);state.labLog=state.labLog.slice(-20);save();drawObjects();nameField.value='';nameField.focus();});
main.addEventListener('input',e=>{if(e.target.id==='counter-name')e.target.setCustomValidity('');});
function exportNotes(){const text=['JAVA A TU RITMO — BITÁCORA PERSONAL',`Exportación: ${new Date().toLocaleString('es-CL')}`,'','MÓDULOS',...lessons.map(l=>`${state.completed.includes(l.id)?'[x]':'[ ]'} ${l.short}`),'','MIS NOTAS',...lessons.concat([{id:'laboratorio',short:'Laboratorio'},{id:'preparacion',short:'Preparación'}]).map(l=>`\n${l.short}\n${state.notes[l.id]||'(sin notas)'}`),'','PRÁCTICA — ÚLTIMA RESPUESTA',...lessons.flatMap(l=>l.questions.map((q,i)=>{const a=state.answers[`${l.id}-${i}`];return `${q.q}\n${a===undefined?'Sin responder':`${q.options[a]||'Respuesta no válida'} — ${a===q.answer?'correcta':'por revisar'}`}`;})),'','AUTOEVALUACIÓN',...checkGroups.flatMap(g=>g.items.map(([id,title])=>`${state.checks[id]?'[x]':'[ ]'} ${title}`))].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='mi-bitacora-java.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Bitácora exportada. Revisa tus descargas.');}
function setMenu(open,restoreFocus=false){
 const sidebar=document.getElementById('sidebar');
 sidebar.classList.toggle('open',open);
 const mobile=window.matchMedia('(max-width: 800px)').matches;
 sidebar.inert=mobile&&!open;
 if(mobile&&!open)sidebar.setAttribute('aria-hidden','true');else sidebar.removeAttribute('aria-hidden');
 document.getElementById('menu-button').setAttribute('aria-expanded',String(open));
 if(open&&mobile)document.getElementById('close-menu').focus();
 if(restoreFocus&&mobile)document.getElementById('menu-button').focus();
}
document.getElementById('menu-button').addEventListener('click',()=>setMenu(!document.getElementById('sidebar').classList.contains('open')));
document.getElementById('close-menu').addEventListener('click',()=>setMenu(false,true));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('sidebar').classList.contains('open'))setMenu(false,true);});
document.addEventListener('click',e=>{if(!e.target.closest('.sidebar')&&!e.target.closest('#menu-button'))setMenu(false);});
window.matchMedia('(max-width: 800px)').addEventListener('change',()=>setMenu(false));
window.addEventListener('hashchange',()=>render(true));
render();
