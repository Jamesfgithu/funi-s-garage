import { EmailEditor } from '@/components/email-editor/EmailEditor';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Safelist AI Pro Dashboard
        </h1>
        <p className="text-muted-foreground mb-4">
          Generate high-converting emails with world-class AI copywriting and proven safelist templates
        </p>
      </div>

      <EmailEditor />
    </div>
  );
}
