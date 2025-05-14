const nodemailer = require('nodemailer');

// Create reusable transporter object using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // This should be the app password generated from Google
    }
});

const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: `"SkillSwap Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - SkillSwap',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4066FF;">Reset Your Password</h2>
                <p>You requested to reset your password. Click the button below to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #4066FF; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 5px;
                              display: inline-block;
                              font-family: Arial, sans-serif;">
                        Reset Password
                    </a>
                </div>
                <p style="margin-top: 20px;">Or copy and paste this URL into your browser:</p>
                <p style="word-break: break-all; color: #4066FF;">
                    <a href="${resetUrl}" style="color: #4066FF; text-decoration: none;">${resetUrl}</a>
                </p>
                <p><strong>Note:</strong> If the link opens in a new tab, you can copy and paste the URL into the same tab to continue.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    This is an automated email, please do not reply.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        throw error; // Let the controller handle the error
    }
};
// Verify transporter configuration
const verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        return true;
    } catch (error) {
        throw new Error(`Email configuration error: ${error.message}`);
    }
};

module.exports = { sendResetEmail, verifyEmailConfig, transporter };