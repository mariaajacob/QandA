import React, { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../Interfaces/Store';
import '../CSS/App.css';
import '../CSS/index.css';
import { HomePage } from './HomePage'; //with brackets is default import
import { SearchPage } from './SearchPage';
import { SignInPage } from './SignInPage';
import { QuestionPage } from './QuestionPage';
import { NotFoundPage } from './NotFoundPage';
import { HeaderWithRouter as Header} from './Header'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
const AskPage = lazy(() => import('./AskPage')); //Must be last
//The lazy finction allows dynamic imports as regular components, dynamoc importd  return a promise for the requested module that is resolved after it has been fetched, instantiated and evaluated.

const store = configureStore();
function App() {
  return (
    <Provider store={store}>
    {/* Browser Router will look for Route components, use exact to avoid partial matches e.g. HomePage + Search. Like a real switch, not found must be last. */}
    <BrowserRouter>
      <div className='emotionApp'>
        <Header />
        <Switch>
          {/* /home and / should go to the same place, use redirect. Must be within a switch (switch renders the first Route/redirect taht matches the browsers location path.*/}
          <Redirect from="/home" to="/" />
          <Route exact path="/" component={HomePage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/ask" component={AskPage}>
            {/* The suspense fallback props (required with Lazy loading) allows rendering a component while AskPage is loading */}
            <Suspense fallback={
                <div className="fallBackRoute">
                  Loading...
                </div>
              }
            >
              <AskPage />
            </Suspense>
          </Route>
          <Route path="/signin" component={SignInPage} />
          <Route path="/questions/:questionId" component={QuestionPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
