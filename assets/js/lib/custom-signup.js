// Custom signup form validation and state handling
document.addEventListener('DOMContentLoaded', function() {
    const signupForms = document.querySelectorAll('form[data-members-form="signup"]');
    
    signupForms.forEach(form => {
        const submitButton = form.querySelector('#signup-submit');
        const consentCheckbox = form.querySelector('#signup-consent');
        const emailInput = form.querySelector('.kg-signup-card-input');
        const successDiv = form.querySelector('.kg-signup-card-success');
        const errorDiv = form.querySelector('.kg-signup-card-error');
        const buttonDefault = submitButton?.querySelector('.kg-signup-card-button-default');
        const buttonLoading = submitButton?.querySelector('.kg-signup-card-button-loading');
        
        if (submitButton && consentCheckbox) {
            // Initially disable button if checkbox is not checked
            function updateButtonState() {
                const isValid = consentCheckbox.checked && emailInput?.value?.trim();
                submitButton.disabled = !isValid;
                submitButton.style.opacity = isValid ? '1' : '0.5';
                submitButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
            }
            
            // Update button state on checkbox change or email input
            consentCheckbox.addEventListener('change', updateButtonState);
            emailInput?.addEventListener('input', updateButtonState);
            
            // Initial state
            updateButtonState();
            
            // Handle form submission
            form.addEventListener('submit', function(e) {
                // Validate consent checkbox
                if (!consentCheckbox.checked) {
                    e.preventDefault();
                    showError('Musisz zaakceptować regulamin i politykę prywatności przed zapisaniem się do newslettera.');
                    return false;
                }
                
                // Show loading state
                showLoading();
                
                // Let Ghost handle the rest, but set up a timeout to reset loading state
                setTimeout(() => {
                    hideLoading();
                }, 10000); // Reset after 10 seconds max
            });
            
            // Watch for Ghost's form state classes using MutationObserver
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const classList = form.classList;
                        
                        if (classList.contains('success')) {
                            hideLoading();
                            if (successDiv) {
                                successDiv.style.display = 'block';
                                successDiv.classList.add('show');
                            }
                            form.reset();
                            updateButtonState();
                            
                            // Hide success after 5 seconds
                            setTimeout(() => {
                                if (successDiv) {
                                    successDiv.style.display = 'none';
                                    successDiv.classList.remove('show');
                                }
                            }, 5000);
                        }
                        
                        if (classList.contains('error')) {
                            hideLoading();
                            if (errorDiv) {
                                // Use Ghost's error message if available, otherwise use default
                                const errorMessage = errorDiv.textContent.trim() || 'Wystąpił błąd podczas zapisywania. Spróbuj ponownie.';
                                errorDiv.textContent = errorMessage;
                                errorDiv.style.display = 'block';
                                errorDiv.classList.add('show');
                            }
                            
                            // Hide error after 5 seconds
                            setTimeout(() => {
                                if (errorDiv) {
                                    errorDiv.style.display = 'none';
                                    errorDiv.classList.remove('show');
                                }
                            }, 5000);
                        }
                        
                        // Reset loading state when form is no longer in loading state
                        if (!classList.contains('loading') && !classList.contains('success') && !classList.contains('error')) {
                            hideLoading();
                        }
                    }
                });
            });
            
            // Observe form class changes
            observer.observe(form, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            // Utility functions
            function showLoading() {
                if (buttonDefault && buttonLoading) {
                    buttonDefault.style.display = 'none';
                    buttonLoading.style.display = 'inline';
                    buttonLoading.textContent = 'Zapisywanie...';
                }
                submitButton.disabled = true;
                hideMessages();
            }
            
            function hideLoading() {
                if (buttonDefault && buttonLoading) {
                    buttonDefault.style.display = 'inline';
                    buttonLoading.style.display = 'none';
                }
                updateButtonState();
            }
            
            function showError(message) {
                hideMessages();
                if (errorDiv) {
                    errorDiv.textContent = message;
                    errorDiv.style.display = 'block';
                    errorDiv.classList.add('show');
                    
                    setTimeout(() => {
                        errorDiv.style.display = 'none';
                        errorDiv.classList.remove('show');
                    }, 5000);
                }
            }
            
            function hideMessages() {
                if (successDiv) {
                    successDiv.style.display = 'none';
                    successDiv.classList.remove('show');
                }
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                    errorDiv.classList.remove('show');
                }
            }
        }
    });
});
