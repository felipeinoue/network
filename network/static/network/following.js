
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('nav_following').className =    'btn btn-sm btn-outline-light active';

    const user_json = JSON.parse(document.getElementById('user-data').textContent);
    load_posts(user_json['id'], 'following', Fpage);
});
