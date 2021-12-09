const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities').pool

const router = express.Router();


router.get('/:code', (request, response) => {
    //var code = request.params.code;

        let theQuery = "UPDATE MEMBERS SET verification = 1 where code = $1";
        let values = [request.params.code];
        pool.query(theQuery, values);
        // .then(result => {
        //     // response send response saying "your email is now verified"
        //     response.writeHead(200, {'Content-Type': 'text/html'});
        //     response.write('<h' + ' style="color:black">Your email is now verified!</h' + '>');

        // })

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<h' + ' style="color:black">Congratulations, your email is now verified!</h' + '>');

})

module.exports = router