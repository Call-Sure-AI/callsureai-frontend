"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

interface Question {
    question: string;
    answer: string;
    category: string;
}

interface TabsType {
    id: string;
    label: string;
}

const FAQ: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState<string>('About us');
    const [activeQuestion, setActiveQuestion] = React.useState<string | null>(null);

    const tabs: TabsType[] = [
        { id: 'about', label: 'About us' },
        { id: 'service', label: 'Our Service' },
        { id: 'plan', label: 'Our Plan' }
    ];

    const questions: Question[] = [
        {
            question: 'What is Callsure.ai?',
            answer: 'Callsure.ai is an AI-powered voice agent SaaS designed to automate and enhance customer support calls for businesses.',
            category: 'About us'
        },
        {
            question: 'What industries can benefit from Callsure.ai?',
            answer: "Our solution is ideal for industries like banking, insurance, travel agency, food and beverages, e-commerce, healthcare, and more.",
            category: 'About us'
        },
        {
            question: 'How does Callsure.ai work?',
            answer: 'Our platform uses State of the Art AI Technology to handle customer interactions, providing natural-sounding realtime responses tailored to your business. We also provide customizable features to integrate seamlessly with your CRM.',
            category: 'About us'
        },
        {
            question: 'Is it secure to use Callsure.ai?',
            answer: 'Yes, we prioritize data security and comply with regulations like GDPR and CCPA to protect your information.',
            category: 'About us'
        },
        {
            question: 'How do I get started with Callsure.ai?',
            answer: 'Click on Sign Up or Get Started button on the page, and fill a short basic info form, and voila, you will get your own personalized dashboard right away!',
            category: 'Our Service'
        },
        {
            question: 'What analytics does Callsure.ai provide?',
            answer: "We offer detailed insights into Number of Calls Handled by AI, Each Call's Real-time Transcript, Sentiment Analysis, Response time, and NPS Scores and Ratings through an easy-to-use dashboard.",
            category: 'Our Service'
        },
        {
            question: 'Does Callsure.ai integrate with CRMs?',
            answer: 'Absolutely! Callsure.ai supports integrations with popular CRM tools to streamline customer data management.',
            category: 'Our Service'
        },
        {
            question: 'Can I customize the AI voice assistant?',
            answer: "Yes, you can fully customize the assistant's voice, tone, language, and gender. You can even upload your sample customer support scripts to align with your brand's personality strictly",
            category: 'Our Service'
        },
        {
            question: 'What support does Callsure.ai offer?',
            answer: 'We provide 24/7 customer support to assist with any issues or queries.',
            category: 'Our Plan'
        },
        {
            question: 'What pricing plans are available?',
            answer: 'We offer flexible pricing plans tailored to your business needs, from starter to enterprise solutions.',
            category: 'Our Plan'
        }
    ];

    const filteredQuestions = questions.filter(q => q.category === activeTab);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const tabContentVariants = {
        enter: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.3
            }
        },
        center: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3
            }
        }
    };

    const questionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <div className="relative w-full overflow-hidden min-h-screen"
            style={{
                background: `
                radial-gradient(circle at 0% 0%, rgba(239, 246, 255, 0.6) 0%, transparent 100%),
                radial-gradient(circle at 100% 100%, rgba(219, 234, 254, 0.4) 0%, transparent 100%),
                white
            `
            }}>
            <div
                className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30"
                style={{
                    filter: 'blur(100px)',
                    transform: 'translate(-50%, -50%)',
                }}
            />
            <div
                className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30"
                style={{
                    filter: 'blur(100px)',
                    transform: 'translate(50%, 50%)',
                }}
            />

            <motion.div
                className="relative w-full max-w-6xl mx-auto px-4 py-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <motion.div
                    className="text-center mb-12"
                    variants={headerVariants}
                >
                    <motion.div
                        className="flex items-center justify-center gap-2 mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='flex items-center justify-center p-2 w-64 bg-blue-100 rounded-3xl'>
                            <MessageCircle className='h-6 w-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full text-white p-1' />
                            <span className="ml-2 text-gray-600">Frequently Asked Question</span>
                        </div>
                    </motion.div>
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-8"
                        variants={headerVariants}
                    >
                        Got Questions? We&apos;re here to help!
                    </motion.h1>

                    <motion.div
                        className="flex gap-4 justify-center mb-8"
                        variants={headerVariants}
                    >
                        {tabs.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.label);
                                    setActiveQuestion(null);
                                }}
                                className={`px-6 py-2 rounded-full transition-colors ${activeTab === tab.label
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'
                                    : 'bg-white text-blue-900 shadow-sm hover:bg-blue-50'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                type="button"
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    className="relative"
                    style={{ minHeight: '400px' }} // Ensure consistent height during transitions
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={tabContentVariants}
                            className="max-w-3xl mx-auto space-y-3"
                        >
                            {filteredQuestions.map((item, index) => (
                                <motion.div
                                    key={item.question}
                                    variants={questionVariants}
                                    layout
                                    className={`rounded-2xl overflow-hidden ${activeQuestion === item.question
                                            ? 'bg-[#EEF2FF]'
                                            : 'bg-[#F8FAFC]'
                                        }`}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{
                                        layout: { duration: 0.3 },
                                        scale: { duration: 0.2 }
                                    }}
                                >
                                    <motion.button
                                        onClick={() => setActiveQuestion(
                                            activeQuestion === item.question ? null : item.question
                                        )}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                        type="button"
                                    >
                                        <motion.span
                                            layout="position"
                                            className={`text-lg ${activeQuestion === item.question
                                                    ? 'text-blue-600 font-medium'
                                                    : 'text-gray-900'
                                                }`}
                                        >
                                            {`${index + 1}. ${item.question}`}
                                        </motion.span>
                                        <motion.div
                                            animate={{
                                                rotate: activeQuestion === item.question ? 180 : 0,
                                                color: activeQuestion === item.question ? '#2563eb' : '#64748b'
                                            }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center w-6 h-6"
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </motion.div>
                                    </motion.button>

                                    <AnimatePresence>
                                        {activeQuestion === item.question && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1,
                                                    transition: {
                                                        height: { duration: 0.3 },
                                                        opacity: { duration: 0.2, delay: 0.1 }
                                                    }
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                    transition: {
                                                        height: { duration: 0.3 },
                                                        opacity: { duration: 0.2 }
                                                    }
                                                }}
                                            >
                                                <div className="px-6 pb-6">
                                                    <motion.p
                                                        className="text-gray-600 text-base leading-relaxed"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                            transition: { delay: 0.1 }
                                                        }}
                                                    >
                                                        {item.answer}
                                                    </motion.p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default FAQ;