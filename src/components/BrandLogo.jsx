import Link from "next/link";

export default function BrandLogo({
  href = "/",
  inverse = false,
  compact = false,
  className = "",
}) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" aria-hidden="true" className="h-9 w-9 shrink-0">
        <path
          d="M20 3.5c7.9 0 14.3 6.4 14.3 14.3 0 9.2-8.2 15.1-14.3 18.7-6.1-3.6-14.3-9.5-14.3-18.7C5.7 9.9 12.1 3.5 20 3.5Z"
          fill={inverse ? "#F7FBF8" : "#176B4D"}
        />
        <path
          d="M14 21.2 18.1 25 27 15.8"
          fill="none"
          stroke={inverse ? "#176B4D" : "white"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!compact && (
        <span
          className={`text-xl font-extrabold tracking-[-0.04em] ${inverse ? "text-white" : "text-[#15231c]"}`}
        >
          Northstar
        </span>
      )}
    </span>
  );
  return href ? (
    <Link href={href} aria-label="Northstar home">
      {content}
    </Link>
  ) : (
    content
  );
}
