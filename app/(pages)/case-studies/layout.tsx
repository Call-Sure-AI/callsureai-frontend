// app/(pages)/case-studies/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies - CallSure AI",
  description: "See how businesses transform their customer experience with AI voice agents",
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}