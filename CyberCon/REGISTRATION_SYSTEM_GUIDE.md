# CyberCon25 Registration System - Complete Guide

## 🎯 System Overview

The CyberCon25 registration system is a complete web-based registration solution that collects student information, processes payments, and sends confirmation emails with unique ticket IDs.

## 📋 Features

### ✅ Registration Form Fields
1. **Full Name** - Text input with validation (letters and spaces only)
2. **Email** - Varsity email validation (@uttara.ac.bd or @uttarauniversity.edu.bd)
3. **Phone** - Formatted as +880XXXXXXXXXX
4. **Student ID** - Numbers only
5. **University** - Pre-filled with "Uttara University"
6. **Department** - Required field for student's department
7. **Transaction ID** - Payment verification
8. **Payment Number** - bKash/Rocket number used for payment

### 🎟️ Ticket Generation
- Random 4-digit ticket ID (1000-9999)
- Displayed immediately after successful registration
- Sent via email confirmation

### 📧 Email Integration
- Automatic confirmation email sent via Google Apps Script
- Professional HTML email template
- Includes all registration details
- Event information (date, time, venue)
- Ticket ID prominently displayed

## 🔧 Technical Components

### 1. HTML Structure (`CyberCon.html`)
- **Pricing Card Section** - "Select Plan" button triggers registration form
- **Registration Form** - Hidden by default, shows when button clicked
- **Success Modal** - Displays ticket ID after successful registration

### 2. JavaScript (`registration-integration.js`)
- Form validation and submission
- Google Apps Script integration
- Ticket ID generation
- Modal management
- Email domain validation
- Phone number formatting

### 3. CSS Styling (`cybercon-form-theme.css`)
- CyberCon themed form design
- Modal styling
- Success animation
- Responsive design

### 4. Google Apps Script Backend
- Receives registration data
- Stores in Google Sheets
- Sends confirmation emails
- Returns success/failure response

## 🚀 How It Works

### User Flow:
1. User clicks "Select Plan" button on pricing card
2. Registration form slides into view
3. User fills all required fields
4. Form validates inputs (email domain, phone format, etc.)
5. JavaScript generates random ticket ID
6. Data sent to Google Apps Script
7. Script saves to Google Sheets
8. Script sends confirmation email
9. Success modal shows ticket ID
10. Form resets and hides

## 📊 Data Flow

```
User Input → Validation → JavaScript
                           ↓
                  Generate Ticket ID
                           ↓
                  Google Apps Script
                           ↓
                    Google Sheets
                           ↓
                  Send Email (Gmail)
                           ↓
                  Success Response
                           ↓
                  Show Modal with Ticket
```

## 🔑 Required Fields Mapping

```javascript
{
    timestamp: "11/19/2025, 12:30:45 PM",
    ticketId: "2501",
    fullName: "Student Name",
    email: "student@uttara.ac.bd",
    phone: "+8801712345678",
    studentId: "2233081405",
    university: "Uttara University",
    department: "Computer Science",
    tshirtSize: "M", // Default
    dietaryRestrictions: "" // Optional
}
```

## 📝 Google Sheets Structure

| Column | Description |
|--------|-------------|
| Timestamp | Registration date/time |
| Ticket ID | Unique 4-digit number |
| Full Name | Student's full name |
| Email | Varsity email address |
| Phone | Contact number |
| Student ID | University student ID |
| University | Institution name |
| Department | Academic department |
| T-Shirt Size | Default: M |
| Dietary Restrictions | Optional field |

## ⚙️ Configuration

### Update Google Apps Script URL
In `registration-integration.js`, line 4:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_DEPLOYED_SCRIPT_URL';
```

### Google Apps Script Setup
1. Go to https://script.google.com
2. Create new project
3. Paste code from `google-apps-script.gs`
4. Update `SHEET_ID` with your Google Sheet ID
5. Deploy as Web App
6. Set permissions: Execute as "Me", Access "Anyone"
7. Copy deployment URL
8. Update `GOOGLE_SCRIPT_URL` in JavaScript

## 🎨 Styling Features

- **CyberCon Themed**: Matches website color scheme
- **Responsive**: Works on mobile, tablet, desktop
- **Animated**: Smooth transitions and hover effects
- **Professional**: Clean, modern design
- **Accessible**: Proper form labels and validation messages

## 🔒 Validation Rules

1. **Email**: Must be @uttara.ac.bd or @uttarauniversity.edu.bd
2. **Phone**: Must start with +880 and have 10 digits
3. **Full Name**: Letters and spaces only
4. **Student ID**: Numbers only
5. **Transaction ID**: Alphanumeric only
6. **All Fields**: Required except dietary restrictions

## 📱 Responsive Behavior

- **Desktop**: Full two-column layout
- **Tablet**: Adjusted spacing
- **Mobile**: Single column, full-width buttons

## 🐛 Error Handling

- Form validation before submission
- Network error handling
- User-friendly error messages
- Alert notifications for success/failure
- Loading overlay during submission

## 📧 Email Template Features

- HTML formatted professional email
- CyberCon branding
- Ticket ID prominently displayed
- Event details table
- Important instructions
- Contact information
- Plain text fallback

## 🔍 Testing Checklist

- [ ] Click "Select Plan" - Form appears
- [ ] Fill all fields - Validation works
- [ ] Invalid email domain - Shows error
- [ ] Submit form - Loading appears
- [ ] Success - Modal shows ticket ID
- [ ] Email received - Check inbox
- [ ] Mobile responsive - Test on phone
- [ ] Form reset - Fields clear after success

## 🎯 Production Deployment

1. Update Google Apps Script URL
2. Test form submission
3. Verify email delivery
4. Check Google Sheets data
5. Test on multiple devices
6. Monitor for errors

## 📞 Support

For issues or questions:
- Email: cybersecurity@club.uttara.ac.bd
- Phone: +880 1919399235

## 🎉 Success!

Your CyberCon25 registration system is now fully functional!
