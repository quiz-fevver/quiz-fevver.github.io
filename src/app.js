import { page, render } from './lib.js';
import { logout as apiLogout } from './api/data.js'
import { editorPage } from './views/editor/editor.js'
import { browsePage } from './views/browse.js'
import { loginPage, registerPage } from './views/auth.js'
import { quizPage } from './views/quiz/quiz.js'
import { getQuizById, getQuestionByQuizId } from './api/data.js'
import { cube } from './views/common/loader.js'
import { resultPage } from './views/quiz/result.js'
import { detailsPage } from './views/quiz/details.js'
import { homePage } from './home.js'


const state = {};
const main = document.getElementById('content');


page('/', decorateContext, homePage)
page('/login', decorateContext, loginPage)
page('/register', decorateContext, registerPage)
page('/create', decorateContext, editorPage)
page('/edit/:id', decorateContext, editorPage)
page('/browse', decorateContext, browsePage)
page('/quiz/:id', decorateContext, getQuiz, quizPage)
page('/summary/:id', decorateContext, getQuiz, resultPage)
page('/details/:id', decorateContext, getQuiz, detailsPage)


page.start();
setUserNav();
document.getElementById('logoutBtn').addEventListener('click', logout);


async function getQuiz(ctx, next) {
    ctx.clearCache = clearCache
    const quizId = ctx.params.id
    if (state[quizId] == undefined) {
        ctx.render(cube());
        state[quizId] = await getQuizById(quizId);
        const ownerId = state[quizId].owner.objectId;
        state[quizId].questions = await getQuestionByQuizId(quizId, ownerId)
        state[quizId].answers = state[quizId].questions.map(q => undefined)
    }
    ctx.quiz = state[quizId]
    next();
}

function clearCache(quizId) {
    if (state[quizId]) {
        delete state[quizId]
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

