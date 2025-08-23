document.getElementById("navigate-btn").addEventListener("click", function () {
  this.classList.add("button-fade-out");
  
  setTimeout(() => {
    document.body.classList.add("body-exit");
    
    // Simple fade transition without pillar animation
    setTimeout(() => {
      window.location.href = "/auth";
    }, 1000);
  }, 500); 
});
