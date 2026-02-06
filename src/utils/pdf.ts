import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Policy } from '../types/policy';

export const createPolicyPdf = async (policy: Policy): Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const title = 'Seguros Atlas - Póliza';
  const subtitle = `Póliza ${policy.policyNumber}`;

  page.drawText(title, {
    x: 50,
    y: height - 60,
    size: 18,
    font: fontBold,
    color: rgb(0.45, 0.32, 0.23)
  });

  page.drawText(subtitle, {
    x: 50,
    y: height - 85,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2)
  });

  const lineY = height - 100;
  page.drawLine({
    start: { x: 50, y: lineY },
    end: { x: width - 50, y: lineY },
    thickness: 1,
    color: rgb(0.9, 0.7, 0.4)
  });

  const small = 10;
  let y = height - 130;
  const lineGap = 16;

  const rows: string[] = [
    `Asegurado: ${policy.insuredName}`,
    `Producto: ${policy.productName}`,
    `Número de póliza: ${policy.policyNumber}`,
    `Vigencia: ${new Date(policy.effectiveDate).toLocaleDateString('es-MX')}  a  ${new Date(
      policy.expiryDate
    ).toLocaleDateString('es-MX')}`,
    `ID de póliza interno: ${policy.id}`,
    policy.notificationEmail ? `Correo de envío: ${policy.notificationEmail}` : '',
    '',
    'Este documento es un ejemplo generado desde el ambiente de demostración.',
    'Para efectos oficiales, consulta la póliza emitida en los sistemas centrales.'
  ];

  rows.forEach((text) => {
    page.drawText(text, {
      x: 50,
      y,
      size: small,
      font,
      color: rgb(0.2, 0.2, 0.2)
    });
    y -= lineGap;
  });

  const buffer = await pdfDoc.save();
  const blob = new Blob([buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  return url;
};
