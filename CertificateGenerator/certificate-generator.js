// Certificate Generator JavaScript - Clean Version
class CertificateGenerator {
    constructor() {
        this.certificateBlob = null;
        this.validatedStudent = null;
        this.validatedName = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.studentIdInput = document.getElementById('studentId');
        this.checkIdBtn = document.getElementById('checkIdBtn');
        this.nameInputSection = document.getElementById('nameInputSection');
        this.studentNameInput = document.getElementById('studentName');
        this.generateBtn = document.getElementById('generateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        this.errorText = document.getElementById('errorText');
        
        // Certificate preview elements
        this.certificatePreview = document.getElementById('certificatePreview');
        this.certificateImage = document.getElementById('certificateImage');
    }

    bindEvents() {
        this.checkIdBtn.addEventListener('click', () => this.handleCheckId());
        this.generateBtn.addEventListener('click', () => this.handleGenerate());
        this.downloadBtn.addEventListener('click', () => this.downloadCertificate());
        
        // Allow Enter key to trigger ID check
        this.studentIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.nameInputSection.classList.contains('hidden-step')) {
                this.handleCheckId();
            }
        });

        // Clear messages on input
        this.studentIdInput.addEventListener('input', (e) => {
            this.clearMessages();
            this.validateInputFormat(e.target.value);
            // Reset to step 1 if ID is modified
            if (!this.nameInputSection.classList.contains('hidden-step')) {
                this.resetToStep1();
            }
        });
    }

    // Accept 1 to 4 digit ticket IDs only
    isValidTicketId(id) {
        const pattern = /^\d{1,4}$/;
        return pattern.test(id);
    }

    async handleCheckId() {
        const API_BASE = 'https://cybersecurity.club.uttara.ac.bd/certificate-api';
        const ticketId = this.studentIdInput.value.trim();
        if (!ticketId) {
            this.showError('Please enter your Ticket ID');
            return;
        }
        if (!this.isValidTicketId(ticketId)) {
            this.showError('Ticket ID must be 1 to 4 digits');
            return;
        }
        this.showLoading();
        this.checkIdBtn.disabled = true;
        try {
            const response = await fetch(`${API_BASE}/api/lookup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId })
            });
            let data;
            if (response.ok) {
                data = await response.json();
                this.validatedName = data.name;
                this.showNameInputStep();
                this.clearMessages();
            } else {
                // Try to parse error from JSON, fallback to generic error
                let errorMsg = 'Ticket ID not found. Only registered participants can generate certificates.';
                try {
                    const errData = await response.json();
                    errorMsg = errData.error || errorMsg;
                } catch {
                    // If JSON parsing fails, keep default errorMsg
                }
                throw new Error(errorMsg);
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
            this.checkIdBtn.disabled = false;
        }
    }

    async handleGenerate() {
        const API_BASE = 'https://cybersecurity.club.uttara.ac.bd/certificate-api';
        if (!this.validatedName) {
            this.showError('Please check your Ticket ID first');
            return;
        }
        this.showLoading();
        this.generateBtn.disabled = true;
        try {
            const ticketId = this.studentIdInput.value.trim();
            const response = await fetch(`${API_BASE}/api/generate-certificate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Certificate generation failed');
            }
            // Use base64 image for preview
            this.certificateImage.src = data.image;
            // Convert base64 to Blob for download
            const base64Data = data.image.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            this.certificateBlob = new Blob([byteArray], { type: 'image/png' });
            this.showSuccess();
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
            this.generateBtn.disabled = false;
        }
    }

    showNameInputStep() {
        this.nameInputSection.classList.remove('hidden-step');
        this.nameInputSection.classList.add('visible-step');
        this.generateBtn.classList.remove('hidden-step');
        this.generateBtn.classList.add('visible-step');
        this.checkIdBtn.classList.add('hidden-step');
        this.studentIdInput.disabled = true;
        // Pre-fill with registered name (read-only)
        if (this.validatedName) {
            this.studentNameInput.value = this.validatedName;
        }
        this.generateBtn.focus();
    }

    resetToStep1() {
        this.nameInputSection.classList.add('hidden-step');
        this.nameInputSection.classList.remove('visible-step');
        this.generateBtn.classList.add('hidden-step');
        this.generateBtn.classList.remove('visible-step');
        this.checkIdBtn.classList.remove('hidden-step');
        this.studentIdInput.disabled = false;
        this.validatedStudent = null;
        this.studentNameInput.value = '';
        this.clearMessages();
    }


    downloadCertificate() {
        if (!this.certificateBlob) {
            this.showError('No certificate available for download');
            return;
        }

        const studentId = this.studentIdInput.value.trim();
        const url = URL.createObjectURL(this.certificateBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificate_${studentId}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showLoading() {
        this.clearMessages();
        this.loadingSpinner.classList.add('visible', 'animate-slide-in');
    }

    hideLoading() {
        this.loadingSpinner.classList.remove('visible', 'animate-slide-in');
    }

    showError(message) {
        this.clearMessages();
        this.errorText.textContent = message;
        this.errorMessage.classList.add('visible', 'animate-slide-in');
    }

    showSuccess() {
        this.clearMessages();
        this.successMessage.classList.add('visible', 'animate-slide-in');
        
        // Hide the generate button after successful generation
        this.generateBtn.style.display = 'none';
        
        // Show the certificate preview
        this.showCertificatePreview();
    }

    clearMessages() {
        this.loadingSpinner.classList.remove('visible', 'animate-slide-in');
        this.errorMessage.classList.remove('visible', 'animate-slide-in');
        this.successMessage.classList.remove('visible', 'animate-slide-in');
    }

    showCertificatePreview() {
        if (!this.certificateImage.src) {
            console.error('No certificate available for preview');
            return;
        }
        this.certificatePreview.classList.add('visible');
        // Scroll to the preview section
        this.certificatePreview.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    validateInputFormat(value) {
        const input = this.studentIdInput;
        
        if (value.length === 0) {
            input.style.borderColor = '#e9ecef';
            return;
        }
        
        if (this.isValidTicketId(value)) {
            input.style.borderColor = '#28a745';
        } else {
            input.style.borderColor = '#dc3545';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CertificateGenerator();
});

// Add mobile navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.navbar-burger');
    const menu = document.querySelector('.navbar-menu');

    if (burger && menu) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('is-active');
            menu.classList.toggle('is-active');
        });
    }
});