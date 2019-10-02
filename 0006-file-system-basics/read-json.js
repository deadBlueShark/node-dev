const fs = require('fs');

let data = require('./assets/style/info.json');

console.log(data);
data.colors.forEach(item => {
  fs.appendFile('./assets/style/mirror-info.json', `${item.name}: ${item.id}\n`, err => {
    if (err) throw err;
    console.log('Written');
  });
})
