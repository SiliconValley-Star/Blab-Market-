import React, { forwardRef } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
  isInvalid?: boolean
  isRequired?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  inputSize = 'md',
  isInvalid = false,
  isRequired = false,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-4 text-base'
  }

  const variantClasses = {
    default: `
      border border-gray-300 bg-white 
      focus:border-primary-blue focus:ring-1 focus:ring-primary-blue
    `,
    filled: `
      border-0 bg-gray-100 
      focus:bg-white focus:ring-2 focus:ring-primary-blue
    `,
    outline: `
      border-2 border-gray-200 bg-transparent
      focus:border-primary-blue focus:ring-0
    `
  }

  const baseClasses = `
    w-full rounded-lg transition-all duration-200
    placeholder:text-gray-400 
    disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
    ${isInvalid || error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
  `

  const inputClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[inputSize]}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon || type === 'password' ? 'pr-10' : ''}
    ${className}
  `

  const actualType = type === 'password' ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="form-label">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}

        {/* Input */}
        <input
          {...props}
          ref={ref}
          type={actualType}
          className={inputClasses}
        />

        {/* Right Icon / Password Toggle */}
        {(rightIcon || type === 'password') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            ) : (
              <span className="text-gray-400">{rightIcon}</span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="form-error">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  isRequired?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  resize = 'vertical',
  isRequired = false,
  className = '',
  ...props
}, ref) => {
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x', 
    both: 'resize'
  }

  const textareaClasses = `
    form-input min-h-[100px] 
    ${resizeClasses[resize]}
    ${error ? 'form-field-invalid' : ''}
    ${className}
  `

  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        {...props}
        ref={ref}
        className={textareaClasses}
      />

      {error && <p className="form-error">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// Select Component
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  inputSize?: 'sm' | 'md' | 'lg'
  isRequired?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  inputSize = 'md',
  isRequired = false,
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-4 text-base'
  }

  const selectClasses = `
    form-input pr-10 cursor-pointer
    ${sizeClasses[inputSize]}
    ${error ? 'form-field-invalid' : ''}
    ${className}
  `

  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          {...props}
          ref={ref}
          className={selectClasses}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

// Checkbox Component
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  description?: string
  error?: string
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  inputSize = 'md',
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const checkboxClasses = `
    ${sizeClasses[inputSize]} text-primary-blue rounded border-gray-300
    focus:ring-2 focus:ring-primary-blue focus:ring-offset-0
    ${error ? 'border-red-300' : ''}
    ${className}
  `

  return (
    <div className="w-full">
      <div className="flex items-start">
        <input
          {...props}
          ref={ref}
          type="checkbox"
          className={checkboxClasses}
        />
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
      {error && <p className="form-error mt-2">{error}</p>}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Input