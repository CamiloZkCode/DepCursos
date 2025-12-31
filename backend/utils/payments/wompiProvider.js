const axios = require("axios");
const PaymentProvider = require("./paymentProvider");

class WompiProvider extends PaymentProvider {
  async createPayment({ monto, referencia, email }) {
    return {
      checkoutUrl: `https://checkout.wompi.co/p/?public-key=${process.env.WOMPI_PUBLIC_KEY}&amount-in-cents=${monto*100}&reference=${referencia}&currency=COP&customer-email=${email}`
    };
  }
}

module.exports = new WompiProvider();
