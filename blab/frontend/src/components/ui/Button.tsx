import React from 'react'
import LoadingSpinner from './LoadingSpinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isLoading ? 'cursor-not-allowed' : ''}
  `

  const variantClasses = {
    primary: `
      bg-primary-blue text-white hover:bg-blue-600 
      focus:ring-primary-blue shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 
      focus:ring-gray-500 shadow-sm hover:shadow-md
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700 
      focus:ring-red-500 shadow-sm hover:shadow-md
    `,
    success: `
      bg-green-600 text-white hover:bg-green-700 
      focus:ring-green-500 shadow-sm hover:shadow-md
    `,
    warning: `
      bg-yellow-600 text-white hover:bg-yellow-700 
      focus:ring-yellow-500 shadow-sm hover:shadow-md
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100 
      focus:ring-gray-500
    `,
    outline: `
      bg-transparent border-2 border-current text-primary-blue 
      hover:bg-primary-blue hover:text-white 
      focus:ring-primary-blue
    `
  }

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  return (
    <button
      {...props}
      className={classes}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'primary'} />
          <span>{loadingText || 'Yükleniyor...'}</span>
        </div>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

// Icon Button variant
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode
  'aria-label': string
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5', 
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4'
  }

  return (
    <Button
      {...props}
      variant={variant}
      className={`${sizeClasses[size]} ${className}`}
    >
      {icon}
    </Button>
  )
}

// Button Group
interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  orientation = 'horizontal'
}) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  }

  return (
    <div className={`inline-flex ${orientationClasses[orientation]} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          let childClassName = ''
          
          if (orientation === 'horizontal') {
            if (index === 0) childClassName = 'rounded-r-none'
            else if (index === React.Children.count(children) - 1) childClassName = 'rounded-l-none -ml-px'
            else childClassName = 'rounded-none -ml-px'
          } else {
            if (index === 0) childClassName = 'rounded-b-none'
            else if (index === React.Children.count(children) - 1) childClassName = 'rounded-t-none -mt-px'
            else childClassName = 'rounded-none -mt-px'
          }

          return React.cloneElement(child, {
            className: `${child.props.className || ''} ${childClassName}`
          })
        }
        return child
      })}
    </div>
  )
}

export default Button