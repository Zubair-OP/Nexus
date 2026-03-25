import React from 'react';
import { Badge, BadgeVariant } from '../ui/Badge';

type SupportedStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'draft'
  | 'in_review'
  | 'signed'
  | 'completed'
  | 'processing'
  | 'failed';

interface StatusBadgeProps {
  status: SupportedStatus;
}

const statusMap: Record<SupportedStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: 'Pending', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  declined: { label: 'Declined', variant: 'error' },
  draft: { label: 'Draft', variant: 'gray' },
  in_review: { label: 'In Review', variant: 'secondary' },
  signed: { label: 'Signed', variant: 'success' },
  completed: { label: 'Completed', variant: 'success' },
  processing: { label: 'Processing', variant: 'warning' },
  failed: { label: 'Failed', variant: 'error' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusMap[status];

  return (
    <Badge rounded size="sm" variant={config.variant}>
      {config.label}
    </Badge>
  );
};
