import React, { useState } from 'react';
import { ArrowRight, X, Check, Mail, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from '@/hooks/use-toast';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [validFields, setValidFields] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePhone = (phone: string) => {
        if (!phone.trim()) {
            return 'Phone number is required';
        }
        if (!isValidPhoneNumber(phone)) {
            return 'Please enter a valid phone number';
        }
        return '';
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Real-time validation
        if (name === 'email') {
            const emailError = validateEmail(value);
            setErrors((prev) => ({ ...prev, email: emailError }));
            setValidFields((prev) => ({ ...prev, email: !emailError }));
        }
    };

    const handlePhoneChange = (value: string | undefined) => {
        const phoneValue = value || '';
        setFormData((prev) => ({
            ...prev,
            phone: phoneValue,
        }));

        const phoneError = validatePhone(phoneValue);
        setErrors((prev) => ({ ...prev, phone: phoneError }));
        setValidFields((prev) => ({ ...prev, phone: !phoneError }));
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'email':
                error = validateEmail(value);
                break;
            case 'name':
                error = !value.trim() ? 'Name is required' : '';
                break;
            case 'message':
                error = !value.trim() ? 'Message is required' : '';
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        setValidFields((prev) => ({ ...prev, [name]: !error && value.trim() !== '' }));
    };

    const validateForm = () => {
        const newErrors = {
            name: !formData.name.trim() ? 'Name is required' : '',
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
            message: !formData.message.trim() ? 'Message is required' : '',
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('https://api.callsure.ai/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Submission failed');
            toast({
                title: "Success",
                description: 'Thank you for your message. We will get back to you soon!',
                variant: "default",
            });
            setFormData({ name: '', email: '', phone: '', message: '' });
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message || "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden"
                >
                    <div className="relative p-8">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#162a47] via-[#3362A6] to-[#162a47] bg-clip-text text-transparent">
                                Get in Touch
                            </h2>
                            <p className="text-gray-600">
                                We&apos;d love to hear from you. Fill out the form below and we&apos;ll get back to you shortly.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Full Name"
                                        className={`w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3362A6] transition-all duration-200 ${errors.name
                                            ? 'border-red-500 bg-red-50'
                                            : validFields.name
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    />
                                    {validFields.name && (
                                        <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                                    )}
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1 ml-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Email Address"
                                        className={`w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3362A6] transition-all duration-200 ${errors.email
                                            ? 'border-red-500 bg-red-50'
                                            : validFields.email
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    />
                                    {validFields.email && (
                                        <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                                    )}
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1 ml-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <PhoneInput
                                    international
                                    defaultCountry="US"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    className={`custom-phone-input ${errors.phone
                                        ? 'phone-error'
                                        : validFields.phone
                                            ? 'phone-valid'
                                            : ''
                                        }`}
                                />
                                {validFields.phone && (
                                    <Check className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                                )}
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1 ml-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Your Message"
                                        rows={4}
                                        className={`w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3362A6] transition-all duration-200 resize-none ${errors.message
                                            ? 'border-red-500 bg-red-50'
                                            : validFields.message
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    />
                                    {validFields.message && (
                                        <Check className="w-5 h-5 text-green-500 absolute right-4 top-4" />
                                    )}
                                </div>
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1 ml-1">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    Object.keys(errors).some((key) => errors[key])
                                }
                                className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#162a47] via-[#3362A6] to-[#162a47] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3362A6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                ) : (
                                    <>
                                        Send Message
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <style jsx global>{`
                        .custom-phone-input {
                            width: 100%;
                        }
                        
                        .custom-phone-input .PhoneInputInput {
                            width: 100%;
                            padding: 0.75rem 1rem 0.75rem 3.5rem;
                            border: 1px solid #e5e7eb;
                            border-radius: 0.75rem;
                            font-size: 1rem;
                            line-height: 1.5rem;
                            transition: all 0.2s;
                        }
                        
                        .custom-phone-input .PhoneInputInput:focus {
                            outline: none;
                            border-color: #3362A6;
                            box-shadow: 0 0 0 2px rgba(51, 98, 166, 0.2);
                        }
                        
                        .custom-phone-input .PhoneInputInput:hover {
                            border-color: #d1d5db;
                        }
                        
                        .custom-phone-input .PhoneInputCountry {
                            position: absolute;
                            left: 0.75rem;
                            top: 50%;
                            transform: translateY(-50%);
                            z-index: 1;
                        }
                        
                        .custom-phone-input .PhoneInputCountryIcon {
                            border-radius: 0.25rem;
                            overflow: hidden;
                        }
                        
                        .custom-phone-input .PhoneInputCountrySelect {
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: 100%;
                            opacity: 0;
                            cursor: pointer;
                        }
                        
                        .phone-error .PhoneInputInput {
                            border-color: #ef4444;
                            background-color: #fef2f2;
                        }
                        
                        .phone-valid .PhoneInputInput {
                            border-color: #22c55e;
                            background-color: #f0fdf4;
                        }
                        
                        .PhoneInputCountrySelect option {
                            padding: 8px;
                        }
                        
                        .PhoneInputCountrySelectArrow {
                            display: none;
                        }
                    `}</style>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default ContactModal