const express = require('express')
const v1 = new express.Router()
const weather = require('./weather')

v1.use('/weather', weather)

module.exports = v1
