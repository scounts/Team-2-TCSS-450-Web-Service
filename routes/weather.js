const API_KEY = process.env.OPENWEATHER_KEY

const express = require('express')
const fetch = require('node-fetch');

//request module is needed to make a request to a web service
//const request = require('request')

const router = express.Router()

router.get('/current', async (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&zip=98402,&appid=${API_KEY}`
    await fetch(url)
        .then((response) => response.json())
        .then((data) => {

            const location = {
                city: data.name,
                country: data.sys.country,
                desc: data.weather[0],
                icon: data.weather[4]
            };

            const tempature = {
                //current_temp: (Math.round((data.main.temp - 273.15) * (9 / 5) + 32)) + "° F"
                current_temp: Math.round(data.main.temp) + "° F"
            };
            
            res.send({location, tempature})
        });

    });

    router.get('/hourly', async (req, res) => {
        const url =`https://api.openweathermap.org/data/2.5/onecall?lat=47.247306&lon=-122.438352&exclude=current,minutely,daily,alerts&units=imperial&appid=${API_KEY}`
         await fetch(url)
             .then((response) => response.json())
             .then((data) => {
     
                 res.send(data)
             });
            
     
         });

    router.get('/daily', async (req, res) => {
        const url =`https://api.openweathermap.org/data/2.5/forecast?units=imperial&zip=98402,&appid=${API_KEY}`
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
         
                res.send(data)
            });
                
         
        });


module.exports = router

