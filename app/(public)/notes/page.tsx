import { NotesPageContent } from "@/components/public/notes/notes-page-content";

export const metadata = {
  title: "Lab Notes | PapiGECode",
  description: "Apuntes de Pablo sobre sus proyectos, integraciones, automatizaciones y comunidades.",
};

export default function NotesPage() {
  return (
    <div className="pt-24">
      <NotesPageContent />
    </div>
  );
}
