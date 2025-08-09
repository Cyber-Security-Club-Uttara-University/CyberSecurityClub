// Recruitment Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const recruitmentForm = document.querySelector('.recruitment-form');
    
    if (recruitmentForm) {
        recruitmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = recruitmentForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4444';
                } else {
                    field.style.borderColor = '#28a745';
                }
            });
            
            if (isValid) {
                console.log('Form submitted successfully!');
                // Reset form after successful submission
                setTimeout(() => {
                    recruitmentForm.reset();
                    resetFieldColors();
                }, 2000);
            } else {
                alert('Please fill in all required fields.');
            }
        });
        
        // Add smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    function resetFieldColors() {
        const formFields = recruitmentForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    // Add interest tag functionality
    const interestCheckboxes = document.querySelectorAll('input[name="interests[]"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.checkbox-label');
            if (this.checked) {
                label.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
                label.style.borderLeft = '3px solid #0000FF';
            } else {
                label.style.backgroundColor = '';
                label.style.borderLeft = '';
            }
        });
    });
    
    // Form field focus effects
    const formInputs = document.querySelectorAll('.recruitment-form input, .recruitment-form select, .recruitment-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});
