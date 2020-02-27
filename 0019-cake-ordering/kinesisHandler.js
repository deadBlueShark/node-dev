'use strict'

const kinesisHelper = require('./helpers/kinesisHelper')

module.exports.notifyCakeProducer = async event => {
  let orders = kinesisHelper.getRecordsFromEvent(event)
  let placeOrder = orders.filter(order => kinesisHelper.filterOrderByType(order, 'init_order'))

  console.log('Kinesis Data: ', placeOrder)
  return
}
