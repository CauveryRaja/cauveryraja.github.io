import { DEVELOPER, CANVAS } from "./constants/images.js";
import view from './src/view.js';

// function loadImages() {
//     document.getElementsByClassName('developer-img')[0].insertAdjacentHTML('beforeend', DEVELOPER);
//     document.getElementsByClassName('canvas-img')[0].insertAdjacentHTML('beforeend', CANVAS);
// }

view.loadImages(DEVELOPER, CANVAS);

// let roleElm = document.getElementsByClassName('role')[0];
// let cursorElm = document.getElementsByClassName('cursor')[0];
// let CHAR_DELAY = 400;

// async function renderString(str) {
//     cursorElm.classList.add('blink');
//     await runAfterDelay(() => cursorElm.classList.remove('blink'), 2000);

//     for (let i = 0; i < str.length; i++) {
//         highlightKeys(str[i]);
//         await renderChar(str[i]);
//     }

//     cursorElm.classList.add('blink');
//     await runAfterDelay(() => cursorElm.classList.remove('blink'), 2000); 

//     for (let i = 0; i < str.length; i++) {
//         highlightBackspace();
//         await clearLastChar();
//     }
// }

// function renderChar(char) {
//     return runAfterDelay(() => roleElm.textContent += char, CHAR_DELAY);
// }

// function clearLastChar() {
//     return runAfterDelay(() => {
//         roleElm.textContent = roleElm.textContent.substring(0, roleElm.textContent.length - 1);
//     }, CHAR_DELAY);   
// }

// function runAfterDelay(callback, delay) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             callback();
//             resolve();
//         }, delay);
//     });
// }

// async function renderStrings(strings) {
//     for (let i = 0; i < strings.length; i++) {
//         await renderString(strings[i]);
//     }
//     await renderStrings(strings);
// }


// function highlightKeys(char) {
//     let keys = getKeys(char);

//     keys.forEach(key => {
//         document.getElementById(key).style.fill = '#6C63FF';
//         setTimeout(() => document.getElementById(key).style.fill = 'white', CHAR_DELAY);
//         runAfterDelay(() => () => document.getElementById(key).style.fill = 'white', )
//     });
// }

// function highlightBackspace() {
//     document.getElementById('Key_Backspace').style.fill = '#6C63FF';
//     setTimeout(() => document.getElementById('Key_Backspace').style.fill = 'white', CHAR_DELAY);
// }


// function getKeys(char) {
//     if (char === ' ')
//         return ['Key_Spacebar'];
//     else if (char.charCodeAt() >= 65 && char.charCodeAt() <= 90)
//         return [`Key_${char.toLowerCase()}`, 'Key_Shift'];
//     else if (char.charCodeAt() >= 97 && char.charCodeAt() <= 122)
//         return [`Key_${char}`];
//     return [];
// }

let strings = ['Frontend Engineer', 'Artist', 'Designer'];
// renderStrings(strings);

(async function renderStringsInLoop(strings) {
    await view.renderStrings(strings);
    renderStringsInLoop(strings);
})(strings);