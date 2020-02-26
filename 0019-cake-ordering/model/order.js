'use strict'

const { uuid } = require('uuidv4')
const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
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

module.exports.placeOrder = async order => {
  let createdOrder = await _createOrder(order)
  console.log('Created order: ', createdOrder)

  if (createdOrder) {
    console.log('Start push data to Kinesis Data Stream:')
    await _pushOrderToKinesisDataStream(order)
  }
}

async function _createOrder(order) {
  let orderRecord = {
    TableName: ORDER_TABLE,
    Item: order
  }

  return dynamo.put(orderRecord).promise().then((dynamoErr, dynamoData) => {
    if (_isEmpty(dynamoErr)) {
      console.log('Order created success: ', dynamoData)
      return dynamoData
    } else {
      console.log('[DynamoDB] There were erros: ', dynamoErr)
      return null
    }
  })
}

async function _pushOrderToKinesisDataStream(order) {
  let orderData = {
    Data: JSON.stringify(order),
    PartitionKey: order.orderId,
    StreamName: ORDER_STREAM
  }

  return kinesis.putRecord(orderData).promise().then((kinesisErr, kinesisData) => {
    if (_isEmpty(kinesisErr)) {
      console.log('Push data to KDS success: ', kinesisData)
    } else {
      console.log('[Kinesis] There were errors: ', kinesisErr)
    }
  })
}

function _isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}
