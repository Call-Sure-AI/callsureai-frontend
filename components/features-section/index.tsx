"use client";

import React from "react";
import { StickyScroll } from "./sticky-scroll-reveal";

const content = [
    {
        title: "Collaborative Editing",
        description: (
            <div className="space-y-4">
                <p>
                    <strong>Human Touch When You Need It: </strong>
                    Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                </p>
                <p>
                    <strong>Real-Time Human Help: </strong>
                    If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                </p>
                <p>
                    <strong>Ticket Raising Made Easy: </strong>
                    If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
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
                    <strong>Human Touch When You Need It: </strong>
                    Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                </p>
                <p>
                    <strong>Real-Time Human Help: </strong>
                    If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                </p>
                <p>
                    <strong>Ticket Raising Made Easy: </strong>
                    If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
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
                    <strong>Human Touch When You Need It: </strong>
                    Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                </p>
                <p>
                    <strong>Real-Time Human Help: </strong>
                    If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                </p>
                <p>
                    <strong>Ticket Raising Made Easy: </strong>
                    If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
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
                    <strong>Human Touch When You Need It: </strong>
                    Although our AI is great, live agent handoff is always available to ensure you get the personal attention you deserve.
                </p>
                <p>
                    <strong>Real-Time Human Help: </strong>
                    If you need extra assistance, our system brings in human intervention in real-time, providing support whenever it&apos;s needed.
                </p>
                <p>
                    <strong>Ticket Raising Made Easy: </strong>
                    If something needs more attention, you can easily raise a ticket, and our team will jump in to resolve it for you quickly.
                </p>
                <p>
                    Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.
                </p>
            </div>
        ),
        url: "/images/hero2.png",
    },
];

export function FeaturesSection() {
    return (
        <section className="w-full relative h-screen bg-white">
            <div className="mx-auto max-w-7xl">
                <StickyScroll 
                    content={content} 
                    contentClassName="bg-gradient-to-br from-white to-slate-50"
                />
            </div>
        </section>
    );
}