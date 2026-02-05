import { fireEvent, render, screen } from '@testing-library/react';
import { PhotoCapture } from '../PhotoCapture';

describe('PhotoCapture', () => {
  it('muestra el label y permite seleccionar archivo', () => {
    const handleChange = vi.fn();
    render(<PhotoCapture label="Foto de prueba" photo={null} onChange={handleChange} />);

    expect(screen.getByText('Foto de prueba')).toBeInTheDocument();

    const input = screen.getByLabelText('Foto de prueba') as HTMLInputElement;
    const file = new File(['hello'], 'test.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalled();
  });
});

