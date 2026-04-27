import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ButtonAssets/Button';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!isSupabaseConfigured) {
            setError('Supabase is not configured. Please set up your .env file.');
            return;
        }

        setError('');
        setLoading(true);

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

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
                <h1 className="auth_title">Connexion</h1>

                <form onSubmit={handleSubmit}>
                    {error && <p className="auth_error">{error}</p>}

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
                            autoComplete="current-password"
                        />
                    </div>

                    <Button
                        className="auth_submit"
                        type="submit"
                        variant="blue"
                        txt={loading ? 'Connexion...' : 'Se connecter'}
                        disabled={loading}
                        h={48}
                    />
                </form>

                <p className="auth_footer">
                    Pas encore de compte ?{' '}
                    <Link className="auth_link" to="/register">S&apos;inscrire</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
