import { ChevronDown } from "lucide-react";

export default function SiteFooter({ className = "" }: { className?: string }) {
  const footerClassName = ["footer", "site-footer", className].filter(Boolean).join(" ");

  return (
    <footer className={footerClassName}>
      <div className="footer-brand">© 2026 • Made by aiThs</div>

      <div className="footer-contact-label">Contact for work</div>
      <ChevronDown className="footer-contact-arrow" aria-hidden="true" />

      <a
        className="footer-email"
        href="mailto:danhthai4560@gmail.com"
        aria-label="Gửi email công việc tới danhthai4560@gmail.com"
      >
        danhthai4560@gmail.com
      </a>
    </footer>
  );
}
