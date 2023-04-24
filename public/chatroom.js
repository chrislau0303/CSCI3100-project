const popup = document.querySelector('.popupchat');
const chatBtn = document.querySelector('.chatbtn');
const submitbtn = document.querySelector('.submit');
const inputElm = document.querySelector('#textInput');
const chatarea = document.querySelector('.chat-body');
const button = document.querySelector('#emoji-button');
const picker = new EmojiButton();
const addbtn = document.querySelector('.addfrdtogrpbtn');
const drpbtn = document.querySelector('.dropbtn');
const createbtn = document.querySelector('.setupgrp');
const frdnamebtn1 = document.querySelector('#btn1');
const frdnamebtn2 = document.querySelector('#btn2');
const frdnamebtn3 = document.querySelector('#btn3');
const frdnamebtn4 = document.querySelector('#btn4');
const frdnamebtn5 = document.querySelector('#btn5'); 
const chatname = document.querySelector('.chat-header');
const chatbox = document.querySelector('.chat-body');

frdnamebtn1.onclick = function(){
  if (chatname.innerHTML != frdnamebtn1.innerHTML){
    chatbox.innerHTML="";
    chatname.innerHTML = frdnamebtn1.innerHTML;
    let temp = `<div class="chat-message">
    <div class="chat-text">
      <p class="chat-message-text">Hello, how are you doing?</p>
      <p class="chat-time">12:00 PM | Apr 14</p>
    </div>
    </div>`;
    chatarea.insertAdjacentHTML("beforeend", temp);
    
  }
}

frdnamebtn2.onclick = function(){
  if (chatname.innerHTML != frdnamebtn2.innerHTML){
    chatbox.innerHTML="";
    chatname.innerHTML = frdnamebtn2.innerHTML;
    let temp = `<div class="chat-message">
    <div class="chat-text">
      <p class="chat-message-text">Playing games!</p>
      <p class="chat-time">1:00 PM | Apr 3</p>
    </div>
    </div>`;
    chatarea.insertAdjacentHTML("beforeend", temp);
  }
}

frdnamebtn3.onclick = function(){
  if (chatname.innerHTML != frdnamebtn3.innerHTML){
    chatbox.innerHTML="";
    chatname.innerHTML = frdnamebtn3.innerHTML;
    let temp = `<div class="chat-message">
    <div class="chat-text">
      <p class="chat-message-text">Hey guys, what's up?</p>
      <p class="chat-time">2:00 PM | Mar 3</p>
    </div>
    </div>`;
    chatarea.insertAdjacentHTML("beforeend", temp);

  }
}

frdnamebtn4.onclick = function(){
  if (chatname.innerHTML != frdnamebtn4.innerHTML){
    chatbox.innerHTML="";
    chatname.innerHTML = frdnamebtn4.innerHTML;
    let temp = `<div class="chat-message">
    <div class="chat-text">
      <p class="chat-message-text">Nothing much, just chilling</p>
      <p class="chat-time">3:00 PM | Mar 23</p>
    </div>
  </div>`;
    chatarea.insertAdjacentHTML("beforeend", temp);
  }
}

frdnamebtn5.onclick = function(){
  if (chatname.innerHTML != frdnamebtn5.innerHTML){
    chatbox.innerHTML="";
    chatname.innerHTML = frdnamebtn5.innerHTML;
    let temp = `<div class="chat-message">
    <div class="chat-text">
      <p class="chat-message-text">Bye!</p>
      <p class="chat-time">2:00 PM | Apr 11</p>
    </div>
    </div>`;
    chatarea.insertAdjacentHTML("beforeend", temp);
  }
}


//enter the submission button
inputElm.addEventListener('keypress', function(event) {
  if (event.key === "Enter"){
    event.preventDefault();
    submitbtn.click();
  }
  })
//emoji button
button.addEventListener('click', () => {
  picker.togglePicker(button);
  
});

  picker.on('emoji', emoji => {
    document.querySelector('#textInput').value += emoji;
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

// addbtn.addEventListener('click', ()=>{
//   var button = document.getElementById("addmember");
//   button.style.backgroundColor = "palebule";
//   button.style.color = "white";
//   button.disabled = false;
// })