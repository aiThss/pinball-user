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
          display: inline-block;
          max-width: calc(100vw - 24px);
          padding-block: 3px;
          background: var(--footer-email-text-fill);
          background-clip: text;
          color: var(--footer-email-color);
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: clamp(11px, 2.8vw, 13px);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.3;
          text-decoration: none;
          text-wrap: nowrap;
          text-shadow: var(--footer-email-text-shadow);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-tap-highlight-color: transparent;
          transition:
            text-shadow var(--user-transition),
            transform var(--user-transition);
        }

        body[data-pinball-user-theme="light"] .footer-email {
          --footer-email-color: #111216;
          --footer-email-text-shadow:
            0 0 1px rgba(255, 255, 255, 0.92),
            0 1px 1px rgba(15, 17, 22, 0.16);
          --footer-email-hover-shadow:
            0 0 2px rgba(255, 255, 255, 0.95),
            0 1px 2px rgba(15, 17, 22, 0.22);
          background: none;
          -webkit-text-fill-color: #111216;
        }

        body[data-pinball-user-theme="dark"] .footer-email {
          --footer-email-color: #ffffff;
          --footer-email-text-fill: linear-gradient(180deg, #ffffff 0%, #f7f8fb 50%, #c8ccd5 100%);
          --footer-email-text-shadow:
            0 0 2px rgba(255, 255, 255, 0.9),
            0 0 9px rgba(255, 255, 255, 0.48),
            0 0 20px rgba(214, 223, 255, 0.24);
          --footer-email-hover-shadow:
            0 0 3px rgba(255, 255, 255, 0.95),
            0 0 12px rgba(255, 255, 255, 0.62),
            0 0 24px rgba(214, 223, 255, 0.34);
        }

        body[data-pinball-user-theme] .footer-email:hover {
          text-shadow: var(--footer-email-hover-shadow);
          transform: translateY(-1px);
        }

        body[data-pinball-user-theme] .footer-email:active {
          transform: scale(0.98);
        }

        body[data-pinball-user-theme] .footer-email:focus-visible {
          outline: 2px solid var(--footer-email-color);
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
