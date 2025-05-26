# How to Restore the Enhanced Presentation PDF Button

The Enhanced Presentation PDF button has been temporarily hidden but is still available in the codebase. Follow these steps to restore it:

## Method 1: Edit the source code directly

1. Locate the file: `app/scorecard/results/NewResultsPage.tsx`
2. Find the PresentationPDFButton component (around line 1229)
3. Remove the `hidden` class from the className prop:

```jsx
<PresentationPDFButton
  onGeneratePDF={handlePresentationPdf}
  isLoading={isPresentationPdfLoading}
  className="btn-primary-divine bg-[#20E28F] text-[#103138] hover:bg-[#20E28F]/90"
/>
```

## Method 2: Temporary browser restoration

If you need to temporarily access the button without changing the source code:

1. Open your browser's developer tools (F12 or right-click → Inspect)
2. Navigate to the Elements tab
3. Locate the hidden button element
4. Select the element and in the Styles panel, remove or uncheck the `display: none` property

## Method 3: Using JavaScript console

You can also make the button visible via the browser console:

```javascript
document.querySelector("#pdf-download-container button").classList.remove("hidden");
```

Note that Methods 2 and 3 will only make the button visible for the current session.

## Why it's hidden

The Enhanced Presentation PDF button has been hidden to simplify the UI and focus on the primary SeekPDF functionality. The functionality remains in the codebase for future use. 