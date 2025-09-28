
function logout() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}