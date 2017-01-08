var inherits = require('util').inherits;

var Accessory, Service, Characteristic, uuid;

/*
 *  Wireless Sensor Tag Accessory
 */

module.exports = function(oAccessory, oService, oCharacteristic) {
    if (oAccessory) {
        Accessory = oAccessory;
        Service = oService;
        Characteristic = oCharacteristic;

        inherits(WirelessTagAccessory, Accessory);
        WirelessTagAccessory.prototype.getServices = getServices;
    }
    return WirelessTagAccessory;
};
module.exports.WirelessTagAccessory = WirelessTagAccessory;

function WirelessTagAccessory(platform, device) {
    this.platform = platform;
    this.log = platform.log;
    this.device = device;
    this.name = device.name;
    this.uuid = device.uuid;
    this.uuid_base = this.uuid;
    Accessory.call(this, this.name, this.uuid);
}

var getServices = function() {
    return this.services;
}