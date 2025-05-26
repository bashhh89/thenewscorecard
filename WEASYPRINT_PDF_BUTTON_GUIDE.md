# WeasyPrint PDF Button Documentation

## Current Status

The "download pdf 2" button (WeasyPrint PDF) has been temporarily hidden from the UI while preserving all its underlying functionality.

## How to Restore the Button

To make the WeasyPrint PDF button visible again, follow these steps:

1. Open the file `app/scorecard/results/NewResultsPage.tsx`

2. Locate the WeasyPrint PDF button component (around line 1017):
   ```tsx
   <WeasyprintPDFButton 
     scorecardData={formatReportDataForPDF()}
     className="btn-primary-divine bg-[#FEC401] text-[#103138] hover:bg-[#FEC401]/90 hidden"
   >
     download pdf 2
   </WeasyprintPDFButton>
   ```

3. Remove the `hidden` class from the `className` prop:
   ```tsx
   <WeasyprintPDFButton 
     scorecardData={formatReportDataForPDF()}
     className="btn-primary-divine bg-[#FEC401] text-[#103138] hover:bg-[#FEC401]/90"
   >
     download pdf 2
   </WeasyprintPDFButton>
   ```

4. Save the file and restart the application to see the button restored in the UI.

## Technical Details

The WeasyPrint PDF button uses a specialized PDF generation method through the following components:

- Component File: `components/ui/pdf-download/WeasyprintPDFButton.tsx`
- PDF Generator: WeasyPrint HTML-to-PDF conversion

No API endpoints were removed during this change, so all functionality remains intact.

## Usage Considerations

The button is primarily used for specialized PDF generation requirements. Before restoring it to the UI, consider:

1. If the button's functionality is needed for specific user workflows
2. Whether the current visible PDF generation options sufficiently meet user needs
3. If the button should be modified or renamed before restoring visibility 