import * as React from "react"

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "primary" | "secondary";
  size?: "default" | "sm" | "lg";
}

function Button({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  const baseClasses = "btn";
  let variantClasses = "btn-primary";
  
  if (variant === "secondary") {
    variantClasses = "btn-secondary";
  } else if (variant === "primary") {
    variantClasses = "btn-primary";
  }
  
  const sizeClasses = className.includes("w-full") ? "btn-full" : "";
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }
