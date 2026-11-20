export default function WhatsAppLogo({ size = 24, style = {} }) {
  const gradientId = `whatsapp-green-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="WhatsApp"
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor="#55F477" />
          <stop offset="100%" stopColor="#20BD35" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="15" fill={`url(#${gradientId})`} />
      <path
        d="M32 9.5c-12.1 0-21.9 9.6-21.9 21.5 0 4.2 1.2 8.1 3.4 11.4L10.8 54l12-3.1c2.8 1.4 5.9 2.1 9.2 2.1 12.1 0 21.9-9.6 21.9-21.5S44.1 9.5 32 9.5z"
        fill="none"
        stroke="#fff"
        strokeWidth="4.2"
        strokeLinejoin="round"
      />
      <path
        d="M24.2 21.5c-.7-1.5-1.4-1.5-2-1.5h-1.7c-.6 0-1.5.2-2.3 1.1-.8.9-3 2.9-3 7.1s3.1 8.2 3.5 8.8c.4.6 6 9.5 14.7 12.9 7.3 2.9 8.8 2.3 10.4 2.1 1.6-.2 5.1-2.1 5.8-4.1.7-2 .7-3.7.5-4.1-.2-.4-.8-.6-1.7-1.1-.9-.4-5.1-2.5-5.9-2.8-.8-.3-1.4-.4-2 .5-.6.9-2.3 2.8-2.8 3.4-.5.6-1 .7-1.9.2-.9-.4-3.7-1.3-7-4.2-2.6-2.3-4.3-5.1-4.8-6-.5-.9 0-1.4.4-1.8.4-.4.9-1.1 1.3-1.6.4-.5.6-.9.9-1.5.3-.6.1-1.1-.1-1.6-.2-.4-1.9-4.6-2.7-6.2z"
        fill="#fff"
        transform="translate(3 0) scale(.88)"
      />
    </svg>
  );
}
