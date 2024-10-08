import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header Component", () => {
  it("renders the header with correct title and subtitle", () => {
    // Render the Header component
    render(<Header />);

    // Assert that the header has the correct role
    const headerElement = screen.getByRole("banner");
    expect(headerElement).toBeInTheDocument();

    // Assert that the main title (h1) is rendered and contains the correct text
    const titleElement = screen.getByRole("heading", {
      name: /Cribl Log Viewer/i
    });
    expect(titleElement).toBeInTheDocument();

    // Assert that the subtitle (p) is rendered and contains the correct text
    const subtitleElement = screen.getByText(
      /Streaming logs directly from the server/i
    );
    expect(subtitleElement).toBeInTheDocument();

    // Assert that the subtitle has the correct aria-describedby attribute
    expect(subtitleElement).toHaveAttribute("aria-describedby", "main-title");
  });

  it("has the correct accessibility attributes", () => {
    // Render the Header component
    render(<Header />);

    // Assert that the header has the role of banner
    const headerElement = screen.getByRole("banner");
    expect(headerElement).toHaveAttribute("role", "banner");

    // Assert that the main title has the correct id
    const titleElement = screen.getByRole("heading", {
      name: /Cribl Log Viewer/i
    });
    expect(titleElement).toHaveAttribute("id", "main-title");

    // Assert that the subtitle has the aria-describedby attribute linked to the main title
    const subtitleElement = screen.getByText(
      /Streaming logs directly from the server/i
    );
    expect(subtitleElement).toHaveAttribute("aria-describedby", "main-title");
  });
});
