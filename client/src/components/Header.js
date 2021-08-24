import { Link } from 'react-router-dom';

import logo from '../logo.png';


const Header = () => {
    return (
        <header className="space-y-5 lg:grid lg:grid-cols-3 lg:space-y-0">
            <div className="lg:col-start-2">
                <Link to="/">
                    <img src={logo} className="h-20 m-auto" alt="logo" />
                </Link>
            </div> 
        </header>
    );
};

export default Header;
