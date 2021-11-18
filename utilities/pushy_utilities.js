const Pushy = require('pushy');

// Plug in your Secret API Key 
const pushyAPI = new Pushy(process.env.PUSHY_API_KEY);

//use to send a message to a specific client using the token
function sendMessageToIndividual(token, message) {

    //build the message for Pushy to send
    var data = {
        "type": "msg",
        "message": message,
        "chatid": message.chatid
    }


    // Send push notification via the Send Notifications API 
    // https://pushy.me/docs/api/send-notifications 
    pushyAPI.sendPushNotification(data, token, {}, function (err, id) {
        // Log errors to console 
        if (err) {
            return console.log('Fatal Error', err);
        }

        // Log success 
        console.log('Push sent successfully! (ID: ' + id + ')')
    })
}

//use to send a contact request to a specific client using the token
function sendContactRequestToIndividual(token, message) {

    //build the message for Pushy to send
    let data = {
        "type": "contact",
        "username": message
    };

    // Send push notification via the Send Notifications API
    // https://pushy.me/docs/api/send-notifications
    pushyAPI.sendPushNotification(data, token, {}, function (err, id) {
        // Log errors to console
        if (err) {
            return console.log('Fatal Error', err);
        }

        // Log success
        console.log('Push sent successfully! (ID: ' + id + ')');
    })
}

//add other "sendTypeToIndividual" functions here. Don't forget to export them

module.exports = {
    sendMessageToIndividual, sendContactRequestToIndividual
}