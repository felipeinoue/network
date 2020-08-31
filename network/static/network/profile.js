let Fprofile_json
let Fuser_json
const profile_id = parseInt(document.location.pathname.replace('/profile/', ''))

document.addEventListener('DOMContentLoaded', function() {

    const Factual_page = JSON.parse(document.getElementById('actual_page').textContent);

    try {
        document.querySelector('#follow-btn').addEventListener('click', () => follow());
    }
    catch{}
    
    // Default page to be shown
    load_posts(profile_id, 'profile', Fpage);
    loadFollowbtn(profile_id)
});

function loadFollowbtn(profile_id) {
    // Get profile data
    fetch(`/profileAPI/${profile_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error while trying to get profile data.')
        }
        return response.json()
    })
    .then(data => {
        Fprofile_json = data;
    })    

    // Get user data
    .then (() => {
        fetch('/userIDAPI')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error while trying to get user id.');
            }
            return response.json();
        })
        .then(data => {
            fetch(`/profileAPI/${data['id']}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error while trying to get user data.')
                }
                return response.json()
            })
            .then(data => {
                Fuser_json = data
            })
            // update Follow button
            .then(() => {
                let s
                if (Fuser_json['id'] !== Fprofile_json['id']) {
                    if (Fprofile_json['followers'].includes(Fuser_json['id'])) {
                        s = 'unfollow'
                    } else {
                        s = 'follow'
                    }
                    document.querySelector('#follow-btn').innerHTML = `${s.charAt(0).toUpperCase() + s.slice(1)}`;
                    document.querySelector('#follow-btn').value = s;
                } else {
                    document.querySelector('#follow-btn').remove();
                }
            })
            .catch(error => {console.error('There has been a problem with your fetch operation:', error)})
        })
        .catch(error => {console.error('There has been a problem with your fetch operation:', error)})  
    })

    .catch(error => {console.error('There has been a problem with your fetch operation:', error)})   
}

function follow() {

    const csrftoken = getCookie('csrftoken');
    let m;

    if (document.querySelector('#follow-btn').value === 'follow') {
        m = "POST";
    } else {
        m = "DELETE";
    }
    fetch('/followAPI', {
        method: m,
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            follower: Fuser_json['id'],
            followed: Fprofile_json['id']
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error while trying to perform follow operation.');
        }
        return response.json()
    })
    .then(data => {
        console.log(data);
        loadFollowbtn(profile_id);
    })
    .catch(error => {console.error('There has been a problem with your fetch operation:', error)})

}