// src/components/IconRemount.tsx
import React from "react";

const IconRemount: React.FC<{ keyHint: string | number; children: React.ReactNode }> = ({ keyHint, children }) => {
  return <span key={String(keyHint)}>{children}</span>;
};

export default IconRemount;
