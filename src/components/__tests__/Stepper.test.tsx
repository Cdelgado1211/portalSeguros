import { render, screen } from '@testing-library/react';
import { Stepper } from '../Stepper';

describe('Stepper', () => {
  it('marca el paso activo correctamente', () => {
    render(
      <Stepper
        steps={[
          { key: 'one', label: 'Uno' },
          { key: 'two', label: 'Dos' },
          { key: 'three', label: 'Tres' }
        ]}
        activeIndex={1}
      />
    );

    const activeStep = screen.getByText('Dos');
    expect(activeStep.parentElement).toHaveAttribute('aria-current', 'step');
  });
});

