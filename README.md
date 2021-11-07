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

> > Debemos tener en cuenta que este comportamiento de rutas relativas en el modulo `fs` es diferente al de `require`. Con `fs` la ruta es relativa al directorio de trabajo donde se ejecuta el programa, mientras que con `require` la ruta o path es relativa a la ubicacion del script.

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

## Leer y escribir archivos JSON con Node.js

Cuando deseamos almacenar datos entre reinicios del servidor con node, los archivos JSON son una muy buena opcion, ya sea para leer archivos de configuracion o persistiendo datos para la aplicacion, ademas Node tiene algunas utilidades integradas que facilitan la lectura y escritura de estos archivos JSON. Ademas puede ser una fora util de conservar los datos. Ademas podemos convertir JSON a objetos JS y viceversa.

Supongamos que tenemos un ecommerce y en disco hay guardado un archivo `customer.json` que tiene el registro de un cliente para la tienda.

Necesitamos acceder a la direccion del cliente, y luego actualizar la cantidad de pedidos despues de hacer un pedido.

Entonces veamos como leer, escribir y actualizar el archivo `customer.json`.

```json
{
    "name": "Mega Corp.",
    "order_count": 83,
    "address": "Infinity Loop Drive"
}
```

### Interactuar con archivos usando el modulo fs

Para interactuar con archivos con node, usamos el modulo nativo `fs`, esto lo hacemos requerirlo en nuestro codigo sin necesidad de instalarlo.

```javascript
const fs = require("fs");
```

El modulo `fs` nos da difierentes versiones sincronas y asincronas. Las sincronas bloquean la ejecucion del programa hasta que termine de acceder al sistema de archivos ya sea lectura o escritura, en cambio una funciona asincrona se ejecuta sin bloquear la ejecucion de otro codigo.

Para leer y escribir archivos de forma asincrona usaremos los metodos `fs.readFile` y `fs.writeFile`. Tambien usaremos el `global JSON helper` para convertir objetos en cadenas JSON y cadenas JSON en objetos.

### Leer un archivo JSON

La forma mas sencilla de leer un JSON es haciendo un `require()` con la ruta del archivo JSON, y este se leera y analizara de forma sincrona en un objeto Javascript.

```javascript
const config = require("./config.json");
```

Leer archivos JSON directamente (dincronamente) con `require` tiene sus desventajas, ya que el archivo solo se leera una vez, y si lo requerimos nuevamente nos devolvera los datos almacenados en cache desde la primera vez que se ejecuto el `require`. Esta forma solo se recomienda para cargar datos estaticos como se ha explicado ya como datos de configuracion. Pero si queremos leer un archivo que esta en constante cambio en el disco como `customer.json`, necesitamos leerlo manualmente usando el metodo asincrono `fs.readFile`.

### Leer un archivo usando fs.readFile

Vamos usar una funcion asincrona para siempre leer el estado actual del archivo a leer, esta funcion retorna el contenido del archivo en `string` y luego lo parseamos a `Javascript object`

```javascript
const fs = require("fs");

fs.readFile("./customer.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("La lectura del archivo fallo:", err);
        return;
    }
    console.log("Datos del archivo:", jsonString);
});
```

-   `./customer.json` es la ruta realtiva del archivo, `utf8` es un parametro opcional para especificar la codificaciion del archivo que estamos leyendo, aunque se puede omitir.

-   `(err, jsonString) => {}` es la funcion callback que se ejecuta despues de que se haya leido el archivo.

Ahora tenemos el contenido del archivo en una cadena JSON, pero necesitamos convertir la cadena a un objeto javascript.PAra esto usamos el metodo `JSON.parse` que toma los datos JSON y devuelve un objeto javascript.

El metodo `JSON.parse` puede generar errores y bloquear nuestro programa, si se pasa una cadena JSON invalida, para evitarlo envolvemos el `JSON.parse` en una declaracion try/catch para detectar correctamente cualquier error.

```javascript
const fs = require("fs");

fs.readFile("./customer.json", "utf-8", (err, jsonString) => {
    if (err) {
        console.log("La lectura del archivo fallo:", err);
        return;
    }
    try {
        const customer = JSON.parse(jsonString);
        console.log("Direccion del cliente es:", customer.address);
    } catch (err) {
        console.err("Error al parsear JSON string:", err);
    }
});
```

Tambien podemos leer el archivo de forma sincrona usando el metodo `fs.readFileSync`. En lugar de recibir un callback, devuelve el contenido del archivo despues de leerlo.

