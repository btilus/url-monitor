const nodemailer = require("nodemailer");

(async () => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // SMTP server
            port: 587, // Port for STARTTLS
            secure: false, // Use true for port 465
            auth: {
                user: "brandon@projectstart.co", // Your email address
                pass: "vurp lgct qteb uwik", // App Password or SMTP password
            },
        });

        const info = await transporter.sendMail({
            from: '"URL Monitor Test" <brandon@projectstart.co>', // Sender
            to: "brandon@projectstart.co", // Recipient
            subject: "Test Email from Nodemailer",
            text: "This is a test email to verify SMTP credentials.",
        });

        console.log("Email sent successfully: ", info.messageId);
    } catch (error) {
        console.error("Error sending email: ", error.message);
    }
})();
