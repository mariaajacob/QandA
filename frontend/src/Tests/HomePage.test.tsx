import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import { HomePage } from '../Components/HomePage';
import { BrowserRouter } from 'react-router-dom';

afterEach(cleanup);

test ('When HopePage first rendered, loading indicator should show', () => {
    let mock: any = jest.fn();
    const { getByText } = render(
        <BrowserRouter>
            <HomePage history={mock} location={mock} match={mock}/>
        </BrowserRouter>
    );

    const loading = getByText('Gota go fast...');
    expect(loading).not.toBeNull();
})4