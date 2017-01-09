# homebridge-wireless-sensor-tag
 
Homebridge platform for Wireless Sensor Tags. (http://wirelesstags.net/)

Polls status of the wireless tags on a configurable interval and based on data from the tags determines occupancy of those tags + current temperature in 
degress celcius. 

Occupancy is 0 if the tag is inactive or out of range. Otherwise it is considered occupancy 1.

NOTE: Currently only supports the temperature tags. If someone wants to donate one of the other tag types happy to add them. :)
 
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
            "password": "password"
        }
    ] 
```
     
 Fields:
 * platform - Must be set to wireless-sensor-tag
 * name - Up to you. 
 * username - Your wirelesstags.net username
 * password - Your wirelesstags.net password
 
 # To do
 * Re-add support for ignored tags and query frequency
 * Possibly reorganize classes so there is less duplicate code

