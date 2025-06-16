import { EmailEditor } from '@/components/email-editor/EmailEditor';

export default function EmailGeneratorPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Email Generator
        </h1>
        <p className="text-muted-foreground">
          Create professional safelist marketing emails using proven templates
        </p>
      </div>
      
      <EmailEditor />
    </div>
  );
}
