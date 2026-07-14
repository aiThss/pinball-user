import { ChevronDown } from "lucide-react";

export default function SiteFooter({ className = "" }: { className?: string }) {
  const footerClassName = ["footer", "site-footer", className].filter(Boolean).join(" ");

  return (
    <footer className={footerClassName}>
      <div className="footer-brand">
        <span>© 2026 • Made by</span>
        <span className="footer-signature">aiThs</span>
      </div>

      <div className="footer-contact-label">Contact for work</div>
      <ChevronDown className="footer-contact-arrow" aria-hidden="true" />

      <a
        className="footer-email"
        href="mailto:danhthai4560@gmail.com"
        aria-label="Gửi email công việc tới danhthai4560@gmail.com"
      >
        danhthai4560@gmail.com
      </a>

      <style>{`
        body[data-pinball-user-theme] .footer-contact-label {
          margin-top: 5px;
          color: var(--user-text-secondary);
          font-size: 12px;
          font-weight: 650;
          line-height: 1.3;
        }

        body[data-pinball-user-theme] .site-footer .footer-contact-arrow {
          display: block;
          margin-block: -1px;
          color: var(--user-text-muted);
        }

        body[data-pinball-user-theme] .footer-email {
          display: inline-flex;
          max-width: calc(100vw - 24px);
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border: 1px solid var(--footer-email-border);
          border-radius: 999px;
          background: var(--footer-email-background);
          box-shadow: var(--footer-email-shadow);
          color: var(--footer-email-text);
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: clamp(10px, 2.8vw, 12px);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.3;
          text-decoration: none;
          text-wrap: nowrap;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          backdrop-filter: blur(12px) saturate(125%);
          -webkit-backdrop-filter: blur(12px) saturate(125%);
          -webkit-tap-highlight-color: transparent;
          transition:
            background var(--user-transition),
            border-color var(--user-transition),
            box-shadow var(--user-transition),
            transform var(--user-transition);
        }

        body[data-pinball-user-theme="light"] .footer-email {
          --footer-email-text: #ffffff;
          --footer-email-border: rgba(255, 255, 255, 0.34);
          --footer-email-background: linear-gradient(135deg, rgba(10, 11, 14, 0.94), rgba(37, 39, 45, 0.84));
          --footer-email-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            0 9px 22px rgba(13, 15, 20, 0.2);
        }

        body[data-pinball-user-theme="dark"] .footer-email {
          --footer-email-text: #16171a;
          --footer-email-border: rgba(255, 255, 255, 0.72);
          --footer-email-background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(226, 228, 233, 0.88));
          --footer-email-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.92),
            0 9px 22px rgba(0, 0, 0, 0.28);
        }

        body[data-pinball-user-theme] .footer-email:hover {
          border-color: var(--footer-email-text);
          box-shadow:
            var(--footer-email-shadow),
            0 0 0 3px color-mix(in srgb, var(--footer-email-text) 9%, transparent);
          transform: translateY(-1px);
        }

        body[data-pinball-user-theme] .footer-email:active {
          transform: scale(0.98);
        }

        body[data-pinball-user-theme] .footer-email:focus-visible {
          outline: 2px solid var(--footer-email-text);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          body[data-pinball-user-theme] .footer-email {
            transition: none !important;
          }
        }
      `}</style>
    </footer>
  );
}
