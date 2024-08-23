/* exported vendor */

/* Magic Mirror
 * Vendor File Definition
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var vendor = {
    "day.js": "node_modules/dayjs/dayjs.min.js",
	"weather-icons.css": "node_modules/weathericons/css/weather-icons.css",
	"weather-icons-wind.css": "node_modules/weathericons/css/weather-icons-wind.css",
	"font-awesome.css": "css/font-awesome.css",
	"nunjucks.js": "node_modules/nunjucks/browser/nunjucks.min.js"
};

if (typeof module !== "undefined"){module.exports = vendor;}
