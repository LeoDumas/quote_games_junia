import QuoteBox from "../../components/QuoteBox/QuoteBox";

function Home() {
  return (
    <div className="container">
      <h1>HOME</h1>
      <QuoteBox
        text="This is a long ahh quote to test the element, and this is not really good"
        author="Fan De Gameplay"
      />
    </div>
  );
}
export default Home;
