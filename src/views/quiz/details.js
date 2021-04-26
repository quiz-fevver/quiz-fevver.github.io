import { html, until } from '../../lib.js'
import { line } from '../common/loader.js'
import { topics } from '../../lib.js';
import { getSolutionCount } from '../../api/data.js';

const detailTemplate = (quiz) => html`
<section id="details">
    <div class="pad-large alt-page">
        <article class="details">
            <h1>Extensible Markup Language</h1>
            <span class="quiz-topic">A quiz by <a href="#">Peter</a> on the topic of Languages</span>
            <div class="quiz-meta">
                <span>15 Questions</span>
                <span>|</span>
                <span>Taken 189 times</span>
            </div>
            <p class="quiz-desc">Test your knowledge of XML by completing this medium-difficulty quiz.
                Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam recusandae corporis voluptatum quibusdam
                maxime similique reprehenderit rem, officia vero at.</p>

            <div>
                <a class="cta action" href="#">Begin Quiz</a>
            </div>

        </article>
    </div>
</section>
`;

const detailsTemplate = (quiz) => html`
<section id="details">
    <div class="pad-large alt-page">
        <article class="details">
            <h1>${quiz.title}</h1>
            <span class="quiz-topic">A quiz by <a href="/users/${quiz.owner.objectId}">${quiz.owner.username}</a> on the
                topic of <strong>${topics[quiz.topic]}</strong></span>
            ${until(loadCount(quiz), line())}
            <p class="quiz-desc">${quiz.description}</p>
            <div>
                <a class="cta action" href="/quiz/${quiz.objectId}">Begin Quiz</a>
            </div>
        </article>
    </div>
</section>`;

async function loadCount(quiz) {
    const taken = (await getSolutionCount([quiz.objectId]))[quiz.objectId] || 0;

    return html`
    <div class="quiz-meta">
        <span>${quiz.questionCount} question${quiz.questionCount == 1 ? '' : 's'}</span>
        <span>|</span>
        <span>Taken ${taken} time${taken == 1 ? '' : 's'}</span>
    </div>`;
}


export async function detailsPage(ctx) {
    ctx.render(detailsTemplate(ctx.quiz))
}