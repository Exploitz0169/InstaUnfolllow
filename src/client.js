/* Imports */
const { IgApiClient } = require("instagram-private-api");
const Unfollow = require("./unfollowService.js");
const inquirer = require("inquirer");

class Client {

    constructor (options) {

        /* Throw error if incorrect type is given */
        if (typeof options !== "object")
            throw new Error (`Type 'object' is expected for options. Type given: ${typeof options}`);

        /* Throw error if username or password is not supplied. */
        if (!options.password || !options.username)
            throw new Error (`Username or password was not given.`);

        /* Non-writable username variable */
        Object.defineProperty(this, "_username", {
            value: options.username,
            enumerable: false,
            writable: false
        });

        /* Non-writable password variable */
        Object.defineProperty(this, "_password", {
            value: options.password,
            enumerable: false,
            writable: false
        });

        /* Rate at which bot unfollows users. */
        this.timer = options.timer || '30s';

        /* Instagram Private API */
        this.ig = null;

        this.auth = null;

        this.unfollowService = null;

        this.order = options.order;

    }

    async login () {

        console.log("Instagram login starting.");

        /* Instantiate private api class */
        this.ig = new IgApiClient();

        /* Generate device */
        this.ig.state.generateDevice(this._username);

        /* Login */
        try {

            this.auth = await this.ig.account.login(this._username, this._password);

        } catch (e) {

            console.log(`Checkpoint detected during login.`);

            await this.ig.challenge.auto(true);

            const { code } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'code',
                    message: 'Code:'
                }
            ])

            await this.ig.challenge.sendSecurityCode(code);

            console.log(`Checkpoint cleared.`);

        } 
        
        

        /* Pass information to unfollow service */
        this.unfollowService = new Unfollow(this.timer, this.order, this.ig, this.auth);

        console.log("Instagram login successful.");

        return this;


    }

}

module.exports = Client;