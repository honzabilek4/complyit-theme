// Custom signup form validation
document.addEventListener('DOMContentLoaded', function() {
    const signupForms = document.querySelectorAll('form[data-members-form="signup"]');
    
    signupForms.forEach(form => {
        const submitButton = form.querySelector('#signup-submit');
        const consentCheckbox = form.querySelector('#signup-consent');
        
        if (submitButton && consentCheckbox) {
            // Initially disable button if checkbox is not checked
            function updateButtonState() {
                submitButton.disabled = !consentCheckbox.checked;
                submitButton.style.opacity = consentCheckbox.checked ? '1' : '0.5';
                submitButton.style.cursor = consentCheckbox.checked ? 'pointer' : 'not-allowed';
            }
            
            // Update button state on checkbox change
            consentCheckbox.addEventListener('change', updateButtonState);
            
            // Initial state
            updateButtonState();
            
            // Prevent form submission if checkbox is not checked
            form.addEventListener('submit', function(e) {
                if (!consentCheckbox.checked) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Show error message
                    const errorDiv = form.querySelector('.kg-signup-card-error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Musisz zaakceptować regulamin i politykę prywatności przed zapisaniem się do newslettera.';
                        errorDiv.classList.add('show');
                        
                        // Hide error after 5 seconds
                        setTimeout(() => {
                            errorDiv.classList.remove('show');
                        }, 5000);
                    }
                    
                    return false;
                }
            });
        }
    });
});