import type {ButtonHTMLAttributes} from 'react'
import {twMerge} from 'tailwind-merge'
import {tv, type VariantProps} from 'tailwind-variants'

const button = tv({
  base: 'rounded px-3 py-1 text-sm transition-colors',
  variants: {
    variant: {
      primary: 'bg-primary text-white hover:bg-primary-hover cursor-pointer',
      secondary: 'bg-accent text-white hover:bg-accent-hover cursor-pointer',
      ghost: 'bg-transparent text-text hover:bg-surface cursor-pointer',
    },
    disabled: {
      true: 'bg-text-muted text-white cursor-not-allowed hover:bg-text-muted',
    },
  },
  defaultVariants: {
    variant: 'primary',
    disabled: false,
  },
})

type ButtonProps = {
  title: string
} & VariantProps<typeof button> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export const Button = ({title, variant, disabled, className, ...props}: ButtonProps) => (
  <button
    className={twMerge(button({variant, disabled}), className)}
    disabled={disabled ?? false}
    {...props}
  >
    {title}
  </button>
)
