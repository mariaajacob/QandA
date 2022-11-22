import React, { FC, useState, Fragment, useEffect } from 'react';
import { Page } from '../Interfaces/Page';
import { RouteComponentProps } from 'react-router-dom';
import { QuestionData, getQuestion, postAnswer } from '../Interfaces/QuestionsData';
import { AnswerList } from '../Interfaces/AnswerList';
// import { required, minLength, Values } from '../Interfaces/Form';
// import { Field } from '../Interfaces/Field';
import { QuestionList } from '../Interfaces/QuestionsList';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import sonicLogo from '../Images/sanic.png';
import { BootstrapButton } from './LovelyButton';

interface RouteParams {
    questionId: string;
}

//Going to style title differently, so not supplying in the interface.
//Defined route and route type, thus giving us strongly typed access to the questionId route parameter
export const QuestionPage: FC<RouteComponentProps<RouteParams>> = ({ match }) => {
    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<boolean | null>(null);

    //On first render, question component will fetch questuon and set the state that will trigger a second render.
    useEffect(() => {
        const doGetQuestion = async (questionId: number) => {
            const foundQuestion = await getQuestion(questionId);
            setQuestion(foundQuestion);
        };
        if (match.params.questionId) {
            const questionId = Number(match.params.questionId); //Convert string to a number
            doGetQuestion(questionId);
        }

    }, [match.params.questionId]); //First param reliant the match.params.questionId value and should return if the value changes.

    //calls hte postAnswer, asynchronously passing in hte content from the field values with a hardcoded username and created date.
    // const handleSubmit = async (values: Values) => {
    //     const result = await postAnswer({
    //         questionId: question!.questionId,
    //         content: values.content,
    //         userName: 'Fred',
    //         created: new Date()
    //     });

    //     return{ success: result ? true : false };
    // };

    return( 
        <Page>
            <div className="questionsPageApp">
                <div className="questionsPageTitle">
                    {question === null ? '' : question.title}
                </div>
                {question !== null && (
                    // Fragment, allows us to nest multiple elements within creating a DOM node. Otherwise React enforces return of a single element.
                    <Fragment> 
                        <p className="questionPageContent">
                            {question.content}
                        </p>
                        <div className="fontStypeQuestion">
                            {`Asked by ${question.userName} on ${question.created.toLocaleDateString()} ${question.created.toLocaleTimeString()}`}
                        </div>
                        <AnswerList data={question.answers} />
                        <div className="justMargin">
                            {/* <Form 
                                submitCaption="Submit Your Answer"
                                validationRules={{
                                content: [
                                    { validator: required },
                                    { validator: minLength, arg: 50 }
                                ]
                                }}
                                onSubmit={handleSubmit}
                                failureMessage="There was a problem with your answer"
                                successMessage="Your answer was sucessfully submitted"
                            >
                                <Field name="content" label="Your Answer" type="TextArea"/>
                            </Form> */}
                            <Formik
                                initialValues={{ content: '' }}
                                validationSchema={
                                    Yup.object({
                                        content: Yup.string()
                                            .min(50, 'Must be greater than 50 characters')
                                            .required('Required')
                                    })
                                }
                                onSubmit={ async (values) => {
                                        const dates = new Date();
                                        const result = await postAnswer({
                                            questionId: question!.questionId,
                                            content: values.content,
                                            userName: 'Fred',
                                            created: new Date()
                                        });
                                        result!.created = dates;
                                        question.answers.push(result!);
                                        setQuestion(question)
                                        setSubmissionStatus(result ? true : false);
                                    }
                                }
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        {submissionStatus !== undefined && submissionStatus === true &&(
                                            <div className="successText">Successfully Submitted Answer</div>
                                        )}
                                        {submissionStatus !== undefined && submissionStatus === false &&(
                                            <div className="errorText">Drat, an error occured and your answer was not posted</div>
                                        )}
                                        {isSubmitting === true &&(
                                            <div className="loadingApp">
                                                Gota go fast...
                                                <div className="appContainer">
                                                    <img src={sonicLogo} className="Sonic-Speed" alt="logo" />
                                                </div>
                                            </div>
                                        )}
                                        {isSubmitting === false && submissionStatus === null &&(
                                            <Fragment>
                                                <div className="fieldComp">
                                                    <label htmlFor="content" className="justBold">Your Answer</label>
                                                    <Field name="content" as="textarea" className="formFieldTypes justHeight" />
                                                    <div className='errorText'>
                                                        <ErrorMessage name="content" className='errorText' />
                                                    </div>
                                                </div>
                                                <BootstrapButton type="submit" disabled={isSubmitting}>Submit</BootstrapButton>
                                            </Fragment>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </Fragment>
                )}
            </div>
        </Page>
    );
};