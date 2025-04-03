import { TestimonialType } from "@/types";

export const integrations = [
    {
        name: 'LinkedIn',
        description: 'Connect with LinkedIn',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: 'WhatsApp',
        description: 'Connect with WhatsApp',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
    },
    {
        name: 'Facebook',
        description: 'Connect with Facebook',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        name: 'GitHub',
        description: 'Integrate with GitHub',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
    {
        name: 'Slack',
        description: 'Connect with Slack',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
            </svg>
        ),
    },
    {
        name: 'Trello',
        description: 'Integrate with Twilio',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.645-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .795-.645 1.44-1.44 1.44h-4.44c-.795 0-1.44-.645-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z" />
            </svg>
        ),
    },
    {
        name: 'Twilio',
        description: 'SMS and Voice integration',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c1.6 0 2.88 1.28 2.88 2.88S13.6 9.36 12 9.36s-2.88-1.28-2.88-2.88S10.4 3.6 12 3.6zm0 16.8c-1.6 0-2.88-1.28-2.88-2.88s1.28-2.88 2.88-2.88 2.88 1.28 2.88 2.88-1.28 2.88-2.88 2.88zm4.8-9.6c1.6 0 2.88 1.28 2.88 2.88s-1.28 2.88-2.88 2.88-2.88-1.28-2.88-2.88 1.28-2.88 2.88-2.88zm-9.6 0c1.6 0 2.88 1.28 2.88 2.88s-1.28 2.88-2.88 2.88S4.32 14.28 4.32 12.8s1.28-2.88 2.88-2.88z" />
            </svg>
        ),
    },
];

export const testimonials: TestimonialType[] = [
    {
        name: "Nitesh Jain",
        title: "VP of Customer Experience, E2ESell",
        testimonial: "We run a large B2B marketplace with thousands of daily seller-buyer interactions. Initially, we didn’t think AI could replace our human support team. But after integrating Callsure AI into our live chat and voice channels, our call center costs dropped by 40%, and CSAT scores improved by 35% in just 90 days. It’s been a complete shift in how we support users.",
        avatar: "/images/Face.jpeg",
    },
    {
        name: "Prateek Indurkar",
        title: "CEO of Jobiffy",
        testimonial: "Jobiffy connects job seekers with employers at scale, and customer support is a core part of that journey. As our user base grew, we needed a scalable solution. Callsure AI now handles over 70% of our queries, reduced support costs by 50%, and adapted easily to a 3x surge in traffic without compromising on service quality.",
        avatar: "/images/Face1.jpeg",
    },
    {
        name: "Harshit Sharma",
        title: "MD, Codevik Solutions",
        testimonial: "As a fast-growing SaaS consultancy, we support clients across time zones. Support used to be a bottleneck—until we onboarded Callsure. It now handles over 80% of our L1 queries, reduced overhead by 45%, and let our human agents focus on complex issues. It’s become a key driver of sustainable growth.",
        avatar: "/images/Face2.jpeg",
    },
    {
        name: "Abhinav Sinha",
        title: "CEO, AI Abhi Tech",
        testimonial: "We offer an AI-powered productivity assistant used by tens of thousands daily. With Callsure AI managing our customer support across app and web, we now deliver 24/7 assistance without building a 24/7 team. It resolves 85% of queries instantly, maintains a 92% resolution accuracy, and dropped our wait times by 70%. Our users love how fast and helpful the experience has become.",
        avatar: "/images/Face.jpeg",
    },
    {
        name: "Aditya Desai",
        title: "Support Director, TechVista Solutions",
        testimonial: "At TechVista, we support enterprise clients across multiple countries, and finding qualified support staff was always our biggest challenge. Since implementing Callsure AI, we've been able to onboard new clients without the usual staffing headaches. What I appreciate most is how well it integrates with our existing ticketing system, making the transition practically seamless for our team.",
        avatar: "/images/Face1.jpeg",
    },
    {
        name: "Priya Dwivedi",
        title: "Operations Manager, Growlytic",
        testimonial: "When Growlytic expanded into new markets last year, we were worried about maintaining consistent support quality. The implementation took longer than expected—about six weeks to fully customize—but Callsure AI has more than made up for that initial setup time. Our NPS scores have actually improved since transitioning from an all-human support model.",
        avatar: "/images/Face2.jpeg",
    },
    {
        name: "Vikram Patel",
        title: "Customer Success Lead, Nexacom",
        testimonial: "Our support team used to work long hours just keeping up with the basics. Now that Callsure handles routine inquiries, we've been able to launch a customer education program that's been on our roadmap for years. My team's job satisfaction has noticeably improved - they're doing meaningful work instead of repetitive tasks, and our retention has improved as a result.",
        avatar: "/images/Face3.jpeg",
    },
    {
        name: "Sarah Williams",
        title: "VP of Sales, MarketEdge",
        testimonial: "I was skeptical about AI support at first—our customers expect a premium experience. What convinced me was seeing the transcripts from actual conversations. The ROI is certainly there in terms of cost savings, but what's been truly valuable is having consistent quality regardless of time of day or support volume. That predictability is worth its weight in gold.",
        avatar: "/images/Face4.jpeg",
    },
    {
        name: "Rahul Malhotra",
        title: "CEO, Synapse Technologies",
        testimonial: "In our industry, customers expect immediate support when issues arise. We initially brought Callsure in for after-hours coverage only, but it performed so well that we've expanded its role. The strategic benefit has been unexpected—with better support metrics, our sales team has a compelling advantage when pitching to prospects who've experienced support frustrations elsewhere.",
        avatar: "/images/Face5.jpeg",
    },
    {
        name: "Anjali Mehta",
        title: "Support Manager, FlowStack",
        testimonial: "What impressed me wasn't just the immediate impact, but how Callsure continues to improve over time. After the first month, I was concerned about how it handled certain technical queries, but the learning curve has been impressive. Six months in, it's managing conversations I wouldn't have thought possible for an AI system. The self-service analytics dashboard has been particularly useful for my weekly reporting.",
        avatar: "/images/Face6.jpeg",
    },
    {
        name: "Michael Chen",
        title: "Operations Director, CloudServe",
        testimonial: "With thousands of SMB clients, our support team was pulling weekend shifts just to keep up. Since implementing Callsure, we've eliminated our backlog and actually improved service levels. The most telling change? Support is no longer a topic in our executive meetings—it just works. That peace of mind lets us focus on product development instead of putting out fires.",
        avatar: "/images/Face7.jpeg",
    },
    {
        name: "Deepak Gupta",
        title: "CXO, OmniTrade",
        testimonial: "The handoff between AI and human agents is what makes Callsure stand out. When an issue requires escalation, our team gets complete context without the customer having to repeat themselves. This has transformed how we handle complex support cases. I particularly value how it's given our junior support staff time to shadow senior agents on difficult issues—it's become an unexpected training tool.",
        avatar: "/images/Face8.jpeg",
    }
];

