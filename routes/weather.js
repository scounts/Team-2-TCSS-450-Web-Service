const API_KEY = process.env.OPENWEATHER_KEY

const express = require('express')
const fetch = require('node-fetch');

//request module is needed to make a request to a web service
//const request = require('request')

const router = express.Router()

router.get('/current', async (req, res) => {
    //let latitude = req.query.latitude;
    //let longitude = req.query.longitude;
    let latitude = 37.421779;
    let longitude = -122.084563;
    //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    //const url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&zip=98402,&appid=${API_KEY}`
    const url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    await fetch(url)
        .then((response) => response.json())
        .then((data) => {

            const location = {
                city: data.name,
                country: data.sys.country,
                desc: data.weather[0],
                icon: data.weather[4]
            };

            const temperature = {
                //current_temp: (Math.round((data.main.temp - 273.15) * (9 / 5) + 32)) + "° F"
                current_temp: Math.round(data.main.temp) + "° F",
                high_temp: Math.round(data.main.temp_max) + "°",
                low_temp:  Math.round(data.main.temp_min) + "°",
            };
            
            res.send({location, temperature})
        });

    });

    router.get('/hourly', async (req, res) => {
        //let latitude = req.query.latitude;
        //let longitude = req.query.longitude;
        latitude = 37.421779;
        longitude = -122.084563;
        const url =`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,daily,alerts&units=imperial&appid=${API_KEY}`
         await fetch(url)
             .then((response) => response.json())
             .then((data) => {
     
                const hours = {
                    hour1: data.hourly[0],
                    hour2: data.hourly[1]
                };

                 res.send(hours)
             });
            
     
         });

    router.get('/daily', async (req, res) => {
        //let latitude = req.query.latitude;
        //let longitude = req.query.longitude;
        latitude = 37.421779;
        longitude = -122.084563;
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${API_KEY}`
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
         
                var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

                const day1 = {
                    high: Math.round(data.daily[1].temp.max),
                    low:  Math.round(data.daily[1].temp.min),
                    date: week[(new Date(data.daily[1].dt * 1000)).getDay()],
                    desc: data.daily[1].weather[0].main

                };
                const day2 = {
                    high: Math.round(data.daily[2].temp.max),
                    low:  Math.round(data.daily[2].temp.min),
                    date: week[(new Date(data.daily[2].dt * 1000)).getDay()],
                    desc: data.daily[2].weather[0].main

                };
                const day3 = {
                    high: Math.round(data.daily[3].temp.max),
                    low:  Math.round(data.daily[3].temp.min),
                    date: week[(new Date(data.daily[3].dt * 1000)).getDay()],
                    desc: data.daily[3].weather[0].main

                };
                const day4 = {
                    high: Math.round(data.daily[4].temp.max),
                    low:  Math.round(data.daily[4].temp.min),
                    date: week[(new Date(data.daily[4].dt * 1000)).getDay()],
                    desc: data.daily[4].weather[0].main

                };
                const day5 = {
                    high: Math.round(data.daily[5].temp.max),
                    low:  Math.round(data.daily[5].temp.min),
                    date: week[(new Date(data.daily[5].dt * 1000)).getDay()],
                    desc: data.daily[5].weather[0].main

                };
                const day6 = {
                    high: Math.round(data.daily[6].temp.max),
                    low:  Math.round(data.daily[6].temp.min),
                    date: week[(new Date(data.daily[6].dt * 1000)).getDay()],
                    desc: data.daily[6].weather[0].main

                };
                const day7 = {
                    high: Math.round(data.daily[7].temp.max),
                    low:  Math.round(data.daily[7].temp.min),
                    date: week[(new Date(data.daily[7].dt * 1000)).getDay()],
                    desc: data.daily[7].weather[0].main

                };

                res.send({day1, day2, day3, day4, day5, day6, day7})
                // res.send(day0)
                // res.send(data)
            });
                
         
        });


module.exports = router

