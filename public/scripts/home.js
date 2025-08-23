document.addEventListener('DOMContentLoaded', function() {
    // Load and display user data from authentication
    loadUserData();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize interactive features
    initializeInteractiveFeatures();
    
    // Initialize animations
    initializeAnimations();
});

function loadUserData() {
    // Get user data from localStorage (stored during auth)
    const userData = JSON.parse(localStorage.getItem('miraiUserData'));
    const userType = localStorage.getItem('miraiUserType');
    
    if (userData) {
        // Update welcome message
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userData.studentName.split(' ')[0]; // First name only
        }
        
        // Update profile section
        const profileName = document.getElementById('profile-name');
        const profileCollege = document.getElementById('profile-college');
        const profileCourse = document.getElementById('profile-course');
        const profileDate = document.querySelector('#profile-date span');
        
        if (profileName) profileName.textContent = userData.studentName;
        if (profileCollege) profileCollege.textContent = userData.collegeName;
        if (profileCourse) profileCourse.textContent = userData.course;
        if (profileDate) {
            const joinDate = new Date(userData.registrationDate);
            profileDate.textContent = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // Customize content based on user type
        if (userType) {
            customizeContentForUserType(userType);
        }
    }
}

function customizeContentForUserType(userType) {
    // Customize welcome subtitle based on user type
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    
    switch(userType.toLowerCase()) {
        case 'fresher':
            welcomeSubtitle.textContent = 'Ready to start your career journey?';
            // Hide create course feature for freshers
            hideCreateCourseFeature();
            break;
        case 'senior':
            welcomeSubtitle.textContent = 'Ready to advance your career?';
            break;
        case 'alumni':
            welcomeSubtitle.textContent = 'Ready to share your expertise?';
            break;
        default:
            welcomeSubtitle.textContent = 'Ready to shape your future?';
    }
}

