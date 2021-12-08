//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

/**
 * @api {get} /memberchats Request to get ChatIDs of Chats the requestee is in
 * @apiname GetMemberChats
 * @apigroup MemberChats
 * 
 * @apiDescription Retrieves chats the requestee is in.
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiSuccess {boolean} success True when the list of chats the requestee is in is returned
 * @apiSuccess {Object[]} chatlist List of chats the requestee is in
 * @apiSuccess {String} chatid ChatID of a chat the member is in
 * @apiSuccess {String} memberid MemberID of the member making the request
 *
 * @apiError (400: SQL Error, Retrieve Chats of Requestee) {String} message the reported SQL error details
 * @apiError (404: Member Not Found) {String} message "Member not found"
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