import "./Home.css";
import Button from "../../components/ButtonAssets/Button";
import HistoryBoard from "../../components/HistoryBoard/HistoryBoard";
import QuoteBox from "../../components/QuoteBox/QuoteBox";

function Home() {
  const historyEntries = [
    { name: "XXXGamerXXX", score: 50129837 },
    { name: "XXXGamerXXX", score: 41209483 },
    { name: "XXXGamerXXX", score: 3586598 },
    { name: "XXXGamerXXX", score: 3419090 },
    { name: "XXXGamerXXX", score: 3157609 },
    { name: "XXXGamerXXX", score: 2997910 },
    { name: "XXXGamerXXX", score: 2272983 },
  ];

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

        <Button className="home_play_button" variant="blue" txt="> Play <" />
      </section>

      <HistoryBoard entries={historyEntries} />
    </main>
  );
}
export default Home;
