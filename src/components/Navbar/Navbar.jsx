import './Navbar.css';

import burger from "../../assets/burger-menu-svgrepo-com.svg";
import {useState} from "react";
import Button from "../ButtonAssets/Button.jsx";
import logo from "../../assets/logo.svg";


function Navbar() {

    let [isMenuOpen, setIsMenuOpen] = useState(true);

    return (

        <div id="topnav" className="topnav" data-reverse={isMenuOpen}>
            <div className="topnav-inner">
                <a href="/">
                    <div className="logo"><img id="logo" src={logo} alt="logo"/></div>
                </a>

                <a id="topnav_hamburger_icon_link" onClick={() => {
                    isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
                }
                }>
                    <img id="burger_icon" src={burger} alt="burger_menu_icon"/>
                </a>

            </div>

            <nav role="navigation" id="topnav_responsive_menu">
                <ul>
                    <li><a href="/"><Button h={50} w={200} txt={"Home"}/></a></li>
                    <li><a href="/game"><Button h={50} w={200} txt={"Flash citation"}/></a></li>
                    <li><a href="/saisie-agile"><Button h={50} w={200} txt={"Saisie agile"}/></a></li>
                    <li><a href="/verdict-express"><Button h={50} w={200} txt={"Verdict expess"}/></a></li>
                    <li><a href="/compte"><Button h={50} w={200} txt={"Compte"}/></a></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;