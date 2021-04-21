import { html } from '../../lib.js'
import { createQuestion } from './question.js';
import { createList } from './list.js';
import { createQuiz, updateQuiz, getQuizById, getQuestionByQuizId } from '../../api/data.js'


const template = (quiz, onSave) => html`
<section id="editor">

    <header class="pad-large">
        <h1>${quiz ? 'Edit quiz' : 'New quiz'}</h1>
    </header>

    <div class="pad-large alt-page">
        <form @submit=${onSave}>
            <label class="editor-label layout">
                <span class="label-col">Title:</span>
                <input class="input i-med" type="text" name="title" .value=${quiz ? quiz.title : '' }></label>
            <label class="editor-label layout">
                <span class="label-col">Topic:</span>
                <select class="input i-med" name="topic" .value=${quiz ? quiz.topic : '0' }>
                    <option value="0">-- Select category --</option>
                    <option value="it" ?checked=${quiz && quiz.topic=='it' }>Languages</option>
                    <option value="hardware" ?checked=${quiz && quiz.topic=='hardware' }>Hardware</option>
                    <option value="software" ?checked=${quiz && quiz.topic=='software' }>Tools and Software</option>
                </select>
            </label>
            <label class="editor-label layout">
                <span class="label-col">Description:</span>
                <textarea class="input" name="description" .value=${quiz ? quiz.description : '' }></textarea>
            </label>
            <input class="input submit action" type="submit" value="Save">
        </form>
    </div>

    ${quiz ? createList(quiz.questions) : ''}

</section>
`;


const questions = [{
    text: 'is this first question',
    answers: [
        'Yes',
        'No',
        'Maybe'
    ],
    correctIndex: 0
},
{
    text: 'is this second question',
    answers: [
        'Yes',
        'Maybe 2',
        'No',
    ],
    correctIndex: 1
}
];

export async function editorPage(ctx) {
    const quizId = ctx.params.id
    let quiz = null;
    if (quizId) {
        quiz = {
            title: 'Test question',
            topic: 'hardware',
            questions,
        }
    }

    ctx.render(template(quiz, onSave))

    async function onSave(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const topic = formData.get('topic');
        const description = formData.get('description');
        const data = {
            title,
            topic,
            description,
        }
        if (quizId) {
            await updateQuiz(quizId, data)
        } else {
           const result =  await createQuiz(data);
           ctx.page.redirect('/edit/' + result.objectId)
        }
    }

}
