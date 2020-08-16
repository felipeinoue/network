
document.addEventListener('DOMContentLoaded', function() {

    try {
        document.querySelector('#newpost-form').onsubmit = () => {
            const data = document.querySelector('#newpost-content');
            post(data);
            // return false; está comentado para forçar a página a recarregar
        };    
    }

    catch(err) {
        console.log('User not authenticated.')
        console.log(err.message)
    }

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
