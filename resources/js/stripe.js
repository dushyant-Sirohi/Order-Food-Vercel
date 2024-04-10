import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService";

export async function initStripe() {
  const stripe = await loadStripe(
    "pk_test_51Nsdy9Ls04WqLZIQwjPqrBIk0FecSTZpSorYrBujnOQxoEgdRtT1l3QDKXC1YIXPfqjJnWWVHPReRGEN8yi7HV4s00nqxEGCWh"
  );
  let card = null;
  function mountWidget() {
    const elements = stripe.elements();

    let style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };

    card = elements.create("card", { style, hidePostalCode: true });
    card.mount("#card-element");
  }

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }
  paymentType.addEventListener("change", (e) => {
    if (e.target.value === "card") {
      mountWidget();
      // Display Widget
      // card = new CardWidget(stripe);
      // card.mount();
    } else {
      card.destroy();
    }
  });

  // Ajax Call
  const orderForm = document.querySelector("#orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(orderForm);
      const formDataObject = {};
      for (let [key, value] of formData.entries()) {
        formDataObject[key] = value;
      }

      if (!card) {
        placeOrder(formDataObject);
        return;
      }

      //verify card
      stripe
        .createToken(card)
        .then((result) => {
          formDataObject.stripeToken = result.token.id;
          placeOrder(formDataObject);
          console.log(formDataObject);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}

export default initStripe;