```javascript
try {
    const jsonString = fs.readFileSync("./customer.json");
    const customer = JSON.parse(jsonString);
} catch (err) {
    console.log(err);
    return;
}
console.log(customer.address);
```

Con este conocimiento podemos crear una funcion auxiliar reusable para leer y analizar la informacion de una archivo JSON.

```javascript
const fs = require("fs");

function jsonReader(filePath, callback) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return callback && callback(err);
        }
        try {
            const object = JSON.parse(fileData);
            return callback && callback(null, object);
        } catch (err) {
            return callback && callback(err);
        }
    });
}

jsonReader("./customer.json", (err, customer) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(customer.address);
});
```

### Escribir en un archivo usando fs.writeFile

Escribir un JSON en el `file system` es similar a leerlo. Usamos el metodo `fs.writeFile` para escribir de forma asincrona.

Para escribir en un JSON, primero debemos crear una cadena JSON usando el metodo `JSON.stringify`, esto convierte un objeto Javascript a una cadena JSON.

Vamos a crear un objeto de cliente con nuestros datos a continuacion y convertirlo en una cadena.

```javascript
const customer = {
    name: "Nuevo cliente",
    order_count: 0,
    address: "cuenca City",
};

const jsonString = JSON.stringify(customer);
console.log(jsonString);
```

> > Tener en cuenta que si intentamos escribir un objeto javascript sin convertirlo en un JSON string, el archivo estara vacio y se vera asi: `[object,object]`

Una vez tenemos la datos en un string, podemos usar el metodo `fs.writeFile` para rear un nuevo archivo de cliente, para esto le pasamos la ruta, los datos a escribir, y una funcion callback que se ejecutara despues de que se escriba el archivo. Vamos a usar el nombre `newCustomer.json` si no existe lo creara, o si existe lo reemplazara.

### Escribir un archivo JSON con fs.writeFile

```javascript
const fs = require("fs");

const customer = {
    name: "Nuevo cliente",
    order_count: 0,
    address: "cuenca City",
};
const jsonString = JSON.stringify(customer);
fs.writeFile("./newCustomer.json", jsonString, (err) => {
    if (err) {
        console.log("Error al escribir en el archivo", err);
    } else {
        console.log("Se escribio en el archivo correctamente");
    }
});
```

Una vez que se ejecuta el callback, el archiivo se ha escrito en el disco. Tener en cuenta que solo se pasa un objeto de error, los datos del string que escribimos no se pasan al callback.

Tambien podemos escribir usando la funcion sincrona con `fs.writeFileSync`:

```javascript
const jsonString = JSON.stringify(customer);
fs.writeFileSync("./newCustomer.json", jsonString);
```

Una vez que se haya creado y escrito en el archivo, se vera asi:

```json
{ "name": "Nuevo cliente", "order_count": 0, "address": "cuenca City" }
```

El json string por defecto pone los datos en una sola linea, pero podemos arreglar esto de forma opcional pasando el numero de espacios para sangrar los datos al metodo `JSON.stringify()`.

```javascript
const jsonString = JSON.stringify(customer, null, 2);
```

Ahora el formato del archivo cambio a esto:

```javascript
{
  "name": "Nuevo cliente",
  "order_count": 0,
  "address": "cuenca City"
}
```

### Actualizar un archivo JSON

Ahora que podemos leer y escribir archivos, podemos usarlos como una pequeña base de datos, si queremos actualizar informacion en el archivo JSON, podemos leer el contenido, modificar los datos, y luego volver a escribir en el archivo, usaremos la funcion jsonReader que creamos anteriormente:

```javascript
jsonReader("./customer.json", (err, customer) => {
    if (err) {
        console.log("Error al leer el archivo: ", err);
        return;
    }
    //incrementar el numero de ordenes del cliente en 1
    customer.order_count += 1;
    fs.writeFile("./customer.json", JSON.stringify(customer), (err) => {
        if (err) {
            console.log("Error al escribir en el archivo: ", err);
        }
    });
});
```

Definitivamente no es la base de datos mas eficiente, pero trabajar con archivo JSON es una forma sencilla de guardar datos de nuestro proyecto.

## Notas

-   Segun la documentacion de nodejs es preferible usar las versiones callbacks de los metodos `fs` antes que la version de promesas, esto cuando se requiere mayor rendimiento en terminos de tiempo de ejecucion y asignacion de memoria.
-   JSON es ino de los tipos mas comunes con los que se trabaja en Node.js. los metodos `fs.readFile` y `fs.writeFile` son los metodos del modulo `fs` que usamos para trabajar con archivos json de forma asincrona.
