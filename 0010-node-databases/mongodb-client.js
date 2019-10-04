const MongoClient = require('mongodb').MongoClient

let dbUrl = 'mongodb://localhost:27017/users'

MongoClient.connect(dbUrl, (err, db) => {
  console.log(db)
  db.close()
})
