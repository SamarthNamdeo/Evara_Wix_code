import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-footerbackground mt-auto">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="font-heading text-2xl text-primary-foreground mb-4">
              EVARA
            </h3>
            <p className="font-paragraph text-base text-primary-foreground/80 leading-relaxed">
              Your complete wedding planning companion, bringing elegance and organization to your special day.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg text-primary-foreground mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                to="/checklist"
                className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Checklist
              </Link>
              <Link
                to="/guests"
                className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Guest List
              </Link>
              <Link
                to="/vendors"
                className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Vendors
              </Link>
              <Link
                to="/calendar"
                className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Calendar
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-heading text-lg text-primary-foreground mb-4">
              Get Help
            </h4>
            <Link
              to="/ai-assistant"
              className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
            >
              AI Assistant
            </Link>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="font-paragraph text-sm text-primary-foreground/60 text-center">
            © {currentYear} Evara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
