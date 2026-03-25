import React from 'react';
import { Card, CardBody } from '../ui/Card';

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  accentClassName?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  hint,
  icon,
  accentClassName = 'bg-primary-50 text-primary-700',
}) => {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardBody className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        </div>

        <div className={`rounded-2xl p-3 ${accentClassName}`}>{icon}</div>
      </CardBody>
    </Card>
  );
};
