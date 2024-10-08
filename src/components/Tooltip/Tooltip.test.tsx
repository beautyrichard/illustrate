import { render } from "@testing-library/react";
import Tooltip from "./Tooltip";

describe("Tooltip Component", () => {
  test("renders Tooltip with correct content and position", () => {
    // Render the Tooltip with example x, y and content props
    const { getByRole } = render(
      <Tooltip x={50} y={100} content="Hour: 03:00 Count: 79" />
    );

    // Get the tooltip by its role
    const tooltip = getByRole("tooltip");

    // Check if the tooltip contains the correct content (ignoring \n)
    expect(tooltip).toHaveTextContent("Hour: 03:00 Count: 79");

    // Check if the tooltip has correct inline styles for positioning
    expect(tooltip).toHaveStyle({ left: "50px", top: "100px" });
  });

  test("updates position and content dynamically", () => {
    // Render the Tooltip with different values for props
    const { getByRole, rerender } = render(
      <Tooltip x={150} y={200} content="Hour: 02:00 Count: 100" />
    );

    // Get the tooltip
    const tooltip = getByRole("tooltip");

    // Check for initial content and position (ignoring \n)
    expect(tooltip).toHaveTextContent("Hour: 02:00 Count: 100");
    expect(tooltip).toHaveStyle({ left: "150px", top: "200px" });

    // Re-render the component with new values
    rerender(<Tooltip x={75} y={175} content="Hour: 03:00 Count: 79" />);

    // Check for updated content and position (ignoring \n)
    expect(tooltip).toHaveTextContent("Hour: 03:00 Count: 79");
    expect(tooltip).toHaveStyle({ left: "75px", top: "175px" });
  });
});
