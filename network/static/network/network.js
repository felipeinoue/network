
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#newpost-form').onsubmit = () => {
        const data = document.querySelector('#newpost-content');
        post(data);
        return false;
    };

    // Default page to be shown
    load_posts();
});

function post(data) {

    const csrftoken = getCookie('csrftoken');

    fetch('/posts', {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            content: data.value
        })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    })    
  }

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function load_posts(user_id) {

    if (user_id === undefined) {user_id = 0};

    fetch(`/posts/user/${user_id}`)
    .then(response => response.json())
    .then(posts => {
  
      posts.forEach(contents => {
        const post = document.createElement('div');
        post.style = 'border: solid; border-width: 0.5px; margin: -0.5px 0px -0.5px 0px;';
  
        post.innerHTML = `By: ${contents.owner_name}, ${contents.content}, ` +
                        `${contents.timestamp}, likes: ${contents.likes}`;
  
        document.querySelector('#posts-view').append(post);
      });

      // Print posts
      console.log(posts);
  
    })
}
export default load_posts(user_id);