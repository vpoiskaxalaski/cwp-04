const fs = require('fs');
const path = require('path');
const net = require('net');
const crypto = require('crypto');
const port = 8124;

var id = 0; 
let pathToCrypto;
let key;
const pathToDecrypto = 'E:\\University\\3k1s\\PSKP\\git_tutorial\\work\\cwp-04\\SERVER\\DECODE\\';

const server = net.createServer((client) => {
  console.log('--------------- Connected client: ' + (++id) + ' ---------------');
  client.setEncoding('utf8');

  client.on('data', (data) => {
    String(data);
    console.log(data);
    if(data == 'REMOTE'){      
      client.write('ASK');
    }
    else if(data == 'DEC') {
      client.write('DEC');
    } else if(data.indexOf('COPY')==0){ //копирование файла
      let arrC = data.split(',');
      let f = path.basename(arrC[1]);
      fs.createReadStream(arrC[1]).pipe(fs.createWriteStream(arrC[2]));
      client.write('done');
    } else if(data.indexOf('ENCODE')==0){ // кодирование файлв
      let arr = data.split(',');
      pathToCrypto = arr[2];
      key = arr[3];

      let text = fs.readFileSync(arr[1]);
      const enc = crypto.createCipher('aes-256-ctr', key).update(text, 'utf8', 'hex'); 
      fs.writeFileSync(pathToCrypto, enc);    

      client.write('ENCODE');
    }  else if(data == 'DECODE'){ //декодирование 

      var text = fs.readFileSync(pathToCrypto, 'utf8');
      var dec = crypto.createDecipher('aes-256-ctr',key ).update(text, 'hex', 'utf8');
      fs.writeFileSync(pathToDecrypto+path.basename(pathToCrypto),dec);
    }
  });
  
  client.on('end', () => console.log('Client disconnected'));
});


server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});