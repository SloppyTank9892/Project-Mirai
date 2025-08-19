
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.icon');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {

            const existingRipples = button.querySelectorAll('.ripple');
            existingRipples.forEach(ripple => ripple.remove());
            
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            // Store the selected user type in localStorage
            const userType = button.textContent.trim();
            localStorage.setItem('miraiUserType', userType);
            
            // Add loading state to button
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.8';
            
            setTimeout(() => {
                ripple.remove();
                // Redirect to auth2.html after ripple animation
                window.location.href = 'auth2.html';
            }, 600);
        });
        
        button.addEventListener('focus', function() {
            this.classList.add('pulse-focus');
        });
        
        button.addEventListener('blur', function() {
            this.classList.remove('pulse-focus');
        });
        
        button.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
    });
    
    function enhanceEntranceAnimations() {
        const title = document.querySelector('.item1 h1');
        const subtitle = document.querySelector('.item1 p');
        
        if (title) {
            title.addEventListener('animationend', function() {
                this.classList.add('entrance-complete');
            });
        }
        
        if (subtitle) {
            subtitle.addEventListener('animationend', function() {
                this.classList.add('entrance-complete');
            });
        }
    }
    
    enhanceEntranceAnimations();
    
    function checkScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in-view');
                }
            });
        }, { threshold: 0.1 });
        
        buttons.forEach(button => {
            observer.observe(button.parentElement);
        });
    }
    
    checkScrollAnimations();
    
    document.addEventListener('keydown', function(e) {
        const focusedButton = document.activeElement;
        
        if (focusedButton && focusedButton.classList.contains('icon')) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    focusedButton.click();
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    const nextButton = getNextButton(focusedButton);
                    if (nextButton) nextButton.focus();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevButton = getPrevButton(focusedButton);
                    if (prevButton) prevButton.focus();
                    break;
            }
        }
    });
    
    function getNextButton(currentButton) {
        const buttons = Array.from(document.querySelectorAll('.icon'));
        const currentIndex = buttons.indexOf(currentButton);
        return buttons[currentIndex + 1] || buttons[0];
    }
    
    function getPrevButton(currentButton) {
        const buttons = Array.from(document.querySelectorAll('.icon'));
        const currentIndex = buttons.indexOf(currentButton);
        return buttons[currentIndex - 1] || buttons[buttons.length - 1];
    }
});

function addThemeEnhancements() {
    const style = document.createElement('style');
    style.textContent = `
        /* Click ripple effect styles */
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(155, 154, 154, 0.4);
            pointer-events: none;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            z-index: 1;
        }
        
        @keyframes rippleEffect {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        /* Enhanced focus pulse */
        .icon.pulse-focus {
            animation: pulseFocus 1.5s infinite;
        }
        
        @keyframes pulseFocus {
            0%, 100% {
                box-shadow: 0 0 0 3px rgba(155, 154, 154, 0.3);
            }
            50% {
                box-shadow: 0 0 0 6px rgba(155, 154, 154, 0.1);
            }
        }
        
        /* Hover enhancement */
        .icon.hover-active {
            position: relative;
        }
        
        .icon.hover-active::before {
            animation: rippleExpand 0.6s ease-out;
        }
        
        @keyframes rippleExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0.3;
            }
        }
        
        /* Entrance completion enhancement */
        .entrance-complete {
            animation: none !important;
        }
        
        /* Scroll animation enhancement */
        .animate-in-view .icon {
            animation: bounceIn 0.8s ease-out;
        }
        
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3) translateY(20px);
            }
            50% {
                opacity: 1;
                transform: scale(1.05) translateY(-5px);
            }
            70% {
                transform: scale(0.9) translateY(2px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
}

addThemeEnhancements();