export const featuresContent = [
    {
        title: "Collaborative Editing",
        description: (
            <div className="space-y-4">
                <p>
                    <strong>Human Touch When You Need It:</strong> Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                </p>
                <p>
                    <strong>Real-Time Human Help:</strong> If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                </p>
                <p>
                    <strong>Ticket Raising Made Easy:</strong> If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                </p>
                <p>
                    Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                </p>
            </div>
        ),
        url: "/images/hero.png",
    },
    {
        title: "Real time changes",
        description: (
            <div className="space-y-4">
                <p>
                    <strong>Human Touch When You Need It:</strong> Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                </p>
                <p>
                    <strong>Real-Time Human Help:</strong> If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                </p>
                <p>
                    <strong>Ticket Raising Made Easy:</strong> If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                </p>
                <p>
                    Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                </p>
            </div>
        ),
        url: "/images/hero2.png",
    },
    {
        title: "Version control",
        description: (
            <div className="space-y-4">
                <p>
                    <strong>Human Touch When You Need It:</strong> Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                </p>
                <p>
                    <strong>Real-Time Human Help:</strong> If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                </p>
                <p>
                    <strong>Ticket Raising Made Easy:</strong> If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                </p>
                <p>
                    Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                </p>
            </div>
        ),
        url: "/images/hero.png",
    },
    {
        title: "Running out of content",
        description: (
            <div className="space-y-4">
                <p>
                    <strong>Human Touch When You Need It:</strong> Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                </p>
                <p>
                    <strong>Real-Time Human Help:</strong> If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                </p>
                <p>
                    <strong>Ticket Raising Made Easy:</strong> If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                </p>
                <p>
                    Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                </p>
            </div>
        ),
        url: "/images/hero2.png",
    },
];