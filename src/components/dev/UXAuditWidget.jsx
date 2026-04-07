import { useState, useEffect, useCallback } from "react";
import UXAuditPanel from "./UXAuditPanel";
import {
  runAudit, applyFix, getCachedIssues, setCachedIssues,
  isPageIgnored, ignorePage,
} from "./uxAuditService";
import "../../styles/ux-audit.css";

function getRoute() {
  return window.location.pathname + window.location.hash;
}

export default function UXAuditWidget() {
  const [open, setOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [ignored, setIgnored] = useState(false);
  const route = getRoute();

  // Check if page is ignored
  useEffect(() => {
    setIgnored(isPageIgnored(route));
  }, [route]);

  // Load cache when panel opens
  useEffect(() => {
    if (open && issues.length === 0 && !scanning) {
      const cached = getCachedIssues(route);
      if (cached) setIssues(cached);
    }
  }, [open, route]); // eslint-disable-line react-hooks/exhaustive-deps

  const doScan = useCallback(async () => {
    setScanning(true);
    setIssues([]);
    try {
      const result = await runAudit();
      setIssues(result);
      setCachedIssues(route, result);
    } catch (err) {
      console.error("UX audit failed:", err);
      setIssues([{
        severity: "red",
        title: "Audit Failed",
        description: err.message || "Could not reach audit API",
        suggestion: "Check that the backend is running and /api/ux-audit is available",
      }]);
    } finally {
      setScanning(false);
    }
  }, [route]);

  const handleClick = () => {
    if (!open) {
      setOpen(true);
      // Auto-scan if no cached data
      if (!getCachedIssues(route)) doScan();
    } else {
      setOpen(false);
    }
  };

  const handleApplyFix = async (issue) => {
    try {
      const result = await applyFix(issue.file_hint, issue.title, issue.suggestion);
      if (result.success) window.location.reload();
    } catch (err) {
      alert("Fix failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDismiss = (issue) => {
    const next = issues.filter((i) => i.title !== issue.title);
    setIssues(next);
    setCachedIssues(route, next);
  };

  const handleIgnore = () => {
    ignorePage(route);
    setIgnored(true);
    setOpen(false);
  };

  // Don't render if page is ignored
  if (ignored) return null;

  return (
    <>
      <button
        type="button"
        className={`uxa-fab${scanning ? " uxa-fab-scanning" : ""}`}
        onClick={handleClick}
        title="UX Audit"
      >
        {scanning ? (
          <span className="uxa-fab-spinner" />
        ) : (
          <span className="uxa-fab-icon">UX</span>
        )}
      </button>

      {open && (
        <UXAuditPanel
          issues={issues}
          onApplyFix={handleApplyFix}
          onDismiss={handleDismiss}
          onRescan={doScan}
          onIgnore={handleIgnore}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
