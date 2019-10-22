require('getmac').getMac(function(err, macAddress){
    if (err)  throw err
    console.log(macAddress)
})
