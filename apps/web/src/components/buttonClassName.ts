import './Button.css'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonStyleOptions {
  large?: boolean
  fullWidth?: boolean
}

export function buttonClassName(variant: ButtonVariant, options: ButtonStyleOptions = {}): string {
  const classNames = ['button', `button--${variant}`]
  if (options.large) classNames.push('button--large')
  if (options.fullWidth) classNames.push('button--full')
  return classNames.join(' ')
}
