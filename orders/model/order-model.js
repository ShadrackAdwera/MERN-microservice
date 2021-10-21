const mongoose = require("mongoose");
const { Schema } = mongoose;

/*Order Statuses
created - order has been created but the ticket has not been reserved.

cancelled - ticket from which the order was created has already been reserved by another order, 
or order expires before payment,
or order has been cancelled.

awaiting:payment - order successfully reserved the ticket.

complete - order has reserved the ticket and user has paid the amount successfully.
*/

const orderSchema = new Schema({
  userId: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["created", "cancelled", "awaiting:payment", "complete"],
    default: "created",
  },
  expiresAt: { type: Schema.Types.Date },
  ticket: { type: Schema.Types.ObjectId, required: true, ref: "Ticket" },
});

module.exports = mongoose.model("Order", orderSchema);
