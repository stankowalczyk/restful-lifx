import Promise from 'bluebird';

import lifx from '../lifx';

export default class TargetMiddleware {

  static checkLight(req, res, next) {
    if (!req.params.light) return res.status(400).send({ error: [ 'Missing "light" parameter' ] });

    let light = lifx.getClient().light(req.params.light);
    if (!light) return res.status(400).send({ error: [ `Light with id: '${req.params.light}' not found` ] });

    req.lights = [ light ];

    next();
  }

  static checkLights(req, res, next) {
    req.lightError = [];

    if (!req.body.lights && !req.get('lights')) return res.status(400).send({ error: [ 'Missing "lights" parameter' ] });

    let lights = req.body.lights? req.body.lights : req.get('lights');
    lights = lights.split(',');

    req.lights = lights.reduce((previousValue, light) => {
      let lifxLight = lifx.getClient().light(light);

      if (lifxLight === false)
        req.lightError.push(light);
      else
        previousValue.push(lifxLight);

      return previousValue;
    }, []);

    next();
  }

  static allLights(req, res, next) {
    req.lights = lifx.getClient().lights();
    next();
  }

}
