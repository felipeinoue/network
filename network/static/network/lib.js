let Fpage = 1;

function load_posts(user_id, Amethod, APage) {
    let url = new URL(`${window.location.origin}/posts/user/${user_id}`)
    url.search = new URLSearchParams({
        method: Amethod,
        page: APage
    })

    fetch(url)
    .then(response => response.json())
    .then(posts => {
  
      posts['results'].forEach(contents => {
        const post = document.createElement('div');
        post.style = 'border: solid; border-width: 0.5px; margin: -0.5px 0px -0.5px 0px;';
        post.className = 'post';
  
        post.innerHTML = `<p>By: ${contents.owner_name}</p>` + 
                        `<p><div>${contents.content}<button class="edit">Edit</button></div></p>` +
                        `<p>${contents.timestamp}</p>` +
                        `<p>likes: ${contents.likes}</p>`;
  
        document.querySelector('#posts-view').append(post);
      });
      // Check Previous and Next button behavior
      const total_pages = posts['total'];
      const element_previous = document.getElementById('previous');
      const element_next = document.getElementById('next');
      if (Fpage === 1) {
        element_previous.parentElement.className = 'page-item disabled';;
      } else {
        element_previous.parentElement.className = 'page-item';;
      }
      if (Fpage < total_pages) {
        element_next.parentElement.className = 'page-item';;
      } else {
        element_next.parentElement.className = 'page-item disabled';;
      }

    })
}

// If hide button is clicked, delete the post
document.addEventListener('click', event => {
  const element = event.target;
  if (element.className === 'edit') {
    element.parentElement.remove();
  }
});

function pagination(Anum) {
  clean_posts();

  Fpage = Fpage + (Anum);
  const actual_page = JSON.parse(document.getElementById('actual_page').textContent);
  const user_json = JSON.parse(document.getElementById('user-data').textContent);
  load_posts(user_json['id'], actual_page, Fpage)
}

function clean_posts() {
  let paras = document.getElementsByClassName('post');

  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0])
  }
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