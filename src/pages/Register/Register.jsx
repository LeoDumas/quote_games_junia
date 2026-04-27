import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ButtonAssets/Button';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';
import './Register.css';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!isSupabaseConfigured) {
            setError('Supabase is not configured. Please set up your .env file.');
            return;
        }

        if (password !== confirm) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setError('');
        setLoading(true);

        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username: username.trim() } },
        });

        setLoading(false);

        if (authError) {
            setError(authError.message);
            return;
        }

        navigate('/compte');
    }

    return (
        <div className="auth_container">
            <div className="auth_card">
                <h1 className="auth_title">Inscription</h1>

                <form onSubmit={handleSubmit}>
                    {error && <p className="auth_error">{error}</p>}

                    <div className="auth_field">
                        <label className="auth_label" htmlFor="username">Nom d&apos;utilisateur</label>
                        <input
                            id="username"
                            className="auth_input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={2}
                            maxLength={30}
                            autoComplete="username"
                        />
                    </div>

                    <div className="auth_field">
                        <label className="auth_label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="auth_input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth_field">
                        <label className="auth_label" htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            className="auth_input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="auth_field">
                        <label className="auth_label" htmlFor="confirm">Confirmer le mot de passe</label>
                        <input
                            id="confirm"
                            className="auth_input"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <Button
                        className="auth_submit"
                        type="submit"
                        variant="blue"
                        txt={loading ? 'Inscription...' : "S'inscrire"}
                        disabled={loading}
                        h={48}
                    />
                </form>

                <p className="auth_footer">
                    Déjà un compte ?{' '}
                    <Link className="auth_link" to="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
