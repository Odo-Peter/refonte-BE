import initStripePayment from "./initStripePayment";
import initStripePaymentEnrollment from "./initStripePaymentEnrollment";
import confirmStripePaymentEnrollment from "./confirmStripePaymentEnrollment";

const stripeMutation = {
  initStripePayment,
  initStripePaymentEnrollment,
  confirmStripePaymentEnrollment,
};

export default stripeMutation;
