'use strict'

const { uuid } = require('uuidv4')
const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})
const kinesis = new AWS.Kinesis()

const ORDER_TABLE = process.env.ORDER_TABLE
const ORDER_STREAM = process.env.ORDER_STREAM

module.exports.create = orderData => {
  let order = {
    ...orderData,
    ...{orderId: uuid(), date: Date.now(), event: 'init_order'}
  }

  return order
}

module.exports.placeOrder = order => {
  let orderRecord = {
    TableName: ORDER_TABLE,
    Item: order
  }

  dynamo.put(orderRecord, (err, data) => {
    if (err) {
      console.log('[DynamoDB] There were erros: ', err)
    } else {
      console.log('Put data success: ', data)
      console.log('Start push data to Kinesis Data Stream:')

      let orderData = {
        Data: JSON.stringify(order),
        PartitionKey: order.orderId,
        StreamName: ORDER_STREAM
      }

      kinesis.putRecord(orderData, (err, result) => {
        if (err) {
          console.log('[Kinesis] There were errors: ', err)
        } else {
          console.log('Push data to KDS success: ', result)
        }
      })
    }
  })
}
