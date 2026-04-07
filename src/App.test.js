import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Azan app without crashing', () => {
  render(<App />);
  // التأكد من أن التطبيق يعمل بدون أخطاء
  expect(document.body).toBeTruthy();
});

test('app container exists', () => {
  const { container } = render(<App />);
  expect(container.firstChild).toBeTruthy();
});
