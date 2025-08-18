const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const signInBtn = document.querySelector(".sign-in form button:not(.icon)");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

signInBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = "auth1.html";
  }, 1000);
});
