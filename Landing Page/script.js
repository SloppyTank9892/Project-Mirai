document.getElementById('navigate-btn').addEventListener('click', function() {
    this.classList.add('button-fade-out');
    setTimeout(() => {
        document.body.classList.add('body-exit');
        const pillarAnim = document.getElementById('pillar-animation');
        pillarAnim.classList.add('pillar-animate');
        setTimeout(function() {
            window.location.href = '../Auth Page/Auth.html';
        }, 1600); 
    }, 700); 
});

// Select the pillar animation container
const pillarAnim = document.querySelector('.pillar-animation');

// Function to run the pillar animation sequence
function runPillarAnimation() {
  // Step 1: Reset classes
  pillarAnim.classList.remove('pillar-animate');
  pillarAnim.classList.remove('pillar-animate-in');

  // Step 2: Start with pillars off-screen (top/bottom)
  // Add 'pillar-animate-in' to slide pillars in
  pillarAnim.classList.add('pillar-animate-in');

  // Step 3: After pillars have slid in, slide them out
  setTimeout(() => {
    pillarAnim.classList.remove('pillar-animate-in');
    pillarAnim.classList.add('pillar-animate');
  }, 1600); // Match your CSS transition duration
}

// Run the animation when needed (for example, on button click)
document.querySelector('button').addEventListener('click', runPillarAnimation);