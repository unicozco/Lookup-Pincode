const form = document.getElementById("pincode-form");
const pincodeInput = document.getElementById("pincode");
const messageDiv = document.getElementById("message");
const loader = document.getElementById("loader");
const resultContainer = document.getElementById("result-container");
const pincodeResult = document.getElementById("pincode-result");
const postOfficesContainer = document.getElementById("post-offices");
const filterInput = document.getElementById("filter");

let postOffices = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const pincode = pincodeInput.value.trim();
  if (pincode.length !== 6 || isNaN(pincode)) {
    showMessage("Please enter a valid 6-digit pincode.");
    return;
  }

  clearUI();
  showLoader(true);

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

    displayResults(pincode, postOffices);
  } catch (error) {
    showMessage("An error occurred while fetching data. Please try again.");
  } finally {
    showLoader(false);
  }
});

filterInput.addEventListener("input", (e) => {
  const filter = e.target.value.toLowerCase();
  const filteredOffices = postOffices.filter((office) =>
    office.Name.toLowerCase().includes(filter)
  );

  if (filteredOffices.length === 0) {
    showMessage("Couldn't find the postal data you're looking for...");
  } else {
    displayPostOffices(filteredOffices);
  }
});

function showMessage(msg) {
  messageDiv.textContent = msg;
  messageDiv.classList.remove("hidden");
}

function clearUI() {
  messageDiv.textContent = "";
  messageDiv.classList.add("hidden");
  resultContainer.classList.add("hidden");
  postOfficesContainer.innerHTML = "";
}

function showLoader(show) {
  loader.classList.toggle("hidden", !show);
}

function displayResults(pincode, offices) {
  pincodeResult.textContent = pincode;
  displayPostOffices(offices);
  resultContainer.classList.remove("hidden");
}

function displayPostOffices(offices) {
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
    .join("");
}
