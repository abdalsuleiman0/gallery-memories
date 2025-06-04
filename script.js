document.addEventListener("DOMContentLoaded", function () {
  // Load images from JSON
  fetch("images.json")
    .then((response) => response.json())
    .then((data) => {
      displayImages(data.images);
      setupFilterButtons(data.images);
      setupSearch(data.images);
      setupDownloadButtons(data.images);
    })
    .catch((error) => console.error("Error loading images:", error));

  // Display images in grid
  function displayImages(images) {
    const galleryGrid = document.getElementById("galleryGrid");
    galleryGrid.innerHTML = "";

    images.forEach((image) => {
      const imageElement = document.createElement("div");
      imageElement.className = "gallery-item relative";
      imageElement.dataset.category = image.category;
      imageElement.dataset.id = image.id;

      imageElement.innerHTML = `
                <img src="${image.url}" alt="${image.title}" class="w-full h-64 sm:h-80 object-cover">
                <div class="gallery-overlay">
                    <h3 class="text-lg font-semibold">${image.title}</h3>
                    <p class="text-sm opacity-80 mt-1">${image.description}</p>
                    <div class="flex justify-between mt-3 text-xs">
                        <span><i class="fas fa-user mr-1"></i> ${image.author}</span>
                        <span><i class="fas fa-download mr-1"></i> ${image.downloads}</span>
                    </div>
                </div>
                <button class="download-btn font-medium" data-id="${image.id}">
                    <i class="fas fa-download mr-1"></i> Download
                </button>
            `;

      galleryGrid.appendChild(imageElement);
    });
  }

  // Filter images by category (supports multiple categories per image)
  function setupFilterButtons(images) {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Update active button styling
        filterButtons.forEach((btn) => {
          btn.classList.remove("bg-binance-yellow", "text-binance-black");
          btn.classList.add("bg-binance-dark-gray", "text-binance-white");
        });
        this.classList.add("bg-binance-yellow", "text-binance-black");
        this.classList.remove("bg-binance-dark-gray", "text-binance-white");

        const category = this.dataset.category;

        if (category === "all") {
          displayImages(images);
        } else {
          const filteredImages = images.filter(
            (img) =>
              Array.isArray(img.category) && img.category.includes(category)
          );
          displayImages(filteredImages);
        }
      });
    });
  }

  // Search functionality
  function setupSearch(images) {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm.trim() === "") {
        displayImages(images);
        return;
      }

      const filteredImages = images.filter(
        (img) =>
          img.title.toLowerCase().includes(searchTerm) ||
          img.description.toLowerCase().includes(searchTerm) ||
          img.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );

      displayImages(filteredImages);
    }

    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  }

  // Download functionality
  function setupDownloadButtons(images) {
    document.addEventListener("click", function (e) {
      if (e.target.closest(".download-btn")) {
        const button = e.target.closest(".download-btn");
        const imageId = button.dataset.id;
        const image = images.find((img) => img.id == imageId);

        if (image) {
          downloadImage(image.url, image.title);
        }
      }
    });
  }

  // Helper function to trigger download
  function downloadImage(imageUrl, fileName) {
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName || "binance-gallery-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // In a real app, you might want to track downloads
    console.log(`Downloading: ${fileName}`);
  }
});
