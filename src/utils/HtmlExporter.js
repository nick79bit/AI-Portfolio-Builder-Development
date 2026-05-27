import { generatePortfolioHtml } from './Themes';

/**
 * Trigger browser download of the compiled static HTML portfolio
 */
export function exportToHtmlFile(portfolio, themeId) {
  if (!portfolio) return false;

  try {
    const htmlContent = generatePortfolioHtml(portfolio, themeId);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    
    // Create temporary download link element
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const fileSlug = (portfolio.fullName || "my")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
      
    link.href = url;
    link.setAttribute("download", `${fileSlug}-portfolio.html`);
    
    // Append to document and trigger click
    document.body.appendChild(link);
    link.click();
    
    // Cleanup resources
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Export Error:", error);
    return false;
  }
}
