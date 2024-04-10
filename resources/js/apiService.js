import axios from "axios";
// const axios = require("axios");
// const Noty = require("noty");
import Noty from "noty";

export function placeOrder(formDataObject) {
  axios
    .post("/order", formDataObject)
    .then((res) => {
      console.log(res.data);
      new Noty({
        type: "success",
        timeout: 1000,
        text: res.data.message,
        progressBar: false,
      }).show();

      setTimeout(() => {
        window.location.href = "/customers/orders";
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}
