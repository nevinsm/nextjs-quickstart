'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function HeroActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast('Toast ready', { description: 'This is a placeholder toast.' })}>
        Trigger toast
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Project kickoff</DialogTitle>
            <DialogDescription>
              Use this modal as a quick prompt for onboarding, sharing links, or collecting input.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground" htmlFor="project-name">
              Project name
            </label>
            <Input id="project-name" placeholder="Hackathon launch" />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => toast('Saved', { description: 'Dialog action placeholder.' })}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