function hideCreateCourseFeature() {
    // Hide the create course CTA section for fresher users
    const createCourseCTA = document.querySelector('.create-course-cta');
    if (createCourseCTA) {
        createCourseCTA.style.display = 'none';
        
        // Add a message explaining why the feature is not available
        const messageDiv = document.createElement('div');
        messageDiv.className = 'fresher-message';
        messageDiv.style.cssText = `
            background: rgba(155, 154, 154, 0.1);
            border: 1px solid rgba(155, 154, 154, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            text-align: center;
            color: #B5B5B5;
        `;
        
        messageDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 12px;">📚</div>
            <h3 style="color: #D8D8D8; font-size: 20px; margin-bottom: 12px;">Focus on Learning First!</h3>
            <p style="margin-bottom: 0;">As a fresher, we recommend focusing on taking courses and gaining knowledge. Course creation features will be available as you advance in your journey!</p>
        `;
        
        // Insert the message after the stats grid
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid && statsGrid.parentNode) {
            statsGrid.parentNode.insertBefore(messageDiv, createCourseCTA);
        }
    }
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all links and sections
            navLinks.forEach(nl => nl.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            const targetSectionElement = document.getElementById(targetSection);
            if (targetSectionElement) {
                targetSectionElement.classList.add('active');
                
                // Smooth scroll to top of main content
                document.querySelector('.main-content').scrollIntoView({
                    behavior: 'smooth'
                });
            }
            
            // Add navigation animation
            addNavigationAnimation(this);
        });
    });
}

function addNavigationAnimation(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 100);
}

function initializeInteractiveFeatures() {
    // Feature cards navigation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            navigateToSection(feature);
            addCardClickAnimation(this);
        });
    });
    
    // Feature buttons
    const featureBtns = document.querySelectorAll('.feature-btn');
    featureBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            const featureCard = this.closest('.feature-card');
            const feature = featureCard.getAttribute('data-feature');
            navigateToSection(feature);
            addButtonClickAnimation(this);
        });
    });
    
    // Course enrollment buttons
    const enrollBtns = document.querySelectorAll('.enroll-btn');
    enrollBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showEnrollmentModal();
            addButtonClickAnimation(this);
        });
    });
    
    // Mentor booking buttons
    const bookSessionBtns = document.querySelectorAll('.book-session-btn');
    bookSessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showBookingModal();
            addButtonClickAnimation(this);
        });
    });
    
    // AI Chat functionality
    initializeAIChat();
    
    // Add hover effects to cards
    addCardHoverEffects();
}

function navigateToSection(sectionId) {
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navLink) {
        // Remove active class from all links and sections
        navLinks.forEach(nl => nl.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked link and corresponding section
        navLink.classList.add('active');
        const targetSectionElement = document.getElementById(sectionId);
        if (targetSectionElement) {
            targetSectionElement.classList.add('active');
            
            // Smooth scroll to top of main content
            document.querySelector('.main-content').scrollIntoView({
                behavior: 'smooth'
            });
        }
        
        // Add navigation animation
        addNavigationAnimation(navLink);
    }
}

function addCardClickAnimation(element) {
    element.style.transform = 'scale(0.98)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

function addButtonClickAnimation(element) {
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(216, 216, 216, 0.3)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.zIndex = '1';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size/2 + 'px';
    ripple.style.marginTop = -size/2 + 'px';
    
    // Make button relative if not already
    const position = window.getComputedStyle(element).position;
    if (position !== 'relative' && position !== 'absolute') {
        element.style.position = 'relative';
    }
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function addCardHoverEffects() {
    const allCards = document.querySelectorAll('.stat-card, .feature-card, .course-card, .mentor-card');
    
    allCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function initializeAIChat() {
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatInput && sendBtn && chatMessages) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate AI thinking
        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            addMessage(aiResponse, 'ai');
        }, 1000);
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageP = document.createElement('p');
        messageP.textContent = text;
        
        if (sender === 'user') {
            messageP.style.background = 'rgba(155, 154, 154, 0.2)';
            messageP.style.borderRadius = '16px 16px 4px 16px';
            messageP.style.marginLeft = 'auto';
            messageP.style.textAlign = 'right';
        } else {
            messageP.style.background = 'rgba(155, 154, 154, 0.1)';
            messageP.style.borderRadius = '16px 16px 16px 4px';
        }
        
        messageP.style.color = '#D8D8D8';
        messageP.style.padding = '16px 20px';
        messageP.style.display = 'inline-block';
        messageP.style.maxWidth = '80%';
        messageP.style.lineHeight = '1.5';
        messageP.style.marginBottom = '0';
        
        messageDiv.appendChild(messageP);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
            messageDiv.style.transition = 'all 0.3s ease';
        }, 10);
    }
    
    function generateAIResponse(userMessage) {
        const responses = {
            'career': "Based on your profile, I recommend focusing on web development or data science. These fields have great growth potential!",
            'course': "I suggest starting with our Machine Learning Fundamentals course. It's perfect for your background and interests.",
            'skill': "Key skills for your career path include: Programming (Python/JavaScript), Problem-solving, Communication, and Continuous learning.",
            'job': "Great job opportunities in your field include: Software Developer, Data Analyst, Product Manager, and UX Designer.",
            'mentor': "I can connect you with mentors in your field. Sarah Johnson specializes in ML and would be perfect for your goals.",
            'default': "That's a great question! I'm here to help guide your career journey. Feel free to ask about courses, skills, job opportunities, or mentorship."
        };
        
        const message = userMessage.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key) && key !== 'default') {
                return response;
            }
        }
        
        return responses.default;
    }
}

function showEnrollmentModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(22, 22, 22, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: rgb(22, 22, 22);
        border: 1px solid rgba(155, 154, 154, 0.3);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        animation: modalSlideIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #D8D8D8; font-size: 24px; margin-bottom: 16px;">Course Enrollment</h3>
        <p style="color: #B5B5B5; margin-bottom: 24px;">Great choice! This course will help you build essential skills for your career.</p>
        <div style="margin-bottom: 24px;">
            <button class="modal-btn primary" style="
                background: rgba(155, 154, 154, 0.3);
                color: #D8D8D8;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 500;
                cursor: pointer;
                margin-right: 12px;
                transition: all 0.3s ease;
            ">Enroll Now</button>
            <button class="modal-btn secondary" style="
                background: transparent;
                color: #B5B5B5;
                border: 1px solid rgba(155, 154, 154, 0.3);
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Save for Later</button>
        </div>
        <button class="close-modal" style="
            background: none;
            border: none;
            color: #9B9A9A;
            cursor: pointer;
            font-size: 14px;
            text-decoration: underline;
        ">Close</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add modal animations CSS
    if (!document.querySelector('#modal-animations')) {
        const style = document.createElement('style');
        style.id = 'modal-animations';
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Close modal functionality
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.classList.contains('close-modal')) {
            overlay.remove();
        }
    });
    
    // Button hover effects
    modal.querySelectorAll('.modal-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (this.classList.contains('primary')) {
                this.style.background = 'rgba(155, 154, 154, 0.4)';
            } else {
                this.style.background = 'rgba(155, 154, 154, 0.1)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (this.classList.contains('primary')) {
                this.style.background = 'rgba(155, 154, 154, 0.3)';
            } else {
                this.style.background = 'transparent';
            }
        });
        
        btn.addEventListener('click', function() {
            // Show success message
            modal.innerHTML = `
                <div style="color: #4CAF50; font-size: 48px; margin-bottom: 16px;">✓</div>
                <h3 style="color: #D8D8D8; font-size: 24px; margin-bottom: 16px;">Success!</h3>
                <p style="color: #B5B5B5; margin-bottom: 24px;">You're all set! Check your email for course details.</p>
                <button class="close-modal" style="
                    background: rgba(155, 154, 154, 0.3);
                    color: #D8D8D8;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 500;
                    cursor: pointer;
                ">Close</button>
            `;
            
            modal.querySelector('.close-modal').addEventListener('click', () => overlay.remove());
        });
    });
}

function showBookingModal() {
    // Similar modal for mentor booking
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(22, 22, 22, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: rgb(22, 22, 22);
        border: 1px solid rgba(155, 154, 154, 0.3);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        animation: modalSlideIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #D8D8D8; font-size: 24px; margin-bottom: 16px;">Book Mentorship Session</h3>
        <p style="color: #B5B5B5; margin-bottom: 24px;">Connect with an expert for personalized guidance on your career journey.</p>
        <div style="margin-bottom: 24px;">
            <button class="modal-btn primary" style="
                background: rgba(155, 154, 154, 0.3);
                color: #D8D8D8;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 500;
                cursor: pointer;
                margin-right: 12px;
                transition: all 0.3s ease;
            ">Book Session</button>
            <button class="modal-btn secondary" style="
                background: transparent;
                color: #B5B5B5;
                border: 1px solid rgba(155, 154, 154, 0.3);
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            ">View Profile</button>
        </div>
        <button class="close-modal" style="
            background: none;
            border: none;
            color: #9B9A9A;
            cursor: pointer;
            font-size: 14px;
            text-decoration: underline;
        ">Close</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Same close and interaction logic as enrollment modal
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.classList.contains('close-modal')) {
            overlay.remove();
        }
    });
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.stat-card, .feature-card, .course-card, .mentor-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Staggered animations for grids
    setTimeout(() => {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 500);
}

// Add some utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(155, 154, 154, 0.9)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Create Course Modal Functionality
let selectedTags = [];

function openCreateCourse() {
    const modal = document.getElementById('create-course-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Initialize form
        initializeCreateCourseForm();
        
        // Re-initialize Lucide icons for the modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function closeCreateCourse() {
    const modal = document.getElementById('create-course-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Reset form
        resetCreateCourseForm();
    }
}

function initializeCreateCourseForm() {
    const form = document.getElementById('create-course-form');
    const titleInput = document.getElementById('course-title');
    const descriptionInput = document.getElementById('course-description');
    const levelInput = document.getElementById('course-level');
    const durationInput = document.getElementById('course-duration');
    const tagInput = document.getElementById('tag-input');
    
    // Real-time preview updates
    if (titleInput) {
        titleInput.addEventListener('input', updatePreview);
    }
    if (descriptionInput) {
        descriptionInput.addEventListener('input', updatePreview);
    }
    if (levelInput) {
        levelInput.addEventListener('change', updatePreview);
    }
    if (durationInput) {
        durationInput.addEventListener('input', updatePreview);
    }
    
    // Tag input functionality
    if (tagInput) {
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleCreateCourseSubmit);
    }
    
    // Initialize suggested tags click handlers
    const suggestedTags = document.querySelectorAll('.suggested-tag');
    suggestedTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.replace('+ ', '');
            addSuggestedTag(tagText);
        });
    });
}

function addTag() {
    const tagInput = document.getElementById('tag-input');
    const tagText = tagInput.value.trim();
    
    if (tagText && !selectedTags.includes(tagText)) {
        selectedTags.push(tagText);
        tagInput.value = '';
        renderSelectedTags();
        updatePreview();
        updateSuggestedTags();
    }
}

function addSuggestedTag(tagText) {
    if (tagText && !selectedTags.includes(tagText)) {
        selectedTags.push(tagText);
        renderSelectedTags();
        updatePreview();
        updateSuggestedTags();
    }
}

function removeTag(tagText) {
    selectedTags = selectedTags.filter(tag => tag !== tagText);
    renderSelectedTags();
    updatePreview();
    updateSuggestedTags();
}

function renderSelectedTags() {
    const selectedTagsContainer = document.getElementById('selected-tags');
    if (!selectedTagsContainer) return;
    
    selectedTagsContainer.innerHTML = '';
    
    selectedTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <button type="button" class="tag-remove" onclick="removeTag('${tag}')">
                <i data-lucide="x" style="width: 12px; height: 12px;"></i>
            </button>
        `;
        selectedTagsContainer.appendChild(tagElement);
    });
    
    // Re-initialize Lucide icons for new tags
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function updateSuggestedTags() {
    const suggestedTagElements = document.querySelectorAll('.suggested-tag');
    suggestedTagElements.forEach(element => {
        const tagText = element.textContent.replace('+ ', '');
        if (selectedTags.includes(tagText)) {
            element.style.display = 'none';
        } else {
            element.style.display = 'inline-block';
        }
    });
}

