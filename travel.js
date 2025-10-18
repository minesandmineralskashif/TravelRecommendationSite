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
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();

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
                <p>Please try again later.</p>
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

// Optional: Add sample images for demonstration
// This would be used if you want to provide default images
const sampleImages = {
  "Sydney, Australia":
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "Melbourne, Australia":
    "https://images.unsplash.com/photo-1545044846-351ba102b6d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "Tokyo, Japan":
    "https://images.unsplash.com/photo-1540959733332-4abcb85ecc4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "Kyoto, Japan":
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "Rio de Janeiro, Brazil":
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "São Paulo, Brazil":
    "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "Angkor Wat, Cambodia":
    "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "Taj Mahal, India":
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "Bora Bora, French Polynesia":
    "https://images.unsplash.com/photo-1518638150340-f706e86654de?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
  "Copacabana Beach, Brazil":
    "https://images.unsplash.com/photo-1590650046871-92c887180603?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
};

// Initialize page
showPage("home");

// Add some sample search suggestions
document.addEventListener("DOMContentLoaded", function () {
  // You can add search suggestions here if needed
  console.log("TravelBloom website loaded successfully!");

  // Example: Add placeholder text with examples
  searchInput.placeholder = "Try: beach, temple, Australia, Japan, Brazil...";
});
