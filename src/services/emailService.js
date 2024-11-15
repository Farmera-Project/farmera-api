import { mailTransporter } from "../utils/mail.js";

export const sendEmail = async (email) => {
const subject = 'Welcome to Farmera!';

const message = `
<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f9;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
                text-align: center;
            }
            p {
                color: #555;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                color: #777;
                font-size: 12px;
                margin-top: 30px;
            }
            .button {
                display: inline-block;
                background-color: #28a745;
                color: #fff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 4px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Farmera!</h1>
            <p>Thank you for joining us! We’re thrilled to connect you with farmers and suppliers in the poultry industry.</p>
            <p>Get started by exploring our platform, where you can browse feed options, manage your orders, and stay informed on the latest in poultry feed distribution.</p>
            <p>Should you have any questions, feel free to reach out to our support team for assistance.</p>
            <p><a href="https://yourpoultryapp.com/login" class="button">Log In to Your Account</a></p>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Farmera. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
`;

const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: subject,
    html: message
};

try {
    await mailTransporter.sendMail(mailOptions);
} catch (error) {
    console.error('Error sending welcome email:', error);
}
};