// Certificate Generator JavaScript - Clean Version
class CertificateGenerator {
    constructor() {
        this.studentData = null;
        this.certificateBlob = null;
        this.validatedStudent = null;
        this.initializeElements();
        this.bindEvents();
        this.loadStudentData();
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

    async loadStudentData() {
        try {
            const response = await fetch('student-data.csv');
            if (!response.ok) {
                throw new Error('Could not load student database');
            }
            
            const csvText = await response.text();
            this.studentData = this.parseCSV(csvText);
            console.log('Student data loaded:', this.studentData.length, 'records');
        } catch (error) {
            console.error('Error loading student data:', error);
            this.showError('Could not load student database. Please try again later.');
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        return data;
    }

    async handleCheckId() {
        const studentId = this.studentIdInput.value.trim();
        
        if (!studentId) {
            this.showError('Please enter your Student ID');
            return;
        }

        if (!this.isValidStudentId(studentId)) {
            this.showError('Please enter your Uttara University Student ID (e.g., 2233081XXX)');
            return;
        }

        this.showLoading();
        this.checkIdBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const student = this.findStudent(studentId);
            if (!student) {
                throw new Error('Student ID not found. Only registered CyberCon24 participants can generate certificates.');
            }

            this.validatedStudent = student;
            this.showNameInputStep();
            this.clearMessages();

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
            this.checkIdBtn.disabled = false;
        }
    }

    async handleGenerate() {
        if (!this.validatedStudent) {
            this.showError('Please check your Student ID first');
            return;
        }

        this.showLoading();
        this.generateBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.generateCertificate(this.validatedStudent);
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
        if (this.validatedStudent && this.validatedStudent.name) {
            this.studentNameInput.value = this.validatedStudent.name.trim();
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

    isValidStudentId(id) {
        const pattern = /^\d{10}$/;
        return pattern.test(id);
    }

    findStudent(studentId) {
        if (!this.studentData) {
            throw new Error('Student database not loaded');
        }

        return this.studentData.find(student => 
            student.student_id === studentId || student.id === studentId
        );
    }

    async generateCertificate(student) {
        try {
            // Ensure Dancing Script font is loaded
            await this.loadDancingScriptFont();
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions (A4 landscape at 300 DPI)
            canvas.width = 3508;
            canvas.height = 2480;

            // Try to load Canva template first, fallback to programmatic generation
            try {
                await this.loadCanvaTemplate(ctx, student.name, canvas.width, canvas.height);
            } catch (templateError) {
                console.log('Template not found, using programmatic generation');
                this.createCertificateBackground(ctx, canvas.width, canvas.height);
                this.addTextToCertificate(ctx, student.name, canvas.width, canvas.height);
            }

            // Convert canvas to blob
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    this.certificateBlob = blob;
                    resolve();
                }, 'image/png');
            });
        } catch (error) {
            throw new Error('Failed to generate certificate: ' + error.message);
        }
    }

    async loadDancingScriptFont() {
        if ('fonts' in document) {
            try {
                await document.fonts.load('400 180px Dancing Script');
                await document.fonts.load('600 150px Dancing Script');
                await document.fonts.load('700 150px Dancing Script');
                console.log('Dancing Script font loaded successfully');
            } catch (error) {
                console.warn('Failed to load Dancing Script font:', error);
            }
        }
    }

    async loadCanvaTemplate(ctx, studentName, width, height) {
        return new Promise((resolve, reject) => {
            const templateImg = new Image();
            templateImg.crossOrigin = 'anonymous';
            
            templateImg.onload = () => {
                try {
                    ctx.drawImage(templateImg, 0, 0, width, height);
                    this.addNameToCanvaTemplate(ctx, studentName, width, height);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            templateImg.onerror = () => {
                reject(new Error('Could not load Canva template'));
            };

            templateImg.src = 'Certificate.png';
        });
    }

    addNameToCanvaTemplate(ctx, studentName, width, height) {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 180px Dancing Script, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const nameX = width * 0.500;
        const nameY = height * 0.480;
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.fillText(studentName, nameX, nameY);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    createCertificateBackground(ctx, width, height) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add outer border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 20;
        ctx.strokeRect(100, 100, width - 200, height - 200);

        // Add inner border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 5;
        ctx.strokeRect(150, 150, width - 300, height - 300);
    }

    addTextToCertificate(ctx, studentName, width, height) {
        const centerX = width / 2;
        
        // Add title "CERTIFICATE"
        ctx.fillStyle = 'white';
        ctx.font = 'bold 200px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CERTIFICATE', centerX, 600);

        // Add subtitle "of Participation"
        ctx.font = '80px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText('of Participation', centerX, 720);

        // Add "This is to certify that"
        ctx.font = '60px Arial';
        ctx.fillText('This is to certify that', centerX, 950);

        // Add student name with Dancing Script font
        ctx.font = 'bold 150px Dancing Script, Arial, sans-serif';
        ctx.fillStyle = 'white';
        const nameY = 1150;
        ctx.fillText(studentName, centerX, nameY);

        // Add underline for name
        const nameWidth = ctx.measureText(studentName).width;
        ctx.beginPath();
        ctx.moveTo(centerX - nameWidth/2 - 100, nameY + 80);
        ctx.lineTo(centerX + nameWidth/2 + 100, nameY + 80);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Add description
        ctx.font = '60px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText('has successfully participated in', centerX, 1400);
        
        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('CyberCon 2024', centerX, 1500);
        
        ctx.font = '60px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText('organized by Cyber Security Club, Uttara University', centerX, 1600);

        // Add date
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        ctx.font = '50px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(currentDate, 200, height - 300);

        // Add signature
        const sigX = width - 600;
        const sigY = height - 250;
        
        ctx.beginPath();
        ctx.moveTo(sigX - 200, sigY - 50);
        ctx.lineTo(sigX + 200, sigY - 50);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.font = '45px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Faculty Advisor', sigX, sigY);

        // Add organization info
        ctx.font = '60px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText('Cyber Security Club', centerX, height - 180);
        
        ctx.font = '45px Arial';
        ctx.fillText('Uttara University', centerX, height - 120);
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
        if (!this.certificateBlob) {
            console.error('No certificate available for preview');
            return;
        }

        const certificateUrl = URL.createObjectURL(this.certificateBlob);
        this.certificateImage.src = certificateUrl;
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
        
        if (this.isValidStudentId(value)) {
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