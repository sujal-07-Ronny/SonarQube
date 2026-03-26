import emailjs from '@emailjs/browser';

export const initEmailJS = () => {
  if (!process.env.REACT_APP_EMAILJS_PUBLIC_KEY) {
    console.error('EmailJS Public Key is not set in environment variables');
    return false;
  }
  
  try {
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    return true;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};