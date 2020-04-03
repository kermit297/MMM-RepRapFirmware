Module.register("MMM-RepRapFirmware",{
    // Default module config.
	defaults: {
        host: "",
        updateInterval: "1000",
        parameters: ["timeLeft", "percent"],
        showProgressBar: true,
	},

	// Override dom generator.
	getDom: function(value) {
        var wrapper = document.createElement("div");
        var tableElement = document.createElement("table");
        var parameters = this.config.parameters;

        var date1 = new Date();
        var date2 = new Date("07/20/2020 00:00:00");
        var dt = date2.getTime() - date1.getTime();
        var dd = dt / (1000 * 3600 * 24);

        for (i = 0; i < parameters.length; i++){
            var name = "";
            var val = "";
            switch(parameters[i]){
                case "percent":
                    name = "Baby Progress";
                    val = this.calculatePercent(dt) + "%";
                    break;
                case "timeLeft":
                    name = "Time Left";
                    val = this.convertTime();
                    break;
            }

            newRow = document.createElement("tr");

            cell1 = newRow.insertCell();
            cell1.innerHTML = name;
            cell1.className = "col1";

            cell2 = newRow.insertCell();
            cell2.innerHTML = val;
            cell2.className = "col2";

            tableElement.appendChild(newRow);
        }

        wrapper.appendChild(tableElement);

        if (this.config.showProgressBar){
            var progress = this.calculatePercent(dt);

            var progressBar = document.createElement("progress");
            progressBar.max = 100;
            progressBar.value = progress;

            wrapper.appendChild(progressBar);
        }

		return wrapper;
    },
    
    start: function() {
        var self = this;

        result = "";

        setInterval(function() {
            self.getUpdate();
        }, this.config.updateInterval);
    },

    getUpdate: function(arr){
        var self = this;
        this.updateDom();
    },

    convertTime: function(){

        var date1 = new Date();
        var date2 = new Date("07/20/2020 00:00:00");

        var dt = date2.getTime() - date1.getTime();
        var dd = Math.floor(dt / (1000 * 3600 * 24));
        var ds_tot = Math.floor((dt - dd*1000*3600*24)/1000);
        var dh = (Math.floor(ds_tot/3600));
        var dm = Math.floor((ds_tot - dh*3600)/60);
        var ds = ds_tot - dh*3600 - dm*60;

        if (dh < 10){
            dh = "0" + dh;
        }
        if (dm < 10){
            dm = "0" + dm;
        }
        if (ds < 10){
            ds = "0" + ds;
        }

        timeString = dd + ':' + dh + ':' + dm + ':' + ds;

        return timeString;
    },

    calculatePercent: function(ms_left){
        var percent = (100 * (40*7*24*3600*1000-ms_left)) / (40*7*24*3600*1000);
        return percent.toFixed(5);
    },

    getStyles: function() {
        return [
            this.file('custom.css'), // this file will be loaded straight from the module folder.
        ]
    }
});