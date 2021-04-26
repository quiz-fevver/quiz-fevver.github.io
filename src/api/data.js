import * as api from './api.js';

const host = 'https://parseapi.back4app.com'
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;


//implements application specific query
function createPointer(name, id) {
    return {
        __type: 'Pointer',
        className: name,
        objectId: id
    };
}

function addOwner(object) {
    const userId = sessionStorage.getItem('userId');
    const result = Object.assign({}, object);
    result.owner = createPointer('_User', userId);
    return result;
}


export async function getQuizes() {
    return (await api.get(host + '/classes/Quiz')).results
}

export async function getQuizById(id) {
    return await api.get(host + '/classes/Quiz/' + id + '?include=owner')
}

export async function createQuiz(quiz) {
    const body = addOwner(quiz)
    return await api.post(host + '/classes/Quiz', body)
}

export async function updateQuiz(id, quiz) {
    return await api.put(host + '/classes/Quiz/' + id, quiz)
}

export async function deleteQuiz(id) {
    return await api.del(host + '/classes/Quiz/' + id)
}

//Question querys
export async function createQuestion(quizId, question) {
    const body = addOwner(question);
    body.quiz = createPointer('Quiz', quizId);
    return await api.post(host + '/classes/Question', body);
}

export async function getQuestionByQuizId(quizId, ownerId) {
    const query = JSON.stringify({
        quiz: createPointer('Quiz', quizId),
        owner: createPointer('_User', ownerId)
    });
    const response = await api.get(host + '/classes/Question?where=' + encodeURIComponent(query))
    return response.results;
}

export async function updateQuestion(id, question) {
    return await api.put(host + '/classes/Question/' + id, question);
}

export async function deleteQuestion(id) {
    return await api.del(host + '/classes/Question/' + id);
}

export async function getSolutionsByUserId(userId) {
    const query = JSON.stringify({ owner: createPointer('_User', userId) })
    const response = await api.get(host + '/classes/Solution?where=' + encodeURIComponent(query));
    return response.results;
}

export async function getSolutionsByQuizId(quizId) {
    const query = JSON.stringify({ owner: createPointer('_Quiz', quizId) })
    const response = await api.get(host + '/classes/Solution?where=' + encodeURIComponent(query));
    return response.results;
}

export async function submitSolution(quizId, solution) {
    const body = addOwner(solution);
    body.quiz = createPointer('Quiz', quizId);
    return await api.post(host + '/classes/Solution', body);
}

export async function getSolutionCount(quizIds) {
    const query = JSON.stringify({ $or: quizIds.map(id => ({ quiz: createPointer('Quiz', id) })) });
    const solutions = (await api.get(host + '/classes/Solution?where=' + encodeURIComponent(query))).results;
    const result = solutions.reduce((a, c) => {
        const id = c.quiz.objectId;
        if (!a[id]) { a[id] = 0; }
        a[id]++;
        return a;
    }, {});

    return result;
}

export async function getStats() {
    return (await api.get(host + '/classes/Quiz?count=1&limit=0')).count;
}


export async function getMostRecent() {
    const quiz = (await api.get(host + '/classes/Quiz?order=-createdAt&limit=1')).results[0];
    if (quiz) {
        const taken = await getSolutionCount([quiz.objectId]);
        quiz.taken = taken[quiz.objectId];
    }
    return quiz;
}