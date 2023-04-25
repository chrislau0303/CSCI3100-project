// const popupcreate = document.querySelector('.popupcreatepost');
// const popupedit = document.querySelector('.popupeditpost');
// const postcreatebtn = document.querySelector('#opencreatepage');
const editbtn = document.querySelectorAll('.popupeditbtn');
// const closeModalButton = document.querySelector('#closecreatepage');
const closeeditbtn = document.querySelectorAll('.close-button');
const submitbtn = document.querySelector('#submit');
const inputElm = document.querySelector('.textarea');
const chatarea = document.querySelector('.comment-widgets');
const button = document.querySelector('#emoji-button');
const picker = new EmojiButton();

//emoji button
button.addEventListener('click', () => {
    picker.togglePicker(button);
  });
  picker.on('emoji', emoji => {
    document.querySelector('.textarea').value += emoji;
  });
inputElm.addEventListener('keypress', function(event) {
    if (event.key === "Enter"){
      event.preventDefault();
      submitbtn.click();
    }
    })

submitbtn.addEventListener('click', () => {
    let userInput = inputElm.value;
    console.log(userInput);
    let temp = `<div class="d-flex flex-row comment-row m-t-0">
    <div class="p-2"></div><div class="comment-text w-100">
    <h6 class="font-medium">Chris Wong</h6> <span class="m-b-15 d-block">${userInput}</span>
    <div class="comment-footer"> </div>
    </div>
</div>`;
    chatarea.insertAdjacentHTML("beforeend", temp);
    inputElm.value = '';
})
// postcreatebtn.addEventListener('click', () => {
//   popupcreate.classList.toggle('show');
//   popupcreate.style.display = 'block';
// });

// closeModalButton.addEventListener('click', () => {
//   popupcreate.style.display = 'none';
// });
editbtn.forEach(btn => {
  btn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default click behavior
    const postId = btn.dataset.postId;
    const form = document.querySelector(`#edit-form-${postId}`);
    const popupedit = form.closest('.popupeditpost'); // Get the parent popup element
      // Set the value of the form fields using the post details
      form.querySelector('#content').value = btn.dataset.postDes;
      form.querySelector('#hide_post').checked = btn.dataset.hidePost === 'true';
      form.querySelector('#postID').value = postId;
      
      popupedit.classList.toggle('show');
      popupedit.style.display = 'block';
  });
});

closeeditbtn.forEach(button => {
  button.addEventListener('click', () => {
    const popupedit = button.closest('.popupeditpost');
    popupedit.style.display = 'none';
  });
});

// window.addEventListener('click', function (event) {
//   if (event.target === popupcreate) {
//     popupcreatepost.style.display = 'none';
//   }
// });
// window.addEventListener('click', function (event) {
//   if (event.target === popupedit) {
//     popupeditpost.style.display = 'none';
//   }
// });
