"use client";

import { useMessagePostMutation } from "@slices/usersApiSlice";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import styles from "./contact.module.css";

const PHONE_RAW = "256786118137";
const EMAIL = "info@yookatale.app";
const ADDRESS = "P.O. Box 74940, Clock Tower Plot 6, Kampala · Entebbe, Uganda";
const MAPS_URL = "https://www.google.com/maps/search/Clock+Tower+Plot+6+Kampala+Uganda";

const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [sendMessage, { isLoading: isSending }] = useMessagePostMutation();
  const toast = useToast();

  const validate = () => {
    const err = {};
    if (!name?.trim()) err.name = "Please enter your name";
    if (!email?.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Please enter a valid email";
    if (!message?.trim()) err.message = "Please enter your message";
    else if (message.trim().length < 10) err.message = "Message must be at least 10 characters";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await sendMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      }).unwrap();

      if (res.status === "Success") {
        setIsSubmitted(true);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setFormErrors({});

        toast({
          title: "Message Sent!",
          description: res?.data?.message ?? "We'll get back to you within 24 hours.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
          icon: <FiCheckCircle />,
        });
      }
    } catch (err) {
      toast({
        title: "Sending Failed",
        description: err?.data?.message ?? "Please try again or contact us directly.",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.label}>Get in touch</span>
          <h1 className={styles.title}>
            Contact <span className={styles.titleGreen}><em className={styles.titleEm}>Yoo</em>Katale</span>
          </h1>
          <p className={styles.subtitle}>
            Questions, orders, or partnerships? We're here to help you.
          </p>
        </header>

        <div className={styles.quickStrip}>
          <a href={`tel:+${PHONE_RAW}`} className={`${styles.quickBtn} ${styles.btnCall}`}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
            Call Us
          </a>
          <a href={`https://wa.me/${PHONE_RAW}`} className={`${styles.quickBtn} ${styles.btnWhatsapp}`} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <a href={`mailto:${EMAIL}`} className={`${styles.quickBtn} ${styles.btnEmail}`}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 4-10 9L2 4"/></svg>
            {EMAIL}
          </a>
        </div>

        <div className={styles.hoursBadge}>
          <div className={styles.hoursDot} />
          <span className={styles.hoursText}>Mon–Sat 8am–8pm EAT · We typically reply within 2–4 hours</span>
        </div>

        <div className={styles.promoBanner}>
          <div className={styles.promoIcon}>🔥</div>
          <div>
            <div className={styles.promoTitle}>Fast Replies Guaranteed</div>
            <div className={styles.promoText}>Most messages answered in under 4 hours</div>
          </div>
        </div>

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            </div>
            <div className={styles.cardTitle}>Visit Us</div>
            <div className={styles.cardText}>{ADDRESS}</div>
            <a href={MAPS_URL} className={styles.cardLink} target="_blank" rel="noopener noreferrer">
              Get directions
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div className={`${styles.infoCard} ${styles.infoCardOrange} ${styles.infoCardFull}`}>
            <div className={styles.cardIcon}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div className={styles.cardTitle}>Response Time</div>
            <div className={styles.cardText}>Within 24 hours. Usually 2–4 hours during business days. We reply quickly.</div>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formTitle}>Send a Message</div>
          <p className={styles.formSubtitle}>Tell us what you need — we'll get back to you fast.</p>

          <div className={`${styles.formFields} ${isSubmitted ? styles.formFieldsHidden : ""}`} id="formFields">
            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Full Name</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    placeholder="e.g. Nakato Okello"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" })); }}
                  />
                  {formErrors.name && <span className={styles.fieldError}>{formErrors.name}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Phone</label>
                  <input
                    type="tel"
                    className={styles.fieldInput}
                    placeholder="+256 700 000000"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email Address</label>
                <input
                  type="email"
                  className={styles.fieldInput}
                  placeholder="e.g. nakato@gmail.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (formErrors.email) setFormErrors((p) => ({ ...p, email: "" })); }}
                />
                {formErrors.email && <span className={styles.fieldError}>{formErrors.email}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Your Message</label>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Tell us about your order, question, or partnership idea..."
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); if (formErrors.message) setFormErrors((p) => ({ ...p, message: "" })); }}
                />
                {formErrors.message && <span className={styles.fieldError}>{formErrors.message}</span>}
              </div>
              <button type="submit" className={styles.submitBtn} disabled={isSending}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className={`${styles.successMsg} ${isSubmitted ? styles.successMsgShow : ""}`} id="successMsg">
            <div className={styles.successIcon}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className={styles.formTitle}>Message Sent! 🎉</div>
            <p className={styles.formSubtitle}>We've received your message and will get back to you within 2–4 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
