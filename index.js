var wirelesstags = require('./lib/wireless_tags_api');

var Service, Characteristic, Accessory;

var WirelessTagAccessory;
var WirelessTempHumidityAccessory;
var WirelessMotionAccessory;

// Handle registration with homebridge
module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    Accessory = homebridge.hap.Accessory;
    
    WirelessTagAccessory = require('./accessories/wireless_tag')(Accessory, Service, Characteristic);
    WirelessTempHumidityAccessory = require('./accessories/wireless_temp_humidity')(WirelessTagAccessory, Accessory, Service, Characteristic);
    WirelessMotionAccessory = require('./accessories/wireless_motion')(WirelessTagAccessory, Accessory, Service, Characteristic);
    
    homebridge.registerPlatform("homebridge-wireless-sensor-tag", "wireless-sensor-tag", WirelessTagPlatform);
}

// Platform object for the wireless tags. Represents the wireless tag manager
function WirelessTagPlatform(log, config) {
    this.username = config.username;
    this.password = config.password;
    this.queryFrequency = config.queryFrequency;
    this.log = log;
    this.tagMap = {};
    this.tagList = [];
    this.ignoreList = (config.ignoreList == undefined) ? [] : config.ignoreList;
}

WirelessTagPlatform.prototype = {
    reloadData: function(callback) {
        this.log("Refreshing Wireless Tag data");
        var that = this;
        var foundAccessories = [];
        
        wirelesstags.getTagList(this.username, this.password, function(authenticated, devices) {
            if (!authenticated) {
                that.log("getTagList - authentication failed");
                callback([]);
            }
            else if (devices && devices instanceof Array) {
                for (var i = 0; i < devices.length; i++) {
                    var device = devices[i];
                    var accessory = undefined;

                    // Device already added, so just load data
                    if (that.deviceLookup[device.uuid]) {
                        accessory = that.deviceLookup[device.uuid];
                        accessory.device = device;
                        accessory.loadData(device);
                    }
                    else {
                        // New device - 13-bit temp/humidity sensor
                        if (device.tagType === 13) {
                            accessory = new WirelessTempHumidityAccessory(that, device);
                        }
                        // New device - Pro ALS or PIR sensor
                        else if (device.tagType === 26 || device.tagType === 72) {
                            accessory = new WirelessMotionAccessory(that, device);
                        }

                        // Device successfully added
                        if (accessory !== undefined) {
                            that.log("Device added - " + device.uuid);
                            that.deviceLookup[device.uuid] = accessory;
                            foundAccessories.push(accessory);
                        }
                        // Unknown device - skip
                        else {
                            that.log("Device skipped - " + device.uuid);
                        }
                    }
                }
                
                if (callback) {
                    callback(foundAccessories);
                }
            }
            else {
                that.log("getTagList - error getting tag list");
                callback(foundAccessories);
            }
        });
    },
    accessories: function(callback) {
        this.log("Fetching Wireless Tags");
        var that = this;
        var foundAccessories = [];
        this.deviceLookup = [];
        
        this.reloadData(function(foundAccessories) {
            callback(foundAccessories);
        });
        
        setInterval(that.reloadData.bind(that), 20000);
    }
};



