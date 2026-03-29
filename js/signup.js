const signupForm = document.querySelector("form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = signupForm.querySelector('input[type="text"]').value;
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;
  const role = signupForm.querySelector("select").value;

  if (!name || !email || !password || !role) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    console.log("SIGNUP RESPONSE:", data);

    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    // ✅ SUCCESS FEEDBACK
    alert("Signup successful! Please login.");

    // ✅ REDIRECT TO LOGIN
    window.location.replace("login.html");

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
