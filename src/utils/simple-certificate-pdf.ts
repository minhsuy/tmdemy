import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateSimpleCertificatePDF = async (): Promise<void> => {
  try {
    console.log('=== Simple Certificate PDF Test ===');
    
    // Create a simple test element
    const testElement = document.createElement('div');
    testElement.id = 'test-certificate-element';
    testElement.innerHTML = `
      <div style="
        width: 800px;
        height: 600px;
        background: white;
        border: 2px solid black;
        padding: 20px;
        font-family: Arial, sans-serif;
        text-align: center;
      ">
        <h1 style="color: black; font-size: 24px; margin-bottom: 20px;">TEST CERTIFICATE</h1>
        <p style="color: black; font-size: 16px; margin-bottom: 10px;">This is a test certificate</p>
        <p style="color: black; font-size: 14px; margin-bottom: 20px;">Certificate ID: TEST-123</p>
        <div style="
          width: 200px;
          height: 100px;
          border: 1px solid black;
          margin: 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <p style="color: black; font-size: 12px;">Signature</p>
        </div>
        <p style="color: black; font-size: 12px;">Issued: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
    
    // Add to body temporarily
    document.body.appendChild(testElement);
    
    console.log('Test element created and added to DOM');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Capture with html2canvas
    const canvas = await html2canvas(testElement, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      width: 800,
      height: 600,
    });
    
    console.log('Canvas created:', {
      width: canvas.width,
      height: canvas.height
    });
    
    // Check if canvas has content
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData.data.some((value, index) => {
        return index % 4 === 3 && value > 0; // Check alpha channel
      });
      console.log('Canvas has content:', hasContent);
    }
    
    // Create PDF
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    console.log('Image data length:', imgData.length);
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    
    // Save PDF
    pdf.save('simple-test-certificate.pdf');
    
    // Clean up
    document.body.removeChild(testElement);
    
    console.log('Simple PDF test completed successfully');
    
  } catch (error) {
    console.error('Simple PDF test failed:', error);
    throw error;
  }
};
