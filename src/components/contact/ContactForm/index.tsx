'use client';

import { useState, useRef, useEffect } from 'react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { initializeAppCheckClient, getAppCheckToken } from '@/lib/firebase';
import styles from './ContactForm.module.css';

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const PROJECT_TYPES = [
  { value: '', label: 'Select project type...' },
  { value: 'new-project', label: 'New Project / Application' },
  { value: 'modernization', label: 'Legacy System Modernization' },
  { value: 'ai-integration', label: 'AI / ML Integration' },
  { value: 'security-audit', label: 'Security Audit / Consulting' },
  { value: 'cloud-migration', label: 'Cloud Migration' },
  { value: 'other', label: 'Other / Not Sure Yet' },
] as const;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLFormElement>({ threshold: 0.1 });
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formStartTime = useRef<number>(Date.now());

  // Initialize App Check on component mount
  useEffect(() => {
    initializeAppCheckClient();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    projectType: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Check if all required fields are filled (for button state)
  const isFormComplete =
    formData.name.trim().length >= 2 &&
    EMAIL_REGEX.test(formData.email.trim()) &&
    formData.message.trim().length >= 20;

  // Client-side validation
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        return undefined;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
        return undefined;

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 20) return 'Please provide more details (at least 20 characters)';
        if (value.trim().length > 5000) return 'Message must be less than 5000 characters';
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    const messageError = validateField('message', formData.message);
    if (messageError) newErrors.message = messageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => new Set([...prev, name]));

    // Validate on blur
    const error = validateField(name as keyof FormData, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, silently fail
    if (honeypotRef.current?.value) {
      // Fake success for bots
      setStatus('success');
      return;
    }

    // Time-based check - if submitted too fast (< 3 seconds), likely a bot
    const timeSpent = Date.now() - formStartTime.current;
    if (timeSpent < 3000) {
      setStatus('success'); // Fake success for bots
      return;
    }

    if (!validateForm()) {
      return;
    }

    setStatus('submitting');
    setErrors({});

    try {
      // Get App Check token for request verification
      const appCheckToken = await getAppCheckToken();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Include App Check token if available
      if (appCheckToken) {
        headers['X-Firebase-AppCheck'] = appCheckToken;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          _timestamp: Date.now(),
          _timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit form');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: '',
        message: '',
      });
      setTouched(new Set());
    } catch (error) {
      setStatus('error');
      setErrors({
        general: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Message Sent!</h3>
        <p className={styles.successText}>
          Thank you for reaching out! Please check your email and click the verification
          link within 24 hours to confirm your message. We&apos;ll review your inquiry
          and get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={ref}
      className={`${styles.form} ${isVisible ? styles.visible : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Honeypot field - hidden from users, visible to bots */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          ref={honeypotRef}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.name && touched.has('name') ? styles.inputError : ''}`}
            placeholder="Your name"
            disabled={status === 'submitting'}
            autoComplete="name"
          />
          {errors.name && touched.has('name') && (
            <span className={styles.error}>{errors.name}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.email && touched.has('email') ? styles.inputError : ''}`}
            placeholder="your@email.com"
            disabled={status === 'submitting'}
            autoComplete="email"
          />
          {errors.email && touched.has('email') && (
            <span className={styles.error}>{errors.email}</span>
          )}
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label htmlFor="company" className={styles.label}>
            Company <span className={styles.optional}>(optional)</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={styles.input}
            placeholder="Your company"
            disabled={status === 'submitting'}
            autoComplete="organization"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="projectType" className={styles.label}>
            Project Type <span className={styles.optional}>(optional)</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className={styles.select}
            disabled={status === 'submitting'}
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Message <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${styles.textarea} ${errors.message && touched.has('message') ? styles.inputError : ''}`}
          placeholder="Tell us about your project, goals, and timeline..."
          rows={6}
          disabled={status === 'submitting'}
        />
        {errors.message && touched.has('message') && (
          <span className={styles.error}>{errors.message}</span>
        )}
        <span className={styles.charCount}>
          {formData.message.length} / 5000
        </span>
      </div>

      {errors.general && (
        <div className={styles.generalError}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errors.general}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={status === 'submitting' || !isFormComplete}
      >
        {status === 'submitting' ? (
          <>
            <span className={styles.spinner} />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>

      <p className={styles.privacy}>
        By submitting this form, you agree to our privacy policy.
        We&apos;ll never share your information with third parties.
      </p>
    </form>
  );
}
