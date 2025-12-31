

const provider = require("../payments/PaymentFactory")(proveedor);




router.post("/crear", authMiddleware, async (req, res) => {
  const { proveedor, cursoId } = req.body;



  const pago = await Pago.create({
    usuario_id: req.user.id,
    curso_id: cursoId,
    proveedor,
    monto: 50000,
    estado: "pendiente"
  });

  const result = await provider.createPayment({
    monto: pago.monto,
    referencia: pago.id,
    email: req.user.email
  });

  res.json(result);
});
