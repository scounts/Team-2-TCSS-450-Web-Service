const API_KEY = process.env.OPENWEATHER_KEY

const express = require('express')
const fetch = require('node-fetch');

//request module is needed to make a request to a web service
//const request = require('request')

const router = express.Router()

//const https = require('https')


router.get('/current', async (req, res) => {
   //let weather = []
   //let location = []
    //const url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&zip=98498,&appi8d=${API_KEY}`
    const url = `https://api.openweathermap.org/data/2.5/weather?&zip=98402,&appid=2949d398b211903e2b018f44701ab9e7`;
    //const url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&zip=98498,&appi8d=$2949d398b211903e2b018f44701ab9e7`
    await fetch(url)
        .then((response) => response.json())
        .then((data) => {

            const location = {
                city: data.name,
                country: data.sys.country,
            };
            //location.push(geo);


            const forecast = {
                current_temp: (Math.round(data.main.temp - 273.15) * (9 / 5) + 32) + "° F"
            };
            //weather.push(forecast);

            res.send({location, forecast})
        });
        
    
        
        //res.send({location})
        //res.send(data)
        


    });

module.exports = router

