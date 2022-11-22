import React, { FC, useEffect } from 'react'; //Redux
import { Page } from '../Interfaces/Page';
import { Form, required, minLength, Values, SubmitResult } from '../Interfaces/Form';
import { Field } from '../Interfaces/Field';
import { PostQuestionData, QuestionData } from '../Interfaces/QuestionsData';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { postQuestionActionCreator, AppState, clearPostedQuestionActionCreator } from '../Interfaces/Store';
import { AnyAction } from 'redux';

interface Props {
    postQuestion: (question: PostQuestionData,) => Promise<void>;
    postedQuestionResult?: QuestionData;
    clearPostedQuestion: () => void;
}

/*export const AskPage = () => {  -Redux */
    const AskPage: FC<Props> = ({ postQuestion, postedQuestionResult, clearPostedQuestion,}) => {
    useEffect(() => {
        return function cleanUp() {
            clearPostedQuestion();
          };
    }, [clearPostedQuestion]);

    //Calls postQuestion function asychronously, passing in the title and content from the field values with a hardcoded user name and created date.
    const handleSubmit = (values: Values) => {
        // const question = await postQuestion({
        //     title: values.title,
        //     content: values.content,
        //     userName: 'Fred',
        //     created: new Date(),
        //   });
        // return { success: question ? true : false };
        postQuestion({
            title: values.title,
            content: values.content,
            userName: 'Fred',
            created: new Date(),
          });
    };

    let submitResult: SubmitResult | undefined;
    if (postedQuestionResult) {
      submitResult = { success: postedQuestionResult !== undefined };
    }
    
    return(
        <Page title="Ask a Question">
        <Form
          submitCaption="Submit Your Question"
          validationRules={{
            title: [{ validator: required }, { validator: minLength, arg: 10 }],
            content: [{ validator: required }, { validator: minLength, arg: 50 }],
          }}
          onSubmit={handleSubmit}
          submitResult={submitResult}
          failureMessage="There was a problem with your question"
          successMessage="Your question was successfully submitted"
        >
          <Field name="title" label="Title" />
          <Field name="content" label="Content" type="TextArea" />
        </Form>
      </Page>
    );
};
    
const mapStateToProps = (store: AppState) => {
    return {
      postedQuestionResult: store.questions.postedResult,
    };
  };
  const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
      postQuestion: (question: PostQuestionData) =>
        dispatch(postQuestionActionCreator(question)),
      clearPostedQuestion: () => dispatch(clearPostedQuestionActionCreator()),
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AskPage);