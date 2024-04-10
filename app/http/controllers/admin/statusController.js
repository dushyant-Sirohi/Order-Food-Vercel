const Order = require("../../../models/order");

function statusController() {
  return {
    async index(req, res) {
      try {
        await Order.updateOne(
          { _id: req.body.orderId },
          { status: req.body.status }
        );
        return res.redirect("/admin/orders");
      } catch (error) {
        console.log(error);
      }
    },
  };
}

module.exports = statusController;
