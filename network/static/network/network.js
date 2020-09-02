document.addEventListener('DOMContentLoaded', function() {

    const Factual_page = JSON.parse(document.getElementById('actual_page').textContent);

    try {
        document.querySelector('#newpost-form').onsubmit = () => {
            const data = document.querySelector('#newpost-content');
            post(data);
            // return false; // está comentado para forçar a página a recarregar
        };    
    }

    catch(err) {
        console.log('User is not authenticated.')
        console.log(err.message)
    }

    // Default page to be shown
    load_posts(1, 'all', Fpage);
});

