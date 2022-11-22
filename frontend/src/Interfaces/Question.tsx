import { FC } from 'react';
import { QuestionData } from './QuestionsData';
import { Link } from 'react-router-dom';

//Contract type checking. Defines the structure of the questions we expect to be working with.
interface Props {
    data: QuestionData;
    showContent?: boolean; //Optional prop
}

//FC = generic TypeScript type we can use to pass strongly typed props to a function-based component.
//Syntax FC<Props> where Props is the interface for props. The below is distructered to pull out data and showContent properties from interface above.
export const Question: FC<Props> = ({ data, showContent = true}) => (
    <div className="paddingApp">
        <div className="paddingApp fontSizeTitle">
            <Link className="questionTitleApp" to={`questions/${data.questionId}`}>
                {data.title}
            </Link>
        </div>
        {/* Short circuit && conditional logic. condition followed by logic to execute */}
        {showContent && (
            <div className="contentOfQuestionApp">
                {/* If the content is greater than 50 characters, shorten the string to 50, otherwise show full conent*/}
                {data.content.length > 50 ? `${data.content.substring(0, 50)}...` : data.content}
            </div>
        )}
        <div className="fontStypeQuestion">
            {`Asked by ${data.userName} on ${data.created.toLocaleDateString()} ${data.created.toLocaleTimeString()}`}
        </div>
    </div>
);

//Set default value of Optional prop. Better to define the optional value in the export next to the value
// Question.defaultProps = {
//     showContent: true
// };