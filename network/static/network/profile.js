import load_posts from network.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Default page to be shown
    const user_id = parseInt(document.location.pathname.replace('/profile/', ''))
    load_posts(user_id);
});
