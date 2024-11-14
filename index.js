const axios = require("axios");
const cron = require("node-cron");
const cheerio = require("cheerio");
require("dotenv").config();

const URL_TO_MONITOR = "https://murphybusiness.com/siouxfalls/businesses-for-sale/";
let lastContentHash = "";

const checkForUpdates = async () => {
    try {
        // Fetch the page content
        const response = await axios.get(URL_TO_MONITOR);

        // Load the HTML into cheerio
        const $ = cheerio.load(response.data);

        // Extract meaningful content by targeting specific elements (update selector as needed)
        const content = $("#list_div").text().trim(); // Replace "#main-content" with the correct selector

        // Create a hash of the extracted content
        const currentHash = Buffer.from(content).toString("base64");

        // Compare hashes to detect changes
        if (lastContentHash && currentHash !== lastContentHash) {
            console.log(`Update detected at ${URL_TO_MONITOR}`);
        } else {
            console.log(`No changes detected.`);
        }
        lastContentHash = currentHash; // Update the last known hash
    } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
    }
};

// Schedule the function to run every minute
cron.schedule("* * * * *", checkForUpdates);
console.log(`Monitoring ${URL_TO_MONITOR}...`);
