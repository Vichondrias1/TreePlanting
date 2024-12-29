let totalTreesPlanted = 0; // Initialize total tree count
let sampleData = {}; // Will hold the JSON data from the file
let usedCodes = []; // List of used codes
let usedQRCodes = []; // Array to store used QR codes

// Function to load sample data from JSON file
function loadSampleData() {
    return $.getJSON("data/sampleData.json?v=" + new Date().getTime())
        .done(data => {
            sampleData = data;
            console.log("Sample data loaded:", sampleData);
        })
        .fail(() => {
            showError("Failed to load sample data.");
        });
}

// Function to load used codes from localStorage
function loadUsedCodes() {
    const savedCodes = localStorage.getItem("usedCodes");
    usedCodes = savedCodes ? JSON.parse(savedCodes) : [];
}

// Function to save used codes to localStorage
function saveUsedCodes() {
    localStorage.setItem("usedCodes", JSON.stringify(usedCodes));
}

// Function to load total trees from localStorage
function loadTotalTrees() {
    const savedTotal = localStorage.getItem("totalTreesPlanted");
    totalTreesPlanted = savedTotal ? parseInt(savedTotal, 10) : 0; //base to 10 (decimal).
    updateTotalTreesDisplay(); // Update UI with saved total
}

// Function to save total trees to localStorage
function saveTotalTrees() {
    localStorage.setItem("totalTreesPlanted", totalTreesPlanted);
}

// Function to calculate the number of trees
function calculateTrees(amount) {
    const points = Math.floor(amount / 100); // 100 pesos = 1 point
    return Math.floor(points / 50); // 50 points = 1 tree
}

// Update total trees display
function updateTotalTreesDisplay() {
    $("#totalTrees").text(totalTreesPlanted); // Update UI
}

// Increment total trees and update display
function updateTotalTrees(trees) {
    totalTreesPlanted += trees;
    updateTotalTreesDisplay();
    saveTotalTrees(); // Save to localStorage
}

// Update user points in localStorage and handle tree conversion
function updateUserPoints(points) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    // if (!loggedInUser) {
    //     showError("No user logged in. Redirecting to login.");
    //     setTimeout(() => (window.location.href = "login.html"), 3000);
    //     return;
    // }

    // Get current points
    let userPoints = parseInt(localStorage.getItem(`points_${loggedInUser}`) || "0", 10); //base to 10 (decimal).
    userPoints += points; // Add new points

    // Check if points reach 50 or more
    while (userPoints >= 50) {
        userPoints -= 50; // Deduct 50 points
        updateTotalTrees(1); // Convert to 1 tree planted
        updateUserTrees(loggedInUser); // Increment user's trees planted
    }

    // Save updated points and refresh UI
    localStorage.setItem(`points_${loggedInUser}`, userPoints);
    $("#loggedInUser").text(loggedInUser);
    $("#userPoints").text(userPoints);
}


// Show error message
function showError(message) {
    const $errorAlert = $("#errorAlert");
    $errorAlert.text(message).fadeIn();
    setTimeout(() => $errorAlert.fadeOut(), 5000); // Fade out after 5 seconds
}

// Function to show result message temporarily
function showResultMessage(message) {
    const $resultMessage = $("#resultMessage");
    $resultMessage.text(message).fadeIn(); // Set the message and fade it in
    setTimeout(() => $resultMessage.fadeOut(), 5000); // Fade out after 5 seconds
}


// Toggle between QR Code input and code input
function toggleInputFields() {
    if ($("#qrCodeOption").prop("checked")) {
        $("#qrCodeSection").show();
        $("#codeSection").hide();
    } else if ($("#codeOption").prop("checked")) {
        $("#qrCodeSection").hide();
        $("#codeSection").show();
    }
}

// Check if a code has been used
function isCodeUsed(code) {
    return usedCodes.includes(code);
}

// Mark a code as used
function markCodeAsUsed(code) {
    usedCodes.push(code);
    saveUsedCodes();
}



// Display logged-in user and their points
function displayUser() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        const userPoints = parseInt(localStorage.getItem(`points_${loggedInUser}`) || "0", 10); //base to 10 (decimal).
        $("#loggedInUser").text(loggedInUser);
        $("#userPoints").text(userPoints);

        $("#login-nav").hide(); // Hide logged-in user
    } else {
        console.log("not logged in");
        $("#user-nav").hide(); // Hide logged-in user
        $("#login-nav").show(); // Hide logged-in user

    }
}

// Update user trees planted in localStorage
function updateUserTrees(user, additionalTrees) {
    if (additionalTrees <= 0) return; // Prevent unnecessary updates

    let userTrees = parseInt(localStorage.getItem(`trees_${user}`) || "0", 10); //base to 10 (decimal).
    userTrees += additionalTrees; // Increment trees planted
    localStorage.setItem(`trees_${user}`, userTrees);
}


