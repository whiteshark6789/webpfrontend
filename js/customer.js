// Auth guard
const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");

if (!userId || role !== "customer") {
  window.location.href = "login.html";
}

// Get the product grid container
const productGrid = document.getElementById("productGrid");

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===============================
// AUTO-RELOADING & SEARCH
// ===============================
let allProducts = [];
let currentHash = "";

function fetchProducts() {
  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => {
      const newHash = JSON.stringify(data);
      if (newHash !== currentHash) {
        currentHash = newHash;
        allProducts = data;
        filterAndRender();
      }
    })
    .catch(err => console.error("Error fetching products:", err));
}

// Initial fetch & set background auto-reload (3s logic)
fetchProducts();
setInterval(fetchProducts, 3000);

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", filterAndRender);
}

function filterAndRender() {
  const term = searchInput ? searchInput.value.toLowerCase() : "";
  const filtered = allProducts.filter(p =>
    p.name?.toLowerCase().includes(term) ||
    p.category?.toLowerCase().includes(term)
  );
  renderProducts(filtered);
}

// ===============================
// RENDER PRODUCT CARDS
// ===============================
function renderProducts(products) {
  productGrid.innerHTML = "";

  products.forEach(product => {
    if (!product.name || product.price == null) return;

    const card = document.createElement("div");
    card.className = "product-card";

    const isOutOfStock = product.stock <= 0;
    const stockStatus = isOutOfStock
      ? `<p style="color: #e53935; font-weight: bold; margin-bottom: 10px;">Out of Stock</p>`
      : `<p style="color: #4caf50; font-weight: 500; margin-bottom: 10px; font-size: 13px;">In Stock: ${product.stock}</p>`;

    const buttonHtml = isOutOfStock
      ? `<button disabled style="background: #ccc; color: #fff; cursor: not-allowed;">Unavailable</button>`
      : `<button onclick="addToCart('${product._id}', '${product.name.replace(/'/g, "\\'")}', ${product.price})">Add to Cart</button>`;

    card.innerHTML = `
      <img src="${product.image || 'Images/pill.png'}" onerror="this.src='Images/pill.png'" alt="${product.name}" style="height: 140px; object-fit: contain; margin-bottom: 10px;" />
      <h4>${product.name}</h4>
      <p style="font-size: 16px; color: #222; font-weight: 600; margin-bottom: 6px;">₹${product.price}</p>
      ${stockStatus}
      ${buttonHtml}
    `;

    productGrid.appendChild(card);
  });
}


// ===============================
// ADD TO CART
// ===============================
function addToCart(productId, name, price) {
  const userId = localStorage.getItem("userId");

  fetch("http://localhost:5000/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      product: {
        productId,
        name,
        price
      }
    })
  }).then(() => {
    showToast("Added to cart");
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.cssText = "position:fixed;bottom:20px;right:20px;background:#4caf50;color:white;padding:15px 25px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-weight:bold;z-index:9999;transition:opacity 0.3s ease;opacity:0;";
  document.body.appendChild(toast);

  setTimeout(() => { toast.style.opacity = "1"; }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
