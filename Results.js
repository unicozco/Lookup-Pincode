// **Results.js**

let postOffices = []; // To store the list of post offices fetched from the API

// DOM Elements
const filterInput = document.getElementById("filter");
const messageDiv = document.getElementById("message");
const postOfficesContainer = document.getElementById("post-offices");
const loader = document.getElementById("loader");
const pincodeResult = document.getElementById("pincode-result");

// Fetch the pincode from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const pincode = urlParams.get("pincode");

if (!pincode) {
  messageDiv.textContent = "No pincode provided.";
} else {
  pincodeResult.textContent = pincode; // Display the searched pincode in the UI
  fetchPincodeData(pincode); // Fetch data for the pincode
}

// Function to fetch pincode data from the API
async function fetchPincodeData(pincode) {
  loader.classList.remove("hidden"); // Show loader
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (data[0].Status !== "Success") {
      showMessage(data[0].Message || "Failed to fetch data.");
      return;
    }

    postOffices = data[0].PostOffice || [];
    if (postOffices.length === 0) {
      showMessage("No post office data available for this pincode.");
      return;
    }

    displayPostOffices(postOffices); // Display the fetched post offices
  } catch (error) {
    showMessage("An error occurred while fetching data. Please try again.");
  } finally {
    loader.classList.add("hidden"); // Hide loader
  }
}

// Event listener for the filter input
filterInput.addEventListener("input", (e) => {
  const filter = e.target.value.toLowerCase(); // Get the search input
  const filteredOffices = postOffices.filter((office) =>
    office.Name.toLowerCase().includes(filter)
  );

  if (filteredOffices.length === 0) {
    showMessage("Couldn't find the postal data you're looking for...");
  } else {
    displayPostOffices(filteredOffices); // Update the UI with filtered results
  }
});

// Function to display an error or informational message
function showMessage(msg) {
  messageDiv.textContent = msg; // Display the message
  messageDiv.classList.remove("hidden"); // Ensure the message is visible
  postOfficesContainer.innerHTML = ""; // Clear the results container
}

// Function to display the post offices on the page
function displayPostOffices(offices) {
  messageDiv.classList.add("hidden"); // Hide any error message
  postOfficesContainer.innerHTML = offices
    .map(
      (office) => `
      <div class="post-office">
        <p><strong>Name:</strong> ${office.Name}</p>
        <p><strong>Branch Type:</strong> ${office.BranchType}</p>
        <p><strong>Delivery Status:</strong> ${office.DeliveryStatus}</p>
        <p><strong>District:</strong> ${office.District}</p>
        <p><strong>State:</strong> ${office.State}</p>
      </div>`
    )
    .join(""); // Combine all the HTML strings into one
}
