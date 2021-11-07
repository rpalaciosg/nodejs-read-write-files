const fs = require("fs");

const customer = {
    name: "Nuevo cliente",
    order_count: 0,
    address: "cuenca City",
};
const jsonString = JSON.stringify(customer, null, 2);
fs.writeFile("./newCustomer.json", jsonString, (err) => {
    if (err) {
        console.log("Error al escribir en el archivo", err);
    } else {
        console.log("Se escribio en el archivo correctamente");
    }
});
