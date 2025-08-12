document.getElementById("navigate-btn").addEventListener("click", function () {
  this.classList.add("button-fade-out");
  
  setTimeout(() => {
    document.body.classList.add("body-exit");
    const pillarAnim = document.getElementById("pillar-animation");
    
    pillarAnim.classList.add("pillar-animate-in");
    
    setTimeout(() => {
      pillarAnim.classList.remove("pillar-animate-in");
      pillarAnim.classList.add("pillar-animate-out");
      
      setTimeout(() => {
        window.location.href = "../Auth Page/auth.html";
      }, 3500);
    }, 3500);
  }, 1300); 
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
