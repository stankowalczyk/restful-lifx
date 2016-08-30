import process     from 'process';

import bodyParser  from 'body-parser';
import express     from 'express';
import moment      from 'moment';

import all         from './routes/all';
import clientRoute from './routes/client';
import individual  from './routes/individual';
import lifx        from './lifx';

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

router.get('/all/bulbs',        all.lightInfo);
router.put('/all/on',           all.on);
router.put('/all/off',          all.off);
router.put('/all/colour',       all.colour);
router.get('/all/info',         all.lightInfo);
router.get('/all/information',  all.lightInfo);
router.get('/all/state',        all.lightState);
router.get('/all/firmware',     all.firmwareVersion);
router.get('/all/hardware',     all.hardwareVersion);
router.get('/all/firmwareinfo', all.firmwareInfo);
router.get('/all/firmwareInfo', all.firmwareInfo);
router.get('/all/wifistats',    all.wifiStats);
router.get('/all/wifiStats',    all.wifiStats);
router.get('/all/wifiversion',  all.wifiVersion);
router.get('/all/wifiVersion',  all.wifiVersion);
router.get('/all/ambientlight', all.ambientLight);
router.get('/all/ambientLight', all.ambientLight);

router.put('/:light/on',           individual.checkLight, individual.on);
router.put('/:light/off',          individual.checkLight, individual.off);
router.put('/:light/colour',       individual.checkLight, individual.colour);
router.get('/:light/info',         individual.checkLight, individual.lightInfo);
router.get('/:light/information',  individual.checkLight, individual.lightInfo);
router.get('/:light/state',        individual.checkLight, individual.lightState);
router.get('/:light/firmware',     individual.checkLight, individual.firmwareVersion);
router.get('/:light/hardware',     individual.checkLight, individual.hardwareVersion);
router.get('/:light/firmwareinfo', individual.checkLight, individual.firmwareInfo);
router.get('/:light/firmwareInfo', individual.checkLight, individual.firmwareInfo);
router.get('/:light/wifistats',    individual.checkLight, individual.wifiStats);
router.get('/:light/wifiStats',    individual.checkLight, individual.wifiStats);
router.get('/:light/wifiversion',  individual.checkLight, individual.wifiVersion);
router.get('/:light/wifiVersion',  individual.checkLight, individual.wifiVersion);
router.get('/:light/ambientlight', individual.checkLight, individual.ambientLight);
router.get('/:light/ambientLight', individual.checkLight, individual.ambientLight);

router.put('/startdiscovery', clientRoute.startDiscovery);
router.put('/startDiscovery', clientRoute.startDiscovery);
router.put('/stopdiscovery',  clientRoute.stopDiscovery);
router.put('/stopDiscovery',  clientRoute.stopDiscovery);

app.use('/api', router);

app.listen(port);
console.log('RESTful-LIFX server started');
console.log(`Server listening on port: ${port}`);
console.log(`Log Time\t\t\t\tMethod\tURL`);
