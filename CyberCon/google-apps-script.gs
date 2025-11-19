/**
 * Google Apps Script for CyberCon Registration
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create New Project
 * 3. Paste this code
 * 4. Update SHEET_ID with your Google Sheet ID
 * 5. Deploy as Web App:
 *    - Click Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the deployment URL
 * 7. Update registration.js with your deployment URL
 */

// Your Google Sheet ID from the URL
const SHEET_ID = '14tvZUn3Yb0xSZsI9CZSPIS7nXpXxroVYOd5lpdUHFRw';
const SHEET_NAME = 'CyberCon25 - Registration'; // Sheet tab name

// Email configuration
const SENDER_EMAIL = 'cybersecurity@club.uttara.ac.bd'; // Update with your email
const EVENT_NAME = 'CyberCon25';
const EVENT_DATE = '1st December, 2025';
const EVENT_TIME = '8:00 AM';
const EVENT_VENUE = 'Multipurpose Hall, Uttara University';

/**
 * Handle POST requests from the registration form
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      sheet.appendRow([
        'Timestamp',
        'Ticket ID',
        'Full Name',
        'Email',
        'Phone',
        'Student ID',
        'University',
        'Department',
        'Batch',
        'Section',
        'Queries',
        'Payment Number',
        'Transaction ID'
      ]);
    }
    
    // Append the registration data
    sheet.appendRow([
      data.timestamp,
      data.ticketId,
      data.fullName,
      data.email,
      data.phone,
      data.studentId,
      data.university,
      data.department,
      data.batch,
      data.section,
      data.queries || '',
      data.paymentNumber,
      data.transactionId
    ]);
    
    // Send confirmation email
    sendConfirmationEmail(data);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration successful',
      ticketId: data.ticketId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Registration failed: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send confirmation email to the registrant
 */
