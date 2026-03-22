import type {PropsWithChildren} from 'react'
import {twMerge} from 'tailwind-merge'
import {tv, type VariantProps} from 'tailwind-variants'

const flexBox = tv({
  base: 'flex',
  variants: {
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      stretch: 'justify-stretch',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-5',
      xl: 'gap-8',
      xxl: 'gap-12',
    },
    vertical: {
      true: 'flex-col',
      false: 'flex-row',
    },
  },
  defaultVariants: {
    gap: 'md',
    vertical: false,
    align: 'center',
    justify: 'center',
  },
})

export type FlexBoxProps = PropsWithChildren<
  VariantProps<typeof flexBox> & {
    className?: string
  }
>

export const FlexBox = ({className, children, ...props}: FlexBoxProps) => (
  <div className={twMerge(flexBox(props), className)}>
    {children}
  </div>
)
