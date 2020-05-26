const ms = require("ms");

class Unfollow {

    constructor (time, order = 'reverse', ig, auth) {
        this.time = ms(time);
        this.order = order;
        this.ig = ig;
        this.auth = auth;
        this.users = [];
    }

    async init () {

        console.log(`Unfollow service initialized. Unfollowing users every ${this.time}ms from ${this.order === "reverse" ? 'oldest to newest' : 'newest to oldest'}.`);

        /* Initial population of array */
        await this.populate();

        /* Runs at the given interval */
        setInterval(this.unfollow.bind(this), this.time);
    }

    async unfollow () {

        /* If there are no more users in the array, get some more */
        if(!this.users.length) await this.populate();

        console.log(`Unfollowing user: ${this.users[0].username}`);

        /* Unfollow the user */
        await this.ig.friendship.destroy(this.users[0].pk);

        /* Move on to the next user */
        this.users.shift();

    }

    populate () {
        console.log(`Populating user array.`);
        return new Promise(async (res, rej) => {

            /* Fetch users following list */
            const following = await this.ig.feed.accountFollowing(this.auth.pk).request();

            /* If the user is following zero people, abort. */
            if(!following.users.length) {
                console.log("No more users left to unfollow. Exiting process.");
                process.exit();
            }

            /* If the order is 'reverse' then sort the array from oldest following to newest following. Vice versa. */
            this.order === "reverse" ? this.users.push(...following.users.reverse()) : this.users.push(...following.users);

            /* Resolve the promise */
            res();

        });

    }

}


module.exports = Unfollow;