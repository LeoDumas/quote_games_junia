import { useState } from 'react';
import Button from '../ButtonAssets/Button';
import './NamePromptModal.css';

const STORED_NAME_KEY = 'quote-game-player-name';

function NamePromptModal({ score, onSave }) {
    const [name, setName] = useState(
        () => localStorage.getItem(STORED_NAME_KEY) ?? ''
    );

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = name.trim() || 'Player';
        localStorage.setItem(STORED_NAME_KEY, trimmed);
        onSave(trimmed);
    }

    return (
        <div className="modal_overlay">
            <div className="modal_card">
                <p className="modal_title">Partie terminée !</p>
                <p className="modal_score">{score.toLocaleString()} pts</p>

                <form onSubmit={handleSubmit}>
                    <label className="modal_label" htmlFor="player_name">
                        Votre nom pour le classement
                    </label>
                    <input
                        id="player_name"
                        className="modal_input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={30}
                        autoFocus
                        autoComplete="off"
                    />
                    <div className="modal_actions">
                        <Button type="submit" variant="blue" txt="Sauvegarder" h={44} w={140} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NamePromptModal;
