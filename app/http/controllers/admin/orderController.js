const Order = require("../../../models/order");
function orderController() {
  return {
    async index(req, res) {
      const orders = await Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      }).populate("customerId", "-password");
      if (req.xhr) {
        return res.json(orders);
      } else {
        return res.render("admin/orders");
      }
    },
  };
}

module.exports = orderController;
