import bodyParser from 'body-parser';
import express from 'express';
import moment from 'moment';

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

app.use('/api', router);

app.listen(PORT);
console.log('RESTful-LIFX server started');
console.log(`Server listening on port: ${PORT}`);
console.log(`Log Time\t\t\t\tMethod\tURL`);
