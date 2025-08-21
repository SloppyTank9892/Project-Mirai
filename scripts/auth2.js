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
        
        // Get user type from localStorage (set in auth1.js)
        const userType = localStorage.getItem('miraiUserType') || 'student';
        
        // Store user data in localStorage for immediate use
        const userData = {
            studentName: studentName,
            collegeName: collegeName,
            course: course,
            userType: userType.toLowerCase(),
            registrationDate: new Date().toISOString()
        };
        
        localStorage.setItem('miraiUserData', JSON.stringify(userData));
        
        // Show loading state
        showLoadingState();
        
        // Save profile data to backend
        saveProfileToBackend(userData);
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

// Save profile data to backend
async function saveProfileToBackend(userData) {
    try {
        // Check if user is authenticated (from Google or local signup)
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                name: userData.studentName,
                collegeName: userData.collegeName,
                course: userData.course,
                userType: userData.userType
            })
        });
        
        if (response.ok) {
            // Profile saved successfully, redirect to home
            showSuccessState();
            setTimeout(() => {
                window.location.href = '../Home/home.html';
            }, 1500);
        } else if (response.status === 401) {
            // User not authenticated, treat as new user and create account
            await createNewUserAccount(userData);
        } else {
            // Handle other errors
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save profile');
        }
    } catch (error) {
        console.error('Profile save error:', error);
        showErrorState(error.message);
    }
}

// Create new user account for non-authenticated users
async function createNewUserAccount(userData) {
    try {
        // Generate a temporary email and password for the user
        const tempEmail = `temp_${Date.now()}@mirai.local`;
        const tempPassword = generateTempPassword();
        
        const signupResponse = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userData.studentName,
                email: tempEmail,
                password: tempPassword,
                userType: userData.userType,
                collegeName: userData.collegeName,
                course: userData.course
            })
        });
        
        if (signupResponse.ok) {
            // Account created successfully
            showSuccessState();
            setTimeout(() => {
                window.location.href = '../Home/home.html';
            }, 1500);
        } else {
            const errorData = await signupResponse.json();
            throw new Error(errorData.error || 'Failed to create account');
        }
    } catch (error) {
        console.error('Account creation error:', error);
        showErrorState(error.message);
    }
}

// Generate temporary password for users who don't provide one
function generateTempPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Show success state
function showSuccessState() {
    const getStartedBtn = document.getElementById('getStartedBtn');
    const btnText = getStartedBtn.querySelector('.btn-text');
    const btnLoader = getStartedBtn.querySelector('.btn-loader');
    
    getStartedBtn.classList.remove('loading');
    getStartedBtn.classList.add('success');
    btnText.textContent = 'Profile Saved!';
    btnLoader.style.display = 'none';
    
    // Add success checkmark
    const checkmark = document.createElement('span');
    checkmark.innerHTML = '✓';
    checkmark.style.marginLeft = '8px';
    checkmark.style.color = '#4CAF50';
    btnText.appendChild(checkmark);
}

// Show error state
function showErrorState(message) {
    const getStartedBtn = document.getElementById('getStartedBtn');
    const btnText = getStartedBtn.querySelector('.btn-text');
    const btnLoader = getStartedBtn.querySelector('.btn-loader');
    
    getStartedBtn.classList.remove('loading');
    getStartedBtn.classList.add('error');
    btnText.textContent = 'Error: ' + message;
    btnLoader.style.display = 'none';
    
    // Re-enable form after 3 seconds
    setTimeout(() => {
        getStartedBtn.classList.remove('error');
        btnText.textContent = 'Get Started';
        getStartedBtn.disabled = false;
        
        // Re-enable inputs
        document.getElementById('studentName').disabled = false;
        document.getElementById('collegeName').disabled = false;
        document.getElementById('course').disabled = false;
        
        // Remove loading animation from container
        document.querySelector('.container').style.pointerEvents = 'auto';
    }, 3000);
}

// Add enhanced button states CSS
function addButtonStatesCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .get-started-btn.success {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            border-color: #4CAF50;
        }
        
        .get-started-btn.error {
            background: linear-gradient(135deg, #f44336, #da190b);
            border-color: #f44336;
        }
        
        .get-started-btn .btn-loader {
            display: none;
        }
        
        .get-started-btn.loading .btn-loader {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize enhanced styles
addEnhancedStyles();
addButtonStatesCSS();
