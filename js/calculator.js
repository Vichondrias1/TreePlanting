$(document).ready(function() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    // Display logged-in user
    if (loggedInUser) {
        $("#loggedInUser").text(loggedInUser);
    }
});