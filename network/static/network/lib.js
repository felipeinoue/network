var $ = document.getElementById; //freedom from document.getElementById!
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
  
        const user_json = JSON.parse(document.getElementById('user-data').textContent);
        let edit_button = "";
        if (user_json['id'] === contents.owner_id) {
          edit_button = `<button class="edit">Edit</button>`+
          `<textarea style="display: none;" class="form-control" rows="3">${contents.content}</textarea>`+
          `<button style="display: none;" class="save_edit" data-value="${contents.id}">Save</button>`;
        }

        post.innerHTML = `<p>By: ${contents.owner_name}</p>` + 
                        `<p><div>`+
                          `<div>${contents.content}</div>`+
                          `${edit_button}`+
                          // `<button class="edit">Edit</button>`+
                          // `<textarea style="display: none;" class="form-control" rows="3">${contents.content}</textarea>`+
                          // `<button style="display: none;" class="save_edit" data-value="${contents.id}">Save</button>`+
                        `</div></p>` +
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


// Evaluate button click
document.addEventListener('click', event => {
  const element = event.target;
  // if click is class edit
  if (element.className === 'edit') {

    // Hide
    element.parentElement.childNodes[0].style.display = "none"; //div
    element.style.display = "none"; //edit button

    // Show
    element.parentElement.childNodes[2].style.display = "block"; //textarea
    element.parentElement.childNodes[3].style.display = "block"; //save button

  }

  // if click is class save_edit
  if (element.className === 'save_edit') {
    const post_id = parseInt(element.dataset.value);
    const data = element.parentElement.childNodes[2];
    update_post(data, post_id);
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

function update_post(data, post_id) {

  const csrftoken = getCookie('csrftoken');

  fetch(`/api_update_post/${post_id}`, {
      method: 'PUT',
      mode: 'same-origin',  // Do not send CSRF token to another domain.
      headers: {
          'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({
          content: data.value
          // content: data
      })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      pagination(0);
  }) 
}