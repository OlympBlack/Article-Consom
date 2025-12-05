import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">
            Développé par <span className="developer-name"><a href='http://juleschrist.lavoixdabouloussi.org/'>GBASSI Jules-christ</a></span>
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} ArticleConsom. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;