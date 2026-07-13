import { ChevronDown } from "lucide-react";

export default function SiteFooter({ className = "" }: { className?: string }) {
  const footerClassName = ["footer", "site-footer", className].filter(Boolean).join(" ");

  return (
    <footer className={footerClassName}>
      <div className="footer-brand">© 2026 • Made by aiThs</div>
      <a
        className="footer-contact"
        href="mailto:danhthai4560@gmail.com"
        aria-label="Contact for work qua email danhthai4560@gmail.com"
      >
        <span>Contact for work</span>
        <ChevronDown className="footer-contact-arrow" aria-hidden="true" />
      </a>
    </footer>
  );
}
