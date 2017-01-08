var inherits = require('util').inherits;
var EventState = require('../lib/event_state');

var WirelessTagAccessory, Accessory, Service, Characteristic;

/*
 *  WirelessTempHumidity Accessory
 */

module.exports = function(oWirelessTagAccessory, oAccessory, oService, oCharacteristic) {
    if (oWirelessTagAccessory) {
        WirelessTagAccessory = oWirelessTagAccessory;
        Accessory = oAccessory;
        Service = oService;
        Characteristic = oCharacteristic;
        
        inherits(WirelessTempHumidityAccessory, WirelessTagAccessory);
        WirelessTempHumidityAccessory.prototype.loadData = loadData;
    }
    return WirelessTempHumidityAccessory;
};
module.exports.WirelessTempHumidityAccessory = WirelessTempHumidityAccessory;

function WirelessTempHumidityAccessory(platform, device) {
    WirelessTagAccessory.call(this, platform, device);

    var that = this;

    // Open/closed
    this.addService(Service.ContactSensor)
        .getCharacteristic(Characteristic.ContactSensorState)
        .on('get', function (callback) {
        callback(null, that.device.eventState === EventState.CLOSED ? Characteristic.ContactSensorState.CONTACT_DETECTED : Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
    });

    // Temperature
    this.addService(Service.TemperatureSensor)
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', function (callback) {
        callback(null, that.device.temperature);
    });

    // Humidity
    this.addService(Service.HumiditySensor)
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', function (callback) {
        callback(null, device.cap !== undefined ? Math.round(device.cap) : 0.0);
    });

    // Battery
    this.addService(Service.BatteryService)
        .getCharacteristic(Characteristic.BatteryLevel)
        .on('get', function (callback) {
        callback(null, device.batteryRemaining * 100);
    });

    this.getService(Service.BatteryService)
        .getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', function (callback) {
        if (that.device.batteryRemaining < 0.25)
            callback(null, Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW);
        else
            callback(null, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
    });

    this.getService(Service.BatteryService)
        .setCharacteristic(Characteristic.ChargingState, Characteristic.ChargingState.NOT_CHARGING);

    this.loadData();
}

var loadData = function() {
    // Open/closed
    this.getService(Service.ContactSensor)
        .getCharacteristic(Characteristic.ContactSensorState)
        .getValue();

    // Temperature
    this.getService(Service.TemperatureSensor)
        .getCharacteristic(Characteristic.CurrentTemperature)
        .getValue();

    // Humidity
    this.getService(Service.HumiditySensor)
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .getValue();

    // Battery
    this.getService(Service.BatteryService)
        .getCharacteristic(Characteristic.BatteryLevel)
        .getValue();
    this.getService(Service.BatteryService)
        .getCharacteristic(Characteristic.StatusLowBattery)
        .getValue();
};