// Update the leaderboard display
function updateLeaderboard() {
    const leaderboard = [];

    // Collect trees planted for each user
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("trees_")) {
            const user = key.replace("trees_", "");
            const trees = parseInt(localStorage.getItem(key), 10); //base to 10 (decimal).
            leaderboard.push({ user, trees });
        }
    });

    // Sort by trees planted in descending order
    leaderboard.sort((a, b) => b.trees - a.trees);

    // Update the leaderboard UI
    const $leaderboard = $("#leaderboard");
    $leaderboard.empty();
    leaderboard.forEach((entry) => {
        $leaderboard.append(
            `<li class="list-group-item d-flex justify-content-between align-items-center">
                <h4 class="process-card-title">${entry.user}</h4>
                <span class="bg-success text-white pull-right tree-badge">${entry.trees} Trees</span>
            </li>`
        );
    });
}

// Handle "Enter a Code"
function handleCode() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        showError("No user logged in. Redirecting to login.");
        setTimeout(() => (window.location.href = "login.html"), 2000);
        return;
    }


    const codeInput = $("#codeInput").val().trim();
    if (!codeInput) {
        showError("Please enter a code!");
        return;
    }

    const userData = sampleData[codeInput];
    if (!userData) {
        showError("Code not found in the database.");
        return;
    }

    const usedCodes = JSON.parse(localStorage.getItem("usedCodes")) || [];
    if (usedCodes.includes(codeInput)) {
        showError("This code has already been used!");
        return;
    }

    // Mark the code as used
    usedCodes.push(codeInput);
    localStorage.setItem("usedCodes", JSON.stringify(usedCodes));

    const amount = userData.amount;
    const points = Math.floor(amount / 100); // 100 pesos = 1 point

    const currentPoints = parseInt(localStorage.getItem(`points_${loggedInUser}`) || "0", 10); // base to 10 (decimal).
    const totalPoints = currentPoints + points;

    // Calculate total trees and remaining points based on 50-point rule
    const additionalTrees = Math.floor(totalPoints / 50);
    const finalRemainingPoints = totalPoints % 50;

    // Update user points and trees
    localStorage.setItem(`points_${loggedInUser}`, finalRemainingPoints);
    updateUserTrees(loggedInUser, additionalTrees);
    updateLeaderboard();

    $("#userPoints").text(finalRemainingPoints);

    if (additionalTrees > 0) {
        showResultMessage(`Congratulations ${loggedInUser}! You've planted ${additionalTrees} trees.`);
    } else {
        showResultMessage(`Congratulations ${loggedInUser}! You've earned ${points} points.`);
    }

    updateTotalTrees(additionalTrees);
}


// Handle QR Code upload
function handleQRCode() {

    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        showError("No user logged in. Redirecting to login.");
        setTimeout(() => (window.location.href = "login.html"), 2000);
        return;
    }

    const qrCodeInput = $("#qrCode")[0];
    if (!qrCodeInput.files[0]) {
        showError("Please upload a QR code!");
        return;
    }

    const file = qrCodeInput.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const img = new Image();
        img.src = reader.result;

        img.onload = function() {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const qrCodeData = jsQR(imageData.data, canvas.width, canvas.height);

            if (qrCodeData) {
                try {
                    const qrContent = JSON.parse(qrCodeData.data);

                    if (isCodeUsed(qrContent.code)) {
                        showError("This QR code has already been used.");
                        return;
                    }



                    const amount = qrContent.amount;
                    const points = Math.floor(amount / 100); // Calculate points
                    const currentPoints = parseInt(localStorage.getItem(`points_${loggedInUser}`) || "0", 10); //base to 10 (decimal).
                    const totalPoints = currentPoints + points;

                    // Calculate total trees and remaining points based on 50-point rule
                    const additionalTrees = Math.floor(totalPoints / 50);
                    const finalRemainingPoints = totalPoints % 50;

                    localStorage.setItem(`points_${loggedInUser}`, finalRemainingPoints);

                    if (additionalTrees > 0) {
                        updateUserTrees(loggedInUser, additionalTrees);
                        updateTotalTrees(additionalTrees);
                        showResultMessage(`Congratulations ${loggedInUser}! You've planted ${additionalTrees} trees.`);
                    } else {
                        showResultMessage(`Congratulations ${loggedInUser}! You've earned ${points} points.`);
                    }

                    markCodeAsUsed(qrContent.code);
                    $("#userPoints").text(finalRemainingPoints);
                    updateLeaderboard();
                } catch (error) {
                    showError("QR Code content is not valid JSON.");
                }
            } else {
                showError("No QR code detected.");
            }
        };
    };

    reader.readAsDataURL(file);
}




// Initialize the calculator page
$(document).ready(function() {
    displayUser(); // Display logged-in user
    loadTotalTrees(); // Load total trees from localStorage
    loadSampleData(); // Load sample data from JSON
    loadUsedCodes(); // Load used codes from localStorage
    toggleInputFields(); // Show QR Code input by default
    updateLeaderboard(); // Display initial leaderboard

    // Event listeners for buttons
    $("#calculateQRCodeBtn").click(handleQRCode);
    $("#calculateCodeBtn").click(handleCode);

    // Event listener for radio buttons to toggle input fields
    $("input[name='inputType']").change(toggleInputFields);
});