import { FC } from 'react';
import { AnswerData } from './QuestionsData';
import { Answer } from './Answer';

interface Props {
    data: AnswerData[];
}

export const AnswerList: FC<Props> = ({ data }) => (
    <ul className="answerUnorderedList">
        {data.map(answer => (
            <li className="answerList" key="{answer.answerId}">
                <Answer data={answer} />
            </li>
        ))}
    </ul>
)