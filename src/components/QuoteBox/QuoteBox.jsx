import "./QuoteBox.css";
import quoteIcon from "../../assets/quote.svg";

function QuoteBox({ text, author = "" }) {
  return (
    <article className="box_quote_container">
      <article className="box_quote">
        <div className="top_quote">
          <img src={quoteIcon} alt="quote icon" className="quote_svg_themed" />
        </div>
        <section className="box_content">
          <p className="quote_text">{text}</p>
          {author !== "" && <p className="quote_author">{author}</p>}
        </section>
      </article>
    </article>
  );
}

export default QuoteBox;
