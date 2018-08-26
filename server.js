const bodyParser = require('body-parser');
const request = require('request');
const fahrenheitToCelsius = require('fahrenheit-to-celsius');
const countryDataLookup = require('country-data').lookup;
const express = require('express');
const app = express();

const apiKey = 'a691a305351dcd2571647cde5bad7bdb';

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/weather/index', {weather: null, error: null});
});

app.post('/', function(req, res) {
	let city = req.body.city;
	let country = req.body.country;
	let countryCode = countryDataLookup.countries({name: country})[0];
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=imperial&appid=${apiKey}`
	request(url, function(err, response, body) {
		if (err) {
			res.render('pages/weather/index', {
				weather: null,
				error: 'Error, please try again'
			});
		} else {
			let weather = JSON.parse(body)
			if (weather.main == undefined) {
				res.render('pages/weather/index', {
					weather: null,
					error: 'Error, please try again'
				});
			} else {
				let weatherText = `It's ${fahrenheitToCelsius(weather.main.temp).toFixed(2)} degrees Celcius in ${city}, ${country}!`;
				res.render('pages/weather/index', {
					weather: weatherText,
					error: null
				});
			}
		}
	});
})

app.listen(3000, function() {
	console.log('Live at port 3000!');
});