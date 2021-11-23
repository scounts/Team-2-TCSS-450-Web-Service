//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()



/**
 * @apiDefine JSONError
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 */



/**
 * @api {post} /contacts Request to create a contact
 * @apiName PostContacts
 * @apiGroup Contacts
 * 
 * @apiDescription Add an unapproved request to the database.
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} username Username of the member being sent a request
 * 
 * @apiSuccess {boolean} Success True when the unapproved contact is added to the database
 * 
 * @apiError (400: Missing required information) {String} message "Missing required information"
 * @apiError (400: SQL Error, Create Contact) {String} message the reported SQL error details
 * @apiError (400: Contact already exists) {String} message "Contact already exists"
 * @apiError (400: Unexpected result from query) {String} message "Unexpected result from query"
 * @apiError (400: SQL Error, Adding contact to DB) {String} message the reported SQL error details
 * @apiError (404: Member not found) {String} message "Member not found"
 * 
 * @apiUse JSONError
 */
 router.post("/", (request, response, next) => {

    // Check for required parameters
    if (!request.body.username) {
        response.status(400).send({
            message: "Missing required information"
        });
    } else {
        next();
    }

}, (request, response, next) => {

    let query = 'SELECT * ' + 
                'FROM Members ' + 
                'WHERE Username = $1 AND NOT MemberID = $2';
    let values = [request.body.username, request.decoded.memberid];
    pool.query(query, values)
        .then(result => {
            // Check that a Member with that Username exists
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Member not found"
                });
            } else if (result.rowCount > 1) {
                response.status(400).send({
                    message: "Unexpected result from query"
                });
            } else {
                response.sender = request.decoded.memberid;
                response.receiver = result.rows[0].memberid;
                response.message = request.decoded.username;
                next();
            }
        }).catch(err => {
        response.status(400).send({
            message: "SQL Error, Create Contact",
            error: err
        });
    });

}, (request, response, next) => {

    let query = 'SELECT * ' + 
                'FROM Contacts ' + 
                'WHERE (MemberID_A = $1 AND MemberID_B = $2) OR (MemberID_A = $2 AND MemberID_B = $1)';
    let values = [response.sender, response.receiver];
    pool.query(query, values)
        .then(result => {
            // Check that a Contact between the two Members doesn't already exist
            if (result.rowCount == 0) {
                next();
            } else if (result.rowCount > 1) {
                response.status(400).send({
                    message: "Unexpected result from query"
                });
            } else {
                response.status(400).send({
                    error: "Contact already exists"
                });
            }
        }).catch(err => {
        response.status(400).send({
            message: "SQL Error, Contact check",
            error: err
        });
    });

}, (request, response, next) => {

    // Add the unapproved contact to the DB (PUT request approves contacts)
    let query = 'INSERT INTO Contacts(MemberID_A, MemberID_B, Verified) ' + 
                'VALUES ($1, $2, $3)';
    let values = [response.sender, response.receiver, 0];
    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 1) {
                next();
            } else {
                response.status(400).send({
                    message: "Unexpected result from query"
                });
            }
        }).catch(err => {
        response.status(400).send({
            message: "SQL Error, Adding contact to DB",
            error: err
        });
    });

}, (request, response) => {
    
    // Success response
    let receiver = response.receiver;
     response.status(201).send({
        success: true,
        message: receiver
    });

});



/**
 * @api {put} /contacts Request to approve a contact request
 * @apiName PutContacts
 * @apiGroup Contacts
 * 
 * @apiDescription Modify a contact to be approved.
 * 
 * @apiHeader {String} Authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} memberId memberId of the member who sent the request
 * 
 * @apiSuccess {boolean} success True when the contact is approved
 * 
 * @apiError (400: Missing Required Information) {String} message "Missing required information"
 * @apiError (400: Unexpected result from query) {String} message "Unexpected result from query"
 * @apiError (400: SQL Error, MemberID check) {String} message the reported SQL error details
 * @apiError (400: SQL Error, Contact check) {String} message the reported SQL error details
 * @apiError (400: SQL Error, Approve contact) {String} message the reported SQL error details
 * @apiError (404: Member Not Found) {String} message "Member not found"
 * @apiError (404: Contact Not Found) {String} message "Contact not found"
 */
router.put("/", (request, response, next) => {

    // Check for required parameters
    if (!request.query.memberId) {
        response.status(400).send({
            message: "Missing required information"
        });
    } else {
        next();
    }

}, (request, response, next) => { 

    let query = 'SELECT * ' + 
                'FROM Members ' + 
                'WHERE MemberID = $1';
    let values = [request.query.memberId];
    pool.query(query, values)
        .then(result => {
            // Check that a Member with that MemberID exists
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Member not found"
                });
            } else if (result.rowCount > 1) {
                response.status(400).set({
                    message: "Unexpected result from query"
                });
            } else {
                next();
            }
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error, MemberID check",
                error: err
            });
        });

}, (request, response, next) => {

    let query = 'SELECT * ' +
                'FROM Contacts ' + 
                'WHERE (MemberID_A = $1 AND MemberID_B = $2) OR (MemberID_A = $2 AND MemberID_B = $1);';
    let values = [request.decoded.memberid, request.query.memberId];
    pool.query(query, values)
        .then(result => {
            // Check that a Contact between those MemberIDs exists
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Contact not found"
                });
            } else if (result.rowCount > 1) {
                response.status(400).send({
                    message: "Unexpected result from query"
                });
            } else {
                next();
            }
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error, Contact check",
                error: err
            });
        });

}, (request, response) => {

    // Modify the DB to approve the contact
    let query = 'UPDATE Contacts ' +
                'SET Verified = 1 ' + 
                'WHERE (MemberID_A = $1 AND MemberID_B = $2) OR (MemberID_A = $2 AND MemberID_B = $1);';
    let values = [request.decoded.memberid, request.query.memberId];
   pool.query(query, values)
        .then(result => {
            // Success response
            response.send({
                success: true
            });
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error, Approve Contact",
                error: err
            });
        });

});



