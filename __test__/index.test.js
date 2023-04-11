
```js
import React from eact\import { render, screen } from 	esting-library/react\import Gallery from \Gallery	est(enders scientist images\ () => {
  render(<Gallery />);
  const images = screen.getAllByAltText(/amazing scientist/i);
  expect(images).toHaveLength(3);
});
```
