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
    this.name = device.name;
    this.uuid = device.uuid;
    this.uuid_base = this.uuid;
    Accessory.call(this, this.name, this.uuid);
    
    // Motion
    if (platform.motionSensors.indexOf(device.name) >= 0) {
        this.addService(Service.MotionSensor)
            .getCharacteristic(Characteristic.MotionDetected)
            .on('get', function(callback) {
            callback(null, device.eventState === EventState.DETECTED_MOVEMENT || device.eventState === EventState.MOVED);
        });
    }
    
    // Contact
    if (platform.contactSensors.indexOf(device.name) >= 0) {
        this.addService(Service.ContactSensor)
            .getCharacteristic(Characteristic.ContactSensorState)
            .on('get', function(callback) {
            if (device.eventState === EventState.OPENED || device.lightEventState === "TooBright") {
                callback(null, Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
            }
            else {
                callback(null, Characteristic.ContactSensorState.CONTACT_DETECTED);
            }
                    
        });
    }
    
    // Temperature
    this.addService(Service.TemperatureSensor)
        .getCharacteristic(Characteristic.CurrentTemperature)
        .setProps({
            minValue: -100,
            maxValue: 100
        })
        .on('get', function(callback) {
        callback(null, device.temperature);
    });

    // Humidity
    this.addService(Service.HumiditySensor)
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', function(callback) {
        callback(null, device.cap !== undefined ? Math.round(device.cap) : 0.0);
    });

    // Battery
    this.addService(Service.BatteryService)
        .getCharacteristic(Characteristic.BatteryLevel)
        .on('get', function(callback) {
        callback(null, device.batteryRemaining * 100);
    });

    this.getService(Service.BatteryService)
        .getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', function(callback) {
        if (device.batteryRemaining < 0.25)
            callback(null, Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW);
        else
            callback(null, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
    });

    this.getService(Service.BatteryService)
        .setCharacteristic(Characteristic.ChargingState, Characteristic.ChargingState.NOT_CHARGING);

    this.loadData();
}

var getServices = function() {
    return this.services;
}

var loadData = function() {
    // Motion
    if (this.platform.motionSensors.indexOf(this.name) >= 0) {
        this.getService(Service.MotionSensor)
            .getCharacteristic(Characteristic.MotionDetected)
            .getValue();
    }
    
    // Contact
    if (this.platform.contactSensors.indexOf(this.name) >= 0) {
        this.getService(Service.ContactSensor)
            .getCharacteristic(Characteristic.ContactSensorState)
            .getValue();
    }
    
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