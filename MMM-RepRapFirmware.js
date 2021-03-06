Module.register("MMM-RepRapFirmware",{
    // Default module config.
	defaults: {
        host: "",
        updateInterval: "5000",
        parameters: ["status", "timeLeft", "percent"],
        showProgressBar: true,
	},

	// Override dom generator.
	getDom: function(value) {
        var wrapper = document.createElement("div");

        if (result != ""){
            var tableElement = document.createElement("table");

            var parameters = this.config.parameters;
            for (i = 0; i < parameters.length; i++){
                var name = "";
                var val = "";
                switch(parameters[i]){
                    case "status":
                        name = "Status";
                        val = this.convertStatus(result.status);
                        break;
                    case "percent":
                        name = "Print Progress";
                        val = this.calculatePercent((result.timesLeft.filament), (result.printDuration)) + "%";
                        break;
                    case "timeLeft":
                        name = "Time Left";
                        val = this.convertTime(result.timesLeft.filament);
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

            if (this.config.showProgressBar && result.timesLeft.filament > 0){
                var progress = this.calculatePercent((result.timesLeft.filament), (result.printDuration));

                var progressBar = document.createElement("progress");
                progressBar.max = 100;
                progressBar.value = progress;

                wrapper.appendChild(progressBar);
            }
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

        var xmlhttp = new XMLHttpRequest();
        var url = "http://" + this.config.host + "/rr_status?type=3";

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {                
                result = JSON.parse(xmlhttp.responseText);

                if (self.hidden){
                    self.show(1000);
                }
            }
        };

        


        xmlhttp.open("GET", url, true);
        xmlhttp.onerror = function(){
            if (!self.hidden){
                self.hide(1000);
            }
        }
        xmlhttp.send();

        this.updateDom();
    },

    convertStatus: function(stateVal){
        var state = "";

        switch(stateVal){
            case "C":
                state = "Processing";
                break;
            case "I":
                state = "Idle";
                break;
            case "B":
                state = "Busy";
                break;
            case "P":
                state = "Printing";
                break;
            case "D":
                state = "Decelerating";
                break;
            case "S":
                state = "Stopped";
                break;
            case "R":
                state = "Resuming";
                break;
            case "H":
                state = "Halted";
                break;
            case "F":
                state = "Flashing";
                break;
            case "T":
                state = "Tool Change";
                break;
            case "M":
                state = "Simulating";
                break;
        }

        return state;
    },

    convertTime: function(timeVal){
        var hours = Math.floor(timeVal / (60*60));
        var minutes =  Math.floor((timeVal - (hours * 60 * 60)) / 60);
        var seconds = Math.round((timeVal - (hours * 60 * 60) - (minutes * 60)));

/*        if (minutes < 10){
            minutes = "0" + minutes;
        }
        if (seconds < 10){
            seconds = "0" + seconds;
        }*/

        var timeString = "";

        if (hours > 0){
            timeString += hours + "h ";
            timeString += minutes + "m ";
        }
        else if (minutes > 0) {
            timeString += minutes + "m ";
        }
        timeString += seconds + "s";

        return timeString;
    },

    calculatePercent: function(timeLeft, printDuration){
        var percent = (100 * printDuration) / (timeLeft + printDuration);
        return Math.round(percent);
    },

    getStyles: function() {
        return [
            this.file('custom.css'), // this file will be loaded straight from the module folder.
        ]
    }
});