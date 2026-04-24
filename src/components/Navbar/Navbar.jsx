import './Navbar.css';

import burger from "../../assets/burger-menu-svgrepo-com.svg";
import {useState} from "react";
import Button from "../ButtonAssets/Button.jsx";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

function Navbar() {

    let [isMenuOpen, setIsMenuOpen] = useState(true);

    return (

        <div id="topnav" className="topnav" data-reverse={isMenuOpen}>
            <div className="topnav-inner">
                <Link to="/">
                    <div className="logo"><img id="logo" src={logo} alt="logo"/></div>
                </Link>

                <a id="topnav_hamburger_icon_link" onClick={() => {
                    isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
                }
                }>
                    <img id="burger_icon" src={burger} alt="burger_menu_icon"/>
                </a>

            </div>

            <nav role="navigation" id="topnav_responsive_menu">
                <ul>
                    <li><Link to="/"><Button h={50} w={200} txt={"Home"}/></Link></li>
                    <li><Link to="/game"><Button h={50} w={200} txt={"Flash citation"}/></Link></li>
                    <li><Link to="/saisie-agile"><Button h={50} w={200} txt={"Saisie agile"}/></Link></li>
                    <li><Link to="/express"><Button h={50} w={200} txt={"Verdict expess"}/></Link></li>
                    <li><Link to="/compte"><Button h={50} w={200} txt={"Compte"}/></Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;