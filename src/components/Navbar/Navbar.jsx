import './Navbar.css';

import burger from "../../assets/burger-menu-svgrepo-com.svg";
import {useState, useEffect, useRef} from "react";
import Button from "../ButtonAssets/Button.jsx";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { supabase, isSupabaseConfigured } from "../../utils/supabase.js";

function Navbar() {
    let [isMenuOpen, setIsMenuOpen] = useState(true);
    const { user } = useAuth();
    const navRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (!isMenuOpen && navRef.current && !navRef.current.contains(e.target)) {
                setIsMenuOpen(true);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    async function handleLogout() {
        if (isSupabaseConfigured) await supabase.auth.signOut();
        setIsMenuOpen(true);
    }

    return (
        <div id="topnav" className="topnav" data-reverse={isMenuOpen} ref={navRef}>
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
                    <li><Link to="/"><Button className="topnav__btn" txt={"Home"}/></Link></li>
                    <li><Link to="/game"><Button className="topnav__btn" txt={"Flash citation"}/></Link></li>
                    <li><Link to="/typing"><Button className="topnav__btn" txt={"Saisie agile"}/></Link></li>
                    <li><Link to="/express"><Button className="topnav__btn" txt={"Verdict expess"}/></Link></li>

                    {user ? (
                        <>
                            <li><Link to="/compte"><Button className="topnav__btn" txt={"Mon compte"}/></Link></li>
                            <li><Button className="topnav__btn" variant="red" txt={"Déconnexion"} onClick={handleLogout}/></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login"><Button className="topnav__btn" txt={"Connexion"}/></Link></li>
                            <li><Link to="/register"><Button className="topnav__btn" variant="green" txt={"Inscription"}/></Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
