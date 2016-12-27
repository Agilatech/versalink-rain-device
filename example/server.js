/*
 Copyright © 2016 Agilatech. All Rights Reserved.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const fs     = require('fs');
const zetta  = require('zetta');
const sensor = require('./rain-scout');
const app    = require('./apps/rain_app');

const serverPort  = 1107;  // IIOT port definied and claimed by Agilatech

var options       = {};
var keyfile       = null;
var certfile      = null;
var securityCheck = 0;

// a production server would use something robust, such as minimist for command arg parsing
process.argv.forEach(function (val, index, array) {
	if (index < 2) { return; }

	if (array[index-1] == "-k") {
		keyfile = fs.readFileSync(val);
		securityCheck++;
	}
	else if (array[index-1] == "-c") {
		certfile = fs.readFileSync(val);
		securityCheck++;
	}
});

if (securityCheck == 2) {
	options.tls = {key:keyfile, cert:certfile};
}

zetta(options)
    .name('testServer')

    // NOTE: the options for the sensor are overridden here
    .use(sensor, { "gpio":60, "tipAmount":0.254 })

    .use(app)
    .listen(serverPort, function() {
		console.log(`*** VersaLink Test Server running ${(securityCheck == 2) ? 'with TLS Security' : 'unsecured'} on port ${serverPort}`);
	});

/*  Example TSL files created using OpenSSL with the following commands:

// create a self-signed certificate and public-private key file, good for 10 years
openssl req -newkey rsa:4096 -nodes -sha512 -x509 -days 3650 -nodes -out examplecert.pem -keyout examplekeypair.pem

// Separate public key from public-private key pair
openssl rsa -in examplekeypair.pem -pubout -out examplepub.pem

// show certificate details  (base64 decode)
openssl x509 -in examplecert.pem -text -noout

// obviously, you should generate your own keys -- the ones here are only for educational purposes
*/



