
document.addEventListener('DOMContentLoaded', function() {

    const user_json = JSON.parse(document.getElementById('user-data').textContent);
    load_posts(user_json['id'], 'following', Fpage);
});
