import React, { useState } from 'react';
import { useEffect, FC } from 'react';
import logo from '../Images/logo.svg';
import sonicLogo from '../Images/sanic.png';
import shadowLogo from '../Images/shadow.png';
import { PrimaryButton } from '../PrimaryButton';
import { QuestionList } from '../Interfaces/QuestionsList';
import { getUnansweredQuestions, QuestionData } from '../Interfaces/QuestionsData'; //Removed for redux
import { Page } from '../Interfaces/Page';
import { PageTitle } from './PageTitle';
import { BootstrapButton } from './LovelyButton';
//The import below gives access to a history object, this keeps track of the locations previsouly visited. Push adds a new entry to the history stack.
import { RouteComponentProps } from 'react-router-dom';
//Connect allows connection to the store.
//import { connect } from 'react-redux';
//import { ThunkDispatch } from 'redux-thunk';
//import { AnyAction } from 'redux';
//Redux
//import { getUnansweredQuestionsActionCreator, AppState } from '../Interfaces/Store';

interface Props extends RouteComponentProps {
    getUnansweredQuestions: () => Promise<void>;
    questions: QuestionData[] | null;
    questionsLoading: boolean;
}

//HomePage conponent us a container component. QuestionList and Question being presentational components.
//Containers are responsible for how things work. I.E. fetching any data from a web API and managing state.
//Presentational components recieve data via their props and also have property event handlers so that their containers can manage user interactions.

// const renderQuestion = (question: QuestionData) =>
//     <div>{question.title}</div>;
// Add: renderItem={renderQuestion} to QuestionList if you wanted to use
//Use return when we want to write some Javascript logic (e.g. useEffect) in the component as well as JSX.
export const HomePage:FC<RouteComponentProps> = ({history}) => {
//export const HomePage: FC<Props> = ({ history, questions, questionsLoading, getUnansweredQuestions }) => { // --REDUX ONLY
    // UseState returns an array containing the state variable in the first element and function to set the state in the second element.
    //THe initial value of the state variable is pass into the function as a parameter. The TypeScript type for the state variable can be passed to the function as a generic.
    //questions is a state variable, setQuestions is a function to set the sate variable (deconstruction).
    
    const [questions, setQuestions] = useState<QuestionData[] | null>(null); //Union type - specifying a type can be one of multiple types. Different types in union are seperated by |.
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    
    // The useEffect hook is a function that allows a side effect, such as fetching data to be performed in a component.
    // Takes two parameters, first a fuction to execute, second parameter determines when the function in the first parameter should be executed.
    // Second parameter cont.. This is defined in an array of variables that, if changed results in the first parameter function being executed.
    // If the array is empty, then the function is executed only when the component is mounted into the DOM.
    useEffect(() => {
        const doGetUnansweredQuestions = async () => {
            try{
                const unansweredQuestions = await getUnansweredQuestions();
                setQuestions(unansweredQuestions);
                setQuestionsLoading(false);
            } catch (error) {
                setHasError(true);
                setErrorMessage(error.message ? error.message : 'Unable to retrieve an error message');
            }
        };
        doGetUnansweredQuestions();
    }, []);
    
    //--- REDUX ONLY
    //     if (questions === null){
    //         getUnansweredQuestions();
    //     }
    // }, [questions, getUnansweredQuestions]);
    // React components are re-rendered whenever their states are changed, the below log will be produced 3 times, 1: initial load, 2: setQuestions, 3: setQuestionsLoading
    //console.log('rendered');

    const handleAskQuestionClick = () => {
        history.push('/ask');
    }
    return(
        <Page>
            <div className="homePageApp">
                <div className="askQuestionApp">
                    <PageTitle>Unanswered Questions</PageTitle>
                    <BootstrapButton onClick={handleAskQuestionClick} size="small">Ask a Question</BootstrapButton>
                </div>
                {questionsLoading && !hasError ? (
                    <div className="loadingApp">
                        Gota go fast...
                        <div className="appContainer">
                            <img src={sonicLogo} className="Sonic-Speed" alt="logo" />
                        </div>
                    </div>
                ) : (
                    <QuestionList data={questions || []}/>
                )}
                {hasError &&  (
                    <div className="loadingApp2">
                        You got the wrong hedgehog...{errorMessage}
                        <div className="appContainer">
                            <img src={shadowLogo} className="Shadow-Speed" alt="logo" />
                        </div>
                    </div>
                )}
                <div className="appContainer">
                    <div className="poweredBy">Created With</div>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
            </div>
        </Page>
    );
};

//-- Redux - takes store state amd returns questions and questionsLoaded props.
// const mapStateToProps = (store: AppState) => {
//     return {
//         questions: store.questions.unanswered,
//         questionsLoading: store.questions.loading
//     };
// };

// const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>,) => {
//     return {
//         getUnansweredQuestions: () =>
//         dispatch(getUnansweredQuestionsActionCreator()),
//     };
// };

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps,
// )(HomePage);