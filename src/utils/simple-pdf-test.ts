import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const testSimplePDF = async (elementId: string): Promise<void> => {
  try {
    console.log('Starting simple PDF test...');
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    console.log('Element found:', element);
    console.log('Element styles:', window.getComputedStyle(element));

    // Simple html2canvas configuration
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    console.log('Canvas created:', {
      width: canvas.width,
      height: canvas.height
    });

    // Create a simple PDF
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');
    console.log('Image data length:', imgData.length);
    
    // Add image to PDF (full page)
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    
    // Save PDF
    pdf.save('test-certificate.pdf');
    
    console.log('PDF test completed successfully');
    
  } catch (error) {
    console.error('PDF test failed:', error);
    throw error;
  }
};