function updatePreview() {
    const titleInput = document.getElementById('course-title');
    const descriptionInput = document.getElementById('course-description');
    const levelInput = document.getElementById('course-level');
    const durationInput = document.getElementById('course-duration');
    
    const previewTitle = document.getElementById('preview-title');
    const previewDescription = document.getElementById('preview-description');
    const previewLevel = document.getElementById('preview-level');
    const previewDuration = document.getElementById('preview-duration');
    const previewTags = document.getElementById('preview-tags');
    
    // Update preview content
    if (previewTitle) {
        previewTitle.textContent = titleInput?.value || 'Course Title';
    }
    if (previewDescription) {
        previewDescription.textContent = descriptionInput?.value || 'Course description will appear here...';
    }
    if (previewLevel) {
        previewLevel.textContent = levelInput?.value || 'Beginner';
    }
    if (previewDuration) {
        previewDuration.textContent = durationInput?.value || 'Duration';
    }
    
    // Update preview tags
    if (previewTags) {
        previewTags.innerHTML = '';
        const tagsToShow = selectedTags.slice(0, 3);
        
        tagsToShow.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'preview-tag';
            tagElement.textContent = tag;
            previewTags.appendChild(tagElement);
        });
        
        if (selectedTags.length > 3) {
            const moreTagsElement = document.createElement('span');
            moreTagsElement.className = 'preview-tag';
            moreTagsElement.textContent = `+${selectedTags.length - 3}`;
            previewTags.appendChild(moreTagsElement);
        }
    }
}

