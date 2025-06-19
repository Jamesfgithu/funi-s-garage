import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Safelist AI Pro
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          The executive-level SaaS application is starting to take shape.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More &rarr;</Button>
        </div>
      </div>
    </main>
  );
}
