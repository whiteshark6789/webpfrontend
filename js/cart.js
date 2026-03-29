const userId = localStorage.getItem("userId");
if (!userId) window.location.href = "login.html";

const cartItems = document.getElementById("cartItems");
const subTotalEl = document.getElementById("subTotal");
const grandTotalEl = document.getElementById("grandTotal");

let currentCart = null;

fetch(`http://localhost:5000/api/cart/${userId}`)
  .then(res => res.json())
  .then(cart => {
    currentCart = cart;
    cartItems.innerHTML = "";
    cart.items.forEach(item => {
      cartItems.innerHTML += `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="min-width: 60px; height: 60px; background: #e1f5fe; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <img src="${item.image || 'Images/pill.png'}" onerror="this.style.display='none'" style="max-width: 40px; max-height: 40px;" alt=""/>
              </div>
              <div>
                <strong style="display: block; font-size: 16px; color: #333; margin-bottom: 4px;">${item.name}</strong>
                <span style="color: #888; font-size: 13px;">Medicine</span>
              </div>
            </div>
          </td>
          <td style="font-weight: 600; color: #555;">₹${item.price}</td>
          <td>
            <select onchange="updateQty('${item.productId}', this.value)" style="padding: 6px 14px; border-radius: 8px; border: 1px solid #b3e5fc; background: #fff; color: #0288d1; font-weight: 600; outline: none; cursor: pointer; appearance: auto;">
              ${Array.from({ length: item.stock || item.qty }, (_, i) => i + 1).map(num =>
        `<option value="${num}" ${num === item.qty ? 'selected' : ''}>${num}</option>`
      ).join('')}
            </select>
          </td>
          <td style="font-weight: 600; color: #222;">₹${item.price * item.qty}</td>
        </tr>
      `;
    });

    subTotalEl.innerText = `₹${cart.subtotal}`;
    grandTotalEl.innerText = `₹${cart.total}`;
  });

function updateQty(productId, qty) {
  fetch(`http://localhost:5000/api/cart/update/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty })
  }).then(() => {
    window.location.reload();
  });
}

function placeOrder() {
  if (!currentCart || currentCart.items.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const orderData = {
    userId,
    items: currentCart.items,
    totalAmount: currentCart.total
  };

  fetch(`http://localhost:5000/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        alert("Order successfully placed!");
        window.location.href = "shopping.html";
      }
    })
    .catch(err => {
      console.error("Order error:", err);
      alert("Failed to place order. Please try again.");
    });
}
