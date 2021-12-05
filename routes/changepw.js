//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

const generateHash = require('../utilities').generateHash

const router = express.Router()




/**
 * @api {post} /changepw Request to change password
 * @apiName PostChangePW
 * @apiGroup ChangePW
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} newpw the new password
 * @apiParam {String} confirmation the new password retyped
 * 
 * @apiParamExample {json} Request-Body-Example:
 *  {
 *      "newpw":"IdenticalPW1!",
 *      "confirmation":"IdenticalPW1!"
 *  }
 * 
 * @apiSuccess (Success 201) {boolean} success true when the password is changed
 * @apiSuccess (Success 201) {String} message Password Changed
 * 
 * @apiError (400: SQL Error, Update Password) {String} message "SQL Error, Update Password"
 * @apiError (400: Unexpected result from query) {String} message "Unexpected result from query"
 * @apiError (400: SQL Error, Get Salt) {String} message "SQL Error, Get Salt"
 * @apiError (400: Confirmation does not match) {String} message "Confirmation does not match newpw"
 * @apiError (400: Missing required information) {String} message "Missing required information"
 * 
 */
router.post("/", (request, response) => {
    const newpw = request.body.newpw
    const confirmation = request.body.confirmation

    if (isStringProvided(newpw) &&
        isStringProvided(confirmation) &&
        newpw === confirmation) {

        let query = 'SELECT Salt ' +
                    'FROM Members ' +
                    'WHERE MemberID = $1'
        let values = [request.decoded.memberid];
        pool.query(query, values)
            .then(result => {

                if (result.rowCount = 1) {
                
                    let salt = result.rows[0].salt;
                    let salted_hash = generateHash(request.body.newpw, salt); 

                    let query = 'UPDATE Members ' +
                                'SET Password = $1 ' +
                                'WHERE MemberID = $2'
                    let values = [salted_hash, request.decoded.memberid];

                    pool.query(query, values)
                        .then(result => {
                            response.send({
                            success: true,
                            message: "Password changed"
                            })
                        }).catch(err => {
                            response.status(400).send({
                                message: "SQL Error, Update Password",
                                error: err
                            });
                        });
                } else {
                    response.status(400).send({
                        message: "Unexpected result from query"
                    });
                }

            }).catch(err => {
                response.status(400).send({
                    message: "SQL Error, Get Salt",
                    error: err
                });
            });


    } else if (newpw !== confirmation) {
        response.status(400).send({
            message: "Confirmation does not match newpw"
        })
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }

});


module.exports = router