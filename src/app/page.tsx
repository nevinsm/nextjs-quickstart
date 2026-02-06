export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Hackathon Starter
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Ready to build. Wire up Supabase, add shadcn/ui, and ship fast.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
            Next.js App Router
          </span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
            TypeScript
          </span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
            Tailwind CSS
          </span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
            Supabase Ready
          </span>
        </div>
      </div>
    </main>
  );
}
