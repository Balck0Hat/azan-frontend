import html2canvas from "html2canvas";
import api from "../../api";

const CACHE_KEY = "ux-audit-cache";
const IGNORE_KEY = "ux-audit-ignored";

/* ── DOM scanner ── */
export function scanDOM() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        const tag = node.tagName;
        if (["SCRIPT", "NOSCRIPT", "STYLE", "SVG", "CANVAS", "PATH"].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const lines = [];
  let count = 0;
  const MAX_NODES = 400;

  while (walker.nextNode() && count < MAX_NODES) {
    const el = walker.currentNode;
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    // Skip invisible elements
    if (rect.width === 0 && rect.height === 0) continue;

    const classes = el.className && typeof el.className === "string"
      ? `.${el.className.trim().split(/\s+/).join(".")}`
      : "";
    const tag = el.tagName.toLowerCase();
    const text = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
      ? ` "${el.textContent.trim().slice(0, 40)}"`
      : "";

    const styles = [
      `display:${cs.display}`,
      `color:${cs.color}`,
      `bg:${cs.backgroundColor}`,
      `font:${cs.fontSize}/${cs.fontWeight}`,
      `w:${Math.round(rect.width)}`,
      `h:${Math.round(rect.height)}`,
    ].join("; ");

    lines.push(`<${tag}${classes}${text}> [${styles}]`);
    count++;
  }

  return `Page: ${window.location.pathname}\nViewport: ${window.innerWidth}x${window.innerHeight}\nNodes: ${count}\n\n${lines.join("\n")}`;
}

/* ── Screenshot capture ── */
export async function captureScreenshot() {
  const canvas = await html2canvas(document.body, {
    scale: 1,
    useCORS: true,
    logging: false,
    width: Math.min(window.innerWidth, 1400),
    height: Math.min(document.body.scrollHeight, 3000),
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });
  // Return base64 without data URL prefix
  return canvas.toDataURL("image/png", 0.8).replace(/^data:image\/png;base64,/, "");
}

/* ── API call ── */
export async function runAudit() {
  const [domText, screenshot] = await Promise.all([
    scanDOM(),
    captureScreenshot().catch(() => null),
  ]);
  const { data } = await api.post("/ux-audit", { domText, screenshot });
  return data.issues || [];
}

export async function applyFix(filename, issue, solution) {
  const { data } = await api.post("/ux-fix", { filename, issue, solution });
  return data;
}

/* ── Cache helpers ── */
export function getCachedIssues(route) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    return cache[route] || null;
  } catch { return null; }
}

export function setCachedIssues(route, issues) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    cache[route] = issues;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* ignore */ }
}

export function isPageIgnored(route) {
  try {
    const ignored = JSON.parse(localStorage.getItem(IGNORE_KEY) || "[]");
    return ignored.includes(route);
  } catch { return false; }
}

export function ignorePage(route) {
  try {
    const ignored = JSON.parse(localStorage.getItem(IGNORE_KEY) || "[]");
    if (!ignored.includes(route)) ignored.push(route);
    localStorage.setItem(IGNORE_KEY, JSON.stringify(ignored));
  } catch { /* ignore */ }
}
