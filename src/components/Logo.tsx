export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="23" fill="url(#ll-sun)" />
      <path
        d="M24 1a23 23 0 0 1 0 46Z"
        fill="url(#ll-sun-half)"
        opacity="0.55"
      />
      <path
        d="M14 34c1.5-4 4-6.5 4-10.5 0-2.8-1.4-4.6-1.4-4.6s3.4.4 4.6 3.4c.5-2.4 2.6-5.8 2.6-5.8s.6 3.6 2.2 5.6c1-2.4 3.6-4.2 3.6-4.2s-.8 3-.2 5.4c1.6-1.4 4.6-1.6 4.6-1.6S32 25 30.8 28.4c2 .2 4.2 2 4.2 2H14Z"
        fill="#0b0414"
        opacity="0.85"
      />
      <defs>
        <linearGradient id="ll-sun" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff5fa2" />
          <stop offset="55%" stopColor="#ff2e88" />
          <stop offset="100%" stopColor="#6c1bd6" />
        </linearGradient>
        <linearGradient id="ll-sun-half" x1="24" y1="1" x2="24" y2="47" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#17d6c9" />
          <stop offset="100%" stopColor="#ff2e88" />
        </linearGradient>
      </defs>
    </svg>
  );
}
