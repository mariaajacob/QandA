import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Page } from '../Interfaces/Page';
import { searchQuestions, QuestionData } from '../Interfaces/QuestionsData';
import { QuestionList } from '../Interfaces/QuestionsList';

export const SearchPage: FC<RouteComponentProps> = ({location,}) => {
    const [questions, setQuestions] = useState<QuestionData[]>([]);

    //React router gives us access tp all the query parameters in a search string inside the location object.
    const searchParams = new URLSearchParams(location.search); //URLSearchParams = search string only, not full url path.
    const search = searchParams.get('criteria') || '';

    //Invoke search when the component first renders and when the search variable changes with the useEffect hook.
    useEffect(() => {
        const doSearch = async (criteria: string) => {
            const foundResults = await searchQuestions(criteria);
            setQuestions(foundResults);
        };
        doSearch(search);
    }, [search]);

    return (
        <Page title="Search Results">
            {search && (
                <p className="searchResults">
                    for "{search}"
                </p>
            )}
            <QuestionList data={questions} />
        </Page>
    )
};