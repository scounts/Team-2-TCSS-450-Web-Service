//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

/**
 * @api {get} Request to get chatIds of chats the requestee is in
 */
router.get("/", (request, response) => {

    if (request.decoded.memberid) {
        let query = 'SELECT * ' +
                    'FROM ChatMembers ' +
                    'WHERE (ChatMembers.MemberID = $1) ';
        let values = [request.decoded.memberid];
        pool.query(query, values)
        .then(result => {
            let queryRows = result.rows;
            let responseChats = [];
            queryRows.forEach( function (element) {
                responseChats.push(element);
            });
            // Success response
            response.status(200).send({
                success: true,
                chats: responseChats
            });
        })
        .catch(err => {
            response.status(400).send({
                message: "SQL Error, Retrieve Chats of Requestee",
                error: err
            });
        });
    } else {
        response.status(404).send({
            message: "Member not found"
        });
    }

});


module.exports = router;