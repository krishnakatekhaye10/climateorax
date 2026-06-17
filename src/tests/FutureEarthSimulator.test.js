import { render, screen } from '@testing-library/react';
import FutureEarthSimulator from '../pages/FutureEarthSimulator';

test('renders Future Earth Simulator heading', () => {
  render(<FutureEarthSimulator />);
  expect(screen.getByText(/Future Earth Simulator/i)).toBeInTheDocument();
});
