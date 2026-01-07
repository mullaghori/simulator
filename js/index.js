
/******************************************

INDEX.JS FILE FOR THE INDEX.HTML PAGE OF MY SIMULATOR - WEB-BASED SIMULATOR FOR SORTING ALGORITHMS
BY
JAVED ULLAH - BC210405541

THIS FILE CAN CAN...
* Verify the entered array if enetered in a valid format
* Verify that the array is provided
* Save array in session storage
* Generate an array as per user's requirements

BUG - TO BE REMOVED
* When the user cancel the alert, the process is still moving forward

******************************************/


// Function to store array in sessionStorage and redirect
function saveArray() {
    let input = document.getElementById("arrayInput").value;
    let inputArray = input.split(",").map(s => s.trim()).filter(s => s !== "").map(Number);

    if (inputArray.length === 0 || inputArray.some(isNaN)) {
        alert("Please enter a valid array of numbers separated by commas.");
        return;
    }

    sessionStorage.removeItem("generatedArray"); // Clear previous random array
    sessionStorage.setItem("userArray", JSON.stringify(inputArray));

    window.location.href = "../html/algorithm.html"; // Redirect to algorithm page
}

// Ensure button click triggers the function
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("selectAlgorithmBtn").addEventListener("click", saveArray);
});

// Select the "Generate Random" button
const generateRandomBtn = document.getElementById("generateRandomBtn");

// click event listener
generateRandomBtn.addEventListener("click", () => {

    // Ask the user for array length
    let lengthInput = prompt("Enter the length of the array (leave empty for random between 10 and 100):");
    let arrayLength = parseInt(lengthInput);

    // Use default random length if input is invalid
    if (isNaN(arrayLength) || arrayLength <= 0) {
        arrayLength = Math.floor(Math.random() * 91) + 10; // Random between 10 and 100
    }

    // Ask the user for minimum value (default = 0)
    let minInput = prompt("Enter the minimum value of array elements (default = 0):");
    let minValue = parseInt(minInput);
    if (isNaN(minValue)) minValue = 0;

    // Ask the user for maximum value (default = 100)
    let maxInput = prompt("Enter the maximum value of array elements (default = 100):");
    let maxValue = parseInt(maxInput);
    if (isNaN(maxValue)) maxValue = 100;

    // Swap if min > max
    if (minValue > maxValue) {
        [minValue, maxValue] = [maxValue, minValue];
    }

    // Generate the random array
    const randomArray = [];
    for (let i = 0; i < arrayLength; i++) {
        const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        randomArray.push(randomValue);
    }

    sessionStorage.removeItem("userArray"); // Clear user input if generating new
    // Store the array in sessionStorage for use in sorting.html
    sessionStorage.setItem("generatedArray", JSON.stringify(randomArray));

    // Inform user and redirect
    alert(`Random array of ${arrayLength} elements created!\nNow redirecting to algorithm selection page...`);
    window.location.href = "../html/algorithm.html";
});


