// import type React from "react"
import PropTypes from 'prop-types';

// interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
//   variant?: "default" | "secondary" | "success" | "destructive"
// }

export function Badge({ children, variant = "default", className = "", ...props }) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["default", "secondary", "success", "destructive"]),
  className: PropTypes.string,
}

