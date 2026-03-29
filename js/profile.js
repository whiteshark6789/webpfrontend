console.log("profile.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  console.log("Session:", { userId, role });

  // 🔐 AUTH GUARD
  if (!userId) {
    alert("Please login first");
    window.location.replace("login.html");
    return;
  }

  // 🧩 GET ELEMENTS (FAIL SAFE)
  const nameEl = document.getElementById("profileName");
  const emailEl = document.getElementById("profileEmail");
  const phoneEl = document.getElementById("profilePhone");
  const roleEl = document.getElementById("profileRole");

  if (!nameEl || !emailEl || !roleEl) {
    console.error("Profile elements missing in HTML");
    return;
  }

  // ✅ TEMP DATA (UNTIL BACKEND USER API)
  nameEl.innerText = "Logged In User";
  emailEl.innerText = "Session Active";
  roleEl.innerText =
    role.charAt(0).toUpperCase() + role.slice(1);

  if (phoneEl) {
    phoneEl.innerText = "Not added";
  }

  console.log("Profile rendered");
});

// BUTTON HANDLER
function editProfile() {
  alert("Edit profile will be enabled once backend is connected");
}
