import React, { useRef } from 'react';

interface OtpInputProps {
  value: string[];
  onChange: (nextValue: string[]) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ value, onChange }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, rawValue: string) => {
    const nextDigit = rawValue.replace(/\D/g, '').slice(-1);
    const nextValue = value.map((digit, digitIndex) => (digitIndex === index ? nextDigit : digit));
    onChange(nextValue);

    if (nextDigit && index < value.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          value={digit}
          inputMode="numeric"
          maxLength={1}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-12 w-12 rounded-xl border border-gray-300 text-center text-lg font-semibold text-gray-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
      ))}
    </div>
  );
};
