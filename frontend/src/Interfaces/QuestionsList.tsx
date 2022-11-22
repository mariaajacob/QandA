import { FC } from 'react';
import { QuestionData } from './QuestionsData';
import { Question } from './Question';
import { MyPaper } from '../Components/MyPaper';

//FC = generic TypeScript type we can use to pass strongly typed props to a function-based component.
//Syntax FC<Props> where Props is the interface for props.
//The renderItem prop is a function that takes in a parameter containing the question and returns a JSX element
interface Props {
    data: QuestionData[];
    renderItem?: (item: QuestionData) => JSX.Element;
}

//We have defined props that can be passed into the component of the Props type.
//This means we can pass a data prop into QuestionList when we reference it in JSX.
// props was de-constructed from props to ({data}), this unpacks objects or arrays into variables.

//Wrapping the Questions list component in memo (after FC<Props>) means that the Questions List only rerenders when its props change.
//Usae memo only when components: return the same output of a given set of props, renders ofter or outputs lots of elements.
export const QuestionList: FC<Props> = ({ data, renderItem }) => {
    return(
        <MyPaper elevation={3}>
            <ul className="unorderedListApp">
            {/* referencing data and calling map nested inside the list component map iterates through the items in the array calling the function each time
                the key helps react detect element changes
            */}
            { data.map( question => (
                <li className="listApp" key={question.questionId}>
                    {renderItem ? renderItem(question) : <Question data={question}/>}
                </li>
            ))}
        </ul>
    </MyPaper>
    );
};

