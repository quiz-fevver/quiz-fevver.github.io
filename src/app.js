import { page, render } from './lib.js';

import { editorPage } from './views/editor/editor.js'
import { browsePage } from './views/browse.js'
import { loginPage, registerPage } from './views/auth.js'



const main = document.getElementById('content');

page('/create', decorateContext, editorPage)
page('/edit/:id', decorateContext, editorPage)
page('/browse', decorateContext, browsePage)
page('/login', decorateContext, loginPage)
page('/register', decorateContext, registerPage)

page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    next();
}

