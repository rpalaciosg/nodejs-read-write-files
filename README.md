# Read and Write Files with Node.js

Este documento es un resumen de como leer y escribir archivos usando el modulo `fs` de Node.js.
Muestra el funcionamiento de los metodos `fs.readFile` y `fs.writeFile` para leer y escribir archivos por ejemplo JSONs,
ademas procesarlos y usarlos como objetos en Nodejs.

## Que es el Node.js Fyle System Module (`fs`)

El `fs` module, es uno de los modulos nativos dentro de Nodejs, esta disponible en node sin tener que instalar nada, nos
ayuda a leer, escribir, y administrar datos del sistemas operativo.

```javascript
const fs = require("fs");
```

La forma de hacerlo con ECMAScript es la siguiente:

```javascript
import * as fs from "fs";
```

Algunas de las caracteristicas mas usadas del modulo `fs` son:

-   `fs.readFile` que ayuda a leer datos de archivos.
-   `fs.writeFile` que nos ayuda a escribir datos en un archivo y tambien reemplazar un archivo existente.
-   `fs.watchFile` que nos ayuda a monitorear un archivo y podemos recibir notificaciones de cambios en un archivo.
-   `fs.appendFile` que nos permite agregar datos en un archivo.

El objetivo de este documento es poder:

-   Comprender usos comunes del modulo `fs` (fyle system) de Node, para acceder e interactuar con el sistema de archivos.
-   Aprender sobre rutas relativas de archivos al usar el modulo `fs`. (Relative paths)
-   Aprender a usar y la diferencia de los metodos asincronos y sincronos del modulo `fs`.
-   Tener una descripcion general de la nueva version del modulo `fs` basada en promesas.
-   Entender cuando no podemos confiar en el modulo `fs` de Nodejs.

### Acerca del modulo `fs`

Nodejs proporciona un modulo integrado para trabajar con el `file system`, para poder usarlo, debo importarlo siguiendo la especificacion common.js:

```javascript
const fs = require("fs");
```

Como ya lo mencionamos, nos da acceso a funciones utiles para observar cambios en archivos, leer, escribir, reemplazar archivos, crear directorios y mas.

-   `fs.readFile` - Leer datos de un archivo
-   `fs.writeFile` - Escribe datos en un archivo, reemplaza el archivo si ya existe
-   `fs.watchFile` - Recibe notificaciones de cambios en un archivo.
-   `fs.appendFile` - Agregar datos a un archivo

