import Card from "../ui/Card";

interface Note {
  id: string;
  at: string;
  author: string;
  body: string;
}

export default function ClinicalNotes({ notes }: { notes: Note[] }) {
  return (
    <Card
      title="Clinical notes"
      actions={
        <button className="text-xs font-medium text-clinical-accent hover:underline">
          Add note →
        </button>
      }
    >
      <ul className="space-y-4">
        {notes.map((n) => (
          <li key={n.id} className="border-l-2 border-clinical-border pl-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-clinical-ink">
                {n.author}
              </div>
              <div className="font-mono text-[11px] text-clinical-muted">
                {new Date(n.at).toLocaleDateString("en-GB")}
              </div>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-clinical-muted">
              {n.body}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
