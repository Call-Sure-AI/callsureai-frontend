// app/features/layout.tsx
import React from "react";

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full overflow-x-hidden">
      {children}
    </div>
  );
}