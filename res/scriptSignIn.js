const newAlert = document.createElement('p');
const form = document.getElementById('login_container');
newAlert.id = 'warning-text';

function insertText(ele) {
    form.insertBefore(ele, form.children[4]);
}


const params = new URLSearchParams(window.location.search);
console.log(window.location.search);
const screen = params.get('screen')

if (screen == 'userDsntExist') {

    newAlert.textContent = `The user desn't exist. Please sign up`;

    insertText(newAlert);
} else if (screen == 'passwordError') {
    newAlert.textContent = `The user desn't exist. Please sign up`;
}



