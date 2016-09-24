import Promise from 'bluebird';

import lifx from '../lifx';

export default class TargetMiddleware {

  static checkLight(req, res, next) {
    if (!req.params.light) return res.status(400).send({ error: 'Missing "light" parameter'});

    let light = lifx.getClient().light(req.params.light);
    if (!light) return res.status(400).send({ error: `Light with id: '${req.params.light}' not found` });

    req.lights = [ light ];

    next();
  }

  static checkLights(req, res, next) {
    if (!req.body.lights) return res.status(400).send({ error: 'Missing "lights" parameter'});

    let lights = req.body.lights.split(',');

    try {
      lights.map(light => {
        return lifx.getClient().light(light);
      });
    } catch(err) {
      return res.status(400).send({ error: `Light not found`, exception: err });
    }

    req.lights = lights;

    next();
  }

  static allLights(req, res, next) {
    req.lights = lifx.getClient().lights();
    next();
  }

}
