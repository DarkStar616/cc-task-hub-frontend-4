interface CootClubLogoProps {
  className?: string
}

export function CootClubLogo({ className = "w-8 h-8" }: CootClubLogoProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-label="Coot Club Logo" role="img">
      {/* Duck body */}
      <ellipse cx="50" cy="65" rx="25" ry="20" fill="#91cfce" stroke="#133a65" strokeWidth="2" />

      {/* Duck head */}
      <circle cx="50" cy="35" r="18" fill="#91cfce" stroke="#133a65" strokeWidth="2" />

      {/* Duck bill */}
      <ellipse cx="42" cy="35" rx="8" ry="4" fill="#ffc731" stroke="#133a65" strokeWidth="1" />

      {/* Duck eye */}
      <circle cx="55" cy="30" r="3" fill="#133a65" />

      {/* Eye highlight */}
      <circle cx="56" cy="29" r="1" fill="white" />

      {/* Wing detail */}
      <ellipse cx="60" cy="60" rx="8" ry="12" fill="#de4426" opacity="0.8" />
    </svg>
  )
}
