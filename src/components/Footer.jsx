import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
      animate={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
      className="fixed inset-0 z-[9999] backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white/90 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openGmail = (email) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  };

  const navigateToHeadquarters = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=16.93883862462309,74.40837081269919`,
          "_blank"
        );
      },
      () => {
        window.open(
          "https://www.google.com/maps/dir/?api=1&destination=16.93883862462309,74.40837081269919",
          "_blank"
        );
      }
    );
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed with email:", email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const downloadResource = (type) => {
    console.log(`Downloading ${type}`);
    alert(`Downloading ${type} file...`);
  };

  const footerInfo = {
    about: {
      title: "About UNSS Tech",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Founded in 2023, UNSS Tech is a pioneering force in AI-powered image generation technology. 
            We are committed to democratizing visual content creation by developing intuitive, powerful AI tools.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Our Mission</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Empower creators with cutting-edge AI technologies</li>
              <li>Make advanced image generation accessible</li>
              <li>Maintain the highest ethical standards in AI development</li>
            </ul>
          </div>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-4">
          <section className="mb-4">
            <h3 className="font-semibold text-lg text-blue-800 mb-2">Data Protection</h3>
            <p className="text-gray-700 leading-relaxed">
              We prioritize your privacy by collecting only essential information required to provide our services. 
              Our commitment is to transparency and minimal data collection.
            </p>
          </section>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 className="font-medium text-green-800 mb-2">🔒 Privacy Guarantees</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>End-to-end data encryption</li>
              <li>No unauthorized data sharing</li>
              <li>Regular privacy audits</li>
              <li>User data control options</li>
            </ul>
          </div>
        </div>
      ),
    },
    terms: {
      title: "Terms of Service",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">
            By using our services, you agree to maintain ethical and responsible use of our AI technologies.
          </p>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h4 className="font-medium text-red-800 mb-2">⚠️ Key Usage Guidelines</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Respect intellectual property rights</li>
              <li>No hate speech or discriminatory content</li>
              <li>No illegal or harmful imagery</li>
              <li>Comply with our content guidelines</li>
            </ul>
          </div>
        </div>
      ),
    },
    refund: {
      title: "Refund & Cancellation Policy",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            At UNSS Tech, customer satisfaction is our top priority. We offer a transparent refund and cancellation policy for all purchases.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h4 className="font-semibold text-yellow-800 mb-2">📌 Policy Details</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Refunds available within 7 days of purchase for eligible products</li>
              <li>Cancellations must be requested via email with order details</li>
              <li>Refunds processed within 5–10 business days</li>
              <li>Non-refundable items include custom and one-time-use services</li>
            </ul>
          </div>
        </div>
      ),
    },
    faq: {
      title: "FAQs / Help Center",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-blue-800 mb-2">🧠 Frequently Asked Questions</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Q:</strong> How do I generate an image?<br />
                <span className="ml-4">A: Simply input your prompt and click "Generate." Our AI will process and create the image in seconds.</span>
              </li>
              <li>
                <strong>Q:</strong> Is there a free trial available?<br />
                <span className="ml-4">A: Yes! We offer a limited free plan to explore basic features.</span>
              </li>
              <li>
                <strong>Q:</strong> How do I report inappropriate content?<br />
                <span className="ml-4">A: Please email us at <span className="text-blue-500 cursor-pointer" onClick={() => openGmail("sujalshaha974@gmail.com")}>sujalshaha974@gmail.com</span> with a screenshot or description.</span>
              </li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">📚 Resources</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => downloadResource('User Guide')}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm hover:bg-purple-200 transition"
              >
                User Guide
              </button>
              <button 
                onClick={() => downloadResource('API Docs')}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm hover:bg-purple-200 transition"
              >
                API Documentation
              </button>
              <button 
                onClick={() => downloadResource('Tutorials')}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm hover:bg-purple-200 transition"
              >
                Video Tutorials
              </button>
            </div>
          </div>
        </div>
      ),
    },
    contact: {
      title: "Contact Us",
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">📍 Headquarters</h3>
              <p className="text-gray-700">
                101 Gandhinagar Ashta - 416301<br />
                Maharashtra, India
              </p>
              <button 
                onClick={navigateToHeadquarters}
                className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Get Directions
              </button>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-800 mb-2">📞 Support</h3>
              <p className="text-gray-700">
                +91 7517053282<br />
                Monday-Friday: 9am-5pm IST
              </p>
              <p className="mt-2 text-sm text-gray-600">Response within 24 hours guaranteed</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-4">
            <h3 className="font-semibold text-purple-800 mb-2">📧 Email Contacts</h3>
            <div className="space-y-2">
              <p>General: 
                <span 
                  className="text-blue-500 hover:underline cursor-pointer ml-2"
                  onClick={() => openGmail("sujalshaha974@gmail.com")}
                >
                  sujalshaha974@gmail.com
                </span>
              </p>
              <p>Support: 
                <span 
                  className="text-blue-500 hover:underline cursor-pointer ml-2"
                  onClick={() => openGmail("sujalshaha774@gmail.com")}
                >
                  sujalshaha774@gmail.com
                </span>
              </p>
            </div>
          </div>
        </div>
      ),
    },
  };

  const socialLinks = [
    { name: "Twitter", icon: "twitter", url: "https://twitter.com/unss_tech" },
    { name: "Facebook", icon: "facebook", url: "https://facebook.com/unss_tech" },
    { name: "Instagram", icon: "instagram", url: "https://instagram.com/unss_tech" },
    { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com/company/unss-tech" },
  ];

  const renderSocialIcon = (icon) => {
    switch (icon) {
      case "twitter":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        );
      case "facebook":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        );
      case "linkedin":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <footer className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 mt-20 border-t border-gray-100">
        <div className="container mx-auto max-w-screen-lg px-6">
          <div className="flex flex-wrap items-center justify-between gap-8 mb-8">
            <div className="transition-all duration-300 hover:scale-105">
              <img src={assets.logo} alt="UNSS Tech Logo" width={180} className="drop-shadow-sm" />
            </div>
            
            {/* Newsletter Section */}
            <div className="flex-1 min-w-[250px] max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  Subscribe
                </button>
              </form>
              {isSubscribed && (
                <p className="mt-2 text-sm text-green-600">Thank you for subscribing!</p>
              )}
              
              {/* Social Links */}
              <div className="flex gap-4 mt-4">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label={social.name}
                  >
                    {renderSocialIcon(social.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600 text-center">
              {Object.keys(footerInfo).map((key) => (
                <button 
                  key={key}
                  onClick={() => setActiveModal(key)} 
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  {footerInfo[key].title}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              &copy; {new Date().getFullYear()} <span className="text-blue-600 font-medium">UNSS Tech</span> | All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {activeModal && (
          <Modal 
            isOpen={!!activeModal} 
            onClose={closeModal} 
            title={footerInfo[activeModal].title}
          >
            {footerInfo[activeModal].content}
          </Modal>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
};

export default Footer;