'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function GoldBorderTestDemo() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          ✨ 24k Gold Border & Glow Demo
        </h1>
        <p className="text-muted-foreground mb-6 text-xl">
          Preview the new 24-karat gold border and pulsing glow!
        </p>
      </div>
      <div className="w-96">
        <Card
          className="card-pulsing-glow hover:shadow-3xl relative cursor-pointer overflow-hidden border-2 border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/95 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--color-gold)]"
          onClick={() => alert('Card is fully clickable!')}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
          <CardHeader className="relative pb-6 text-center">
            <div className="mb-6 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-400 transition-colors duration-300 hover:text-yellow-400" />
            </div>
            <CardTitle className="text-3xl text-green-400">Ready Now</CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <div className="mb-4 text-8xl font-bold text-green-300">89</div>
            <p className="text-lg text-slate-400">Links ready for action</p>
          </CardContent>
        </Card>
      </div>
      <div className="text-muted-foreground mt-8 max-w-md text-center text-sm">
        <p>
          <strong>Hover:</strong> See the 24k gold border and a strong gold
          glow.
          <br />
          <strong>Pulse:</strong> The gold glow pulses automatically.
          <br />
          <strong>Click:</strong> Card remains fully interactive.
        </p>
      </div>
    </div>
  );
}
