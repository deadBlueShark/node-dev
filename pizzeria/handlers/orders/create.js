'use strict'

function createOrder(order) {
  if (!order || !order.pizzaId || !order.address) {
    throw new Error('Invalid order.');
  }

  return {}
}

module.exports = createOrder;
