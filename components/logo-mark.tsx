/**
 * Islamic community logo mark for সর্দারপাড়া আমলে সালেহ যুব সংঘ.
 * A domed mosque silhouette topped with a crescent, cradled by two
 * supporting hands inside a rounded shield — symbolizing faith,
 * community, and mutual support. Uses currentColor so it inherits
 * the surrounding text color.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="সর্দারপাড়া আমলে সালেহ যুব সংঘ লোগো"
    >
      {/* Shield outline */}
      <path
        d="M24 3.5 41 9.2v13.4c0 10.4-7 17.8-17 21.9C14 40.4 7 33 7 22.6V9.2L24 3.5Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Crescent + star finial above the dome */}
      <path
        d="M24 9.2a3.1 3.1 0 1 0 2.5 4.95 2.35 2.35 0 1 1-2.5-4.95Z"
        fill="currentColor"
      />
      {/* Dome */}
      <path
        d="M18 24.5c0-3.6 2.7-6.5 6-6.5s6 2.9 6 6.5v.5H18v-.5Z"
        fill="currentColor"
      />
      {/* Mosque body / gateway */}
      <path
        d="M17 25h14v6h-3v-3.4c0-.9-.7-1.6-1.6-1.6h-4.8c-.9 0-1.6.7-1.6 1.6V31h-3v-6Z"
        fill="currentColor"
      />
      {/* Two supporting hands cradling the base */}
      <path
        d="M13 31.5c1.8 0 3 1.1 4.4 2.2 2 1.5 4 2.3 6.6 2.3s4.6-.8 6.6-2.3c1.4-1.1 2.6-2.2 4.4-2.2v2.2c-1.1 0-2 .8-3.2 1.7-2.3 1.8-4.8 2.8-7.8 2.8s-5.5-1-7.8-2.8c-1.2-.9-2.1-1.7-3.2-1.7v-2.2Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
    </svg>
  )
}
