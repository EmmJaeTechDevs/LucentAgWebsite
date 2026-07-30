// Type declaration for the Google Analytics gtag.js snippet loaded in index.html.
interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}
