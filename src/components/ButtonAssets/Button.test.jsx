import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button Component", () => {
  it("renders the txt prop", () => {
    render(<Button txt="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders children instead of txt when both are provided", () => {
    render(<Button txt="Fallback">Child content</Button>);
    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(screen.queryByText("Fallback")).not.toBeInTheDocument();
  });

  it("applies the correct variant class", () => {
    render(<Button txt="Red" variant="red" />);
    expect(screen.getByRole("button")).toHaveClass("btn--red");
  });

  it("applies neon hover class by default", () => {
    render(<Button txt="Neon" />);
    expect(screen.getByRole("button")).toHaveClass("btn--neon-hover");
  });

  it("omits neon hover class when neonOnHover is false", () => {
    render(<Button txt="No neon" neonOnHover={false} />);
    expect(screen.getByRole("button")).not.toHaveClass("btn--neon-hover");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button txt="Go" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("applies a custom className", () => {
    render(<Button txt="X" className="my-class" />);
    expect(screen.getByRole("button")).toHaveClass("my-class");
  });

  it("sets the button type attribute", () => {
    render(<Button txt="Submit" type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
