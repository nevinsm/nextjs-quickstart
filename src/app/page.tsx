import Link from 'next/link';

import { HeroActions } from '@/components/landing/hero-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const highlights = [
  {
    title: 'Ship fast',
    description: 'Reusable components, ready-to-wire Supabase, and a clean layout out of the box.',
  },
  {
    title: 'Stay consistent',
    description: 'Tailwind + shadcn/ui ensures your UI stays crisp while you move quickly.',
  },
  {
    title: 'Deploy instantly',
    description: 'Works seamlessly with Vercel once you connect environment variables.',
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-border bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container flex flex-col gap-8 py-16">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Hackathon starter
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Build bold ideas with a production-ready scaffold.
            </h1>
            <p className="text-base text-muted-foreground">
              Connect Supabase, design your flow, and iterate quickly with a UI kit that already works.
            </p>
          </div>
          <HeroActions />
        </div>
      </section>

      <section className="container space-y-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Launch checklist</h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to start building in minutes.
            </p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
            Visit dashboard
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Replace this copy with your project specifics and keep momentum.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
