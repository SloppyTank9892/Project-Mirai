document.getElementById("navigate-btn").addEventListener("click", function () {
  // Step 1: Button fades out slowly (1.2s)
  this.classList.add("button-fade-out");
  
  // Step 2: Wait for button fade to complete, then start pillar animation
  setTimeout(() => {
    document.body.classList.add("body-exit");
    const pillarAnim = document.getElementById("pillar-animation");
    
    // Step 3: Pillars come in slowly
    pillarAnim.classList.add("pillar-animate-in");
    
    // Step 4: Wait for pillars to fully come in (3.5s), then make them leave
    setTimeout(() => {
      pillarAnim.classList.remove("pillar-animate-in");
      pillarAnim.classList.add("pillar-animate-out");
      
      // Step 5: Wait for pillars to fully leave (3.5s), then navigate
      setTimeout(() => {
        window.location.href = "../Auth Page/auth.html";
      }, 3500);
    }, 3500);
  }, 1300); // Wait a bit longer for button fade to complete
});

const pillarAnim = document.querySelector(".pillar-animation");

function runPillarAnimation() {
  pillarAnim.classList.remove("pillar-animate");
  pillarAnim.classList.remove("pillar-animate-in");
  pillarAnim.classList.add("pillar-animate-in");
  setTimeout(() => {
    pillarAnim.classList.remove("pillar-animate-in");
    pillarAnim.classList.add("pillar-animate");
  }, 3500);
}
