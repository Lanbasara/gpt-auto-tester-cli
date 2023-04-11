

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Product from '../src/ProductList/pindex';

test('renders product name', () => {
  const product = { name: 'Sample Product' };
  const component = render(<Product product={product} />);
  const nameElement = component.getByText('Sample Product');
  expect(nameElement).toBeInTheDocument();
});

test('onDelete is called when product is clicked', () => {
  const product = { name: 'Sample Product' };
  const onDelete = jest.fn();
  const component = render(<Product product={product} onDelete={onDelete} />);
  const productElement = component.getByText('Sample Product');
  fireEvent.click(productElement);
  expect(onDelete).toHaveBeenCalled();
});

