import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export const generateWarrantyPdf = async ({
  requestId,
  clientName,
  device,
  serviceCenter,
  date,
  trackingUrl
}) => {
  const doc = new jsPDF();
  const qrDataUrl = await QRCode.toDataURL(trackingUrl, { width: 120, margin: 1 });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ServicePro.kz Warranty Certificate', 14, 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Request ID: ${requestId}`, 14, 32);
  doc.text(`Client: ${clientName}`, 14, 40);
  doc.text(`Device: ${device}`, 14, 48);
  doc.text(`Service Center: ${serviceCenter}`, 14, 56);
  doc.text(`Date: ${date}`, 14, 64);

  doc.setFont('helvetica', 'bold');
  doc.text('Scan QR to track status', 14, 78);
  doc.addImage(qrDataUrl, 'PNG', 14, 82, 36, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('This certificate confirms warranty service eligibility for the above request.', 14, 130);

  return doc;
};

export default generateWarrantyPdf;
