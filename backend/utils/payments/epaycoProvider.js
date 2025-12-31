const epayco = require("epayco-sdk-node")({
  apiKey: process.env.EPAYCO_PUBLIC_KEY,
  privateKey: process.env.EPAYCO_PRIVATE_KEY,
  lang: "ES",
  test: true
});

class EpaycoProvider {
  async createPayment({ monto, referencia, email }) {
    const payment = await epayco.checkout.create({
      name: "Curso",
      description: "Compra de curso",
      invoice: referencia,
      currency: "cop",
      amount: monto,
      country: "CO",
      email_billing: email
    });

    return { checkoutUrl: payment.data.url };
  }
}

module.exports = new EpaycoProvider();
