import { http } from '../HTTP/http';

//Contract type checking. Defines the structure of the questions we expect to be working with.
export interface QuestionData {
    questionId: number;
    title: string;
    content: string;
    userName: string;
    created: Date;
    answers: AnswerData[];
}

export interface AnswerData{
    answerId: number;
    content: string;
    userName: string;
    created: Date;
}

export interface QuestionDataFromServer {
    questionId: number;
    title: string;
    content: string;
    userName: string;
    created: string;
    answers: AnswerDataFromServer[];
    }

export interface AnswerDataFromServer {
    answerId: number;
    content: string;
    userName: string;
    created: string;
}

export interface PostQuestionData {
    title: string;
    content: string;
    userName: string;
    created: Date;
}

export interface PostAnswerData {
    questionId: number;
    content: string;
    userName: string;
    created: Date;
}

//We create a copy of the question and answer using the spread syntax and set the created dates to Date objects from the string-based date using the Date constructor
export const mapQuestionFromServer = ( question: QuestionDataFromServer, ): QuestionData => ({
    ...question,
    created: new Date(question.created.substr(0, 19)),
    answers: (question.answers) ? question.answers.map(answer => ({
        ...answer,
        created: new Date(answer.created.substr(0, 19)),
    })) : [],
});

//This function returns the question array items that have no answers with array.filter
//getUnansweredQuestions takes no parameters and expects a return type of QuestionsData in an array.
// export const getUnansweredQuestions = (): QuestionData [] => {
//     return questions.filter(question => question.answers.length === 0);
// }

//Await stops the next line from executing until the asynchronous statement is completed, while async indicated the function contains asynchronous statements.
//Instead or returning data straight away like above, this code will now return data eventually.
export const getUnansweredQuestions = async (): Promise<QuestionData[]> =>{
    // await wait(500);
    // return questions.filter(q => q.answers.length === 0);
    // let unansweredQuestions: QuestionData[] = [];

    // //Wait for the promise to be resolved, call then when the promise arrived to convert to json and and assign the response body
    // await fetch('https://localhost:44386/api/questions/getUnansweredQuestions')
    //     .then(res => res.json())
    //     .then(body => {
    //         unansweredQuestions = body;
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     });

    // return unansweredQuestions.map(questions => ({
    //     ...questions,
    //     created: new Date(questions.created)
    // }));

    //Pass undefined into the http function as the request body type because there isn't one and QuestionDataFromServer[] as the expected response body type.
    try {
        const result = await http<undefined,QuestionDataFromServer[]>({ path: '/getUnansweredQuestions', });
        if (result.parsedBody) {
            return result.parsedBody.map(mapQuestionFromServer);
        } else {
            return [];
        }
    } catch (ex) {
        throw Error(`Unable to retrieve data: ${ex.message}`);
    }
};

export const getQuestion = async ( questionId: number ): Promise<QuestionData | null> => {
    try{
        const result = await http<undefined, QuestionDataFromServer>({ path: `/getQuestion/${questionId}`});
        if (result.ok && result.parsedBody){
            return mapQuestionFromServer(result.parsedBody)
        } else {
            return null;
        }
    } catch (ex) {
        console.error(ex);
        return null;
    }
};

//Simulate search via a web request
export const searchQuestions = async ( criteria: string ): Promise<QuestionData[]> => {
    try {
        const result = await http<undefined, QuestionDataFromServer[]>({ path: `/getQuestionBySearch?search=${criteria}`, });
        if (result.ok && result.parsedBody){
            return result.parsedBody.map(mapQuestionFromServer);
        } else {
            return [];
        }
    } catch (ex) {
        console.error(ex);
        return [];
    }
};

export const postQuestion = async ( question: PostQuestionData, ) : Promise<QuestionData | undefined> => {
    try{
        const result = await http<PostQuestionData, QuestionDataFromServer>({ path: '/postQuestion', method: 'post', body: question, });
        if( result.ok && result.parsedBody ){
            return mapQuestionFromServer(result.parsedBody);
        } else {
            return undefined;
        }
    } catch (ex) {
        console.log(ex);
        return undefined;
    }
}

export const postAnswer = async (answer: PostAnswerData,): Promise<AnswerData | undefined> => {
    try{
        const result = await http<PostAnswerData, AnswerData>({ path: `/postAnswer/${answer.questionId}`, method: 'post', body: answer });

        if (result.ok) {
            var test = result.parsedBody
            return test
        } else {
            return undefined;
        }
    } catch (ex) {
        console.error(ex);
        return undefined;
    }
};