document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('authForm');
    const studentNameInput = document.getElementById('studentName');
    const collegeNameInput = document.getElementById('collegeName');
    const courseSelect = document.getElementById('course');
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    const nameError = document.getElementById('nameError');
    const collegeError = document.getElementById('collegeError');
    const courseError = document.getElementById('courseError');
    
    let validationState = {
        studentName: false,
        collegeName: false,
        course: false
    };
    
    // Input validation functions
    function validateStudentName(name) {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name.trim());
    }
    
    function validateCollegeName(college) {
        return college.trim().length >= 3 && college.trim().length <= 100;
    }
    
    function validateCourse(course) {
        return course && course !== '';
    }
    
    // Show error message with animation
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // Hide error message with animation
    function hideError(errorElement) {
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 300);
    }
    
    // Update button state based on validation
    function updateButtonState() {
        const allValid = Object.values(validationState).every(isValid => isValid);
        getStartedBtn.disabled = !allValid;
        
        if (allValid) {
            getStartedBtn.classList.add('ready');
            addButtonReadyAnimation();
        } else {
            getStartedBtn.classList.remove('ready');
        }
    }
    
    // Add ready animation to button
    function addButtonReadyAnimation() {
        getStartedBtn.style.transform = 'scale(1.02)';
        setTimeout(() => {
            getStartedBtn.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Student Name Input Events
    studentNameInput.addEventListener('input', function() {
        const value = this.value;
        
        if (value === '') {
            hideError(nameError);
            validationState.studentName = false;
        } else if (!validateStudentName(value)) {
            showError(nameError, 'Please enter a valid name (2-50 characters, letters only)');
            validationState.studentName = false;
        } else {
            hideError(nameError);
            validationState.studentName = true;
            addInputSuccessAnimation(this);
        }
        
        updateButtonState();
    });
    
    studentNameInput.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value !== '' && !validateStudentName(value)) {
            this.style.borderColor = '#ff4757';
            showError(nameError, 'Please enter a valid name (2-50 characters, letters only)');
        }
    });
    
    // College Name Input Events
    collegeNameInput.addEventListener('input', function() {
        const value = this.value;
        
        if (value === '') {
            hideError(collegeError);
            validationState.collegeName = false;
        } else if (!validateCollegeName(value)) {
            showError(collegeError, 'College name must be between 3-100 characters');
            validationState.collegeName = false;
        } else {
            hideError(collegeError);
            validationState.collegeName = true;
            addInputSuccessAnimation(this);
        }
        
        updateButtonState();
    });
    
    collegeNameInput.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value !== '' && !validateCollegeName(value)) {
            this.style.borderColor = '#ff4757';
            showError(collegeError, 'College name must be between 3-100 characters');
        }
    });
    
    // Course Select Events
    courseSelect.addEventListener('change', function() {
        const value = this.value;
        
        if (!validateCourse(value)) {
            showError(courseError, 'Please select your course');
            validationState.course = false;
        } else {
            hideError(courseError);
            validationState.course = true;
            addInputSuccessAnimation(this);
        }
        
        updateButtonState();
    });
    
    // Input success animation
    function addInputSuccessAnimation(element) {
        element.style.borderColor = '#4CAF50';
        element.style.transform = 'scale(1.02)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Form submission handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Final validation
        const studentName = studentNameInput.value.trim();
        const collegeName = collegeNameInput.value.trim();
        const course = courseSelect.value;
        
        if (!validateStudentName(studentName)) {
            showError(nameError, 'Please enter a valid student name');
            studentNameInput.focus();
            return;
        }
        
        if (!validateCollegeName(collegeName)) {
            showError(collegeError, 'Please enter a valid college name');
            collegeNameInput.focus();
            return;
        }
        
        if (!validateCourse(course)) {
            showError(courseError, 'Please select your course');
            courseSelect.focus();
            return;
        }
        
        // Store user data in localStorage
        const userData = {
            studentName: studentName,
            collegeName: collegeName,
            course: course,
            registrationDate: new Date().toISOString()
        };
        
        localStorage.setItem('miraiUserData', JSON.stringify(userData));
        
        // Show loading state
        showLoadingState();
        
        // Simulate processing time and redirect
        setTimeout(() => {
            // Redirect to home page
            window.location.href = '../Home/home.html';
        }, 2000);
    });
    
    // Show loading state
    function showLoadingState() {
        getStartedBtn.classList.add('loading');
        getStartedBtn.disabled = true;
        
        // Disable all inputs
        studentNameInput.disabled = true;
        collegeNameInput.disabled = true;
        courseSelect.disabled = true;
        
        // Add loading animation to container
        document.querySelector('.container').style.pointerEvents = 'none';
    }
    
    // Button click animations and ripple effects
    getStartedBtn.addEventListener('click', function(e) {
        if (!this.disabled) {
            // Remove existing ripples
            const existingRipples = this.querySelectorAll('.ripple');
            existingRipples.forEach(ripple => ripple.remove());
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
    
    // Input focus and blur animations
    [studentNameInput, collegeNameInput, courseSelect].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            addFocusAnimation(this);
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    function addFocusAnimation(element) {
        element.style.transform = 'scale(1.02)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            
            if (focusedElement === studentNameInput) {
                e.preventDefault();
                collegeNameInput.focus();
            } else if (focusedElement === collegeNameInput) {
                e.preventDefault();
                courseSelect.focus();
            } else if (focusedElement === courseSelect) {
                e.preventDefault();
                if (!getStartedBtn.disabled) {
                    getStartedBtn.click();
                }
            }
        }
    });
    
    // Progressive enhancement for better UX
    function enhanceFormExperience() {
        // Auto-capitalize first letter of names
        studentNameInput.addEventListener('input', function() {
            let value = this.value;
            // Capitalize first letter of each word
            value = value.replace(/\b\w/g, char => char.toUpperCase());
            if (this.value !== value) {
                this.value = value;
            }
        });
        
        // Auto-format college name
        collegeNameInput.addEventListener('input', function() {
            let value = this.value;
            // Capitalize first letter of each word
            value = value.replace(/\b\w/g, char => char.toUpperCase());
            if (this.value !== value) {
                this.value = value;
            }
        });
        
        // Add visual feedback for form completion
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    const target = mutation.target;
                    if (target === getStartedBtn && !target.disabled) {
                        target.style.animation = 'pulse 0.5s ease-out';
                        setTimeout(() => {
                            target.style.animation = '';
                        }, 500);
                    }
                }
            });
        });
        
        observer.observe(getStartedBtn, { attributes: true });
    }
    
    // Initialize enhancements
    enhanceFormExperience();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Page visibility API for better performance
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations when page is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations when page becomes visible
            document.body.style.animationPlayState = 'running';
        }
    });
});

// Add additional CSS for enhanced animations
function addEnhancedStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Enhanced form animations */
        .form-group.focused {
            transform: translateY(-2px);
            transition: transform 0.3s ease;
        }
        
        .get-started-btn.ready {
            animation: readyPulse 1s ease-out;
        }
        
        @keyframes readyPulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.02);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 4px 15px rgba(155, 154, 154, 0.1);
            }
            50% {
                transform: scale(1.02);
                box-shadow: 0 6px 20px rgba(155, 154, 154, 0.2);
            }
        }
        
        /* Loading state enhancements */
        .container[data-loading="true"] {
            position: relative;
        }
        
        .container[data-loading="true"]::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            z-index: 1000;
        }
        
        /* Success feedback animation */
        .form-group input:valid:not(:placeholder-shown),
        .form-group select:valid:not([value=""]) {
            border-color: #4CAF50;
            animation: successGlow 0.5s ease-out;
        }
        
        @keyframes successGlow {
            0% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
            }
            70% {
                box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize enhanced styles
addEnhancedStyles();
