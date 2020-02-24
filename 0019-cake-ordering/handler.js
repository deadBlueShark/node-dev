'use strict'

const orderManager = require('./model/order')

module.exports.createOrder = async event => {
  const order = orderManager.create(event.body)

  // Save order to DB
  orderManager.placeOrder(order)

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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
