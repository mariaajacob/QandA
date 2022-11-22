import { FC } from 'react';
import { AnswerData } from './QuestionsData';

interface Props {
    data: AnswerData;
}

export const Answer: FC<Props> = ({ data }) => (
    <div className="paddingApp">
        <div className="answerContent">
            {data.content}
        </div>
        <div className="fontStypeQuestion">
            {`Answered by ${data.userName} on ${data.created.toLocaleDateString()} ${data.created.toLocaleTimeString()}`}
        </div>
    </div>
)