document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!userId) {
    window.location.replace("login.html");
    return;
  }

  loadProfile(userId);
});

async function loadProfile(userId) {
  try {
    const res = await fetch(`${API_URL}/api/auth/profile/${userId}`);
    const user = await res.json();

    if (user.error) throw new Error(user.error);

    // Display mode
    document.getElementById("profileName").innerText = user.name;
    document.getElementById("profileEmail").innerText = user.email;
    document.getElementById("profilePhone").innerText = user.phone || "Not provided";
    document.getElementById("profileAddress").innerText = user.address || "Not provided";
    document.getElementById("profileRole").innerText =
      user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // Edit mode (inputs)
    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editPhone").value = user.phone || "";
    document.getElementById("editAddress").value = user.address || "";
  } catch (error) {
    console.error("Failed to load profile:", error);
    alert("Could not load profile details.");
  }
}

function toggleEdit(isEditing) {
  document.getElementById("profileView").style.display = isEditing ? "none" : "block";
  document.getElementById("profileEdit").style.display = isEditing ? "block" : "none";
}

async function saveProfile() {
  const userId = localStorage.getItem("userId");
  const updatedData = {
    name: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    phone: document.getElementById("editPhone").value,
    address: document.getElementById("editAddress").value
  };

  try {
    const res = await fetch(`${API_URL}/api/auth/profile/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error);

    alert("Profile updated successfully!");
    location.reload();
  } catch (error) {
    console.error("Update error:", error);
    alert("Failed to update profile.");
  }
}
