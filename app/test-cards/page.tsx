'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function GoldBorderTestDemo() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">✨ 24k Gold Border & Glow Demo</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Preview the new 24-karat gold border and pulsing glow!
        </p>
      </div>
      <div className="w-96">
        <Card
          className="card-pulsing-glow relative overflow-hidden border-2 border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-sm shadow-2xl cursor-pointer transition-all duration-500 hover:border-[color:var(--color-gold)] hover:shadow-3xl hover:-translate-y-1"
          onClick={() => alert('Card is fully clickable!')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
          <CardHeader className="relative text-center pb-6">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-400 hover:text-yellow-400 transition-colors duration-300" />
            </div>
            <CardTitle className="text-3xl text-green-400">Ready Now</CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <div className="text-8xl font-bold text-green-300 mb-4">89</div>
            <p className="text-lg text-slate-400">Links ready for action</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p>
          <strong>Hover:</strong> See the 24k gold border and a strong gold glow.<br />
          <strong>Pulse:</strong> The gold glow pulses automatically.<br />
          <strong>Click:</strong> Card remains fully interactive.
        </p>
      </div>
    </div>
  );
}
