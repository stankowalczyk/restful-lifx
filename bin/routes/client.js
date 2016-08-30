import Promise from 'bluebird';

import lifx from '../lifx';

export default class ClientRoute {

  static stopDiscovery(req, res) {
    lifx.getClient().stopDiscovery();
    return res.status(200).send();
  }

  static startDiscovery(req, res) {
    lifx.getClient().startDiscovery();
    return res.status(200).send();
  }
}
