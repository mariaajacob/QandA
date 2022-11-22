import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Page } from '../Interfaces/Page';

describe('Test page component', () => {
    afterEach(cleanup);
    test('when the page component is rendered, it should contain the correct title and content', () =>{
        const { getByText } = render(
            <Page title="My Test Title">
                <span>Test Content</span>
            </Page>
        );
        const title = getByText('My Test Title');
        expect(title).not.toBeNull();
        const content = getByText('Test Content');
        expect(content).not.toBeNull();
    });
})
