import Promise from 'bluebird';

import lifx from '../lifx';

export default class All {
  static on(req, res) {
    let response = { successful: [], failed: [] };

    Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return new Promise(result => light.on(0, result))
      .then(() => {
        return response.successful.push(lifx.simplifyLightObject(light));
      }).catch(err => {
        console.error(err);
        return response.successful.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      res.status(200).send(response);
    });
  }

  static off(req, res) {
    let response = { successful: [], failed: [] };

    Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return new Promise(result => light.off(0, result))
      .then(() => {
        return response.successful.push(lifx.simplifyLightObject(light));
      }).catch(err => {
        console.error(err);
        return response.successful.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      res.status(200).send(response);
    });
  }
}
