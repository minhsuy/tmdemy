import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface CertificatePDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

export const generateCertificatePDF = async (
  elementId: string,
  options: CertificatePDFOptions = {}
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Certificate element not found');
    }

    console.log('=== PDF Generation Debug ===');
    console.log('Element found:', element);
    console.log('Element tagName:', element.tagName);
    console.log('Element className:', element.className);
    console.log('Element innerHTML length:', element.innerHTML.length);
    
    // Check if element has content
    const hasTextContent = element.textContent && element.textContent.trim().length > 0;
    console.log('Has text content:', hasTextContent);
    console.log('Text content preview:', element.textContent?.substring(0, 100));

    const {
      filename = 'certificate.pdf',
      quality = 0.98,
      scale = 1 // Reduce scale to 1 for better compatibility
    } = options;

    // Wait longer for fonts and images to load
    console.log('Waiting for fonts and images to load...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Force element to be visible and have proper dimensions
    const originalStyle = element.style.cssText;
    const originalParent = element.parentElement;
    
    // Create a temporary container for better rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      position: fixed !important;
      top: -9999px !important;
      left: -9999px !important;
      width: 800px !important;
      height: 600px !important;
      background: white !important;
      z-index: 9999 !important;
      visibility: visible !important;
      opacity: 1 !important;
      overflow: visible !important;
    `;
    
    // Apply styles to element
    element.style.cssText = `
      position: relative !important;
      width: 800px !important;
      height: 600px !important;
      background: white !important;
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
      margin: 0 !important;
      padding: 32px !important;
      box-sizing: border-box !important;
      ${originalStyle}
    `;
    
    // Move element to temp container
    document.body.appendChild(tempContainer);
    tempContainer.appendChild(element);

    console.log('Element style applied:', element.style.cssText);

    // Configure html2canvas options
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      width: 800,
      height: 600,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      foreignObjectRendering: true,
      removeContainer: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure fonts are loaded in cloned document
        const clonedElement = clonedDoc.getElementById('certificate-content');
        if (clonedElement) {
          clonedElement.style.fontFamily = 'Arial, sans-serif';
          clonedElement.style.color = '#000000';
          clonedElement.style.backgroundColor = '#ffffff';
        }
      }
    });

    // Restore original style and position
    element.style.cssText = originalStyle;
    if (originalParent) {
      originalParent.appendChild(element);
    }
    if (tempContainer && tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }

    console.log('Canvas created:', {
      width: canvas.width,
      height: canvas.height
    });

    // Check if canvas has content
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    console.log('Canvas dimensions:', { imgWidth, imgHeight });
    
    // Check if canvas is empty
    const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
    const hasContent = imageData.data.some((value, index) => {
      // Check alpha channel (every 4th value)
      return index % 4 === 3 && value > 0;
    });
    
    if (!hasContent) {
      throw new Error('Canvas appears to be empty - no content detected');
    }
    
    // Calculate PDF dimensions (A4 landscape)
    const pdfWidth = 297; // A4 width in mm
    const pdfHeight = 210; // A4 height in mm
    
    // Calculate scaling to fit content
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;
    
    console.log('PDF scaling:', { ratio, scaledWidth, scaledHeight });
    
    // Center the content
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png', quality);
    
    console.log('Image data length:', imgData.length);
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    
    // Save PDF
    pdf.save(filename);
    
    console.log('PDF saved successfully');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF certificate');
  }
};

export const downloadCertificatePDF = async (
  certificateId: string,
  courseTitle: string,
  studentName: string
): Promise<void> => {
  const filename = `certificate-${courseTitle.replace(/\s+/g, '-').toLowerCase()}-${certificateId}.pdf`;
  
  console.log('=== Download Certificate PDF ===');
  console.log('Certificate ID:', certificateId);
  console.log('Course Title:', courseTitle);
  console.log('Student Name:', studentName);
  console.log('Filename:', filename);
  
  await generateCertificatePDF('certificate-content', {
    filename,
    quality: 0.98,
    scale: 1 // Use scale 1 for better compatibility
  });
};
