// CyberCon25 Registration Integration Script

// Google Apps Script Web App URL - UPDATE THIS WITH YOUR DEPLOYED SCRIPT URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNVslOGClvYRIwMH9AgfsJLNHR4Ikv_bG8bWCCeUoqsygmJc1OUAHE_xrhWv4XzJXeiw/exec';

// Show registration form
function showRegistrationForm() {
    const formSection = document.getElementById('registration-form');
    if (formSection) {
        formSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Set timestamp
        document.getElementById('regTimestamp').value = new Date().toLocaleString('en-US', { 
            timeZone: 'Asia/Dhaka',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }
}

// Hide registration form
function hideRegistrationForm() {
    const formSection = document.getElementById('registration-form');
    if (formSection) {
        formSection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Generate unique ticket ID with timestamp to avoid conflicts
function generateTicketId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    // Use last 4 digits of timestamp + 3 random digits, then take last 4 digits
    const combined = (timestamp + random).toString();
    return combined.slice(-4);
}

// Validate email domain
function validateEmailDomain(input) {
    const email = input.value.toLowerCase();
    const validDomains = ['@uttara.ac.bd', '@uttarauniversity.edu.bd'];
    const hasValidDomain = validDomains.some(domain => email.endsWith(domain));
    
    if (email && !hasValidDomain) {
        input.setCustomValidity('Please use your Uttara University email address');
    } else {
        input.setCustomValidity('');
    }
}

// Format phone number
function formatPhoneNumber(input) {
    let value = input.value.replace(/[^0-9+]/g, '');
    
    // Ensure it starts with +880
    if (!value.startsWith('+880')) {
        value = '+880';
    }
    
    // Limit to +880 + 10 digits
    if (value.length > 14) {
        value = value.substring(0, 14);
    }
    
    input.value = value;
}

// Show form alert
function showFormAlert(message, type = 'info') {
    const container = document.getElementById('form-alert-container');
    if (!container) return;
    
    const alertClass = type === 'error' ? 'alert-danger' : 
                      type === 'success' ? 'alert-success' : 
                      'alert-info';
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'success' ? 'fa-check-circle' : 
                 'fa-info-circle';
    
    container.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas ${icon}"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Show loading overlay
function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlayForm');
    const submitBtn = document.getElementById('submitRegBtn');
    
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
    
    if (submitBtn) {
        submitBtn.disabled = show;
    }
}

// Submit registration to Google Sheets
async function submitCyberConRegistration(event) {
    event.preventDefault();
    
    const form = document.getElementById('cyberconRegistrationForm');
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    
    // Show loading
    showLoadingOverlay(true);
    showFormAlert('Processing your registration...', 'info');
    
    try {
        // Generate ticket ID
        const ticketId = generateTicketId();
        
        // Get form data
        const formData = new FormData(form);
        
        // Prepare data object
        const registrationData = {
            timestamp: formData.get('regTimestamp'),
            ticketId: ticketId,
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            studentId: formData.get('studentId'),
            university: formData.get('university'),
            department: formData.get('department'),
            batch: formData.get('batch'),
            section: formData.get('section'),
            queries: formData.get('queries') || '',
            paymentNumber: formData.get('paymentNumber'),
            transactionId: formData.get('transactionId')
        };
        
        console.log('Submitting registration:', registrationData);
        
        // Submit to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });
        
        // Note: With 'no-cors' mode, we can't read the response
        // We assume success if no error is thrown
        
        console.log('Registration submitted successfully');
        
        // Hide loading
        showLoadingOverlay(false);
        
        // Show success modal
        showSuccessModal(ticketId, registrationData.email);
        
        // Reset form
        form.reset();
        
        // Hide registration form after short delay
        setTimeout(() => {
            hideRegistrationForm();
        }, 1000);
        
    } catch (error) {
        console.error('Registration error:', error);
        showLoadingOverlay(false);
        showFormAlert('Registration failed. Please try again or contact support.', 'error');
    }
    
    return false;
}

// Show success modal
function showSuccessModal(ticketId, email) {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    
    // Update modal content
    document.getElementById('modalTicketId').textContent = ticketId;
    document.getElementById('modalEmail').textContent = email;
    
    // Show modal
    modal.show();
    
    // Clear any alerts
    const container = document.getElementById('form-alert-container');
    if (container) {
        container.innerHTML = '';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('CyberCon Registration System Initialized');
    console.log('Google Script URL:', GOOGLE_SCRIPT_URL);
    
    // Add smooth scroll for register button in navbar
    const registerButtons = document.querySelectorAll('a[href="#register"]');
    registerButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const registerSection = document.getElementById('register');
            if (registerSection) {
                registerSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Ensure phone number always starts with +880
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('focus', function() {
            if (this.value === '') {
                this.value = '+880';
            }
        });
    }
});
