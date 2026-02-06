'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

type ProjectSubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
};

export const ProjectSubmitButton = ({
  idleLabel,
  pendingLabel,
  variant = 'default',
}: ProjectSubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} variant={variant}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
};
