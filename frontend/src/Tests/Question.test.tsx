import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { QuestionData } from '../Interfaces/QuestionsData';
import { Question } from '../Interfaces/Question';
import { BrowserRouter } from 'react-router-dom';

const title = 'My test title';
const content = 'My test content';
const userName = 'Test mi user';
const created = new Date(2021, 1, 1);
const regexUsername = new RegExp(userName)

afterEach(cleanup);

test('When the Question component is rendered, it should contain the correct data', () => {
    //Given: mocked Question data
    const question: QuestionData = {
        questionId: 1,
        title: title,
        content: content,
        userName: userName,
        created: created,
        answers: [],
    };
    //When: the data has been given to the question and rendered
    const { getByText } = render(
        //Browser router required due to <Link> within question requiring a Router
        <BrowserRouter>
            <Question data={question} />
        </BrowserRouter>
    );

    //Then: the expected data is bound to the expected question elements
    const titleText = getByText(title);
    expect(titleText).not.toBeNull();

    const contentText = getByText(content);
    expect(contentText).not.toBeNull();
    
    const userText = getByText(/Test mi user/);
    expect(userText).not.toBeNull();

    const dateText = getByText(/2021/);
    expect(dateText).not.toBeNull();
});