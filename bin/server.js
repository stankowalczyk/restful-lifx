import bodyParser from 'body-parser';
import express from 'express';
import moment from 'moment';

import lifx from './lifx';
import all from './routes/all';

lifx.init();

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 8080;

let router = express.Router();

router.use((req, res, next) => {
  console.log(`${moment().toString()}\t${req.method}\t${req.originalUrl}`);
  next();
});

router.get('/', (req, res) => {
  res.status(200).send('RESTful-LIFX - A NodeJS RESTful API for interacting with your LIFX bulbs locally');
});

router.put('/all/on', all.on);
router.put('/all/off', all.off);
router.put('/all/colour', all.colour);
router.get('/all/info', all.lightInfo);
router.get('/all/infofmation', all.lightInfo);
router.get('/all/state', all.lightState);

app.use('/api', router);

app.listen(PORT);
console.log('RESTful-LIFX server started');
console.log(`Server listening on port: ${PORT}`);
console.log(`Log Time\t\t\t\tMethod\tURL`);
