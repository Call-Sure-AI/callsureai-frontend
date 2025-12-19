// app/(pages)/solutions/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry Solutions - CallSure AI",
  description: "AI-powered voice solutions for every industry",
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}