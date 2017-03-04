import process    from 'process';
import os         from 'os';

import bodyParser from 'body-parser';
import bonjour    from 'bonjour';
import express    from 'express';
import moment     from 'moment';

import clientRoute      from './routes/client';
import lifx             from './lifx';
import lightRoute       from './routes/light';
import targetMiddleware from './middleware/target';

function toInt(value) {
  return Number(value);
}

function isInt(value) {
  return Number.isInteger(value);
}

lifx.init();

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = 8080;

if (process.env.RESTFUL_LIFX_PORT) {
  let parsedValue = toInt(process.env.RESTFUL_LIFX_PORT);
  if (isInt(parsedValue)) port = parsedValue;
  else console.log('Error, environment variable is not an integer');
}

let args = process.argv;
args.splice(0,2);
if (args.length === 1) {
  let parsedValue = toInt(args[0]);
  if (isInt(parsedValue)) port = parsedValue;
  else console.log('Error, parameter is not an integer');
} else if (args.length > 1) console.log('Error only one parameter accepted, using default port 8080');

let router = express.Router();

router.use((req, res, next) => {
  console.log(`${moment().toString()}\t${req.method}\t${req.originalUrl}`);
  next();
});

router.get('/', (req, res) => {
  res.status(200).send('RESTful-LIFX - A NodeJS RESTful API for interacting with your LIFX bulbs locally');
});

router.get('/all/bulbs',        targetMiddleware.allLights, lightRoute.lightInfo);
router.put('/all/on',           targetMiddleware.allLights, lightRoute.on);
router.put('/all/off',          targetMiddleware.allLights, lightRoute.off);
router.put('/all/colour',       targetMiddleware.allLights, lightRoute.colour);
router.get('/all/info',         targetMiddleware.allLights, lightRoute.lightInfo);
router.get('/all/information',  targetMiddleware.allLights, lightRoute.lightInfo);
router.get('/all/state',        targetMiddleware.allLights, lightRoute.lightState);
router.get('/all/firmware',     targetMiddleware.allLights, lightRoute.firmwareVersion);
router.get('/all/hardware',     targetMiddleware.allLights, lightRoute.hardwareVersion);
router.get('/all/firmwareinfo', targetMiddleware.allLights, lightRoute.firmwareInfo);
router.get('/all/firmwareInfo', targetMiddleware.allLights, lightRoute.firmwareInfo);
router.get('/all/wifistats',    targetMiddleware.allLights, lightRoute.wifiStats);
router.get('/all/wifiStats',    targetMiddleware.allLights, lightRoute.wifiStats);
router.get('/all/wifiversion',  targetMiddleware.allLights, lightRoute.wifiVersion);
router.get('/all/wifiVersion',  targetMiddleware.allLights, lightRoute.wifiVersion);
router.get('/all/ambientlight', targetMiddleware.allLights, lightRoute.ambientLight);
router.get('/all/ambientLight', targetMiddleware.allLights, lightRoute.ambientLight);

router.get('/group/bulbs',        targetMiddleware.checkLights, lightRoute.lightInfo);
router.put('/group/on',           targetMiddleware.checkLights, lightRoute.on);
router.put('/group/off',          targetMiddleware.checkLights, lightRoute.off);
router.put('/group/colour',       targetMiddleware.checkLights, lightRoute.colour);
router.get('/group/info',         targetMiddleware.checkLights, lightRoute.lightInfo);
router.get('/group/information',  targetMiddleware.checkLights, lightRoute.lightInfo);
router.get('/group/state',        targetMiddleware.checkLights, lightRoute.lightState);
router.get('/group/firmware',     targetMiddleware.checkLights, lightRoute.firmwareVersion);
router.get('/group/hardware',     targetMiddleware.checkLights, lightRoute.hardwareVersion);
router.get('/group/firmwareinfo', targetMiddleware.checkLights, lightRoute.firmwareInfo);
router.get('/group/firmwareInfo', targetMiddleware.checkLights, lightRoute.firmwareInfo);
router.get('/group/wifistats',    targetMiddleware.checkLights, lightRoute.wifiStats);
router.get('/group/wifiStats',    targetMiddleware.checkLights, lightRoute.wifiStats);
router.get('/group/wifiversion',  targetMiddleware.checkLights, lightRoute.wifiVersion);
router.get('/group/wifiVersion',  targetMiddleware.checkLights, lightRoute.wifiVersion);
router.get('/group/ambientlight', targetMiddleware.checkLights, lightRoute.ambientLight);
router.get('/group/ambientLight', targetMiddleware.checkLights, lightRoute.ambientLight);

router.put('/:light/on',           targetMiddleware.checkLight, lightRoute.on);
router.put('/:light/off',          targetMiddleware.checkLight, lightRoute.off);
router.put('/:light/colour',       targetMiddleware.checkLight, lightRoute.colour);
router.get('/:light/info',         targetMiddleware.checkLight, lightRoute.lightInfo);
router.get('/:light/information',  targetMiddleware.checkLight, lightRoute.lightInfo);
router.get('/:light/state',        targetMiddleware.checkLight, lightRoute.lightState);
router.get('/:light/firmware',     targetMiddleware.checkLight, lightRoute.firmwareVersion);
router.get('/:light/hardware',     targetMiddleware.checkLight, lightRoute.hardwareVersion);
router.get('/:light/firmwareinfo', targetMiddleware.checkLight, lightRoute.firmwareInfo);
router.get('/:light/firmwareInfo', targetMiddleware.checkLight, lightRoute.firmwareInfo);
router.get('/:light/wifistats',    targetMiddleware.checkLight, lightRoute.wifiStats);
router.get('/:light/wifiStats',    targetMiddleware.checkLight, lightRoute.wifiStats);
router.get('/:light/wifiversion',  targetMiddleware.checkLight, lightRoute.wifiVersion);
router.get('/:light/wifiVersion',  targetMiddleware.checkLight, lightRoute.wifiVersion);
router.get('/:light/ambientlight', targetMiddleware.checkLight, lightRoute.ambientLight);
router.get('/:light/ambientLight', targetMiddleware.checkLight, lightRoute.ambientLight);

router.put('/startdiscovery', clientRoute.startDiscovery);
router.put('/startDiscovery', clientRoute.startDiscovery);
router.put('/stopdiscovery',  clientRoute.stopDiscovery);
router.put('/stopDiscovery',  clientRoute.stopDiscovery);

app.use('/api', router);

app.listen(port);
console.log('RESTful-LIFX server started');
console.log(`Server listening on port: ${port}`);
console.log(`Log Time\t\t\t\tMethod\tURL`);


// Bad code alert
// Backstory: While using NSD Manager in Android, the host and port of the machine is not
// resolved. The success or failure callbacks are not called. I've quite possibly made a
// mistake somewhere - but I am unable to find it. This is a quick and dirty solution,
// append the port and IP address to the end of the service name, as that appears
// clearly when looking for beacons in Android. This is not an ideal solution, but neither
// is seperating out Zeroconf into a seperate app / service.

// Get all the ip addresses associated with this machine
let interfaces = os.networkInterfaces();
let addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

// if we have addresses, bonjour with all of them
if (addresses.length > 0) {
  addresses.forEach(address => {
    // Replace all instances of full stops with underscores, NSD Manager in Android does not
    // appear to process names with full stops correctly.
    let name = `RESTful-LIFX@${address.replace(/\./g, '_')}:${port}`;
    bonjour().publish({ name: name, type: 'http', port: port });
    console.log(`Started advertising on Bonjour [${address}], with the name "${name}"`);
  });
}
