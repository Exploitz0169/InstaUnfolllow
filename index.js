/* Imports */
const Client = require("./src/client.js");

/* Initialize Client */
const client = new Client({

    /* Instagram Username. */
    username: "username",

    /* Instagram Password. */
    password: "password",

    /* At what rate shall the bot unfollow someone? Ex: '30s' will unfollow someone every 30 seconds. Change this line if you wish.*/
    timer: '30s',

    /* 'reverse' to unfollow oldest first. 'normal' to unfollow newest first. Change this line if you wish.*/
    order: 'reverse'

});

/* Login then start unfollowing immediately */
client.login().then(_ => {
    client.unfollowService.init();
});