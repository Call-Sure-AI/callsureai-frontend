"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

interface Question {
    question: string;
    answer: string;
}

interface TabsType {
    id: string;
    label: string;
}

const FAQ: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState<string>('Our Service');
    const [activeQuestion, setActiveQuestion] = React.useState<string | null>('What kind of support is available?');

    const tabs: TabsType[] = [
        { id: 'about', label: 'About us' },
        { id: 'service', label: 'Our Service' },
        { id: 'plan', label: 'Our Plan' }
    ];

    const questions: Question[] = [
        {
            question: 'Can I customize my sales pipeline?',
            answer: 'Yes, our platform provides full customization options for your sales pipeline.',
        },
        {
            question: 'Is there a free trial available?',
            answer: 'Yes, we offer a comprehensive free trial period for all new users.',
        },
        {
            question: 'What kind of support is available?',
            answer: 'We provide 24/7 customer support via live chat, email, and phone. Additionally, our Help Center offers detailed guides, tutorials, and FAQs to help you make the most of our platform.',
        },
        {
            question: 'How secure is my data?',
            answer: 'Your data is protected with enterprise-grade security measures.',
        },
    ];

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

    const questionVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
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
                            <MessageCircle className='h-6 w-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full text-white' />
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
                        className="flex gap-4 justify-center"
                        variants={headerVariants}
                    >
                        {tabs.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.label)}
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
                    className="max-w-3xl mx-auto space-y-3"
                    variants={containerVariants}
                >
                    {questions.map((item) => (
                        <motion.div
                            key={item.question}
                            variants={questionVariants}
                            className={`rounded-2xl overflow-hidden ${activeQuestion === item.question
                                ? 'bg-[#EEF2FF]'
                                : 'bg-[#F8FAFC]'
                                }`}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.button
                                onClick={() => setActiveQuestion(
                                    activeQuestion === item.question ? '' : item.question
                                )}
                                className="w-full flex items-center justify-between p-6 text-left"
                                type="button"
                            >
                                <span className={`text-lg ${activeQuestion === item.question
                                    ? 'text-blue-600 font-medium'
                                    : 'text-gray-900'
                                    }`}>
                                    {item.question}
                                </span>
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
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-6">
                                            <p className="text-gray-600 text-base leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default FAQ;