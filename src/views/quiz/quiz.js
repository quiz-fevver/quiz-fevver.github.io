import { html, styleMap, classMap,} from '../../lib.js'

const quizTemplate = (quiz, questions, currentIndex) => html`
<section id="quiz">
    <header class="pad-large">
        <h1>${quiz.title} Question ${currentIndex + 1} / ${questions.length}</h1>
        <nav class="layout q-control">
            <span class="block">Question index</span>
            ${questions.map((q,i)=> indexTemplate(quiz.objectId,i, i == currentIndex))}

        </nav>
    </header>
    <div class="pad-large alt-page">

        <article class="question">
            <p class="q-text">
                ${questions[currentIndex].text}
            </p>
            <form>
                ${questions.map((q, i) => questionTemplate(q, i, i == currentIndex))}
            </form>
            <nav class="q-control">
                <span class="block">12 questions remaining</span>
                <a class="action" href=#><i class="fas fa-arrow-left"></i> Previous</a>
                <a class="action" href=#><i class="fas fa-sync-alt"></i> Start over</a>
                <div class="right-col">
                    <a class="action" href=#>Next <i class="fas fa-arrow-right"></i></a>
                    <a class="action" href=#>Submit answers</a>
                </div>
            </nav>
        </article>

    </div>
</section>
`;

const questionTemplate = (question, index, isCurrent) => html`
<div data-index="question-${index}" style=${styleMap({display:isCurrent ? '' : 'none' })}>

    ${question.answers.map((a, i) => answerTemplate(index, i, a))}

</div>
`;

const answerTemplate = (questionIndex, index, text) => html`
    <label class="q-answer radio">
        <input class="input" type="radio" name="question-${questionIndex}" value=${index} />
        <i class="fas fa-check-circle"></i>
        ${text}
    </label>
`;

const indexTemplate = (quizId, i, isCurrent, isAnswered) => {
    const className = {
        'q-index':true,
        'q-current':isCurrent,
        'q-answered': isAnswered,
    }
return html`<a class=${classMap(className)} href="/quiz/${quizId}?question=${i + 1}"></a>`
}

export async function quizPage(ctx) {
    const index = Number(ctx.querystring.split('=')[1] || 1) - 1;
    const questions = ctx.quiz.questions
    ctx.render(quizTemplate(ctx.quiz,questions,index));
}


