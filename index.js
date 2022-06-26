import { DEVELOPER, CANVAS } from "./constants/images.js";
import view from './src/view.js';
import model from './src/model.js';

view.loadImages(DEVELOPER, CANVAS);

(async function renderStringsInLoop(strings) {
    await view.renderStrings(strings);
    renderStringsInLoop(strings);
})(model.roles);