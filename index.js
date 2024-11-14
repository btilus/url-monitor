const axios = require("axios");
const cron = require("node-cron");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
require("dotenv").config();

const URL_TO_MONITOR = "https://murphybusiness.com/siouxfalls/businesses-for-sale/";
let lastContentHash = "";

const checkForUpdates = async () => {
    try {
        // Fetch the page content
        const response = await axios.get(URL_TO_MONITOR);

        // Load the HTML into cheerio
        const $ = cheerio.load(response.data);

        // Extract meaningful content by targeting specific elements
        const content = $("#list_div").text().trim(); // Update selector as needed

        // Create a hash of the extracted content
        const currentHash = Buffer.from(content).toString("base64");

        // Compare hashes to detect changes
        if (lastContentHash && currentHash !== lastContentHash) {
            console.log(`Update detected at ${URL_TO_MONITOR}`);

            // Email notification logic
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false, // Set to true if using port 465
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const mailOptions = {
                from: `"URL Monitor" <${process.env.SMTP_USER}>`,
                to: process.env.TO_EMAIL,
                subject: "Update Detected!",
                text: `An update was detected on ${URL_TO_MONITOR}. Check it out!`,
            };

            await transporter.sendMail(mailOptions);
            console.log("Email notification sent!");
        } else {
            console.log("No changes detected.");
        }

        lastContentHash = currentHash; // Update the last known hash
    } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
    }
};

// Schedule the function to run every minute
cron.schedule("* * * * *", checkForUpdates);
console.log(`Monitoring ${URL_TO_MONITOR}...`);
