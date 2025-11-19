<?php
/**
 * CyberCon 2025 - Contact Form Handler
 * Process contact form submissions
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set content type
header('Content-Type: application/json');

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Check if form is submitted via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Initialize response array
    $response = array(
        'success' => false,
        'message' => ''
    );
    
    // Get form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? sanitize_input($_POST['subject']) : 'Contact Form Submission';
    $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
    
    // Validation
    $errors = array();
    
    if (empty($name)) {
        $errors[] = "Name is required";
    } elseif (strlen($name) < 2) {
        $errors[] = "Name must be at least 2 characters";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!validate_email($email)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    } elseif (strlen($message) < 10) {
        $errors[] = "Message must be at least 10 characters";
    }
    
    // Check for errors
    if (!empty($errors)) {
        $response['message'] = implode(", ", $errors);
        echo json_encode($response);
        exit;
    }
    
    // Email configuration
    $to = "info@cybercon.org"; // Change this to your email
    $email_subject = "CyberCon Contact: " . $subject;
    
    // Email body
    $email_body = "You have received a new message from the CyberCon website contact form.\n\n";
    $email_body .= "Here are the details:\n\n";
    $email_body .= "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Subject: $subject\n\n";
    $email_body .= "Message:\n$message\n";
    
    // Email headers
    $headers = "From: noreply@cybercon.org\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        $response['success'] = true;
        $response['message'] = "Thank you! Your message has been sent successfully.";
        
        // Optional: Save to database
        // saveToDatabase($name, $email, $subject, $message);
        
        // Optional: Send auto-reply to user
        sendAutoReply($email, $name);
        
    } else {
        $response['message'] = "Sorry, there was an error sending your message. Please try again later.";
    }
    
    echo json_encode($response);
    exit;
}

// Function to send auto-reply to the user
function sendAutoReply($user_email, $user_name) {
    $subject = "Thank you for contacting CyberCon 2025";
    
    $message = "Dear $user_name,\n\n";
    $message .= "Thank you for reaching out to CyberCon 2025!\n\n";
    $message .= "We have received your message and will get back to you as soon as possible.\n\n";
    $message .= "In the meantime, feel free to:\n";
    $message .= "- Check out our event schedule\n";
    $message .= "- Register for the conference\n";
    $message .= "- Connect with us on social media\n\n";
    $message .= "Best regards,\n";
    $message .= "CyberCon 2025 Team\n";
    $message .= "www.cybercon.org\n";
    
    $headers = "From: info@cybercon.org\r\n";
    $headers .= "Reply-To: info@cybercon.org\r\n";
    
    mail($user_email, $subject, $message, $headers);
}

// Optional: Function to save contact to database
function saveToDatabase($name, $email, $subject, $message) {
    // Database configuration
    $servername = "localhost";
    $username = "your_username";
    $password = "your_password";
    $dbname = "cybercon_db";
    
    try {
        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        
        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO contacts (name, email, subject, message, submitted_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->bind_param("ssss", $name, $email, $subject, $message);
        
        // Execute
        $stmt->execute();
        
        // Close
        $stmt->close();
        $conn->close();
        
        return true;
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}

// If accessed directly without POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    $response = array(
        'success' => false,
        'message' => 'Invalid request method'
    );
    echo json_encode($response);
}
?>
