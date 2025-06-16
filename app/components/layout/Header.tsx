'use client'

export function Header() {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Generator</h1>
          <p className="text-muted-foreground">Generate high-converting safelist emails with world-class AI copywriting</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Beta Testing Mode
          </div>
        </div>
      </div>
    </header>
  )
}
