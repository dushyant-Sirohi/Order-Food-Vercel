const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")("sk_test_51Nsdy9Ls04WqLZIQqce5OO8wiTdGMbrQ7hGq0XEzoCeT8cGhyhMCGWG4iyiPE38LE5KLiXoY4ph47HxNzkkbRz4K00kVRtwF1j");
function orderController() {
  return {
    order(req, res) {
      //validation
      const { phone, address, stripeToken, paymentType } = req.body;
      if (!phone || !address) {
        return res.status(422).json({ message: "All fields are required" });
      }
      const order = new Order({
        customerId: req.session.passport.user,
        items: req.session.cart.items,
        phone,
        address,
      });
      order
        .save()
        .then((result) => {
          return Order.populate(result, { path: "customerId" }); // Return the promise
        })
        .then((placedOrder) => {
          // req.flash('success', 'Order placed successfully')

          // Stripe payment
          if (paymentType === "card") {
            return stripe.charges
              .create({
                amount: req.session.cart.totalPrice * 100,
                source: stripeToken,
                currency: "cad",
                description: `Pizza order: ${placedOrder._id}`,
              })
              .then(() => {
                placedOrder.paymentStatus = true;
                placedOrder.paymentType = paymentType;
                return placedOrder.save();
              })
              .then((ord) => {
                // Emit
                // const eventEmitter = req.app.get("eventEmitter");
                // eventEmitter.emit("orderPlaced", ord);
                delete req.session.cart;
                return res.json({
                  message: "Order Payment placed successfully",
                });
              })
              .catch((err) => {
                console.log(err);
                delete req.session.cart;
                return res.json({
                  message:
                    "OrderPlaced but payment failed, You can pay at delivery time",
                });
              });
          } else {
            delete req.session.cart;
            return res.json({ message: "Order placed successfully" });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "Something went wrong" });
        });
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header("Cache-Control", "no-store");
      res.render("customers/order", { orders: orders, moment: moment });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      // Authorize user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", { order });
      }
      return res.redirect("/");
    },
  };
}

module.exports = orderController;
