import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import QuoteBox from "./QuoteBox";

describe("QuoteBox Component", () => {
  it("renders the quote text correctly", () => {
    const testText =
      "The only limit to our realization of tomorrow is our doubts of today.";
    render(<QuoteBox text={testText} />);

    // Check if the text is rendered in the document
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it("renders the author when provided", () => {
    const testText = "Stay hungry, stay foolish.";
    const testAuthor = "Steve Jobs";
    render(<QuoteBox text={testText} author={testAuthor} />);

    // Check if the author is rendered
    expect(screen.getByText(testAuthor)).toBeInTheDocument();
  });

  it("does not render the author paragraph when author is omitted or empty", () => {
    const testText = "A quote with no author.";
    const { container } = render(<QuoteBox text={testText} />);

    // Verify that the element with the 'quote_author' class does not exist
    const authorElement = container.querySelector(".quote_author");
    expect(authorElement).not.toBeInTheDocument();
  });

  it("renders the quote icon with the correct alt text and class", () => {
    render(<QuoteBox text="Just checking the icon." />);

    // Find the image by its alt text
    const icon = screen.getByAltText("quote icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("quote_svg_themed");
  });
});
