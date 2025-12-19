// components\faq\index.tsx
"use client";
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
    const [activeTab, setActiveTab] = React.useState<string>('About Us');
    const [activeQuestion, setActiveQuestion] = React.useState<string | null>(null);

    const tabs: TabsType[] = [
        { id: 'about', label: 'About Us' },
        { id: 'service', label: 'Our Service' },
        { id: 'plan', label: 'Our Plan' }
    ];

    const questions: Question[] = [
        {
            question: 'What is Callsure.ai?',
            answer: 'Callsure.ai is an advanced AI-powered voice agent SaaS platform designed to automate and enhance customer support calls for businesses. Our solution uses natural language processing (NLP) to understand customer queries and provide accurate, conversational responses that feel human-like. The platform works 24/7, handling routine inquiries while freeing up your human agents for more complex issues.',
            category: 'About Us'
        },
        {
            question: 'What languages does Callsure.ai support?',
            answer: 'Callsure.ai supports over 30 languages including English, Spanish, French, German, Mandarin, Japanese, Arabic, Portuguese, and many more. Our multilingual capabilities help businesses connect with diverse customer bases worldwide. Each voice assistant can be configured to respond in your chosen language with natural-sounding accents and culturally appropriate expressions, enabling seamless global customer interactions.',
            category: 'About Us'
        },
        {
            question: 'What industries can benefit from Callsure.ai?',
            answer: "Callsure.ai is versatile and benefits numerous industries including banking (handling account inquiries), insurance (processing claims), travel (booking support), food and beverages (order management), e-commerce (tracking packages), healthcare (appointment scheduling), telecommunications (technical support), and retail (product information). Our AI adapts to each industry's unique terminology and workflows, providing tailored solutions that enhance customer satisfaction and operational efficiency.",
            category: 'About Us'
        },
        {
            question: 'How does Callsure.ai work? Does it offer real-time call monitoring?',
            answer: 'Yes, Callsure.ai uses advanced natural language processing (NLP) and machine learning algorithms to provide real-time, conversational responses tailored to your business needs. When a customer calls, our AI voice agent answers, understands the query, accesses your knowledge base, and delivers accurate information instantly. The system integrates seamlessly with your CRM to personalize interactions based on customer history. Supervisors can monitor live calls through our dashboard and provide immediate assistance when needed, ensuring quality control and customer satisfaction.',
            category: 'About Us'
        },
        {
            question: 'What support does Callsure.ai offer?',
            answer: 'We provide comprehensive 24/7 customer support through multiple channels including live chat, email, and phone. Our dedicated support team assists with implementation, troubleshooting, optimization, and answering any questions about the platform. We also offer regular system updates, maintenance, and a knowledge base with tutorials and best practices. For enterprise clients, we provide a dedicated account manager to ensure your success with our platform.',
            category: 'About Us'
        },
        {
            question: 'What makes Callsure.ai different from other AI call solutions?',
            answer: 'Callsure.ai stands out with its human-like conversational abilities that go beyond basic chatbots. Our proprietary deep learning technology allows for context retention throughout calls, enabling natural back-and-forth conversations. The system continuously improves through machine learning, adapting to your specific customer interactions. Unlike competitors, we offer seamless integration with all major CRM platforms and provide detailed analytics that help optimize your customer service strategy.',
            category: 'About Us'
        },
        {
            question: 'How quickly can Callsure.ai be implemented?',
            answer: 'Most businesses can have Callsure.ai up and running within 1-2 weeks. Our implementation process includes knowledge base setup, voice customization, CRM integration, and testing phases. Our team works closely with yours to ensure a smooth transition. For simpler setups with standard configurations, implementation can be completed in as little as 3-5 business days. We provide comprehensive training for your team throughout the onboarding process.',
            category: 'About Us'
        },
        {
            question: 'How does Callsure.ai ensure call quality?',
            answer: 'Callsure.ai maintains exceptional call quality through several mechanisms: high-definition voice processing, advanced noise cancellation, smart pause detection, and dynamic response timing. Our AI is trained to speak at a natural pace with appropriate intonation. Quality assurance tools allow supervisors to monitor calls and provide feedback, while our analytics dashboard highlights areas for improvement. The system continuously learns from interactions to enhance future calls.',
            category: 'About Us'
        },
        {
            question: 'Can Callsure.ai handle complex queries?',
            answer: "Yes, Callsure.ai's AI voice agent is designed to handle complex queries by accessing your knowledge base, CRM, and external databases. The system can provide detailed information on products, services, policies, and procedures, as well as process transactions, schedule appointments, and troubleshoot technical issues. For queries beyond its capabilities, Callsure.ai can seamlessly transfer the call to a human agent while providing context and relevant information. Our AI is trained to handle a wide range of scenarios and adapt to new challenges over time.",
            category: 'Our Service'
        },
        {
            question: 'Is it secure to use Callsure.ai?',
            answer: 'Absolutely! Security is our top priority. Callsure.ai employs enterprise-grade encryption (AES-256) for all data at rest and in transit. We maintain strict compliance with GDPR, CCPA, HIPAA, and other relevant data protection regulations. Our platform undergoes regular penetration testing and security audits by third-party specialists. All customer data is stored in ISO 27001 certified data centers with geographic redundancy. We implement role-based access controls and maintain detailed access logs to ensure your information remains secure at all times.',
            category: 'Our Service'
        },
        {
            question: 'What analytics does Callsure.ai provide?',
            answer: 'Our comprehensive analytics dashboard offers valuable insights including call volume patterns (by hour, day, and season), real-time call transcripts with sentiment analysis, average response times, resolution rates, and Net Promoter Scores (NPS). The platform identifies common customer queries, enabling you to optimize your knowledge base. Advanced features include conversation flow analysis, customer emotion tracking, and AI performance metrics. All data can be exported in various formats or integrated directly with your business intelligence tools for deeper analysis.',
            category: 'Our Service'
        },
        {
            question: 'Does Callsure.ai integrate with CRMs?',
            answer: 'Yes! Callsure.ai seamlessly integrates with popular CRM platforms including Salesforce, HubSpot, Zoho, Microsoft Dynamics, and many others through our API. This integration allows the AI to access customer history, purchase records, and previous interactions to deliver personalized service. The system automatically updates CRM records after each call, logging conversation details, action items, and outcomes. Our development team can also create custom integrations for proprietary CRM systems, ensuring compatibility with your existing workflow.',
            category: 'Our Service'
        },
        {
            question: 'Can I customize the AI voice assistant?',
            answer: "Definitely! Callsure.ai offers extensive customization options. You can select from multiple voice profiles or create a unique voice that matches your brand identity. Customize the assistant's tone (professional, friendly, empathetic), language, accent, speech rate, and gender. You can upload your customer support scripts and brand guidelines to ensure the AI follows your communication style. The system can be programmed with company-specific greetings, closing statements, and special promotions. Our team helps you configure these settings through an intuitive control panel.",
            category: 'Our Service'
        },
        {
            question: 'How does Callsure.ai handle customer emotions?',
            answer: "Callsure.ai uses advanced sentiment analysis to detect customer emotions through tone, word choice, and speech patterns. When detecting frustration or anger, the AI can adjust its approach speaking more slowly, using empathetic language, or offering to connect with a human agent. For positive emotions, it can match the customer's enthusiasm. The system is trained to recognize cultural nuances in emotional expression and can adapt accordingly. All emotional cues are logged and analyzed to help improve future interactions.",
            category: 'Our Service'
        },
        {
            question: 'Can Callsure.ai handle outbound calls?',
            answer: 'Yes, Callsure.ai excels at both inbound and outbound calling campaigns. For outbound calls, the system can conduct customer satisfaction surveys, appointment reminders, payment notifications, promotional announcements, and follow-ups on service issues. The AI intelligently schedules calls during appropriate hours and respects do-not-call preferences. Campaign performance metrics are available in real-time, allowing you to adjust strategies as needed. Our platform complies with all telemarketing regulations and includes appropriate disclosure messages.',
            category: 'Our Service'
        },
        {
            question: 'How does Callsure.ai improve over time?',
            answer: 'Callsure.ai employs continuous learning algorithms that analyze each interaction to improve future performance. The system identifies patterns in successful resolutions, learns from human agent interventions, and adapts to changing customer needs. Regular updates from our development team introduce new capabilities and refinements. You can provide direct feedback on AI responses through our management portal, which the system incorporates into its learning model. This combination of machine learning and human guidance ensures the platform becomes increasingly effective for your specific customer base.',
            category: 'Our Service'
        },
        {
            question: 'What is the pricing model for Callsure.ai?',
            answer: 'Callsure.ai offers flexible, transparent pricing structured in three tiers: Startup (for small businesses handling up to 1,000 calls monthly), Business (for medium enterprises with up to 10,000 monthly calls), and Enterprise (for large organizations with unlimited calls). Each tier includes different features, with add-ons available for specific needs. We charge based on actual usage rather than fixed rates, allowing you to scale as needed. Volume discounts apply for annual commitments. Contact our sales team for a personalized quote based on your call volume, industry, and required features.',
            category: 'Our Plan'
        },
        {
            question: 'Does Callsure.ai offer a free trial?',
            answer: "Yes, Callsure.ai provides a comprehensive 14-day free trial with access to all core features including AI voice assistant, analytics dashboard, and CRM integration. During the trial, you can handle up to 100 calls and access our full support team. This allows you to evaluate the platform's performance with your actual customer interactions before making a commitment. The setup process for trials is streamlined, typically taking just 24-48 hours. No credit card is required to start, and we provide a dedicated implementation specialist to help you maximize the trial period.",
            category: 'Our Plan'
        },
        {
            question: 'Can Callsure.ai handle high call volumes?',
            answer: "Yes! Callsure.ai is built on a scalable cloud infrastructure designed to handle varying call volumes without performance degradation. Our system can simultaneously process thousands of calls during peak times with consistent quality. The platform automatically allocates additional resources during high-volume periods (like holiday seasons or promotional events). There's no practical limit to scaling capacity, making it suitable for businesses of all sizes. Our load balancing technology ensures optimal distribution of processing power, maintaining response times even during unexpected call spikes.",
            category: 'Our Plan'
        },
        {
            question: 'How do I get started with Callsure.ai?',
            answer: "Getting started is simple! Click the 'Sign In' button on our website, complete a brief questionnaire about your business needs, and our system will create your personalized dashboard within minutes. You'll then work with our implementation team to configure the AI voice, upload your knowledge base, and connect your existing phone system through our API or SIP integration. Training sessions for your team are included in the onboarding process. Most businesses complete the entire setup in 1-2 weeks. For urgent deployments, our fast-track implementation can have you operational in as little as 3 business days.",
            category: 'Our Plan'
        },
        {
            question: "What if there is a technical issue? Will we get a refund?",
            answer: "If you encounter a technical issue, our 24/7 support team will work to resolve it immediately, with a 99.9% uptime guarantee in our SLA (Service Level Agreement). For any service interruption lasting more than 1 hour, we automatically provide prorated credits to your account. In cases where critical functionality is unavailable for over 24 hours, we offer a full refund for the affected period. Our platform has built-in redundancy and failover systems to minimize disruptions. All technical issues are documented and addressed in regular system updates to prevent recurrence.",
            category: 'Our Plan'
        },
        {
            question: 'How long does it take to set up Callsure.ai?',
            answer: 'Setting up Callsure.ai typically takes 5-10 business days from start to finish. The process begins with an initial consultation to understand your requirements, followed by knowledge base setup, voice customization, and CRM integration. Our implementation team handles the technical aspects including phone system configuration, workflow design, and testing. Training sessions for your staff are conducted during this period. The exact timeline depends on the complexity of your needs and the size of your knowledge base. For businesses requiring expedited setup, we offer a premium fast-track option that can reduce implementation time to 3 business days.',
            category: 'Our Plan'
        },
        {
            question: 'Do you offer custom solutions for specific industries?',
            answer: 'Yes, we provide industry-specific solutions pre-configured with common workflows and knowledge bases for sectors like healthcare, financial services, retail, hospitality, and telecommunications. Each industry package includes specialized vocabulary training, compliance features, and best practices for that sector. Our industry experts work with you to fine-tune these templates to your specific business processes. Custom reporting dashboards highlight KPIs relevant to your industry. We regularly update these packages based on regulatory changes and emerging industry trends.',
            category: 'Our Plan'
        },
        {
            question: 'What kind of ROI can I expect with Callsure.ai?',
            answer: 'Most businesses see a positive return on investment within 3-6 months of implementing Callsure.ai. The platform typically reduces call center costs by 30-50% through automation of routine inquiries while improving customer satisfaction scores by an average of 25%. Our AI handles calls 24/7 without overtime costs, reduces average handling time by 40%, and decreases call abandonment rates significantly. The detailed analytics also help identify operational improvements beyond call handling. We provide ROI calculation tools and case studies specific to your industry to help you project potential savings.',
            category: 'Our Plan'
        },
        {
            question: 'Can I scale my plan up or down as needed?',
            answer: 'Absolutely! Callsure.ai offers complete flexibility to scale your subscription up or down monthly based on your business needs. During seasonal peaks, you can temporarily increase capacity, then reduce it during slower periods. There are no penalties for adjusting your plan, and changes take effect within 24 hours. Our dashboard provides utilization forecasts based on historical patterns to help you plan effectively. For businesses with unpredictable call volumes, we offer a pay-as-you-go option that automatically adjusts to your actual usage without requiring manual plan changes.',
            category: 'Our Plan'
        }
    ];

    const filteredQuestions = questions
        .filter(q => q.category === activeTab)
        .slice(0, 8);

    if (filteredQuestions.length < 8) {
        while (filteredQuestions.length < 8) {
            filteredQuestions.push({
                question: 'More questions coming soon!',
                answer: 'Stay tuned for updates.',
                category: activeTab
            });
        }
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const headerVariants: Variants = {
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

    const tabContentVariants: Variants = {
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

    const questionVariants: Variants = {
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
        <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

            <motion.div
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    variants={headerVariants}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-md" />
                            <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                <span className="text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-wider">
                                    FREQUENTLY ASKED QUESTIONS
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        variants={headerVariants}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
                    >
                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Got{" "}
                        </span>
                        <motion.span
                            initial={{ backgroundPosition: "0% 50%" }}
                            animate={{ backgroundPosition: "100% 50%" }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="inline-block bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
                            style={{ backgroundSize: "200% auto" }}
                        >
                            Questions?
                        </motion.span>
                    </motion.h1>
                    <motion.p
                        variants={headerVariants}
                        className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                    >
                        We&apos;re here to answer!
                    </motion.p>

                    {/* Tabs */}
                    <motion.div
                        className="flex flex-wrap gap-3 justify-center"
                        variants={headerVariants}
                    >
                        {tabs.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.label);
                                    setActiveQuestion(null);
                                }}
                                className={`relative px-6 py-2.5 rounded-xl font-semibold transition-all ${
                                    activeTab === tab.label
                                        ? 'text-white'
                                        : 'bg-white/60 dark:bg-slate-900/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50'
                                }`}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                type="button"
                            >
                                {activeTab === tab.label && (
                                    <>
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-70" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl" />
                                    </>
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Questions */}
                <motion.div
                    className="relative"
                    style={{ minHeight: '400px' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={tabContentVariants}
                            className="max-w-4xl mx-auto space-y-4"
                        >
                            {filteredQuestions.map((item, index) => (
                                <motion.div
                                    key={item.question}
                                    variants={questionVariants}
                                    className="group relative"
                                >
                                    {/* Card glow on hover */}
                                    <div
                                        className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 ${
                                            activeQuestion === item.question ? 'opacity-30' : 'group-hover:opacity-20'
                                        } transition-opacity duration-300`}
                                    />

                                    {/* Main card */}
                                    <div
                                        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                                            activeQuestion === item.question
                                                ? 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-2 border-cyan-500/50 dark:border-cyan-500/30'
                                                : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50'
                                        }`}
                                    >
                                        <motion.button
                                            onClick={() => setActiveQuestion(
                                                activeQuestion === item.question ? null : item.question
                                            )}
                                            className="w-full flex items-start justify-between p-6 text-left gap-4"
                                            type="button"
                                            whileHover={{ x: 4 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="flex items-start gap-3 flex-1">
                                                <span
                                                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                        activeQuestion === item.question
                                                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </span>
                                                <motion.span
                                                    layout="position"
                                                    className={`text-base font-semibold ${
                                                        activeQuestion === item.question
                                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent'
                                                            : 'text-gray-900 dark:text-white'
                                                    }`}
                                                >
                                                    {item.question}
                                                </motion.span>
                                            </div>
                                            <motion.div
                                                animate={{
                                                    rotate: activeQuestion === item.question ? 180 : 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                    activeQuestion === item.question
                                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                                                }`}
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
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 pl-[52px]">
                                                        <motion.p
                                                            className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
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
                                    </div>
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