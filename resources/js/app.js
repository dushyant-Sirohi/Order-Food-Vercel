import axios from "axios";
import initAdmin from "./admin";
import moment from "moment";
import { initStripe } from "./stripe";

const Noty = require("noty");

const foodBtn = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cartCounter");

function updateCart(food) {
  axios
    .post("/update-cart", food)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        timeout: 1000,
        layout: "topRight",
        text: "Added to Cart",
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        layout: "topRight",
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}

foodBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    updateCart(JSON.parse(btn.dataset.food));
  });
});

// remove order successful message
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2500);
}

initAdmin();

// update status

const hiddenInput = document.querySelector("#hiddenInput");
// console.log(JSON.parse(order));
let order = hiddenInput ? hiddenInput.value : null;
let time = document.createElement("small");

const elements = document.querySelectorAll(".status_line");
if (elements) {
  updateStatus(JSON.parse(order));
  function updateStatus(order) {
    let stepCompleted = true;

    elements.forEach((element) => {
      let dataProp = element.dataset.status;
      if (stepCompleted) {
        time.innerText = moment(order.updatedAt).format("hh:mm A");
        element.appendChild(time);
        element.classList.add("step-completed");
      }
      if (dataProp === order.status) {
        stepCompleted = false;
        if (element.nextElementSibling) {
          element.nextElementSibling.classList.add("current");
        }
      }
    });
  }
}

// payment
initStripe();
