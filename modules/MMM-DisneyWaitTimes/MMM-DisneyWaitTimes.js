Module.register("MMM-DisneyWaitTimes",{

	defaults: {
		updateInterval: 10 * 60 * 1000,
		ridesToShow: 2,
		displayLength: 3
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function () {
		return ["disney.css"];
	},
	
	getHeader: function() {
		var self = this;
		var headerDiv = document.createElement("div");
		headerDiv.innerHTML = self.data.header;
		
		var timeSpan = document.createElement("span");
		timeSpan.className = "parkTime";
		
		if (self.openingTime != null && self.closingTime != null) {
			timeSpan.innerHTML = self.formatTime(self.openingTime) + " - " + self.formatTime(self.closingTime);
		}
		
		headerDiv.appendChild(timeSpan);
		
		return headerDiv.innerHTML;
	},

	start: function() {
		Log.info("Starting module: " + this.name);

		var self = this;

		self.rides = [];
		self.openingTime;
		self.closingTime;
		self.rideIndex = 0;
		setInterval(function() {
			self.processWaitTimes();
		}, self.config.updateInterval);
		self.processWaitTimes();
		setInterval(function() {
			self.updateDom();
		}, self.config.displayLength*1000);
	},

	getDom: function() {
		var table = document.createElement("table");
		table.className = "small parkHours";
		
		if(this.rides.length == 0){
			return table;
		}
 		
		if (this.rideIndex + this.config.ridesToShow > this.rides.length){
			this.rideIndex = this.rides.length - this.config.ridesToShow;
		}
 		for(var i=this.rideIndex; i < this.rideIndex + this.config.ridesToShow; i++) {
			var ride = this.rides[i];
			var row = document.createElement("tr");
			row.className += "row";
			table.appendChild(row);
			
			var nameCell = document.createElement("td");
			nameCell.className = "bright title";
			nameCell.innerHTML = ride.name;
			row.appendChild(nameCell);

			var timeCell = document.createElement("td");
			timeCell.className = "bright title light time";
			
			if (ride.status == "Closed") {
 				timeCell.innerHTML = "Closed";
			}
			else if (ride.status == "Down") {
				timeCell.innerHTML = "Down";
			}
			else if (ride.status == "Refurbishment") {
				timeCell.innerHTML = "Refurb";
			}
			else {
				timeCell.innerHTML = ride.waitTime;
 			}
			
			row.appendChild(timeCell);
		}
		this.rideIndex += this.config.ridesToShow;
		if(this.rideIndex >= this.rides.length){
			this.rideIndex = 0;
		}
		return table;
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === "POPULATE_WAIT_TIMES_" + this.config.park.name.replace(/ /g,"_")) {
			payload.waitTimes.sort(function(a, b){
				var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
				if (nameA < nameB)
					return -1 
				if (nameA > nameB)
					return 1
				return 0
			})
			
			self.rides = payload.waitTimes;
			
            		self.rideIndex -= self.config.ridesToShow;
	    		if(self.rideIndex < 0){
	    			self.rideIndex = 0;
	    		}
			self.updateDom();
        }
        else if (notification === "POPULATE_OPENING_TIMES_" + this.config.park.name.replace(/ /g,"_")) {
            self.openingTime = payload.openingTime;
            self.closingTime = payload.closingTime;
            self.rideIndex -= self.config.ridesToShow;
	    if(self.rideIndex < 0){
	    	self.rideIndex = 0;
	    }
	    self.updateDom();
        }
	},

	processWaitTimes: function() {
		this.sendSocketNotification("GET_WAIT_TIMES", this.config.park);
	},

	formatTime: function(newDate) {
		var date = new Date(newDate);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		return hours + ':' + minutes + ' ' + ampm;
	}
});
