/* global Module */

/* Magic Mirror
 * Module: WeatherForecast
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-AviationWeather",{

	// Default module config.
	defaults: {
		location: false,
		apiKey: "",
		updateInterval: 15 * 60 * 1000 + 1000, // every 15 minutes
		retryDelay: 2500,
		weatherProduct: "metar",
		apiBase: "https://api.checkwx.com",
	},


	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required scripts.
	getStyles: function() {
		return ["avweather.css"];
	},

	// Define required translations.
	getTranslations: function() {
		// The translations for the default modules are defined in the core translation files.
		// Therefor we can just return false. Otherwise we should have returned a dictionary.
		// If you're trying to build your own module including translations, check out the documentation.
		return false;
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		this.weatherText = "Not loaded.";
		this.loaded = false;
		this.scheduleUpdate(100);

		this.updateTimer = null;

	},


	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.weatherText;
		wrapper.className = "dimmed light small weatherText";
		return wrapper;
	},

	// Override getHeader method.
	getHeader: function() {
		return this.config.location + " CURRENT " + this.config.weatherProduct;
	},

	// Override notification handler.
	notificationReceived: function(notification, payload, sender) {
	},

	/* updateWeather(compliments)
	 * Requests new data from openweather.org.
	 * Calls processWeather on successful response.
	 */
	updateWeather: function() {
		if (this.config.appid === "" || this.config.location === "") {
			Log.error("Module improperly configured!");
			self.metarText = "Module improperly configured!";
			return;
		}

		var url = this.config.apiBase + "/" +  this.config.weatherProduct + "/" + this.config.location;
		var self = this;
		var retry = true;

		var weatherRequest = new XMLHttpRequest();
		weatherRequest.open("GET", url, true);
		console.log(self.config.apiKey);
		weatherRequest.setRequestHeader('X-API-Key', self.config.apiKey);
		weatherRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					var parsed = JSON.parse(this.response);
					if(parsed["results"] >= 1) {
						self.weatherText = parsed["data"][0];
					} else {
						self.weatherText("Something went wrong with their response to us.");
					}
				} else if (this.status === 401) {
					self.weatherText = "Uh oh, you made an oopsie!"
				} else {
					self.weatherText="Uh Oh, they made an oopsie!";
				}
				self.updateDom();
				self.scheduleUpdate(self.config.updateInterval);
			}
		};
		weatherRequest.send();
	},

	
	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function() {
			self.updateWeather();
		}, nextLoad);
	},

});
