# restful-lifx
A NodeJS RESTful API for interacting with your [LIFX](http://www.lifx.com/) bulbs locally.

## Getting started

1. Clone or download the repo as a zip (and extract).
2. Open a terminal or command prompt window, navigate to the repo.
3. Run `npm install`.
4. Run `npm start`.
5. The server will start on port 8080. If you get an error like this: `Error: listen EACCES 0.0.0.0:8080` it means something else is already using port 8080 and you will need to pick a new port - see _Running on a custom port_.

### Running on a custom port

If you wish to use a custom port, supply it as an argument like so: `npm start 3000`, or as an environment variable named `RESTFUL_LIFX_PORT`.

## License

This project is licensed under the terms of the BSD 3-Clause license. Please see the LICENSE file.

## Disclaimer

This project uses [node-LIFX](https://www.npmjs.com/package/node-lifx) in order to facilitate communication with LIFX bulbs. This project not affiliated by any parties involved with [node-LIFX](https://www.npmjs.com/package/node-lifx). This project is not affiliated with [LiFi Labs, the makers of LIFX](http://www.lifx.com/pages/about).

## Endpoints

You can either control all lights, or an individual like. The endpoint for controlling all lights starts with `/all`, and endpoints which control an individual light start with `/:light` (where `:light` is a bulb id or Ip address).

### Get all lights

Endpoint: `GET /all/bulbs`

Returns JSON, an array of all lights with basic information about them.

### On

Endpoint `PUT /all/on` or `PUT /:light/on`

Turns on the specified bulb(s). Returns JSON specifying lights which succeeded and those which failed.

### Off

Endpoint `PUT /all/off` or `PUT /:light/off`

Turns off the specified bulb(s). Returns JSON specifying lights which succeeded and those which failed.

### Colour

Endpoint `PUT /all/colour` or `PUT /:light/colour`

With parameters: Duration (in milliseconds), Hue (0 ... 360), Saturation (0 ... 100), Brightness (0 ... 100), and Kelvin (2500 ... 9000).

Applies a colour to the specified bulb(s). Returns JSON specifying lights which succeeded and those which failed.

### Info

Endpoint `GET /all/info` or `GET /:light/info` or `GET /all/information` or `GET /:light/information`

Gets basic light information about the specified bulb(s). Returns JSON.

### State

Endpoint `GET /all/state` or `GET /:light/state`

Gets the current state of the specified bulb(s). Returns JSON.

### Firmware Version

Endpoint `GET /all/firmware` or `GET /:light/firmware`

Gets information about the firmware version of the specified bulb(s). Returns JSON.

### Hardware Version

Endpoint `GET /all/hardware` or `GET /:light/firmware`

Gets information about the hardware version of the specified bulb(s). Returns JSON.

### Firmware Information

Endpoint `GET /all/firmwareinfo` or `GET /:light/firmwareinfo` or `GET /all/firmwareinfo` or `GET /:light/firmwareinfo`

Gets firmware information for the specified bulb(s). Returns JSON.

### Wifi Statistics

Endpoint `GET /all/wifistats` or `GET /:light/wifistats` or `GET /all/wifiStats` or `GET /:light/wifiStats`

Gets Wifi statistics for the specified bulb(s). Returns JSON.

### Wifi Version

Endpoint `GET /all/wifiversion` or `GET /:light/wifiversion` or `GET /all/wifiVersion` or `GET /:light/wifiVersion`

Gets Wifi version information for the specified bulb(s). Returns JSON.

### Ambient Light

Endpoint `GET /all/ambientlight` or `GET /:light/ambientlight` or `GET /all/ambientLight` or `GET /:light/ambientLight`

Gets information about the ambient light hitting the bulb, for the specified bulb(s). Returns JSON.

## Contribution

NodeJS and ES6 are not my forte, apologies in advance about code quality.

This project I intend to use personally, and have published it with the hope it may be useful to others. For the moment this repo will be publish only, serving as a means through which others can view and use my code.

Currently I am short of free time I can dedicate to maintaining this project, but I aim to continue updating it in the future. Because of this pull requests or issue tickets may be ignored or closed.
