import { runAfterDelay } from './utils.js';

const roleElm = document.getElementsByClassName('role')[0];
const cursorElm = document.getElementsByClassName('cursor')[0];
const INSERTION_DELAY = 400;
const DELETION_DELAY = 200;

async function renderString(str) {
    cursorElm.classList.add('blink');
    await runAfterDelay(() => cursorElm.classList.remove('blink'), 2000);

    for (let i = 0; i < str.length; i++) {
        highlightKeys(str[i]);
        await renderChar(str[i]);
    }

    cursorElm.classList.add('blink');
    await runAfterDelay(() => cursorElm.classList.remove('blink'), 2000); 

    for (let i = 0; i < str.length; i++) {
        highlightBackspace();
        await clearLastChar();
    }
}

function renderChar(char) {
    return runAfterDelay(() => roleElm.textContent += char, INSERTION_DELAY);
}

function clearLastChar() {
    return runAfterDelay(() => {
        roleElm.textContent = roleElm.textContent.substring(0, roleElm.textContent.length - 1);
    }, DELETION_DELAY);   
}

function highlightKeys(char) {
    let keys = getKeys(char);
    keys.forEach(key => {
        document.getElementById(key).style.fill = '#FB7373';
        runAfterDelay(() => document.getElementById(key).style.fill = 'white', INSERTION_DELAY);
    });
}

function highlightBackspace() {
    document.getElementById('Key_Backspace').style.fill = '#FB7373';
    runAfterDelay(() => document.getElementById('Key_Backspace').style.fill = 'white', DELETION_DELAY);
}

function getKeys(char) {
    if (char === ' ')
        return ['Key_Spacebar'];
    else if (char.charCodeAt() >= 65 && char.charCodeAt() <= 90)
        return [`Key_${char.toLowerCase()}`, 'Key_Shift'];
    else if (char.charCodeAt() >= 97 && char.charCodeAt() <= 122)
        return [`Key_${char}`];
    return [];
}

export default {
    loadImages: function(DEVELOPER, CLOUD) {
        document.getElementsByClassName('developer-img')[0].insertAdjacentHTML('beforeend', DEVELOPER);
        const clouds = Array.from(document.getElementsByClassName('cloud'));
        clouds.forEach(elm => elm.insertAdjacentHTML('beforeend', CLOUD));
    },
    renderStrings: async function(strings) {
        for (let i = 0; i < strings.length; i++) {
            await renderString(strings[i]);
        }
    }
}