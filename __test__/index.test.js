
import React from 'react'
import { render } from "@testing-library/react";
import Gallery from "../src/index";

test("renders 3 profiles", () => {
  const { getAllByAltText } = render(<Gallery />);
  const profiles = getAllByAltText(/.+/);
  expect(profiles).toHaveLength(3);
});

