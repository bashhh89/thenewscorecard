/**
 * PDF Generator for AI Efficiency Scorecard (WeasyPrint Version)
 * This utility converts HTML to PDF using the WeasyPrint service.
 */

interface PDFOptions {
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
  format?: string;
  landscape?: boolean;
  pageSize?: string;
  preferCssPageSize?: boolean;
}

/**
 * Converts HTML to PDF using WeasyPrint service
 */
export async function convertHTMLToPDF(html: string, options: PDFOptions = {}): Promise<Buffer> {
  try {
    // WeasyPrint service configuration
    const WEASYPRINT_SERVICE_URL = process.env.WEASYPRINT_SERVICE_URL || "http://168.231.115.219:5001/generate-pdf";
    const WEASYPRINT_TIMEOUT = 180000; // 180 seconds timeout (3 minutes)
    
    console.log("Configuring PDF options for WeasyPrint...");
    
    const defaultOptions = {
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm"
      },
      format: "A4",
      landscape: false,
      preferCssPageSize: true,  // Prefer CSS page size from @page rules
      printBackground: true     // Always print background graphics
    };
    
    // Merge default options with provided options
    const pdfOptions = {
      ...defaultOptions,
      ...options
    };
    
    console.log("Sending request to WeasyPrint service...");
    
    // Set up timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEASYPRINT_TIMEOUT);
    
    try {
      // Make request to WeasyPrint service
      const weasyPrintResponse = await fetch(WEASYPRINT_SERVICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/pdf"
        },
        body: JSON.stringify({
          html_content: html,
          pdf_options: pdfOptions
        }),
        signal: controller.signal
      });
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      if (!weasyPrintResponse.ok) {
        let errorDetails = "";
        try {
          const errorData = await weasyPrintResponse.json();
          errorDetails = JSON.stringify(errorData);
        } catch {
          errorDetails = await weasyPrintResponse.text();
        }
        
        console.error(`WeasyPrint service error (${weasyPrintResponse.status}): ${errorDetails}`);
        throw new Error(`WeasyPrint service error: ${weasyPrintResponse.status} - ${errorDetails.substring(0, 300)}`);
      }
      
      // Check if the response is actually a PDF
      const contentType = weasyPrintResponse.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/pdf')) {
        console.error(`WeasyPrint returned wrong content type: ${contentType}`);
        throw new Error(`WeasyPrint service error: Expected PDF but got ${contentType}`);
      }
      
      // Get PDF as buffer
      const pdfBuffer = await weasyPrintResponse.arrayBuffer();
      if (!pdfBuffer || pdfBuffer.byteLength === 0) {
        throw new Error("WeasyPrint service returned empty PDF");
      }
      
      console.log(`PDF generated successfully: ${pdfBuffer.byteLength} bytes`);
      return Buffer.from(pdfBuffer);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error("Error converting HTML to PDF:", error);
    
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("WeasyPrint service request timed out after 3 minutes");
    }
    
    throw error;
  }
} 