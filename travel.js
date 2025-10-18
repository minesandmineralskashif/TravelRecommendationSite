// DOM Elements
const homeLink = document.getElementById("home-link");
const aboutLink = document.getElementById("about-link");
const contactLink = document.getElementById("contact-link");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const homePage = document.getElementById("home-page");
const aboutPage = document.getElementById("about-page");
const contactPage = document.getElementById("contact-page");
const recommendationsResults = document.getElementById(
  "recommendations-results"
);
const contactForm = document.getElementById("contact-form");

// Navigation
homeLink.addEventListener("click", () => showPage("home"));
aboutLink.addEventListener("click", () => showPage("about"));
contactLink.addEventListener("click", () => showPage("contact"));

function showPage(page) {
  // Hide all pages
  homePage.classList.remove("active");
  aboutPage.classList.remove("active");
  contactPage.classList.remove("active");

  // Show selected page
  if (page === "home") {
    homePage.classList.add("active");
  } else if (page === "about") {
    aboutPage.classList.add("active");
  } else if (page === "contact") {
    contactPage.classList.add("active");
  }
}

// Search Functionality
searchBtn.addEventListener("click", performSearch);
resetBtn.addEventListener("click", clearResults);

// Handle Enter key in search input
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

async function performSearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    alert("Please enter a search term (beach, temple, or country name)");
    return;
  }

  try {
    // Try different path variations
    let response;

    // Option 1: Try with ./ prefix
    try {
      response = await fetch("./travel.json");
      if (!response.ok) throw new Error("Response not ok");
    } catch (err) {
      // Option 2: Try without ./ prefix
      response = await fetch("travel.json");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data loaded successfully:", data);

    let results = [];

    // Search logic with keyword variations
    if (query.includes("beach") || query.includes("beaches")) {
      results = data.beaches || [];
    } else if (query.includes("temple") || query.includes("temples")) {
      results = data.temples || [];
    } else {
      // Search countries and cities
      const countryResults = data.countries
        .filter((country) => country.name.toLowerCase().includes(query))
        .flatMap((country) => country.cities);

      // Search individual cities across all countries
      const cityResults = data.countries.flatMap((country) =>
        country.cities.filter((city) => city.name.toLowerCase().includes(query))
      );

      results = [...countryResults, ...cityResults];

      // Remove duplicates based on city name
      results = results.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.name === item.name)
      );
    }

    displayResults(results, query);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    recommendationsResults.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e74c3c;">
        <h3>Error loading recommendations</h3>
        <p>Could not load travel.json file. Please check:</p>
        <ul style="text-align: left; display: inline-block; margin-top: 10px;">
          <li>The file is named "travel.json"</li>
          <li>It's in the same folder as your HTML file</li>
          <li>You're running on a local server (not opening file directly)</li>
        </ul>
      </div>
    `;
  }
}

function displayResults(results, query) {
  if (results.length === 0) {
    recommendationsResults.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h3 style="color: #2c3e50;">No results found for "${query}"</h3>
        <p style="color: #666;">Try searching for "beach", "temple", or a country name like "Australia", "Japan", or "Brazil".</p>
      </div>
    `;
    return;
  }

  const resultsHTML = `
    <h2 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">Recommendations for "${query}"</h2>
    <div class="recommendation-grid">
      ${results
        .map(
          (item) => `
          <div class="recommendation-card">
            <img src="${getImageUrl(item.imageUrl, item.name)}" alt="${
            item.name
          }" class="recommendation-image">
            <div class="recommendation-content">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  recommendationsResults.innerHTML = resultsHTML;
}

// Function to handle image URLs - uses placeholder if imageUrl is not proper
function getImageUrl(imageUrl, placeName) {
  // If imageUrl is a placeholder, use Unsplash based on place name
  if (imageUrl.includes("enter_your_image")) {
    const searchTerm = placeName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `https://source.unsplash.com/600x400/?${searchTerm},travel`;
  }
  return imageUrl;
}

function clearResults() {
  searchInput.value = "";
  recommendationsResults.innerHTML = "";
}

// Contact Form
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Simple form validation
  if (!name || !email || !message) {
    alert("Please fill in all fields");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // In a real application, you would send this data to a server
  alert(
    `Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`
  );
  contactForm.reset();
});

// Initialize page
showPage("home");

// Add some sample search suggestions
document.addEventListener("DOMContentLoaded", function () {
  console.log("TravelBloom website loaded successfully!");
  searchInput.placeholder = "Try: beach, temple, Australia, Japan, Brazil...";
});
