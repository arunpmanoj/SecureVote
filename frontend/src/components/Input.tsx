import React from 'react'
import './Input.css'

interface InputProps {
  label?: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  helperText?: string
  required?: boolean
  icon?: React.ReactNode
  disabled?: boolean
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  icon,
  disabled = false,
}: InputProps) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className={`input-wrapper ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}
