import "./Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ButtonAssets/Button";
import HistoryBoard from "../../components/HistoryBoard/HistoryBoard";
import QuoteBox from "../../components/QuoteBox/QuoteBox";
import { loadLeaderboard } from "../../resources/leaderboard/leaderboard";

function Home() {
  const navigate = useNavigate();
  const [historyEntries, setHistoryEntries] = useState(() => loadLeaderboard());

  useEffect(() => {
    const refresh = () => setHistoryEntries(loadLeaderboard());

    refresh();
    window.addEventListener("focus", refresh);

    return () => window.removeEventListener("focus", refresh);
  }, []);

  return (
    <main className="home_container">
      <section className="home_content">
        <h1 className="home_title">Le jeu des quotes</h1>

        <div className="home_quote_wrap">
          <QuoteBox
            text="Il fait froid et il neige a New York. Nous avons besoin du rechauffement climatique !"
            author="Donald Trump"
          />
        </div>

        <Button
          className="home_play_button"
          variant="blue"
          txt="> Play <"
          onClick={() => navigate("/game")}
        />
      </section>

      <HistoryBoard entries={historyEntries} />
    </main>
  );
}
export default Home;
