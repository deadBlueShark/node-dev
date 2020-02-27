'use strict'

const orderManager = require('./model/order')

module.exports.createOrder = async event => {
  let order = orderManager.create(JSON.parse(event.body))

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
    body: JSON.stringify({message: 'Order created', order: order}, null, 2)
  }
}

module.exports.fulfillOrder = async event => {
  let params = JSON.parse(event.body)
  let orderId = params.orderId
  let fulfillmentId = params.fulfillmentId

  orderManager.fulfillOrder(orderId, fulfillmentId)
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'Order fulfilled'}, null, 2)
  }
}
