// JavaScript to toggle sidebar visibility
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

// Toggle the sidebar visibility when hamburger icon is clicked
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('active'); // Adds or removes the 'active' class for showing/hiding the sidebar
});

// Optional: Close sidebar when a menu item is clicked
const menuItems = document.querySelectorAll('.sidebar nav ul li a');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    // Close sidebar after menu item is clicked
    sidebar.classList.remove('active');
  });
});
