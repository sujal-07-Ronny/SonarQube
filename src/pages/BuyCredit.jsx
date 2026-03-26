import React, { useContext, useState, useEffect, useRef } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Send, X, Clock, Phone, MapPin, User, MessageSquare, 
  Calendar, CheckCircle2, Loader2, CreditCard, ShieldCheck, 
  ArrowRight, QrCode, Banknote, Wallet, Smartphone, ChevronDown,
  ChevronUp, ExternalLink, AlertCircle, Info, Sparkles, MessageSquareText
} from "lucide-react";

const BuyCredit = () => {
  const { user } = useContext(AppContext);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [scheduleFormData, setScheduleFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    agenda: ""
  });
  const [verificationFormData, setVerificationFormData] = useState({
    name: "",
    email: "",
    phone: "",
    transactionId: "",
    amount: "",
    screenshot: null,
    screenshotPreview: "",
    paymentMethod: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isScheduleSubmitted, setIsScheduleSubmitted] = useState(false);
  const [isVerificationSubmitted, setIsVerificationSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scheduleError, setScheduleError] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showCreditsCalculator, setShowCreditsCalculator] = useState(false);
  const [calculatorCredits, setCalculatorCredits] = useState(100);
  const [calculatorAmount, setCalculatorAmount] = useState(10);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Chatbot states
  const [chatHistory, setChatHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const verificationModalRef = useRef(null);
  const paymentMethodsRef = useRef(null);
  const chatContainerRef = useRef(null);

  const yourPhoneNumber = "919960650886";
  const salesPhoneNumber = "919960650886";
  
  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM'
  ];

  const paymentMethods = [
    { id: 'upi', name: 'UPI Payment', icon: <Smartphone size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'qr', name: 'QR Code', icon: <QrCode size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bank', name: 'Bank Transfer', icon: <Banknote size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'wallet', name: 'Digital Wallet', icon: <Wallet size={18} />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  const paymentDetails = {
    upi: {
      id: 'sujalshaha974@okaxis',
      name: 'Sujal Shaha',
      instructions: [
        '1. Open your UPI app (Google Pay, PhonePe, Paytm, etc.)',
        '2. Enter the UPI ID shown above',
        '3. Enter the exact amount from your invoice',
        '4. Add a note with your email/phone for reference',
        '5. Complete the payment'
      ]
    },
    qr: {
      image: assets.qr_code,
      instructions: [
        '1. Open your UPI or banking app',
        '2. Select "Scan QR Code"',
        '3. Scan the QR code shown here',
        '4. Enter the exact amount from your invoice',
        '5. Complete the payment'
      ]
    },
    bank: {
      accountNumber: '123456789012',
      ifsc: 'AXIS0000123',
      accountName: 'Sujal Shaha',
      bankName: 'AXIS Bank',
      instructions: [
        '1. Log in to your internet banking',
        '2. Add the above account as a beneficiary',
        '3. Transfer the exact amount from your invoice',
        '4. Include your email/phone in the reference'
      ]
    },
    wallet: {
      providers: [
        { name: 'Paytm', number: '919960650886' },
        { name: 'PhonePe', upi: '919960650886@ybl' },
        { name: 'Amazon Pay', number: '919960650886' }
      ],
      instructions: [
        '1. Open your digital wallet app',
        '2. Select "Send Money" or "Pay"',
        '3. Use the details provided for your wallet',
        '4. Enter the exact amount from your invoice',
        '5. Complete the payment'
      ]
    },
    card: {
      link: 'https://razorpay.me/@sujalshaha',
      instructions: [
        '1. Click the "Pay Now" button below',
        '2. Enter your card details',
        '3. Complete the payment',
        '4. Save the transaction ID for verification'
      ]
    }
  };

  const chatSteps = [
    {
      text: "👋 Hi there! I'm your AI assistant. How can I help you today?",
      answer: "",
      options: [
        { label: "💰 Buy Credits", nextStep: 1 },
        { label: "📅 Schedule a Call", nextStep: 2 },
        { label: "❓ General Questions", nextStep: 3 }
      ]
    },
    {
      text: "Great! You can purchase credits directly from our plans section.",
      answer: "Would you like me to show you the available plans?",
      options: [
        { label: "Yes, show me plans", action: () => setShowCreditsCalculator(true) },
        { label: "No, I have another question", nextStep: 0 }
      ]
    },
    {
      text: "I can help you schedule a call with our sales team.",
      answer: "Would you like to open the scheduling calendar now?",
      options: [
        { label: "Yes, open calendar", action: () => setShowScheduleModal(true) },
        { label: "No, I have another question", nextStep: 0 }
      ]
    },
    {
      text: "Here are answers to common questions:",
      answer: "1. Credits are valid for 1 year\n2. You can upgrade/downgrade anytime\n3. We offer volume discounts for large purchases",
      options: [
        { label: "💰 Buy Credits", nextStep: 1 },
        { label: "📅 Schedule a Call", nextStep: 2 },
        { label: "🔙 Back to Menu", nextStep: 0 }
      ]
    }
  ];

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (verificationModalRef.current && !verificationModalRef.current.contains(event.target)) {
        setShowVerificationModal(false);
      }
      if (paymentMethodsRef.current && !paymentMethodsRef.current.contains(event.target) && 
          !document.getElementById('payment-method-trigger')?.contains(event.target)) {
        setShowPaymentMethods(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check for payment success in URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      const planId = queryParams.get('plan_id');
      const amount = queryParams.get('amount');
      const transactionId = queryParams.get('transaction_id');
      
      if (planId && amount && transactionId) {
        const plan = plans.find(p => p.id === planId) || {
          id: "Custom",
          credits: parseInt(queryParams.get('credits')) || 0,
          price: parseFloat(amount),
          desc: "Custom plan"
        };
        
        setActivePlan(plan);
        setVerificationFormData(prev => ({
          ...prev,
          amount: amount,
          transactionId: transactionId,
          paymentMethod: "Razorpay"
        }));
        setShowVerificationModal(true);
        setPaymentSuccess(true);
        setPaymentStatus("Payment successful! Please verify your details below.");
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (paymentStatus === 'failed') {
      setPaymentStatus("Payment failed. Please try again or contact support.");
    }
  }, []);

  // Calculate amount based on credits
  useEffect(() => {
    if (showCreditsCalculator) {
      const calculatedAmount = Math.max(10, calculatorCredits * 0.1); // ₹0.1 per credit, minimum ₹10
      setCalculatorAmount(parseFloat(calculatedAmount.toFixed(2)));
    }
  }, [calculatorCredits, showCreditsCalculator]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        dates.push(date);
      }
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  // Initialize chat history
  useEffect(() => {
    if (showChatbot && chatHistory.length === 0) {
      resetChat();
    }
  }, [showChatbot]);

  const resetChat = () => {
    setChatHistory([chatSteps[0]]);
    setCurrentStep(0);
  };

  const closeAndResetChatbot = () => {
    setShowChatbot(false);
    setTimeout(() => {
      resetChat();
    }, 300);
  };

  const handleOptionClick = (option) => {
    const newMessage = {
      sender: "user",
      text: option.label,
    };
    setChatHistory((prev) => [...prev, newMessage]);

    if (option.nextStep !== undefined) {
      setIsTyping(true);
      setTimeout(() => {
        const botReply = {
          sender: "bot",
          text: chatSteps[option.nextStep]?.text || "",
          answer: chatSteps[option.nextStep]?.answer || "",
          options: chatSteps[option.nextStep]?.options || [],
        };
        setChatHistory((prev) => [...prev, botReply]);
        setCurrentStep(option.nextStep);
        setIsTyping(false);
      }, 800);
    }

    if (option.action) {
      option.action();
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Thanks!",
            answer: "Would you like to go back to the main menu?",
            options: [{ label: "Back to Menu", nextStep: 0 }],
          },
        ]);
      }, 500);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = {
      sender: "user",
      text: chatInput,
    };
    setChatHistory((prev) => [...prev, newMessage]);
    setChatInput("");

    setIsTyping(true);
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "Thanks for your message!",
        answer: "For detailed assistance, please use the menu options below.",
        options: chatSteps[0].options,
      };
      setChatHistory((prev) => [...prev, botReply]);
      setCurrentStep(0);
      setIsTyping(false);
    }, 1000);
  };

  // WhatsApp confirmation handler
  const handleWhatsAppConfirmation = () => {
    const phoneNumber = '917517053282';
    const message = `Payment Verification Details:
  
Name: ${verificationFormData.name}
Email: ${verificationFormData.email}
Phone: ${verificationFormData.phone}
Plan: ${activePlan?.id || 'Custom'} Plan
Amount: ₹${verificationFormData.amount}
Payment Method: ${verificationFormData.paymentMethod}
Transaction ID: ${verificationFormData.transactionId}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerificationInputChange = (e) => {
    const { name, value } = e.target;
    setVerificationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setVerificationError('File size should be less than 5MB');
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationFormData(prev => ({
          ...prev,
          screenshot: file,
          screenshotPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const initiatePayment = (plan) => {
    setActivePlan(plan);
    setVerificationFormData(prev => ({
      ...prev,
      amount: plan.price.toString()
    }));
    
    // Open Razorpay payment link with plan details
    const razorpayUrl = `https://razorpay.me/@sujalshaha?amount=${plan.price * 100}&plan_id=${plan.id}&credits=${plan.credits}`;
    window.open(razorpayUrl, '_blank');
    
    // Show verification modal after a delay (simulating payment completion)
    setTimeout(() => {
      setShowVerificationModal(true);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    const message = `📋 *New Business Inquiry* 📋

*Contact Details:*
▫️ *Name:* ${formData.name.trim()}
▫️ *Email:* ${formData.email.trim()}
${formData.company.trim() ? `▫️ *Company:* ${formData.company.trim()}\n` : ''}
📅 *Submitted on:* ${new Date().toLocaleString('en-IN', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}

📝 *Message:*
${formData.message.trim() || 'No additional message provided'}

We should schedule a call to discuss this further. Please suggest your availability.

Best regards,
${formData.name.trim()}`;

    const whatsappUrl = `https://wa.me/${yourPhoneNumber}?text=${encodeURIComponent(message)}`;
    
    const newWindow = window.open(whatsappUrl, '_blank');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }

    setIsSubmitted(true);
    setIsLoading(false);
    
    setTimeout(() => {
      setShowContactInfo(false);
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    }, 3000);
  };

  const sendWhatsAppMessage = () => {
    if (!selectedDate || !selectedTime) return;

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `Dear Sales Team,

I would like to schedule a call to discuss your services. Below are my details:

Name: ${scheduleFormData.name}
Email: ${scheduleFormData.email}
Phone: ${scheduleFormData.phone}
Company: ${scheduleFormData.company || 'Not specified'}

Preferred Call Time:
Date: ${formattedDate}
Time: ${selectedTime} (IST)

Discussion Topics:
${scheduleFormData.agenda || 'General inquiry about your services and pricing plans'}

Please confirm this appointment or suggest an alternative time if needed.

I look forward to speaking with you.

Best regards,
${scheduleFormData.name}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${salesPhoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const sendSMS = () => {
    if (!selectedDate || !selectedTime) return;

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `New Call Request:
Name: ${scheduleFormData.name}
Email: ${scheduleFormData.email}
Phone: ${scheduleFormData.phone}
Company: ${scheduleFormData.company || 'Not provided'}
Date: ${formattedDate}
Time: ${selectedTime}
Agenda: ${scheduleFormData.agenda || 'General discussion'}`;

    window.open(`sms:${salesPhoneNumber}?body=${encodeURIComponent(message)}`);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setScheduleError('Please select both date and time for your call');
      return;
    }

    if (!scheduleFormData.name || !scheduleFormData.phone) {
      setScheduleError('Please fill all required fields');
      return;
    }

    setIsScheduleLoading(true);
    setScheduleError(null);

    try {
      setIsScheduleSubmitted(true);
    } catch (err) {
      console.error('Failed to schedule call:', err);
      setScheduleError('Failed to schedule call. Please try again later.');
    } finally {
      setIsScheduleLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationFormData.name || !verificationFormData.email || !verificationFormData.phone || 
        !verificationFormData.transactionId || !verificationFormData.amount || !verificationFormData.paymentMethod) {
      setVerificationError('Please fill all required fields');
      return;
    }

    setIsVerificationLoading(true);
    setVerificationError(null);

    try {
      // Prepare the message
      const message = `💰 *Credit Purchase Verification* 💰

*Customer Details:*
▫️ *Name:* ${verificationFormData.name}
▫️ *Email:* ${verificationFormData.email}
▫️ *Phone:* ${verificationFormData.phone}

*Transaction Details:*
▫️ *Plan Purchased:* ${activePlan?.id || 'Custom'} Plan (${activePlan?.credits || 'N/A'} credits)
▫️ *Amount Paid:* ₹${verificationFormData.amount}
▫️ *Payment Method:* ${verificationFormData.paymentMethod}
▫️ *Transaction ID:* ${verificationFormData.transactionId}

📅 *Submitted on:* ${new Date().toLocaleString('en-IN', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}

Please verify this transaction and add the credits to the customer's account.`;

      // Send to WhatsApp
      const whatsappUrl = `https://wa.me/${salesPhoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Send to SMS as fallback
      const smsUrl = `sms:${salesPhoneNumber}?body=${encodeURIComponent(message)}`;

      // Try WhatsApp first
      const newWindow = window.open(whatsappUrl, '_blank');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback to SMS if WhatsApp fails
        window.location.href = smsUrl;
      }

      setIsVerificationSubmitted(true);
    } catch (err) {
      console.error('Failed to submit verification:', err);
      setVerificationError('Failed to submit verification. Please try again later.');
    } finally {
      setIsVerificationLoading(false);
    }
  };

  const selectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    setVerificationFormData(prev => ({
      ...prev,
      paymentMethod: method.name
    }));
    setShowPaymentMethods(false);
  };

  const calculateCredits = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCalculatorCredits(Math.max(100, value)); // Minimum 100 credits
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const planCardVariants = {
    hover: { 
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  const paymentMethodVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, y: -20 }
  };

  const calculatorVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { height: 0, opacity: 0 }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Flexible Credit Plans
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed">
          Discover scalable credit options tailored to your creative needs. From starter to enterprise solutions, we've got you covered.
        </p>
      </motion.div>

      {/* Payment Status Banner */}
      {paymentStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-4xl mb-8 p-4 rounded-lg ${paymentSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <div className="flex items-center gap-3">
            {paymentSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <p className={paymentSuccess ? 'text-green-800' : 'text-red-800'}>{paymentStatus}</p>
          </div>
        </motion.div>
      )}

      {/* Credits Calculator */}
      <div className="w-full max-w-2xl mb-12 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <button 
          onClick={() => setShowCreditsCalculator(!showCreditsCalculator)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-800">Need a custom plan? Calculate your credits</h3>
          </div>
          {showCreditsCalculator ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>
        
        <AnimatePresence>
          {showCreditsCalculator && (
            <motion.div
              variants={calculatorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-6 pb-6"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="credits-input" className="block text-sm font-medium text-gray-700 mb-1">
                    How many credits do you need?
                  </label>
                  <input
                    type="number"
                    id="credits-input"
                    min="100"
                    step="100"
                    value={calculatorCredits}
                    onChange={calculateCredits}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter credits needed"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Minimum: 100 credits</span>
                    <span className="text-xs text-gray-500">Increments of 100</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Credits</p>
                      <p className="font-bold text-lg">{calculatorCredits}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Cost</p>
                      <p className="font-bold text-lg">₹{calculatorAmount}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Approximately {Math.floor(calculatorCredits / 10)} AI images</p>
                </div>
                
                <button
                  onClick={() => {
                    const customPlan = {
                      id: "Custom",
                      credits: calculatorCredits,
                      price: calculatorAmount,
                      desc: `Custom plan with ${calculatorCredits} credits`
                    };
                    initiatePayment(customPlan);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Purchase Custom Plan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plans Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-8 text-left max-w-6xl"
      >
        {plans.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            variants={planCardVariants}
            className="w-full sm:w-[320px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border border-gray-100"
          >
            {/* Ribbon for popular plan */}
            {item.id === "Pro" && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-8 py-1 transform rotate-45 translate-x-8 translate-y-4 w-40 text-center">
                Most Popular
              </div>
            )}

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">{item.id} Plan</h3>
                {item.id === "Enterprise" && (
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    Customizable
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 rounded-full">
                  <img src={assets.logo_icon} alt="Plan Icon" className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-indigo-600 font-semibold">{item.credits} Credits</p>
                  <p className="text-xs text-gray-500">≈ {Math.floor(item.credits / 10)} AI images</p>
                </div>
              </div>

              <p className="text-gray-600 min-h-[60px]">{item.desc}</p>

              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-gray-800">₹{item.price}</span>
                <span className="text-gray-500">/ {item.credits} credits</span>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => initiatePayment(item)}
                  className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
                    item.id === "Pro" 
                      ? "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600" 
                      : "bg-gray-800 hover:bg-gray-900"
                  } flex items-center justify-center gap-2`}
                >
                  <CreditCard size={18} />
                  Purchase Now
                </motion.button>

                <button 
                  onClick={() => {
                    setActivePlan(item);
                    setShowVerificationModal(true);
                  }}
                  className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Already Purchased?
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Contact Sales Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 max-w-3xl mx-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Need Enterprise Solutions?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            For organizations requiring custom plans, volume discounts, or dedicated support, our sales team can craft a solution tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowContactInfo(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Contact Sales Team
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowScheduleModal(true)}
              className="bg-white text-gray-800 px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Calendar size={18} />
              Schedule a Call
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => {
          setShowChatbot(!showChatbot);
          if (!showChatbot) resetChat();
        }}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <MessageSquare size={28} />
      </button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <button onClick={closeAndResetChatbot} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatContainerRef}
              className="p-3 h-64 md:h-80 overflow-y-auto bg-gray-50 space-y-3"
            >
              <AnimatePresence>
                {chatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-xs ${
                      msg.sender === "user"
                        ? "ml-auto bg-indigo-600 text-white rounded-2xl p-3"
                        : "bg-white border border-gray-200 rounded-2xl p-3"
                    }`}
                  >
                    {msg.text && <p>{msg.text}</p>}
                    {msg.answer && <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{msg.answer}</p>}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="bg-white border border-gray-200 rounded-2xl p-3 w-max">
                  <TypingIndicator />
                </div>
              )}
            </div>

            {/* Options Area */}
            {chatSteps[currentStep]?.options && (
              <div className="p-2 bg-white border-t border-gray-200">
                <div className="grid grid-cols-1 gap-2">
                  {chatSteps[currentStep].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick(option)}
                      className="bg-indigo-100 text-indigo-800 py-2 px-4 rounded-md hover:bg-indigo-200 text-sm font-medium transition-colors text-left"
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleChatSubmit} className="p-2 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

     {/* Payment Verification Modal */}
<AnimatePresence>
  {showVerificationModal && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
    >
      <motion.div
        ref={verificationModalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="relative">
          <button 
            onClick={() => {
              setShowVerificationModal(false);
              setVerificationFormData({
                name: "",
                email: "",
                phone: "",
                transactionId: "",
                amount: "",
                paymentMethod: ""
              });
              setIsVerificationSubmitted(false);
            }}
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-white transition-all shadow-sm"
            disabled={isVerificationLoading}
          >
            <X size={20} />
          </button>

          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
            {isVerificationSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
                  <p className="text-gray-600 mb-4">
                    Your payment verification has been submitted successfully.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">Your Purchase Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">Plan:</div>
                      <div className="font-medium">{activePlan?.id || 'Custom'} Plan</div>
                      <div className="text-gray-600">Credits:</div>
                      <div className="font-medium">{activePlan?.credits || 'N/A'}</div>
                      <div className="text-gray-600">Amount Paid:</div>
                      <div className="font-medium">₹{verificationFormData.amount || 'N/A'}</div>
                      <div className="text-gray-600">Payment Method:</div>
                      <div className="font-medium">{verificationFormData.paymentMethod || 'N/A'}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Your credits will be added to your account within 2-3 hours. We appreciate your patience!
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowVerificationModal(false)}
                      className="flex-1 bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleWhatsAppConfirmation}
                      className="flex-1 bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquareText size={18} />
                      WhatsApp Confirmation
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification</h2>
                <p className="text-gray-600 mb-6">
                  Please provide your payment details to verify your purchase and add credits to your account.
                </p>

                {activePlan && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-indigo-800 mb-2">Plan Selected</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600">Plan:</div>
                      <div className="font-medium">{activePlan.id} Plan</div>
                      <div className="text-gray-600">Credits:</div>
                      <div className="font-medium">{activePlan.credits}</div>
                      <div className="text-gray-600">Amount:</div>
                      <div className="font-medium">₹{activePlan.price}</div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  {verificationError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>{verificationError}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="verification-name" className="text-sm font-medium text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        id="verification-name"
                        name="name"
                        value={verificationFormData.name}
                        onChange={handleVerificationInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your Name"
                        disabled={isVerificationLoading}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="verification-email" className="text-sm font-medium text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        id="verification-email"
                        name="email"
                        value={verificationFormData.email}
                        onChange={handleVerificationInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="you@company.com"
                        disabled={isVerificationLoading}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="verification-phone" className="text-sm font-medium text-gray-700">Phone Number *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">+91</span>
                        </div>
                        <input
                          type="tel"
                          id="verification-phone"
                          name="phone"
                          value={verificationFormData.phone}
                          onChange={handleVerificationInputChange}
                          required
                          className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="1234567890"
                          disabled={isVerificationLoading}
                          pattern="[0-9]{10}"
                          maxLength="10"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="verification-amount" className="text-sm font-medium text-gray-700">Amount Paid (₹) *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          id="verification-amount"
                          name="amount"
                          value={verificationFormData.amount}
                          onChange={handleVerificationInputChange}
                          required
                          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="100"
                          disabled={isVerificationLoading || !!activePlan}
                          {...(activePlan ? { value: activePlan.price } : {})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="verification-transactionId" className="text-sm font-medium text-gray-700">Transaction ID *</label>
                    <input
                      type="text"
                      id="verification-transactionId"
                      name="transactionId"
                      value={verificationFormData.transactionId}
                      onChange={handleVerificationInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="TXN123456789"
                      disabled={isVerificationLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the transaction ID from your payment receipt</p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="verification-paymentMethod" className="text-sm font-medium text-gray-700">Payment Method *</label>
                    <select
                      id="verification-paymentMethod"
                      name="paymentMethod"
                      value={verificationFormData.paymentMethod}
                      onChange={handleVerificationInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isVerificationLoading}
                    >
                      <option value="">Select Payment Method</option>
                      <option value="UPI">UPI (Google Pay, PhonePe, etc.)</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-1">Important Notes</h4>
                          <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                            <li>Please double-check all information before submitting</li>
                            <li>Credits will be added within 2-3 hours of verification</li>
                            <li>For any issues, contact support@example.com</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: isVerificationLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isVerificationLoading ? 1 : 0.98 }}
                      type="submit"
                      disabled={isVerificationLoading || !verificationFormData.name || !verificationFormData.email || 
                               !verificationFormData.phone || !verificationFormData.transactionId || 
                               !verificationFormData.amount || !verificationFormData.paymentMethod}
                      className={`w-full ${
                        isVerificationLoading || !verificationFormData.name || !verificationFormData.email || 
                        !verificationFormData.phone || !verificationFormData.transactionId || 
                        !verificationFormData.amount || !verificationFormData.paymentMethod
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      } text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
                    >
                      {isVerificationLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          Verify Payment
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      {/* Schedule Call Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowScheduleModal(false);
                    setScheduleFormData({
                      name: "",
                      email: "",
                      company: "",
                      phone: "",
                      agenda: "",
                    });
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setIsScheduleSubmitted(false);
                  }}
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-white transition-all shadow-sm"
                  disabled={isScheduleLoading}
                >
                  <X size={20} />
                </button>

                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule a Call</h2>
                  <p className="text-gray-600 mb-6">Book a time that works for you and we'll call you at the scheduled time.</p>
                  
                  {isScheduleSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 text-green-700 p-4 rounded-lg text-center"
                    >
                      <p className="font-medium">Your call has been scheduled!</p>
                      <p className="mb-4">
                        {scheduleFormData.name}, we'll call you at {selectedTime} on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={sendWhatsAppMessage}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare size={18} />
                          Continue on WhatsApp
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={sendSMS}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Phone size={16} />
                          Send via SMS
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowScheduleModal(false)}
                          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-all"
                        >
                          Close
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleScheduleSubmit} className="space-y-6">
                      {scheduleError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                          {scheduleError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label htmlFor="schedule-name" className="text-sm font-medium text-gray-700">Full Name *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="schedule-name"
                              name="name"
                              value={scheduleFormData.name}
                              onChange={handleScheduleInputChange}
                              required
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Your Name"
                              disabled={isScheduleLoading}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="schedule-email" className="text-sm font-medium text-gray-700">Email Address *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              id="schedule-email"
                              name="email"
                              value={scheduleFormData.email}
                              onChange={handleScheduleInputChange}
                              required
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="you@company.com"
                              disabled={isScheduleLoading}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="schedule-company" className="text-sm font-medium text-gray-700">Company (Optional)</label>
                          <input
                            type="text"
                            id="schedule-company"
                            name="company"
                            value={scheduleFormData.company}
                            onChange={handleScheduleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your Company"
                            disabled={isScheduleLoading}
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="schedule-phone" className="text-sm font-medium text-gray-700">Phone Number *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              id="schedule-phone"
                              name="phone"
                              value={scheduleFormData.phone}
                              onChange={handleScheduleInputChange}
                              required
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="+91 1234567890"
                              disabled={isScheduleLoading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="schedule-agenda" className="text-sm font-medium text-gray-700">Agenda (Optional)</label>
                        <textarea
                          id="schedule-agenda"
                          name="agenda"
                          value={scheduleFormData.agenda}
                          onChange={handleScheduleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="What would you like to discuss?"
                          disabled={isScheduleLoading}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-800">Select Date and Time</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                          {availableDates.map((date, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setSelectedDate(date)}
                              className={`p-2 rounded-lg border text-center text-sm ${
                                selectedDate && date.toDateString() === selectedDate.toDateString()
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                              <div className="font-medium">
                                {date.toLocaleDateString('en-US', { day: 'numeric' })}
                              </div>
                            </button>
                          ))}
                        </div>

                        {selectedDate && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {availableTimes.map((time, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={`p-2 rounded-lg border text-center text-sm ${
                                  selectedTime === time
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: isScheduleLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isScheduleLoading ? 1 : 0.98 }}
                        type="submit"
                        disabled={isScheduleLoading || !selectedDate || !selectedTime || !scheduleFormData.name || !scheduleFormData.phone}
                        className={`w-full ${
                          isScheduleLoading || !selectedDate || !selectedTime || !scheduleFormData.name || !scheduleFormData.phone
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
                      >
                        {isScheduleLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Scheduling...
                          </>
                        ) : (
                          <>
                            <Calendar size={18} />
                            Schedule Call
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex space-x-1 items-center">
    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
  </div>
);

export default BuyCredit;