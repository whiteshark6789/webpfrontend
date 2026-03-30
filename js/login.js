console.log("login.js loaded");

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔥 CRITICAL

  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;
  const role = loginForm.querySelector("select").value;

  if (!email || !password || !role) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      alert(data.error || "Invalid login");
      return;
    }

    // ✅ SESSION ACTIVE
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("role", data.role);

    // ✅ GUARANTEED REDIRECT
    if (data.role === "customer") {
      window.location.replace("shopping.html");
    } else if (data.role === "manager") {
      window.location.replace("manager.html");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
