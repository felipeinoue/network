
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#newpost-form').onsubmit = () => {
        const data = document.querySelector('#newpost-content');
        post(data);
        return false;
    };
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