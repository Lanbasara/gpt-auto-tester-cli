
import React from 'react'
import { render } from "@testing-library/react";
import Gallery from "../src/index";

test("renders scientist gallery", () => {
  const { getAllByAltText } = render(<Gallery />);
  const images = getAllByAltText(/.+/);
  expect(images).toHaveLength(3);
});

