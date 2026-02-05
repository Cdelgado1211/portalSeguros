import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renderiza children y respeta disabled/loading', () => {
    const { rerender } = render(<Button>Continuar</Button>);
    expect(screen.getByRole('button', { name: /continuar/i })).toBeEnabled();

    rerender(<Button loading>Continuar</Button>);
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled();
  });
});

