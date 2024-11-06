'use client';
import React, { useState } from 'react';
import { Input as NextInput } from '@nextui-org/input';
import { EyeIcon } from './constants/Icons';

interface InputTypes {
  onChange?: any;
  onKeyDown?: any;
  placeholder?: string;
  showIcon?: boolean;
  label?: string;
  name?: string;
  labelPlacement?: any;
  isRequired?: boolean;
  className?: string;
  value?: any;
  onClear?: any;
  isClearable?: boolean;
  type?: any;
  readonly?: boolean;
  errorMessage?: string;
  max?: number | string;
  onFocus?: any;
  onBlur?: any;
  ref?: any;
}

const Input = ({
  onChange,
  onKeyDown,
  placeholder,
  showIcon = false,
  label,
  labelPlacement = 'outside',
  isRequired = false,
  onClear,
  value,
  isClearable = false,
  type = 'text',
  readonly,
  errorMessage,
  max,
  onFocus,
  onBlur,
  ref,
  ...rest
}: InputTypes) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative w-full'>
      <NextInput
        {...rest}
        ref={ref}
        isClearable={isClearable}
        onFocus={onFocus}
        onBlur={onBlur}
        onClear={onClear}
        value={value}
        readOnly={readonly}
        max={max}
        isRequired={isRequired}
        labelPlacement={labelPlacement}
        onChange={onChange}
        type={showPassword ? 'text' : type}
        label={label}
        placeholder={placeholder || 'Placeholder'}
        className={'caret-white'}
        classNames={{
          mainWrapper: 'w-full grow',
          inputWrapper: `bg-primary border border-borderColor data-[hover=true]:bg-gray-700/30 group-data-[focus]:bg-gray-700/30 rounded-small ${
            type == 'password' && 'pr-12'
          } h-[48px]`,
          innerWrapper: 'bg-transparent',
          input: 'text-primary-300 bg-transparent !text-white',
          label: '!text-white !pb-2',
        }}
        onKeyDown={onKeyDown}
      />
      {type == 'password' && (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute ${errorMessage ? 'top-[43%]' : 'top-[60%]'} right-5 text-white cursor-pointer`}
        >
          <EyeIcon />
        </div>
      )}
      {errorMessage && <p className='text-red-400 text-sm mt-2'>{errorMessage}</p>}
    </div>
  );
};

export default Input;
