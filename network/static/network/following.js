
document.addEventListener('DOMContentLoaded', function() {

    const Fuser_json = JSON.parse(document.getElementById('user-data').textContent);
    console.log(Fuser_json['following']);
    for (follow of Fuser_json['following']) {
        load_posts(follow);
    }
});
