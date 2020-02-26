'use strict'

const orderManager = require('./model/order')

module.exports.createOrder = async event => {
  const order = orderManager.create(JSON.parse(event.body))

  // let orderParamSample = {
  //   customer: 'Le Chi Nguyen',
  //   address: '85A PVD, DN',
  //   coupon: 'APFREE',
  //   items: [
  //     { name: 'Pizza', amount: 3 }
  //   ]
  // }

  await orderManager.placeOrder(order)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Order created',
        order: order
      },
      null,
      2
    )
  }
}
