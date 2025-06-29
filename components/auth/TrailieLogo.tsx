import React from 'react';

export function TrailieLogo({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g>
        <path
          d="M32 48C32 48 32 36 32 24C32 16 40 8 48 8C56 8 56 16 56 16C56 16 56 24 48 24C40 24 32 16 32 16C32 16 24 24 16 24C8 24 8 16 8 16C8 16 8 8 16 8C24 8 32 16 32 24C32 36 32 48 32 48Z"
          stroke="#3BA17C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 48C32 48 36 56 48 56"
          stroke="#3BA17C"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M32 48C32 48 28 56 16 56"
          stroke="#3BA17C"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
} 