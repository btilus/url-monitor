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

const sendTestEmail = async () => {
    console.log("sendTestEmail() function called"); // Add log here
    try {
        const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // Use true for port 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        console.log("SMTP transporter created"); // Add log here

        const mailOptions = {
            from: `"URL Monitor Test" <${process.env.SMTP_USER}>`,
            to: process.env.TO_EMAIL,
            subject: "Test Email from URL Monitor",
            text: "This is a test email to verify the email credentials.",
        };

        console.log("Sending email..."); // Add log here
        await transporter.sendMail(mailOptions);
        console.log("Test email sent successfully!"); // Add log here
    } catch (error) {
        console.error(`Error sending test email: ${error.message}`); // Log errors
    }
};

// Only send a test email if the SEND_TEST_EMAIL variable is true
sendTestEmail();
