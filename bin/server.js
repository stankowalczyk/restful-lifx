import bodyParser from 'body-parser';
import express from 'express';
import moment from 'moment';
import Promise from 'bluebird';

import lifx from './lifx';

let app = express();

// Ensure our app uses body-parser
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

router.put('/all/on', (req, res) => {
  let response = { successful: [], failed: [] };

  Promise.each(lifx.getClient().lights(), (light, index, length) => {
    return new Promise(result => light.on(0, result))
    .then(() => {
      return response.successful.push({
        id: light.id,
        address: light.address,
        port: light.port,
        label: light.label,
        status: light.status
      });
    }).catch(err => {
      console.error(err);
      return response.failed.push({
        id: light.id,
        address: light.address,
        port: light.port,
        label: light.label,
        status: light.status
      });
    });
  }).then(() => {
    res.status(200).send(response);
  });
});

router.put('/all/off', (req, res) => {
  let response = { successful: [], failed: [] };

  Promise.each(lifx.getClient().lights(), (light, index, length) => {
    return new Promise(result => light.off(0, result))
    .then(() => {
      return response.successful.push({
        id: light.id,
        address: light.address,
        port: light.port,
        label: light.label,
        status: light.status
      });
    }).catch(err => {
      console.error(err);
      return response.failed.push({
        id: light.id,
        address: light.address,
        port: light.port,
        label: light.label,
        status: light.status
      });
    });
  }).then(() => {
    res.status(200).send(response);
  });
});

app.use('/api', router);

app.listen(PORT);
console.log('RESTful-LIFX server started');
console.log(`Server listening on port: ${PORT}`);
console.log(`Log Time\t\t\t\tMethod\tURL`);
