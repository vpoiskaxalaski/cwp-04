const net = require('net');
const port = 8124;
const path = require('path');

const sekretKey = 'key 123';
let addrCopy;
let originAddr = process.argv[2];


const client = new net.Socket();
client.setEncoding('utf8');

client.connect(port, function () {
  console.log('Connected');
  sendREMOTE(client);
});


client.on('data', function (data) {
  if(data == 'ASK'){  
    addrCopy = 'E:\\University\\3k1s\\PSKP\\git_tutorial\\work\\cwp-04\\SERVER\\' + path.basename(originAddr)
    client.write('COPY,'+ originAddr+','+addrCopy); 
  }
  else if(data == 'DEC'){
    client.destroy();
  } else if( data == 'done'){
    addrCopy = 'E:\\University\\3k1s\\PSKP\\git_tutorial\\work\\cwp-04\\SERVER\\ENCODE\\' + path.basename(originAddr)
    client.write('ENCODE,'+ originAddr+','+addrCopy+','+sekretKey);
  } else if( data == 'ENCODE'){
    client.write('DECODE');
  }

});


function sendREMOTE(client) {
  console.log('send REMOTE');
  client.write('REMOTE');
};

client.on('close', function () {
  console.log('Connection closed');
});

