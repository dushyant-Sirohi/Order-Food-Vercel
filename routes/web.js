const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customer/cartController");
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const orderController = require("../app/http/controllers/customer/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");
const singleOrderController = require("../app/http/controllers/customer/singleOrderController");
const admin = require("../app/http/middlewares/admin");

function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/register", guest, authController().register);
  app.get("/login", guest, authController().login);
  app.get("/logout", authController().logoutUser);

  app.post("/login", authController().postLogin);
  app.post("/register", authController().registerUser);

  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);
  app.post("/order", auth, orderController().order);
  app.get("/customers/orders", auth, orderController().index);
  app.get("/customer/order/:id", auth, singleOrderController().index);

  app.get("/admin/orders", admin, adminOrderController().index);
  app.post("/admin/order/status", admin, statusController().index);
}

module.exports = initRoutes;