Siempre podemos recurrir a la [documentacion de Node.js](https://nodejs.org/api/fs.html) para aprender un poco mas del modulo `fs`.

### Rutas relativas de archivos

LAs mayoria de metodos del modulo `fs` reciben como argumento una ruta de archivo, por lo general usamos rutas relativas de archivo ejm. './output.txt', esta ruta se resolvera desde la perspectiva del directorio de trabajo actual cuando se ejecuta el script de nodejs.

Las rutas relativas tiene como prefijo un punto `.`, que indica el _directorio actual_, o dos puntos `..` que indica el _directorio principal_

Cuando se usan rutas relativas con `fs`, la ruta no es relativa a la ubicacion del script, sino es relativa al directorio en el que se encontraba cuando se ejecuto el comando `node script.js` para ejecutar el script.

> > Debemos tener en cuenta que este comportamiento de rutas relativas en el modulo `fs` es diferente al de `require`.

Debemos estar muy pendiente de como especificamos las rutas relativas, nos pueden sorprender los resultados cuando los archivos se leen o escriben desde ubicaciones no esperadas.

Para especificar una ruta relativa al archivo que se esta ejecutando, usamos la palabra clave `__dirname` que esta en el scope o contexto de cada archivo. Esta palabra se expande a la ruta absoluta del directorio del archivo en el que se usa. Por lo tanto si usamos `__dirname` desde un archivo ubicado en `/foo/bar/script.js`, el valor seria `/foo/bar`.

Podemos unir rutas y crear una ruta completa usando el valor devuelto por `__dirname` y la ruta relativa del archivo.
Para unir las rutas usamos otro modulo de nodejs llamado `path`, este cuenta con el metodo `path.join` que nos permite crear rutas de archivos multiplataforma.

Aqui un ejemplo:

```javascript
const fs = require("fs");
const path = require("path");

fs.writeFile(
    "./out.txt",
    "El path es relativo al directorio de trabajo actual! process.cwd()",
    (err) => console.error(err)
);

fs.writeFile(
    path.join(__dirname, "/out.txt"), //unimos y creamos path
    "El path es relativo para el directorio donde esta este script",
    (err) => console.error(err)
);
```

Tambien puedo combinar `__dirname` y una ruta relativa, para hacer la busqueda de ruta relativa al directorio del archivo actual.

```javascript
const fs = require("fs");
const path = require("path");

fs.writeFile(
    path.join(__dirname, "../../out.txt"),
    "Este path inicia con __dirname, y a partir de ahi retrocede/sube 2 niveles",
    (err) => console.err(err)
);
```

El ultimo ejemplo si lo estamos corriendo desde un path como este ->`/home/user/workspace/projectExample/script.js`, obtenemos lo siguiente:

-   `__dirname` -> '/home/user/workspace/projectExample
-   `path.join(__dirname, "../../out.txt"` -> devuelve y escribe el archivo out.txt en el path /home/user/out.txt debido a que `../../` le dice que debe retroceder 2 niveles.

### Metodos asincronos vs sincronos del modulo `fs`

Las funciones que proporciona `fs` son asincronas y basadas en `callbacks`, pero tambien muchas de estas funciones tienen su version sincrona como `readFileSync` y `writeFileSync`.

Por lo general las operaciones de E/S en node.js, se realizan de forma asincrona para evitar bloquear el `event loop`.

Es buena practica usar codigo asincrono cuando trabajamos con el `file system` y operaciones pesadas de `E/S`.

PAra lidiar con el acceso al `file system` es buena practica usar los metodos asincronos del modulo `fs`, pero aveces realmente es necesario bloquear la ejecucion del programa hasta que haya terminado de acceder al `fle system`. Ejemplos de este caso seria:

-   cuando cargamos datos de configuracion desde un archivo antes de despliegue de nuestro programa, esto tal vez para asegurarnos de que los datos se cargaron correctamente.
-   Otro caso es cuando deseamos leer un archivo con informacion para cargar en base de datos.
-   Cuando queremos evitar que el resto del codigo se ejecute antes de que se haya leido o creado un archivo.

Para la mayoria de casos acceder de forma asincrona al `file system` afectara en el rendimiento de la aplicacion, esto se recomienda solo en casos como los ejemplos antes mencionados, y aqui seran muy utiles estos metodos sincronos del modulo `fs`.

fuera de los casos explicados, es recomendable siempre usar las versiones asincronas, pero por si necesitamos hacer uso de la version sincrona aqui un ejemplo:

```javascript
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("./config.json"));

//seguir ejecutando codigo, con la configuracion disponible
```

### Versiones basadas en promesas para el modulo fs

El soporte de promesas para el modulo `fs` aparecio desde la version 10 de Node.js de forma experimental, pero a partir de la version 11 y posteriores, el soporte es por defecto y ya no experimental.

Los metodos del modulo `fs` basados en promesas, funcionan igual que los basados en `callbacks` y los nombres tambien son los mismos. No existen versiones sincronicas para estos metodos basados en promesas. Si se necesitan las versiones sincronicas podemos usar las versiones basadas en callbacks del modulo del modulo `fs`.

La forma de acceder a los metodos en la version basada en promesas es la siguiente:

```javascript
const fs = require("fs").promises;
```

La diferencia aqui es que en lugar de recibir un `callback`, estos metodos devuelven una promesa.

```javascript
const fs = require("fs").promises;

const writePromise = fs.writeFile("./out.txt", "Hello, world!");

writePromise
    .then(()=> console.log("success!))
    .catch(()=> console.error(err));
```

### ¿Cuando no podemos confiar en el file system?

Dependiendo de donde ejecutemos nuestros scripts, no siempre tenemos acceso a un sistemas de archivos persistente, es decir que los archivos que creemos o modifiquemos esten siempre accesibles o que perduren tal cual como los creamos.
Cuando desarrollamos de forma local es posibles, pero en ciertos entornos en la nube por ejemplo no tenemos un sistema de archivos persistente.

Los sistemas de archivos en la nube no persistentes se suelen llamar [sistemas de archivos efimeros o ephemeral filesystem](https://help.heroku.com/K1PPS2WM/why-are-my-file-uploads-missing-deleted), un ejemplo de esto es Heroku, ya que los archivos que escribe en disco solo se conservan hasta que su instancia se apaga para dormir durante inactividad. Esto ocurre solo con archivos creados durante la ejecucion no con el codigo fuente.
Las funciones de AWS Lambda funcionan de manera similar, los archivos creados durante la ejecucion solo se conservan durante un periodo de tiempo.

Por esta razon, no se recomienda almacenar estados de larga duracion o cargas de usuarios como archivos creados en tiempo de ejecucion en un host con sistema de archivos efimero. El host en la plataforma que elijamos debe poder decirnos si el sistema de archivos de la app es persistente o efimero.

### Notas

-   Segun la documentacion de nodejs es preferible usar las versiones callbacks de los metodos `fs` antes que la version de promesas, esto cuando se requiere mayor rendimiento en terminos de tiempo de ejecucion y asignacion de memoria.
