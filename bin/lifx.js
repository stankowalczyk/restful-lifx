import Promise from 'bluebird';
import {Client as LifxClient} from 'node-lifx';

let lifxClient;

let inited = false;

export default class Lifx {
  static init() {
    if (inited === false) {
      lifxClient = Promise.promisifyAll(new LifxClient());
      lifxClient.init();
      inited = true;
    }
  }

  static getClient() {
    Lifx.init();
    return lifxClient;
  }
}
