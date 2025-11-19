// Registration Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Initialize ticket counter
    let currentTicket = parseInt(localStorage.getItem('lastTicketNumber') || '2500');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!form.checkValidity()) {
            showAlert('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Show loading
        showLoading(true);
        submitBtn.disabled = true;
        
        try {
            // Generate ticket ID
            currentTicket++;
            const ticketId = currentTicket.toString().padStart(4, '0');
            
            // Prepare data for Google Sheets
            const formData = new FormData(form);
            const data = {
                timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
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
            
            // Google Apps Script URL - Update this with your deployed script URL
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNVslOGClvYRIwMH9AgfsJLNHR4Ikv_bG8bWCCeUoqsygmJc1OUAHE_xrhWv4XzJXeiw/exec';
            
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // Save ticket number
            localStorage.setItem('lastTicketNumber', currentTicket.toString());
            
            // Show success modal
            showSuccessModal(ticketId, formData.get('email'));
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            showAlert('Registration failed. Please try again.', 'error');
        } finally {
            showLoading(false);
            submitBtn.disabled = false;
        }
    });
    
    // Phone number validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d+\-\s]/g, '');
        e.target.value = value;
    });
});

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    alertDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.innerHTML = '';
    container.appendChild(alertDiv);
    
    // Scroll to top to show alert
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

function showSuccessModal(ticketId, email) {
    const modal = document.getElementById('successModal');
    const ticketDisplay = document.getElementById('ticketIdDisplay');
    const emailDisplay = document.getElementById('emailDisplay');
    
    ticketDisplay.textContent = ticketId;
    emailDisplay.textContent = email;
    
    modal.classList.add('active');
    
    // Clear any previous alerts
    document.getElementById('alert-container').innerHTML = '';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});
