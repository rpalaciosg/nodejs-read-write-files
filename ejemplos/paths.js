/**
 * Ejemplo path relativos con `fs.writeFile` y
 * union de path con `path.join`
 */
const fs = require("fs");
const path = require("path");

fs.writeFile(
    path.join(__dirname, "../../out.txt"),
    "path inicia con __dirname, y retrocede/sube 2 niveles a partir de ahi.",
    (err) => console.error(err)
);
console.log("__dirname ->" + __dirname);
console.log("path.join ->" + path.join(__dirname, "../../out.txt"));

/**
 * Metodos `fs` module con soporte de promesas
 */
const fs = require("fs").promises;
const writePromise = fs.writeFile("./out.txt", "Hello. world!");

writePromise
    .then(() => console.log("success!"))
    .catch((err) => console.err(err));
