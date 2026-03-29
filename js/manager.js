const table = document.getElementById("productTable");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");
const productIdInput = document.getElementById("productId");
const API = "http://localhost:5000/api/products";
// Auth guard
const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");

if (!userId || role !== "manager") {
  window.location.href = "login.html";
}

/* ================= LOAD PRODUCTS ================= */
let currentManagerHash = "";

function loadProducts() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      const newHash = JSON.stringify(data);
      if (newHash !== currentManagerHash) {
        currentManagerHash = newHash;
        table.innerHTML = "";
        data.forEach(p => {
          table.innerHTML += `
            <tr>
              <td>${p.name}</td>
              <td>₹${p.price}</td>
              <td><span style="font-weight: bold; color: ${p.stock <= 0 ? '#e53935' : '#333'};">${p.stock <= 0 ? 'Out of Stock (0)' : p.stock}</span></td>
              <td>
                <button onclick="editProduct('${p._id}')" class="btn secondary" style="padding: 4px 8px;">Edit</button>
                <button onclick="deleteProduct('${p._id}')" class="btn danger" style="padding: 4px 8px;">Delete</button>
              </td>
            </tr>
          `;
        });
      }
    });
}

loadProducts();
setInterval(loadProducts, 3000);

/* ================= EDIT ================= */
function editProduct(id) {
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(product => {
      productIdInput.value = product._id;
      nameInput.value = product.name;
      priceInput.value = product.price;
      stockInput.value = product.stock;
      categoryInput.value = product.category;
      imageInput.value = product.image;
    });
}

/* ================= SAVE (ADD / UPDATE) ================= */
function saveProduct() {
  const id = productIdInput.value;

  const product = {
    name: nameInput.value.trim(),
    price: priceInput.value,
    stock: stockInput.value,
    category: categoryInput.value.trim(),
    image: imageInput.value.trim()
  };

  if (
    !product.name ||
    !product.price ||
    !product.stock ||
    !product.category ||
    !product.image
  ) {
    alert("Please fill all fields");
    return;
  }

  const payload = {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock)
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${API}/${id}` : API;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(() => {
    clearForm();
    loadProducts();
  });
}

/* ================= DELETE ================= */
function deleteProduct(id) {
  fetch(`${API}/${id}`, { method: "DELETE" })
    .then(() => loadProducts());
}

/* ================= CLEAR ================= */
function clearForm() {
  productIdInput.value = "";
  nameInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
  categoryInput.value = "";
  imageInput.value = "";
}
