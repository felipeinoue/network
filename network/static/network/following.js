
document.addEventListener('DOMContentLoaded', function() {

    const Fuser_json = JSON.parse(document.getElementById('user-data').textContent);
    load_posts(Fuser_json['id'], 'following');
});
