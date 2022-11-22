import { ChangeEvent, FC, useState, FormEvent } from 'react';
import { UserIcon } from '../Components/Icons';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import '../CSS/index.css';
//Function parameters are defined in parentheses and the code that the function executes follows a =>
//Export allows keywords to be used in other files
//Multilines require parentheses
export const Header: FC<RouteComponentProps> = ({ history, location }) => {
    const searchParams = new URLSearchParams(location.search);
    const criteria = searchParams.get('criteria') || '';

    const [search, setSearch] = useState(criteria);

    //Event parameter is strongly typed, set search value on input change
    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
    };

    //This sets the browser location path to search with the approperiate criteria query parameter.
    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        history.push(`/search?criteria=${search}`);
    };

    return(
        <div className="headerApp">
            <Link to="/" className="anchorTagApp">Q & A</Link>
            <form onSubmit={handleSearchSubmit}>
                <input className="inputBoxApp" type="text" placeholder="Search..." value={search} onChange={handleSearchInputChange}/>
            </form>
            <Link to="./signin">
                <UserIcon />
                <span>Sign In</span>
            </Link>
        </div>
    )
};

export const HeaderWithRouter = withRouter(Header);
