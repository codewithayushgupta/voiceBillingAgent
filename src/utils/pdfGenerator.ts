import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

interface Item {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export async function generateBillPDF(
  items: Item[],
  customerName: string
): Promise<number | null> {
  if (!items || items.length === 0) {
    return null;
  }

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('🧾 Voice Billing Receipt', 10, 15);
  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleString()}`, 10, 25);

  if (customerName) {
    doc.text(`Customer: ${customerName}`, 10, 32);
  }

  let y = 44;
  doc.text('Item', 10, y);
  doc.text('Qty', 90, y);
  doc.text('Price', 120, y);
  doc.text('Total', 160, y);
  y += 6;
  doc.line(10, y, 200, y);
  y += 8;

  let totalAmount = 0;
  items.forEach((item) => {
    const name =
      item.name.length > 28 ? item.name.slice(0, 28) + '...' : item.name;
    doc.text(name, 10, y);
    doc.text(String(item.qty), 95, y);
    doc.text(`₹${item.price}`, 125, y);
    doc.text(`₹${item.total}`, 160, y);
    y += 8;
    totalAmount += item.total;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  y += 6;
  doc.line(10, y, 200, y);
  y += 8;
  doc.text(`Total Amount: ₹${totalAmount}`, 10, y);

  // Save and share on mobile, download on web
  if (Capacitor.isNativePlatform()) {
    try {
      const pdfOutput = doc.output('datauristring');
      const base64Data = pdfOutput.split(',')[1];
      const fileName = `bill_${Date.now()}.pdf`;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      await Share.share({
        title: 'Voice Billing Receipt',
        text: `Bill for ${customerName || 'Customer'}`,
        url: savedFile.uri,
        dialogTitle: 'Share Bill',
      });

      return totalAmount;
    } catch (error) {
      console.error('Error saving/sharing PDF:', error);
      return totalAmount;
    }
  } else {
    // Web fallback
    doc.save('bill.pdf');
    return totalAmount;
  }
}