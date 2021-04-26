import { page, render } from './lib.js';
import { logout as apiLogout } from './api/data.js'
import { editorPage } from './views/editor/editor.js'
import { browsePage } from './views/browse.js'
import { loginPage, registerPage } from './views/auth.js'
import { quizPage } from './views/quiz/quiz.js'
import { getQuizById, getQuestionByQuizId } from './api/data.js'
import { cube } from './views/common/loader.js'


const cache = {};
const main = document.getElementById('content');


page('/login', decorateContext, loginPage)
page('/register', decorateContext, registerPage)
page('/create', decorateContext, editorPage)
page('/edit/:id', decorateContext, editorPage)
page('/browse', decorateContext, browsePage)
page('/quiz/:id', decorateContext, getQuiz, quizPage)

page.start();
setUserNav();
document.getElementById('logoutBtn').addEventListener('click', logout);


async function getQuiz(ctx, next) {
    ctx.clearCache = clearCache
    const quizId = ctx.params.id
    if (cache[quizId] == undefined) {
        ctx.render(cube());
        cache[quizId] = await getQuizById(quizId);
        const ownerId = cache[quizId].owner.objectId;
        cache[quizId].questions = await getQuestionByQuizId(quizId, ownerId)
        cache[quizId].answers = cache[quizId].questions.map(q => undefined)
    }
    ctx.quiz = cache[quizId]
    next();
}

function clearCache(quizId){
    if(cache[quizId]){
        delete cache[quizId]
    }
} 


function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;
    next();
}

function setUserNav() {
    const userId = sessionStorage.getItem('userId');

    if (userId != null) {
        document.getElementById('user-nav').style.display = 'block'
        document.getElementById('guest-nav').style.display = 'none'
    } else {
        document.getElementById('user-nav').style.display = 'none'
        document.getElementById('guest-nav').style.display = 'block'
    }
}

async function logout() {
    await apiLogout();
    setUserNav();
    page.redirect('/')
}