async function handleCreateCourseSubmit(e) {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById('course-title')?.value,
    description: document.getElementById('course-description')?.value,
    level: document.getElementById('course-level')?.value,
    duration: document.getElementById('course-duration')?.value,
    tags: selectedTags
  };
  
  // Validate form data
  if (!formData.title || !formData.description || !formData.duration) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  const createBtn = document.querySelector('.create-btn');
  const originalText = createBtn.textContent;
  createBtn.textContent = 'Creating...';
  createBtn.disabled = true;
  
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      closeCreateCourse();
      showNotification('Course created successfully! It will be reviewed before publishing.', 'success');
      
      // Optionally refresh courses list
      // loadCourses();
    } else {
      showNotification(result.error || 'Failed to create course', 'error');
    }
  } catch (error) {
    console.error('Error creating course:', error);
    showNotification('Network error. Please try again.', 'error');
  } finally {
    // Reset button
    createBtn.textContent = originalText;
    createBtn.disabled = false;
  }
}

function resetCreateCourseForm() {
    const form = document.getElementById('create-course-form');
    if (form) {
        form.reset();
    }
    
    selectedTags = [];
    renderSelectedTags();
    updatePreview();
    updateSuggestedTags();
}

// Make functions globally available
window.openCreateCourse = openCreateCourse;
window.closeCreateCourse = closeCreateCourse;
window.addTag = addTag;
window.addSuggestedTag = addSuggestedTag;
window.removeTag = removeTag;

// Export functions for potential external use
window.MiraiHome = {
    navigateToSection,
    showNotification,
    loadUserData,
    openCreateCourse,
    closeCreateCourse
};
