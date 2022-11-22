import { QuestionData, getUnansweredQuestions, postQuestion, PostQuestionData } from './QuestionsData';

//Action creators - When synchronous, the creator will return the action object. When asynchronous, the creator will return a function that dispatches the action and cad dispatch more than one.
//Reducers are responsible for changing the state in the store for a given action.
import { Action, ActionCreator, Dispatch, Reducer, combineReducers, Store, createStore, applyMiddleware } from 'redux';
//Thunk is used to enable asynchronous actions because, by default, Redux actions can't be asynchronous.
import thunk, { ThunkAction } from 'redux-thunk';

//Redux
//The store is going to have a questions property taht, in turn, contains an array of unanswered questions or null in an unanswered property.
//The questions property included whether the unanswered questions are being loaded from the server in a loading property. 
//The questions property also includes the result of posting a new 
//The questions property also includes the result of posting a new question in a postedResult property.
interface QuestionsState {
    readonly loading: boolean;
    readonly unanswered: QuestionData[] | null;
    readonly postedResult?: QuestionData;
}

export interface AppState {
    readonly questions: QuestionsState;
}

const initialQuestionState: QuestionsState = {
    loading: false,
    unanswered: null
};

//Interfaces can inherit properties and methods from another interface using the extends keyword. THe interface that's being inherited from is specified after the extends keyword.
//The action has no other properties, so the object will always be as follows: { type: 'GettingUnansweredQuestions' }
interface GettingUnansweredQuestionsAction extends Action<'GettingUnansweredQuestions'> {}

export interface GotUnansweredQuestionsAction extends Action<'GotUnansweredQuestions'>{
    questions: QuestionData[];
}

export interface PostedQuestionAction extends Action<'PostedQuestion'> {
    result: QuestionData | undefined;
}

type QuestionsActions =
    | GettingUnansweredQuestionsAction
    | GotUnansweredQuestionsAction
    | PostedQuestionAction;

//This is an asynchronous action creator and returns a function that will dispatch two actions. 
//So, the returned function has a dispatch parameter, which is used to dispatch the actions
//ActionCreator takes a parameter for the type of action that is created. Use ThunkAction type which is a generic type that has four parameters: promise<void>, QuestionData,
//type for the parameter that is passed into the nested function (null as there is no parameter). Type of action to be dispached.
export const getUnansweredQuestionsActionCreator: ActionCreator<ThunkAction<Promise<void>, QuestionData[], null, GotUnansweredQuestionsAction>> = () => {
    return async (dispatch: Dispatch) => {
        const gettingUnansweredQuestionsAction: GettingUnansweredQuestionsAction = {
          type: 'GettingUnansweredQuestions',
        };
        dispatch(gettingUnansweredQuestionsAction);
        const questions = await getUnansweredQuestions();
        const gotUnansweredQuestionAction: GotUnansweredQuestionsAction = {
          questions,
          type: 'GotUnansweredQuestions',
        };
        dispatch(gotUnansweredQuestionAction);
    };
};


//Only dispatching a single action after the response of the posted question has been recieved.
//THe nested function also takes in a parameter from the question to be posted, so this appears in the ThunkAction generic type as the third parameter.
export const postQuestionActionCreator: ActionCreator<ThunkAction<Promise<void>,QuestionData,PostQuestionData,PostedQuestionAction>> = (question: PostQuestionData) => {
    return async (dispatch: Dispatch) => {
        const result = await postQuestion(question);
        const postedQuestionAction: PostedQuestionAction = {
        type: 'PostedQuestion',
        result
    };
    dispatch(postedQuestionAction);
    };
};

//Synchronous, returns a PostedQuestion action with an undefined result property
export const clearPostedQuestionActionCreator: ActionCreator<PostedQuestionAction> = () => {
    const postedQuestionAction: PostedQuestionAction = {
        type: 'PostedQuestion',
        result: undefined,
    };
    return postedQuestionAction;
};

//Takes two properties, current state and the action being processed. State underfined first time reducer is called, set default as initialQuestionState.
//Returns the new state objevt for the given action.
const questionsReducer: Reducer<QuestionsState, QuestionsActions> = ( state = initialQuestionState, action ) => {
    switch (action.type) {
        case 'GettingUnansweredQuestions': {
            // We use hte spread syntax to copy the previous state into a new object, initialize the unanswered state to null and set the loading state to true.
            return {
                ...state,
                unanswered: null,
                loading: true
            };
        }
        case 'GotUnansweredQuestions': {
            return {
                ...state,
                unanswered: action.questions,
                loading: false
            };
        }
        //If the question has been sucessfully submitted, the result property in the action will contain a question property, which is added to the unanswered array using the array's concat function.
        //We store the result of the question submission in the pistedResult property.
        case 'PostedQuestion': {
            return {
                ...state,
                unanswered: action.result ? (state.unanswered || []).concat(action.result) : state.unanswered,
                postedResult: action.result
            };
        }
        default: {
            neverReached(action);
        }
    }
    return state;
};

//Takes never object and returns an empty object.
const neverReached = (never: never) => {};

//An object literal is passed into combineReducers that contains the properties in our app state, along with the reducer that is responsible for that state. 
//We only have a single property in our app state called questions and a single reducer managing changes to that state called questionsReducer.
// We will use the rootReducer in the next section when we create the store object.
const rootReducer = combineReducers<AppState>({
    questions: questionsReducer
});

//This function uses the createStore function from Redux by passing in the combined reducers, undefined as the initial state, and the Thunk middleware
//using the applyMiddleware function. Use generic Store type as the return type for the function passing in the interface for our app state, which is AppState.
export function configureStore(): Store<AppState> {
    const store = createStore(rootReducer, undefined, applyMiddleware(thunk) );
    return store;
}
