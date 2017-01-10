# homebridge-wireless-sensor-tag
 
Homebridge platform for Wireless Sensor Tags. (http://wirelesstags.net/)

Supports 13-bit temperature/humidity sensor, Pro ALS sensor, and PIR sensor.
 
# Installation

1. Install homebridge using: npm install -g homebridge
2. After cloning this repo, install this plugin (while inside the repo): npm install; npm link
3. Update your configuration file. See sampleconfig.json in this repository for a sample. 
 
# Configuration

Configuration sample:
 
 ```
    "platforms": [
        {
            "platform": "wireless-sensor-tag",
            "name": "wireless-sensor-tag",         
            "username": "user@domain.com",      
            "password": "password",
            "queryFrequency": 20000,
            "motionSensors": [],
            "contactSensors": ["Mailbox"]
        }
    ] 
```
     
 Fields:
 * platform - Must be set to wireless-sensor-tag
 * name - Up to you. 
 * username - Your wirelesstags.net username
 * password - Your wirelesstags.net password
 * queryFrequency - The amount of time (in ms) between updates. Minimum value is 5000.
 * motionSensors - A list of sensors that should be treated like motion sensors in addition to temperature/humidity.
 * contactSensors - A list of sensors that should be treated like contact (open/close) sensors in addition to temperature/humidity. For the Pro ALS sensor, the "too bright" light state signifies "open" while "normal"/"too dark" signifies "closed"; for all other sensors, the "opened" and "closed" event states are used.
 
# To do
* Re-add support for ignored tags and query frequency
* Reorganize classes so there is less duplicate code
* Configure which sensors should be included for each tag, since many support motion, temperature, humidity, and more.
