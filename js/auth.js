$(document).ready(function() {
    // Register a new user
    $("#registerForm").submit(function(e) {
        e.preventDefault();
        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert("Username already exists!");
        } else {
            users.push({ username, password });
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registration successful! You can now login.");
            window.location.href = "login.html";
        }
    });

    // Login a user
    $("#loginForm").submit(function(e) {
        e.preventDefault();
        const username = $("#loginUsername").val().trim();
        const password = $("#loginPassword").val().trim();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const validUser = users.find(user => user.username === username && user.password === password);

        if (validUser) {
            localStorage.setItem("loggedInUser", username);
            window.location.href = "index.html";
        } else {
            alert("Invalid username or password!");
        }
    });

    // Logout user
    $("#logoutButton").click(function() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    // Check login status and redirect if not logged in
    const currentPage = window.location.pathname.split("/").pop();
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (currentPage === "index.html" && !loggedInUser) {
      //  window.location.href = "login.html";

    }
});