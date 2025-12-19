// app/(pages)/docs/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - CallSure AI",
  description: "Security, compliance, and technical documentation for CallSure AI",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}