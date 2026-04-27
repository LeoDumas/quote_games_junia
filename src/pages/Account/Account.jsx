import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { fetchUserBestScores } from '../../utils/supabaseLeaderboard';
import './Account.css';

const GAMES = [
    { key: 'flash',   label: 'Flash',   path: '/game',    emoji: '⚡' },
    { key: 'express', label: 'Express',  path: '/express', emoji: '✅' },
    { key: 'typing',  label: 'Saisie',   path: '/typing',  emoji: '⌨️' },
];

function PencilIcon() {
    return (
        <svg className="pencil_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
    );
}

function AvatarIcon() {
    return (
        <div className="account_avatar">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="30" r="17" fill="#999"/>
                <ellipse cx="40" cy="72" rx="27" ry="17" fill="#999"/>
            </svg>
        </div>
    );
}

function Account() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [bestScores, setBestScores] = useState({});
    const [loadingData, setLoadingData] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [savingUsername, setSavingUsername] = useState(false);
    const [editError, setEditError] = useState('');

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    useEffect(() => {
        if (!user) return;
        fetchUserBestScores(user.id).then((bests) => {
            setBestScores(bests ?? {});
            setLoadingData(false);
        });
    }, [user]);

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate('/');
    }

    async function handleUsernameSubmit(e) {
        e.preventDefault();
        if (!newUsername.trim()) return;
        setSavingUsername(true);
        setEditError('');

        const { error } = await supabase.auth.updateUser({
            data: { username: newUsername.trim() },
        });

        setSavingUsername(false);
        if (error) {
            setEditError(error.message);
        } else {
            setIsEditing(false);
            setNewUsername('');
        }
    }

    function startEditing(current) {
        setNewUsername(current);
        setEditError('');
        setIsEditing(true);
    }

    if (loading) return null;
    if (!user) return null;

    const username = user.user_metadata?.username ?? 'Joueur';
    const hasNoScores = GAMES.every((g) => bestScores[g.key] == null);

    return (
        <div className="account_page">
            <div className="account_profile_card">
                <div className="account_profile_inner">
                    <AvatarIcon />

                    <div className="account_profile_info">
                        <div className="account_field">
                            <span className="account_field_label">Pseudo</span>
                            {isEditing ? (
                                <form onSubmit={handleUsernameSubmit} className="account_inline_form">
                                    <input
                                        className="account_inline_input"
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder={username}
                                        maxLength={30}
                                        autoFocus
                                    />
                                    <button type="submit" className="account_inline_save" disabled={savingUsername}>
                                        {savingUsername ? '…' : '✓'}
                                    </button>
                                    <button type="button" className="account_inline_cancel" onClick={() => setIsEditing(false)}>
                                        ✕
                                    </button>
                                </form>
                            ) : (
                                <span className="account_field_value">
                                    {username}
                                    <button className="account_pencil_btn" onClick={() => startEditing(username)} aria-label="Modifier le pseudo">
                                        <PencilIcon />
                                    </button>
                                </span>
                            )}
                            {editError && <span className="account_field_error">{editError}</span>}
                        </div>

                        <div className="account_field">
                            <span className="account_field_label">Email</span>
                            <span className="account_field_value">{user.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="account_section_card">
                <h2 className="account_section_title">Meilleurs scores</h2>

                {loadingData ? (
                    <p className="account_placeholder">Chargement…</p>
                ) : hasNoScores ? (
                    <p className="account_placeholder">Aucun score enregistré. Jouez pour apparaître ici !</p>
                ) : (
                    <ul className="account_scores_list">
                        {GAMES.map(({ key, label }) => (
                            <li key={key} className="account_score_row">
                                <span className="account_star">★</span>
                                <span className="account_score_label">{label}</span>
                                <span className="account_score_pts">
                                    {bestScores[key] != null ? bestScores[key].toLocaleString() + ' pts' : '—'}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="account_games_grid">
                {GAMES.map(({ key, label, path, emoji }) => (
                    <button key={key} className="account_game_tile" onClick={() => navigate(path)}>
                        <span className="account_game_emoji">{emoji}</span>
                        <span className="account_game_label">{label}</span>
                    </button>
                ))}
            </div>

            <button className="account_logout_link" onClick={handleLogout}>
                Se déconnecter
            </button>
        </div>
    );
}

export default Account;
