import { DEV_UNDER_TREE, CLOUD, DEVELOPER } from "../constants/images.js";
import view from './src/view.js';
import model from './src/model.js';

view.loadImages(DEVELOPER, CLOUD);

(async function renderStringsInLoop(strings) {
    await view.renderStrings(strings);
    renderStringsInLoop(strings);
})(model.roles);

let plant = document.getElementById('plant-2');
let branch = document.getElementById('Vector_20');

plant.classList.add('move');
branch.classList.add('move');