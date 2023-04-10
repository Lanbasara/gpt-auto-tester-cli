import React from "react";
import { render } from "@testing-library/react";
import Gallery from "../src/index";
describe("Gallery", () => {
  it("should render three profiles", () => {
    const { getAllByAltText } = render(<Gallery />);
    const profiles = getAllByAltText(/./);
    expect(profiles.length).toBe(3);
  });
});
