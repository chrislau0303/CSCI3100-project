// const popupcreate = document.querySelector('.popupcreatepost');
const popupedit = document.querySelector('.popupeditpost');
// const postcreatebtn = document.querySelector('.createpostbtn');
const editbtn = document.querySelectorAll('.popupeditbtn');
// const closeModalButton = document.querySelector('#closecreatepage');
const closeeditbtn = document.querySelector('#closeedit');
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
    <h6 class="font-medium">Dennis Law</h6> <span class="m-b-15 d-block">${userInput}</span>
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

// Add an event listener to each "Edit" button
const postSize = document.getElementById('postSize').value;
for (let i = 0; i < postSize; i++) {
    editbtn[i].addEventListener('click', () => {
        const postId = editbtn[i].dataset.postId;
        const form = document.querySelector(`#edit-form-${postId}`);
        form.querySelector('#content').value = editbtn[i].dataset.postDes;
        form.querySelector('#hide_post').checked = editbtn[i].dataset.hidePost === 'true';
        form.querySelector('#postID').value = postId;
        console.log(editbtn[i].dataset.postDes)
        popupedit.classList.toggle('show');
        popupedit.style.display = 'block';
    });
}

closeeditbtn.addEventListener('click', () => {
  popupedit.style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target === popupcreate) {
    popupcreatepost.style.display = 'none';
  }
  if (event.target === popupedit) {
    popupeditpost.style.display = 'none';
  }
});