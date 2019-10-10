# Magic Mirror Module: RepRapFirmware

This module for the [Magic Mirror²](https://github.com/MichMich/MagicMirror) allows you to display live info from your 3D printer running [RepRapFirmware](https://github.com/dc42/RepRapFirmware). This firmware is mainly used on [Duet3D control boards (Duet Wifi & Ethernet)](https://www.duet3d.com/).
 
## Screenshot

![Screenshot](.github/screenshot.png)

## Installing the module

Navigate to your MagicMirror's `modules` folder:
```
cd ~/MagicMirror/modules
```

Clone this repository:
```
git clone https://github.com/arirobinson/MMM-RepRapFirmware
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: "MMM-RepRapFirmware",
        position: "top_right", //this can be any region
        header: "3D Printer", //name your printer
        config: {
            host: "your_3d_printer_ip_address", //ip address of your printer
        }
    },
]
````

## Configuration options

The following properties can be configured:

| Option            | Description
| ----------------- | -----------
| `host`            | IP address of your printer.<br><br> **Example value:** `192.168.0.5`
| `updateInterval`  | Time between data updates (in ms).<br><br>**Default value:** `5000`
| `showProgressBar` | Show the progress bar when print is running.<br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`