const Order = require("../../../models/order");

function singleOrderController() {
  return {
    async index(req, res) {
      try {
        const order = await Order.findById(req.params.id);
        //Authenticate
        if (req.user._id.toString() === order.customerId.toString()) {
          return res.render("customers/singleOrder", { order });
        }
        return res.redirect("/");
      } catch (error) {
        console.log(error);
        return res.redirect("/");
      }
    },
  };
}

module.exports = singleOrderController;
