const wompi = require("./wompiProvider");
const epayco = require("./epaycoProvider");
// const stripe = require("./StripeProvider"); // futuro

module.exports = (provider) => {
  switch (provider) {
    case "wompi": return wompi;
    case "epayco": return epayco;
    // case "stripe": return stripe;
    default: throw new Error("Proveedor no soportado");
  }
};
