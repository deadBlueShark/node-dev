const events = require('events');
const emitter = new events.EventEmitter();

emitter.on('customEvent', (second, third) => {
  console.log(`${second} ${third}`);
})

emitter.emit('customEvent', 'AAAA', 'BBBB');
emitter.emit('customEvent', 'CCCC', 'DDDD');
