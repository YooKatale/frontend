"use client";

import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@slices/authSlice";
import { useRegisterVendorMutation } from "@slices/vendorSlice";
import { useSubmitDeliveryFormMutation } from "@slices/deliveryFormSlice";
import styles from "./partner.module.css";

const Partner = () => {
  const [activeTab, setActiveTab] = useState(0);
  const chakraToast = useToast();
  const router = useRouter();
  const { userInfo } = useAuth();

  const [vendorFormData, setVendorFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    category: '',
    vegan: false,
    terms: false,
  });
  const [vendorFormStep, setVendorFormStep] = useState(1);
  const [isVendorLoading, setIsVendorLoading] = useState(false);
  const [vendorErrors, setVendorErrors] = useState({});
  const [vendorSubmitted, setVendorSubmitted] = useState(false);
  const [registerVendor] = useRegisterVendorMutation();

  const [deliveryFormData, setDeliveryFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    location: '',
    businessName: '',
    businessAddress: '',
    businessHours: '',
    transport: 'bike',
    numberPlate: '',
    vegan: false,
    terms: false,
  });
  const [isDeliveryLoading, setIsDeliveryLoading] = useState(false);
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [deliverySubmitted, setDeliverySubmitted] = useState(false);
  const [submitDeliveryForm] = useSubmitDeliveryFormMutation();

  const [activeVendorQuestion, setActiveVendorQuestion] = useState(null);
  const [activeDeliveryQuestion, setActiveDeliveryQuestion] = useState(null);

  const validateVendorForm = () => {
    const newErrors = {};
    if (!vendorFormData.name.trim()) newErrors.name = 'Store name is required';
    if (!vendorFormData.address.trim()) newErrors.address = 'Address is required';
    if (!vendorFormData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]+$/.test(vendorFormData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!vendorFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorFormData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!vendorFormData.category) newErrors.category = 'Please select a category';
    setVendorErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVendorSubmit = async (event) => {
    event.preventDefault();
    if (!validateVendorForm()) {
      chakraToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!vendorFormData.terms) {
      chakraToast({
        title: 'Notice',
        description: 'Please agree to the terms and conditions to proceed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsVendorLoading(true);
    try {
      const data = {
        name: vendorFormData.name,
        address: vendorFormData.address,
        email: vendorFormData.email,
        phone: vendorFormData.phone,
        category: vendorFormData.category,
        vegan: vendorFormData.vegan,
        status: 'Unverified'
      };
      const response = await registerVendor(data).unwrap();
      if (response.status === "Success") {
        setVendorSubmitted(true);
        chakraToast({
          title: 'Application Submitted! 🎉',
          description: 'Your vendor application has been received. We\'ll review it within 24 hours.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        setTimeout(() => {
          setVendorFormData({
            name: '',
            address: '',
            phone: '',
            email: '',
            category: '',
            vegan: false,
            terms: false,
          });
          setVendorFormStep(1);
          setIsVendorLoading(false);
          // Redirect to seller stores page if user is logged in
          if (userInfo) {
            setTimeout(() => {
              router.push('/sell/stores');
            }, 2000);
          }
        }, 1500);
      }
    } catch (error) {
      setIsVendorLoading(false);
      chakraToast({
        title: 'Error',
        description: error.data?.message || error.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleVendorChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    if (vendorErrors[name]) {
      setVendorErrors(prev => ({ ...prev, [name]: '' }));
    }
    setVendorFormData({ ...vendorFormData, [name]: newValue });
  };

  const validateDeliveryForm = () => {
    const newErrors = {};
    if (!deliveryFormData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!deliveryFormData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]+$/.test(deliveryFormData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!deliveryFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryFormData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!deliveryFormData.location.trim()) newErrors.location = 'Location is required';
    if (!deliveryFormData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!deliveryFormData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!deliveryFormData.businessHours.trim()) newErrors.businessHours = 'Business hours are required';
    if (deliveryFormData.transport !== 'bike' && !deliveryFormData.numberPlate.trim()) {
      newErrors.numberPlate = 'Number plate is required';
    }
    setDeliveryErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeliverySubmit = async (event) => {
    event.preventDefault();
    if (!validateDeliveryForm()) {
      chakraToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!deliveryFormData.terms) {
      chakraToast({
        title: 'Notice',
        description: 'Please agree to the terms and conditions to proceed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsDeliveryLoading(true);
    try {
      const payload = {
        fullname: deliveryFormData.fullname,
        phone: deliveryFormData.phone,
        email: deliveryFormData.email,
        location: deliveryFormData.location,
        businessName: deliveryFormData.businessName,
        businessAddress: deliveryFormData.businessAddress,
        businessHours: deliveryFormData.businessHours,
        transport: deliveryFormData.transport,
        vegan: deliveryFormData.vegan,
      };
      if (deliveryFormData.transport !== 'bike') {
        payload.numberPlate = deliveryFormData.numberPlate;
      }
      await submitDeliveryForm(payload).unwrap();
      setDeliverySubmitted(true);
      chakraToast({
        title: 'Application Submitted! 🎉',
        description: 'Your delivery application has been received. We\'ll review it within 24 hours.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setTimeout(() => {
        setDeliveryFormData({
          fullname: '',
          phone: '',
          email: '',
          location: '',
          businessName: '',
          businessAddress: '',
          businessHours: '',
          transport: 'bike',
          numberPlate: '',
          vegan: false,
          terms: false,
        });
        setIsDeliveryLoading(false);
      }, 1500);
    } catch (error) {
      setIsDeliveryLoading(false);
      chakraToast({
        title: 'Error',
        description: error.data?.message || error.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleDeliveryChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    if (deliveryErrors[name]) {
      setDeliveryErrors(prev => ({ ...prev, [name]: '' }));
    }
    setDeliveryFormData({ ...deliveryFormData, [name]: newValue });
  };

  const vendorFaqItems = [
    {
      question: 'How do I register my business on YooKatale?',
      answer: 'Fill out the vendor registration form on this page with your store details including name, address, contact information, and business category. Our team will review and approve your application within 24 hours.',
    },
    {
      question: 'How long does the registration process take?',
      answer: 'After submitting the form, your account will be reviewed and approved within 24 hours. You\'ll receive an email notification once your application is approved.',
    },
    {
      question: 'How do I collect my money on YooKatale?',
      answer: 'Payments are processed weekly through bank transfer. You\'ll receive payments every Monday for the previous week\'s sales. All payment details are managed through your vendor dashboard.',
    },
    {
      question: 'What categories can I register under?',
      answer: 'We support various categories including Fresh Produce, Groceries, Restaurants, Bakery, Butchery, Dairy Products, Beverages, Health Foods, Kitchen Supplies, Food Delivery, Catering Services, Organic Foods, and many more.',
    },
    {
      question: 'Is there a registration fee?',
      answer: 'No, registering as a vendor on YooKatale is completely free! There are no hidden fees or charges. You only pay a small commission on successful sales.',
    },
    {
      question: 'Can I update my store information after registration?',
      answer: 'Yes, you can update your store information, business hours, and other details anytime through your vendor dashboard after your account is approved.',
    },
  ];

  const deliveryFaqItems = [
    {
      question: 'How do I register to deliver with YooKatale?',
      answer: 'Fill out the delivery form on this page with your personal details, business information, and preferred transport method. Our team will review your application and get back to you within 24 hours.',
    },
    {
      question: 'How long does registration take?',
      answer: 'Within 24 hours your account will be reviewed and approved to start delivering. You\'ll receive an email notification with your login credentials once approved.',
    },
    {
      question: 'How do I get my earnings?',
      answer: 'Delivery payments are made weekly via bank transfer every Monday. You can track your earnings in real-time through the delivery app dashboard.',
    },
    {
      question: 'Why should I deliver for YooKatale?',
      answer: 'Earn your way with flexible schedules, competitive rates, and the freedom to work when it suits you. Get access to delivery vehicles (van, motorcycle, bicycle, or tricycle) if needed, and enjoy weekly reliable payments.',
    },
    {
      question: 'What transport options are available?',
      answer: 'You can deliver using a bike, motorcycle, or vehicle. If you choose vehicle or motorcycle, you\'ll need to provide your number plate. We also offer vehicle assistance programs for qualified delivery partners.',
    },
    {
      question: 'Can I set my own schedule?',
      answer: 'Yes! One of the biggest advantages of delivering with YooKatale is setting your own schedule. Work when it suits you and connect to the app whenever you\'re ready to accept deliveries.',
    },
  ];

  const categories = [
    'Fresh Produce', 'Groceries', 'Restaurant', 'Bakery', 'Butchery',
    'Dairy Products', 'Beverages', 'Health Foods', 'Kitchen Supplies',
    'Food Delivery', 'Catering Services', 'Organic Foods', 'Farm Produce',
    'Seafood', 'Spices & Herbs', 'International Cuisine', 'Street Food',
    'Coffee Shop', 'Juice Bar', 'Supermarket', 'Livestock farmer',
    'Fisherman', 'Carbohydrates', 'Protein', 'Fats & Oils', 'Vitamins',
    'Gas', 'Knife Sharpening', 'Breakfast', 'Dairy', 'Vegetables',
    'Juice', 'Meals', 'Root tubers', 'Market', 'Shop', 'Dairy farmer',
    'Poultry farmer', 'Egg supplier', 'Honey supplier', 'Cuisines',
    'Kitchen', 'Supplements', 'Gym', 'Sunna & steam', 'Hotel', 'Chef', 'Culinary',
  ];

  return (
    <div className={styles.root}>
      <div className={styles.bgOrbs} />
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>
            <div className={styles.heroBadgeDot} />
            Now accepting partners
          </div>
          <h1 className={styles.heroTitle}>
            Partner with
            <br />
            <span className={styles.heroTitleYoo}>Yoo</span>
            <span className={styles.heroTitleBrand}>Katale</span>
          </h1>
          <p className={styles.heroSub}>
            Join vendors and delivery partners. Grow your business with Uganda&apos;s freshest online
            marketplace.
          </p>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>45,290</div>
            <div className={styles.statLabel}>Users</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statNum} ${styles.statNumOrange}`}>4K</div>
            <div className={styles.statLabel}>Drivers</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statNum} ${styles.statNumYellow}`}>3.5K</div>
            <div className={styles.statLabel}>Stores</div>
          </div>
        </div>

        <div className={styles.tabWrap}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 0 ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(0)}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Vendor
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 1 ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(1)}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6h2l3 5.5M8 17.5h5.5L16 9H9L6.5 14M9 6l3 3.5" />
            </svg>
            Delivery Partner
          </button>
        </div>

        {/* Vendor Panel */}
        <div className={`${styles.panel} ${activeTab === 0 ? styles.panelActive : ""}`}>
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.stepDone}`}>
              <div className={styles.stepCircle}>
                <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className={styles.stepLabel}>Choose</div>
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${styles.stepCurrent}`}>
              <div className={styles.stepCircle}>2</div>
              <div className={styles.stepLabel}>Register</div>
            </div>
            <div className={styles.stepLine} />
            <div className={styles.step}>
              <div className={styles.stepCircle}>3</div>
              <div className={styles.stepLabel}>Go Live</div>
            </div>
          </div>

          <div className={styles.perksGrid}>
            <div className={`${styles.perkCard} ${styles.perkCardFeatured}`}>
              <div className={styles.perkIcon}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <div className={styles.perkName}>Quick Onboarding</div>
                <div className={styles.perkDesc}>Get approved and start selling within 24 hours.</div>
              </div>
            </div>
            <div className={styles.perkCard}>
              <div className={styles.perkIcon}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className={styles.perkName}>Vendor Dashboard</div>
              <div className={styles.perkDesc}>Manage orders and inventory in real-time.</div>
            </div>
            <div className={`${styles.perkCard} ${styles.perkCardOrange}`}>
              <div className={styles.perkIcon}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div className={styles.perkName}>Weekly Payouts</div>
              <div className={styles.perkDesc}>
                Reliable weekly payments via bank or Mobile Money.
              </div>
            </div>
          </div>

          <div className={styles.orangeDivider} />

          <div className={styles.formCard}>
            <div className={styles.formCardHeader}>
              <div className={`${styles.formCardIcon} ${styles.formCardIconGreen}`}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <div className={styles.formCardTitle}>Store Registration</div>
                <div className={styles.formCardSubtitle}>Fill in your store details below.</div>
              </div>
            </div>

            <div className={styles.formBody}>
              <div
                className={
                  vendorSubmitted
                    ? styles.formFieldsWrapHidden
                    : ""
                }
              >
                  <form onSubmit={handleVendorSubmit}>
                  <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Store Name *</label>
                      <input
                        type="text"
                            name="name"
                        className={styles.input}
                        placeholder="e.g. Mama's Kitchen"
                            value={vendorFormData.name}
                            onChange={handleVendorChange}
                      />
                      {vendorErrors.name && (
                        <div className={styles.errorText}>{vendorErrors.name}</div>
                      )}
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        className={styles.input}
                        placeholder="+256 7XX XXX XXX"
                        value={vendorFormData.phone}
                        onChange={handleVendorChange}
                      />
                      {vendorErrors.phone && (
                        <div className={styles.errorText}>{vendorErrors.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Store Address *</label>
                    <input
                      type="text"
                            name="address"
                      className={styles.input}
                      placeholder="e.g. Plot 6, Kampala Road, Kampala"
                            value={vendorFormData.address}
                            onChange={handleVendorChange}
                    />
                    {vendorErrors.address && (
                      <div className={styles.errorText}>{vendorErrors.address}</div>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email Address *</label>
                    <input
                            type="email"
                      name="email"
                      className={styles.input}
                            placeholder="you@example.com"
                            value={vendorFormData.email}
                            onChange={handleVendorChange}
                    />
                    {vendorErrors.email && (
                      <div className={styles.errorText}>{vendorErrors.email}</div>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Business Category *</label>
                    <select
                                name="category"
                      className={styles.select}
                                value={vendorFormData.category}
                                onChange={handleVendorChange}
                    >
                      <option value="">Select your category</option>
                                {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                                ))}
                    </select>
                              {vendorErrors.category && (
                      <div className={styles.errorText}>{vendorErrors.category}</div>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Brief Description</label>
                    <textarea
                      name="description"
                      className={styles.textarea}
                      placeholder="Tell customers what you sell and what makes your store special..."
                      onChange={() => {}}
                    />
                  </div>

                  <button
                              type="button"
                    className={styles.toggleRow}
                    onClick={() =>
                      setVendorFormData((prev) => ({ ...prev, vegan: !prev.vegan }))
                    }
                  >
                    <div className={styles.toggleRowLeft}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17 8C8 10 5.9 16.17 3.82 19.25A13 13 0 0015 21c3.87 0 7-3.13 7-7 0-2.5-1-4.75-5-6z" />
                        <path d="M3.82 19.25C6 14 9.5 11.5 14 10" />
                      </svg>
                      <div>
                        <div className={styles.toggleLabel}>Vegetarian / Vegan options</div>
                        <div className={styles.toggleSub}>
                          We offer plant-based or vegetarian products.
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${styles.toggle} ${
                        vendorFormData.vegan ? styles.toggleOn : ""
                      }`}
                    />
                  </button>

                  <button type="submit" className={styles.submitBtn} disabled={isVendorLoading}>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    {isVendorLoading ? "Submitting..." : "Register My Store"}
                  </button>
                  </form>
              </div>

              <div
                className={`${styles.successState} ${
                  vendorSubmitted ? styles.successStateShow : ""
                }`}
              >
                <div className={styles.successIcon}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                <div className={styles.successTitle}>Application Received!</div>
                <p className={styles.successSub}>
                  We&apos;ll review your store and reach out within 24 hours to get you live on
                  YooKatale.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.sectionLabel}>Vendor FAQs</div>
          <div className={styles.faqCard}>
            {vendorFaqItems.map((item, index) => {
              const open = index === activeVendorQuestion;
              return (
                <div
                  key={item.question}
                  className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqQ}
                    onClick={() =>
                      setActiveVendorQuestion(open ? null : index)
                    }
                  >
                    <span className={styles.faqQText}>{item.question}</span>
                    <svg
                      className={styles.faqChevron}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className={styles.faqA}>
                    <div className={styles.faqAInner}>{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Panel */}
        <div className={`${styles.panel} ${activeTab === 1 ? styles.panelActive : ""}`}>
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.stepDone}`}>
              <div className={styles.stepCircle}>
                <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className={styles.stepLabel}>Choose</div>
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${styles.stepCurrent}`}>
              <div className={styles.stepCircle}>2</div>
              <div className={styles.stepLabel}>Apply</div>
            </div>
            <div className={styles.stepLine} />
            <div className={styles.step}>
              <div className={styles.stepCircle}>3</div>
              <div className={styles.stepLabel}>Deliver</div>
            </div>
          </div>

          <div className={styles.perksGrid}>
            <div className={`${styles.perkCard} ${styles.perkCardDeliveryFeatured}`}>
              <div className={styles.perkIcon}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div className={styles.perkName}>Earn on Your Schedule</div>
                <div className={styles.perkDesc}>Flexible hours, tips, and weekly bonuses.</div>
              </div>
            </div>
            <div className={`${styles.perkCard} ${styles.perkCardOrange}`}>
              <div className={styles.perkIcon}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className={styles.perkName}>Instant Pickup</div>
              <div className={styles.perkDesc}>Orders assigned to nearby riders fast.</div>
            </div>
            <div className={styles.perkCard}>
              <div className={styles.perkIcon}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div className={styles.perkName}>Greater Kampala</div>
              <div className={styles.perkDesc}>Deliver across Kampala and nearby areas.</div>
            </div>
          </div>

          <div className={styles.orangeDivider} />

          <div className={styles.formCard}>
            <div className={styles.formCardHeader}>
              <div className={`${styles.formCardIcon} ${styles.formCardIconOrange}`}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6h2l3 5.5M8 17.5h5.5L16 9H9L6.5 14M9 6l3 3.5" />
                </svg>
              </div>
              <div>
                <div className={styles.formCardTitle}>Driver Application</div>
                <div className={styles.formCardSubtitle}>Join our delivery fleet today.</div>
              </div>
            </div>

            <div className={styles.formBody}>
              <div
                className={
                  deliverySubmitted
                    ? styles.formFieldsWrapHidden
                    : ""
                }
              >
                  <form onSubmit={handleDeliverySubmit}>
                  <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Full Name *</label>
                      <input
                        type="text"
                        name="fullname"
                        className={styles.input}
                        placeholder="e.g. Okello James"
                        value={deliveryFormData.fullname}
                        onChange={handleDeliveryChange}
                      />
                      {deliveryErrors.fullname && (
                        <div className={styles.errorText}>{deliveryErrors.fullname}</div>
                      )}
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        className={styles.input}
                        placeholder="+256 7XX XXX XXX"
                        value={deliveryFormData.phone}
                        onChange={handleDeliveryChange}
                      />
                      {deliveryErrors.phone && (
                        <div className={styles.errorText}>{deliveryErrors.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email Address *</label>
                    <input
                        type="email"
                      name="email"
                      className={styles.input}
                        placeholder="you@example.com"
                        value={deliveryFormData.email}
                        onChange={handleDeliveryChange}
                    />
                    {deliveryErrors.email && (
                      <div className={styles.errorText}>{deliveryErrors.email}</div>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Vehicle Type *</label>
                    <select
                      name="transport"
                      className={styles.select}
                      value={deliveryFormData.transport}
                      onChange={handleDeliveryChange}
                    >
                      <option value="bike">Motorcycle (Boda Boda)</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="car">Car / Saloon</option>
                      <option value="pickup">Pickup Truck</option>
                      <option value="van">Mini Van</option>
                    </select>
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Location / Area *</label>
                      <input
                        type="text"
                        name="location"
                        className={styles.input}
                        placeholder="e.g. Ntinda, Kampala"
                        value={deliveryFormData.location}
                        onChange={handleDeliveryChange}
                      />
                      {deliveryErrors.location && (
                        <div className={styles.errorText}>{deliveryErrors.location}</div>
                      )}
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Availability</label>
                      <select
                        name="availability"
                        className={styles.select}
                        onChange={() => {}}
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Weekends only</option>
                        <option>Evenings only</option>
                      </select>
                    </div>
                  </div>

                  {deliveryFormData.transport !== "bike" && (
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Number Plate *</label>
                      <input
                        type="text"
                            name="numberPlate"
                        className={styles.input}
                            placeholder="Enter vehicle number plate"
                            value={deliveryFormData.numberPlate}
                            onChange={handleDeliveryChange}
                      />
                      {deliveryErrors.numberPlate && (
                        <div className={styles.errorText}>{deliveryErrors.numberPlate}</div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    className={styles.toggleRow}
                    onClick={() =>
                      setDeliveryFormData((prev) => ({ ...prev, vegan: !prev.vegan }))
                    }
                  >
                    <div className={styles.toggleRowLeft}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <circle cx="8" cy="12" r="2" />
                        <path d="M13 9h5M13 12h3" />
                      </svg>
                      <div>
                        <div className={styles.toggleLabel}>I have a valid driving permit</div>
                        <div className={styles.toggleSub}>
                          Required for motorcycle and car drivers.
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${styles.toggle} ${
                        deliveryFormData.vegan ? styles.toggleOn : ""
                      }`}
                    />
                  </button>

                  <button
                          type="submit"
                    className={`${styles.submitBtn} ${styles.submitBtnOrange}`}
                    disabled={isDeliveryLoading}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    {isDeliveryLoading ? "Submitting..." : "Apply as Delivery Partner"}
                  </button>
                </form>
              </div>

              <div
                className={`${styles.successState} ${
                  deliverySubmitted ? styles.successStateShow : ""
                }`}
              >
                <div className={styles.successIcon}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className={styles.successTitle}>You&apos;re on the list!</div>
                <p className={styles.successSub}>
                  Our fleet team will reach out within 24 hours with next steps to get you on the
                  road.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.sectionLabel}>Delivery Partner FAQs</div>
          <div className={styles.faqCard}>
            {deliveryFaqItems.map((item, index) => {
              const open = index === activeDeliveryQuestion;
              return (
                <div
                  key={item.question}
                  className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqQ}
                    onClick={() =>
                      setActiveDeliveryQuestion(open ? null : index)
                    }
                  >
                    <span className={styles.faqQText}>{item.question}</span>
                    <svg
                      className={styles.faqChevron}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className={styles.faqA}>
                    <div className={styles.faqAInner}>{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
