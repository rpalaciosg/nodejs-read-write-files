// const customer = require("./customer.json");

// console.log(customer.address);

// const fs = require("fs");

// fs.readFile("./customer.json", "utf-8", (err, jsonString) => {
//     if (err) {
//         console.log(err);
//     } else {
//         const data = JSON.parse(jsonString);
//         console.log(data.address);
//     }
// });

/**
 * Leer json de forma asincrona
 */

// const fs = require("fs");

// fs.readFile("./customer.json", "utf-8", (err, jsonString) => {
//     if (err) {
//         console.log("La lectura del archivo fallo:", err);
//         return;
//     }
//     try {
//         const customer = JSON.parse(jsonString);
//         console.log("Direccion del cliente es:", customer.address);
//     } catch (err) {
//         console.log("Error al parsear JSON string:", err);
//     }
// });

/**
 * Funcion reusable para leer un archivo JSON
 */

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
