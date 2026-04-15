import './Navbar.css';

import burger from "../../assets/burger-menu-svgrepo-com.svg";
import {useState} from "react";





function Navbar() {

    let [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <div id="topnav" className="topnav" data-reverse={isMenuOpen}>
            <div className="topnav-inner">
                <a id="topnav_hamburger_icon_link" href="javascript:void(0);" onClick={ () => {
                    isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
                }
                }>
                    <img id="burger_icon" src={burger} alt="burger_menu_icon"/>
                </a>

                <nav role="navigation" id="topnav_responsive_menu">
                    <ul>
                        <li><a href="/">HOME</a></li>
                        <li><a href="/about">ABOUT</a></li>
                        <li><a href="/contact-us">CONTACT</a></li>
                        <li><a href="/privacy-policy">PRIVACY POLICY</a></li>
                        <li><a href="/terms-and-conditions">TERMS AND CONDITIONS</a></li>
                    </ul>
                </nav>
            </div>

        </div>
    );
}

export default Navbar;