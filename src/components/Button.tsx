import React from 'react'
import cn from 'classnames'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }

const Button: React.FC<Props> = ({ variant = 'primary', className, ...rest }) => (
  <button
    {...rest}
    className={cn(
      'rounded-2xl px-4 py-2 transition active:scale-[.98] disabled:opacity-50',
      variant === 'primary'
        ? 'bg-blue-600 text-white shadow hover:bg-blue-700'
        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
      className,
    )}
  />
)

export default Button