/**
 * @api {get} /contacts Request to retrieve contacts of the requestee
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiDescription Retrieves contacts (approved and unapproved) of the requestee.
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiSuccess {boolean} success True when contactReqs and contacts lists are returned
 * @apiSuccess {Object[]} contactsReq List of unapproved contacts
 * @apiSuccess {Object[]} contacts List of approved contacts
 * @apiSuccess {String} memberid MemberID of the member whose contact info is being retrieved
 * @apiSuccess {String} username Username of the member whose contact info is being retrieved
 * @apiSuccess {String} primarykey Unique identifier for the contact
 * @apiSuccess {Number} verified Number representing whether the contact is a contact request (0) or a contact (1)
 * @apiSuccess {String} memberid_a MemberID of the member to send the contact request
 * @apiSuccess {String} memberid_b MemberID of the member to receive the contact request
 *
 * @apiError (400: Unexpected result from query) {String} message "Unexpected result from query"
 * @apiError (400: SQL Error, Retrieve Contacts) {String} message the reported SQL error details
 * @apiError (404: Member Not Found) {String} message "Member not found"
 * 
 * @apiUse JSONError
 */
 router.get("/", (request, response) => { 

    if (request.decoded.memberid) {
        let query = 'SELECT Members.MemberID, Members.Username, Contacts.PrimaryKey, Contacts.Verified, Contacts.MemberID_A, Contacts.MemberID_B ' +
                    'FROM Members, Contacts ' +
                    'WHERE ($1 = Contacts.MemberID_B AND Members.MemberID = Contacts.MemberID_A) OR ($1 = Contacts.MemberID_A AND Members.MemberID = Contacts.MemberID_B)';
        let values = [request.decoded.memberid];
        pool.query(query, values)
            .then(result => {
                let queryRows = result.rows;
                // Holds unapproved contacts
                let contactReqsResponse = [];
                // Holds approved contacts
                let contactsResponse = [];
                queryRows.forEach( function (element) {
                    let verified = element.verified;
                    delete element.verified;
                    if (verified == 0) {
                        if (element.memberid_b == request.decoded.memberid) {
                            contactReqsResponse.push(element);
                        }
                    } else if (verified != 1) {
                        // Can technically happen because Verified is a Number in the database
                        response.status(400).send({
                            message: "Unexpected result from query"
                        });
                    } else {
                        contactsResponse.push(element);
                    }
                });
                // Success response
                response.status(200).send({
                    success: true,
                    contactReqs: contactReqsResponse,
                    contacts: contactsResponse
                });
            })
            .catch(err => {
                response.status(400).send({
                    message: "SQL Error, Retrieve Contacts",
                    error: err
                });
            });
    } else {
        response.status(404).send({
            message: "Member not found"
        });
    }

});



/**
 * @api {delete} /contacts Request to delete a contact
 * @apiName DeleteContacts
 * @apiGroup Contacts
 * 
 * @apiDescription Delete a contact (approved or unapproved).
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam memberId memberId of the other member in the contact
 * 
 * @apiSuccess {boolean} success True when the contact is removed from the database.
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. MemberID must be a number"
 * @apiError (400: Unexpected result from query) {String} message "Unexpected result from query"
 * @apiError (400: SQL Error, Contact Check) {String} message the reported SQL error details
 * @apiError (400: SQL Error, Contact Deletion) {String} message the reported SQL error details
 * @apiError (404: Contact Not Found) {String} message "Contact not found"
 */
 router.delete("/", (request, response, next) => {

    // Check for required parameters
    if (!request.decoded.memberid || !request.query.memberId) {
        response.status(400).send({
            message: "Missing required information"
        });
    } else if ((isNaN(request.decoded.memberid) || isNaN(request.query.memberId))) {
        response.status(400).send({
            message: "Malformed parameter. MemberID must be a number"
        });
    } else {
        next();
    }

}, (request, response, next) => {

    // Check that the Contact exists
    let query = 'SELECT * ' + 
                'FROM Contacts ' + 
                'WHERE (MemberID_A = $1 AND MemberID_B = $2) OR (MemberID_A = $2 AND MemberID_B = $1)';
    let values = [request.decoded.memberid, request.query.memberId];
    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Contact not found"
                });
            } else if (result.rowCount > 1) {
                response.status(400).send({
                    message: "Unexpected result from query"
                });
            } else {
                next();
            }
        }).catch(err => {
        response.status(400).send({
            message: "SQL Error, Contact Check",
            error: err
        });
    });

}, (request, response) => {

    // Delete contact from DB
    let query = 'DELETE ' +
                'FROM Contacts ' + 
                'WHERE (MemberID_A = $1 AND MemberID_B = $2) OR (MemberID_A = $2 AND MemberID_B = $1)';
    let values = [request.decoded.memberid, request.query.memberId];
    pool.query(query, values)
        .then(result => {
            // Success response
            response.send({
                success: true
            });
        }).catch(err => {
        response.status(400).send({
            message: "SQL Error, Contact Deletion",
            error: err
        });
    });
});



module.exports = router;