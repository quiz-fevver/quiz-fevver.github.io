import * as api from './api/data.js'
import { page, render } from './lib.js';

import { editorPage } from './views/editor/editor.js'


const main = document.getElementById('content');

page('/create', decorateContext, editorPage)
page('/edit/:id', decorateContext, editorPage)

page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    next();
}