let totalTreesPlanted = 0; // Initialize total tree count
let sampleData = {}; // Will hold the JSON data from the file

// Function to load sample data from JSON file
function loadSampleData() {
    return $.getJSON("data/sampleData.json")
        .done(data => {
            sampleData = data;
        })
        .fail(() => {
            showError("Failed to load sample data.");
        });
}

// Function to load total trees from localStorage
function loadTotalTrees() {
    const savedTotal = localStorage.getItem("totalTreesPlanted");
    totalTreesPlanted = savedTotal ? parseInt(savedTotal, 10) : 0;
    $("#totalTrees").text(totalTreesPlanted); // Update UI with saved total
}

// Function to save total trees to localStorage
function saveTotalTrees() {
    localStorage.setItem("totalTreesPlanted", totalTreesPlanted);
}

// Function to calculate the number of trees
function calculateTrees(amount) {
    const points = Math.floor(amount / 100); // 100 pesos = 1 point
    return Math.floor(points / 10); // 10 points = 1 tree
}

// Update total trees display
function updateTotalTrees(trees) {
    totalTreesPlanted += trees;
    $("#totalTrees").text(totalTreesPlanted); // Update total trees display
    saveTotalTrees(); // Save to localStorage
}

// Show error message
function showError(message) {
    const $errorAlert = $("#errorAlert");
    $errorAlert.text(message).fadeIn();
    setTimeout(() => $errorAlert.fadeOut(), 3000); // Fade out after 3 seconds
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

// Handle QR Code upload
function handleQRCode() {
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
                    const trees = calculateTrees(qrContent.amount);
                    $("#resultMessage").text(
                        `${qrContent.name} traveled ${qrContent.totalKM} km and planted ${trees} trees.`
                    );
                    updateTotalTrees(trees);
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

// Handle "Enter a Code"
function handleCode() {
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

    const trees = calculateTrees(userData.amount);
    $("#resultMessage").text(
        `${userData.name} traveled ${userData.totalKM} km and planted ${trees} trees.`
    );
    updateTotalTrees(trees);
}

//Display User
function displayUser() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    // Display logged-in user
    if (loggedInUser) {
        $("#loggedInUser").text(loggedInUser);
    }
}

// Initialize
$(document).ready(function() {
    displayUser(); //Display User Logged In
    loadTotalTrees(); // Load total trees from localStorage
    loadSampleData(); // Load sample data from JSON
    toggleInputFields(); // Show QR Code input by default

    // Event listeners for buttons
    $("#calculateQRCodeBtn").click(handleQRCode);
    $("#calculateCodeBtn").click(handleCode);

    // Event listener for radio buttons to toggle input fields
    $("input[name='inputType']").change(toggleInputFields);
});