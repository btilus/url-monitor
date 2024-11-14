const axios = require("axios");
const cron = require("node-cron");
require("dotenv").config();

const URL_TO_MONITOR = "https://murphybusiness.com/siouxfalls/businesses-for-sale/";
let lastContentHash = "";

const checkForUpdates = async () => {
    try {
        const response = await axios.get(URL_TO_MONITOR);
        const currentHash = Buffer.from(response.data).toString("base64");

        if (lastContentHash && currentHash !== lastContentHash) {
            console.log(`Update detected at ${URL_TO_MONITOR}`);
        } else {
            console.log(`No changes detected.`);
        }
        lastContentHash = currentHash;
    } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
    }
};

cron.schedule("* * * * *", checkForUpdates); // Runs every minute
console.log(`Monitoring ${URL_TO_MONITOR}...`);
