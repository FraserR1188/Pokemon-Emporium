//Code For Modal Help
var modal = document.getElementById("help-modal");
var btn = document.getElementById("help-button");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
};

span.onclick = function() {
  modal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//Code for email modal

document.addEventListener("DOMContentLoaded", function () {
    const openModalButton = document.getElementById("openEmailModal");
    const modal = document.getElementById("emailModal");
    const closeModalButton = modal.querySelector(".close");

    // Verify button exists
    if (!closeModalButton) {
        console.error("Close button not found");
        return;
    }

    // Open the modal
    openModalButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        modal.style.display = "block";
    });

    // Close the modal when clicking the close button
    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});