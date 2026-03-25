import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
  password: string;
}

const strengthConfig = [
  { label: 'Very weak', color: 'bg-error-500', text: 'text-error-700' },
  { label: 'Weak', color: 'bg-error-500', text: 'text-error-700' },
  { label: 'Fair', color: 'bg-warning-500', text: 'text-warning-700' },
  { label: 'Good', color: 'bg-secondary-600', text: 'text-secondary-700' },
  { label: 'Strong', color: 'bg-success-500', text: 'text-success-700' },
];

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const result = zxcvbn(password);
  const score = password ? result.score : 0;
  const activeConfig = strengthConfig[score];
  const suggestions = result.feedback.suggestions.slice(0, 2);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Password strength</p>
        <p className={`text-sm font-semibold ${activeConfig.text}`}>{activeConfig.label}</p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {strengthConfig.slice(0, 4).map((item, index) => (
          <div
            key={item.label}
            className={`h-2 rounded-full ${score >= index && password ? activeConfig.color : 'bg-gray-200'}`}
          />
        ))}
      </div>

      <p className="mt-3 text-sm text-gray-500">
        {password
          ? result.feedback.warning || suggestions[0] || 'This password looks ready for demo use.'
          : 'Use a mix of cases, numbers, and symbols to strengthen access.'}
      </p>
    </div>
  );
};