function sendConfirmationEmail(data) {
  try {
    const subject = `Registration Confirmed - ${EVENT_NAME} | Ticket ID: ${data.ticketId}`;
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; }
        .email-wrapper { max-width: 650px; margin: 20px auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #233886 0%, #1a2a65 100%); padding: 40px 30px; text-align: center; }
        .logo-container { display: block; text-align: center; margin-bottom: 20px; }
        .logo-container img { max-height: 80px; width: auto; display: inline-block; }
        .header h1 { color: #ffffff; font-size: 26px; font-weight: 600; margin: 0; letter-spacing: 0.5px; }
        .header p { color: #b8c1ec; font-size: 14px; margin-top: 8px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 16px; color: #333333; margin-bottom: 20px; }
        .intro-text { font-size: 15px; color: #555555; margin-bottom: 30px; line-height: 1.8; }
        .ticket-container { background: linear-gradient(135deg, #233886 0%, #1a2a65 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; box-shadow: 0 4px 15px rgba(35, 56, 134, 0.2); }
        .ticket-label { color: #b8c1ec; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
        .ticket-id { color: #ffffff; font-size: 42px; font-weight: 700; letter-spacing: 5px; font-family: 'Courier New', monospace; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); }
        .section-title { font-size: 18px; font-weight: 600; color: #233886; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #ff0037; }
        .details-table { width: 100%; margin: 20px 0; border-collapse: collapse; background: #f9f9f9; }
        .details-table td { padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-size: 14px; }
        .details-table td:first-child { font-weight: 600; color: #233886; width: 35%; background: #f0f0f0; }
        .details-table td:last-child { color: #555555; }
        .details-table tr:last-child td { border-bottom: none; }
        .important-notice { background-color: #fff3cd; border-left: 4px solid #ff0037; padding: 20px; margin: 25px 0; border-radius: 4px; }
        .important-notice strong { color: #ff0037; font-size: 16px; display: block; margin-bottom: 10px; }
        .important-notice ul { margin: 10px 0 0 20px; color: #555555; line-height: 1.8; }
        .important-notice li { margin-bottom: 6px; }
        .closing { font-size: 15px; color: #555555; margin: 30px 0 10px 0; line-height: 1.8; }
        .signature { font-size: 15px; color: #333333; margin-top: 20px; }
        .signature strong { color: #233886; }
        .footer { background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0; }
        .footer p { font-size: 12px; color: #666666; line-height: 1.6; margin: 5px 0; }
        .footer-links { margin-top: 15px; }
        .footer-links a { color: #233886; text-decoration: none; margin: 0 10px; font-size: 12px; }
        .footer-links a:hover { text-decoration: underline; }
        @media only screen and (max-width: 600px) {
            .email-wrapper { margin: 0; }
            .content { padding: 25px 20px; }
            .header { padding: 30px 20px; }
            .logo-container img { max-height: 70px; }
            .ticket-id { font-size: 32px; }
            .details-table td { padding: 10px; font-size: 13px; }
            .footer-logos { flex-direction: column; gap: 15px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <div class="logo-container">
                <img src="https://cybersecurity.club.uttara.ac.bd/CyberCon/Assets/images/logo/CyberCon.png" alt="CyberCon 2025">
            </div>
            <p>Learn, Hack, Defend</p>
            <h1>Registration Confirmed</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear <strong>${data.fullName}</strong>,
            </div>
            
            <div class="intro-text">
                Thank you for registering for <strong>${EVENT_NAME}</strong>. We are pleased to confirm that your registration has been successfully processed. This email serves as your official confirmation and contains important details about your participation.
            </div>
            
            <div class="ticket-container">
                <div class="ticket-label">Your Ticket ID</div>
                <div class="ticket-id">${data.ticketId}</div>
            </div>
            
            <div class="section-title">Event Information</div>
            <table class="details-table">
                <tr><td>Date</td><td>${EVENT_DATE}</td></tr>
                <tr><td>Time</td><td>${EVENT_TIME}</td></tr>
                <tr><td>Venue</td><td>${EVENT_VENUE}</td></tr>
            </table>
            
            <div class="section-title">Registration Details</div>
            <table class="details-table">
                <tr><td>Full Name</td><td>${data.fullName}</td></tr>
                <tr><td>Student ID</td><td>${data.studentId}</td></tr>
                <tr><td>Email Address</td><td>${data.email}</td></tr>
                <tr><td>Contact Number</td><td>${data.phone}</td></tr>
                <tr><td>University</td><td>${data.university}</td></tr>
                <tr><td>Department</td><td>${data.department}</td></tr>
                <tr><td>Batch</td><td>${data.batch}</td></tr>
                <tr><td>Section</td><td>${data.section}</td></tr>
            </table>
            
            <div class="section-title">Payment Details</div>
            <table class="details-table">
                <tr><td>Payment Number</td><td>${data.paymentNumber}</td></tr>
                <tr><td>Transaction ID</td><td>${data.transactionId}</td></tr>
                <tr><td>Amount Paid</td><td>200 BDT</td></tr>
            </table>
            
            <div class="important-notice">
                <strong>Important Instructions</strong>
                <ul>
                    <li>Please save this email for your records. You will need to present your Ticket ID <strong>${data.ticketId}</strong> at the registration desk.</li>
                    <li>Bring a valid student ID card for identity verification at the venue.</li>
                    <li>Arrive at least 30 minutes before the event start time for check-in.</li>
                    <li>Entry will only be permitted with a valid Ticket ID and student identification.</li>
                </ul>
            </div>
            
            <div class="closing">
                We look forward to welcoming you at ${EVENT_NAME}. Should you have any questions or require further assistance, please do not hesitate to contact us.
            </div>
            
            <div class="signature">
                Best regards,<br>
                <strong>Cyber Security Club</strong><br>
                Uttara University
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Cyber Security Club, Uttara University. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <div class="footer-links">
                <a href="https://cybersecurity.club.uttara.ac.bd">Visit Website</a> |
                <a href="https://cybersecurity.club.uttara.ac.bd/CyberCon/CyberCon.html">Event Details</a>
            </div>
        </div>
    </div>
</body>
</html>`;
    
    // Plain text version
    const textBody = `
REGISTRATION CONFIRMED
${EVENT_NAME}

Dear ${data.fullName},

Thank you for registering for ${EVENT_NAME}. We are pleased to confirm that your registration has been successfully processed.

YOUR TICKET ID: ${data.ticketId}

EVENT INFORMATION
-----------------
Date: ${EVENT_DATE}
Time: ${EVENT_TIME}
Venue: ${EVENT_VENUE}

REGISTRATION DETAILS
--------------------
Full Name: ${data.fullName}
Student ID: ${data.studentId}
Email Address: ${data.email}
Contact Number: ${data.phone}
University: ${data.university}
Department: ${data.department}
Batch: ${data.batch}
Section: ${data.section}

PAYMENT DETAILS
---------------
Payment Number: ${data.paymentNumber}
Transaction ID: ${data.transactionId}
Amount Paid: 200 BDT

IMPORTANT INSTRUCTIONS
----------------------
- Please save this email for your records. You will need to present your Ticket ID ${data.ticketId} at the registration desk.
- Bring a valid student ID card for identity verification at the venue.
- Arrive at least 30 minutes before the event start time for check-in.
- Entry will only be permitted with a valid Ticket ID and student identification.

We look forward to welcoming you at ${EVENT_NAME}. Should you have any questions or require further assistance, please do not hesitate to contact us.

Best regards,
Cyber Security Club
Uttara University

---
This is an automated message. Please do not reply to this email.
(c) ${new Date().getFullYear()} Cyber Security Club, Uttara University. All rights reserved.
`;
    
    GmailApp.sendEmail(data.email, subject, textBody, {
      htmlBody: htmlBody,
      name: 'CyberCon25'
    });
    
  } catch (error) {
    Logger.log('Email sending error: ' + error.toString());
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'CyberCon Registration API is running',
    message: 'Use POST requests to submit registrations'
  })).setMimeType(ContentService.MimeType.JSON);
}
