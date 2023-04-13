const popup = document.querySelector('.popupchat');
const chatBtn = document.querySelector('.chatbtn');
const submitbtn = document.querySelector('.submit');
const inputElm = document.querySelector('input');
const chatarea = document.querySelector('.chat-body');
const button = document.querySelector('#emoji-button');
const picker = new EmojiButton();
const addbtn = document.querySelector('.addfrdtogrpbtn');
const drpbtn = document.querySelector('.dropbtn');

//emoji button
button.addEventListener('click', () => {
  picker.togglePicker(button);
  
});

  picker.on('emoji', emoji => {
    document.querySelector('input').value += emoji;
  });
//send message
submitbtn.addEventListener('click', () => {
    let userInput = inputElm.value;
    console.log(userInput);
    let temp = `<div class="out-msg">
    <span class="my-msg">${userInput}</span>
    </div>`;

    chatarea.insertAdjacentHTML("beforeend", temp);
    inputElm.value = '';
})

//show popup chat
chatBtn.addEventListener('click', ()=>{
  popup.classList.toggle('show');
})
addbtn.addEventListener('click', ()=>{
  var button = document.getElementById("addmember");
  button.style.backgroundColor = "palebule";
  button.style.color = "grey";
  button.disabled = false;
})



