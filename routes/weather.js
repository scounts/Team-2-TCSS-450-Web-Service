const API_KEY = process.env.OPENWEATHER_KEY

const express = require('express')
const fetch = require('node-fetch');

//request module is needed to make a request to a web service
//const request = require('request')

const router = express.Router()

router.get('/current', async (req, res) => {
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

            const tempature = {
                current_temp: (Math.round((data.main.temp - 273.15) * (9 / 5) + 32)) + "° F"
            };
            
            res.send({location, tempature})
        });

    });

    router.get('/hourly', async (req, res) => {
        const url =`https://api.openweathermap.org/data/2.5/onecall?lat=47.247306&lon=-122.438352&exclude=current,minutely,daily,alerts&appid=2949d398b211903e2b018f44701ab9e7`
         await fetch(url)
             .then((response) => response.json())
             .then((data) => {
     
                 res.send(data)
             });
            
     
         });

    router.get('/daily', async (req, res) => {
        const url =`https://api.openweathermap.org/data/2.5/forecast?zip=98402,&appid=2949d398b211903e2b018f44701ab9e7`
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
         
                res.send(data)
            });
                
         
        });


module.exports = router

