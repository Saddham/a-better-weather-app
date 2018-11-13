const apiKey = 'a691a305351dcd2571647cde5bad7bdb'
const request = require('request')
const fahrenheitToCelsius = require('fahrenheit-to-celsius')
const { getCode, getName } = require('country-list')
const express = require('express')
const weather = new express.Router()

weather.get('/', function (req, res) {
  res.render('pages/weather/index', { weather: null, error: null })
})

weather.post('/', function (req, res) {
  let city = req.body.city
  let countryName = req.body.country
  let countryCode = getCode(countryName)
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=imperial&appid=${apiKey}`
  request(url, function (err, response, body) {
    if (err) {
      res.render('pages/weather/index', {
        weather: null,
        error: 'Error, please try again'
      })
    } else {
      let weather = JSON.parse(body)
      if (weather.main === undefined) {
        res.render('pages/weather/index', {
          weather: null,
          error: 'Error, please try again'
        })
      } else {
        countryName = getName(weather.sys.country)
        let weatherText = `It's ${fahrenheitToCelsius(weather.main.temp).toFixed(2)} degrees Celcius in ${city}, ${countryName}!`
        res.render('pages/weather/index', {
          weather: weatherText,
          error: null
        })
      }
    }
  })
})

module.exports = weather
