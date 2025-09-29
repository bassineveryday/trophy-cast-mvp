import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Archive, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OfficerNote from "./OfficerNote";
// Mock empty notes for demo cleanup
const mockOfficerNotes: any[] = [];

interface OfficerNoteType {
  id: string;
  title: string;
  contextLine: string;
  status: string;
  priority: string;
  clubId?: string;
}
import { useToast } from "@/hooks/use-toast";

interface OfficerNotesSectionProps {
  clubId?: string;
  showTitle?: boolean;
  maxNotes?: number;
}

const OfficerNotesSection = ({ 
  clubId, 
  showTitle = true, 
  maxNotes 
}: OfficerNotesSectionProps) => {
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  // Filter notes by club if specified
  const filteredNotes = clubId 
    ? mockOfficerNotes.filter(note => note.clubId === clubId)
    : mockOfficerNotes;

  // Separate resolved and unresolved notes
  const unresolvedNotes = filteredNotes.filter(note => note.status === 'UNRESOLVED');
  const resolvedNotes = filteredNotes.filter(note => note.status === 'RESOLVED');

  // Apply max notes limit if specified
  const displayNotes = maxNotes 
    ? unresolvedNotes.slice(0, maxNotes) 
    : unresolvedNotes;

  const handleVolunteer = (noteId: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Volunteer recorded!",
      description: "Officers will be notified of your response.",
    });
  };

  const handleOpenThread = (threadId: string) => {
    // Navigate to discussion thread
    window.location.href = `/messages/officer-thread/${threadId}`;
  };

  if (displayNotes.length === 0 && resolvedNotes.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>No officer notes yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Officer Notes</h2>
            {unresolvedNotes.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unresolvedNotes.length} unresolved
              </Badge>
            )}
          </div>
          
          {resolvedNotes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="text-xs"
            >
              <Archive className="w-4 h-4 mr-1" />
              {showArchived ? 'Hide' : 'Show'} Archived
              {showArchived ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </Button>
          )}
        </div>
      )}

      {/* Unresolved Notes */}
      {displayNotes.length > 0 && (
        <div className="space-y-3">
          {displayNotes.map((note) => (
            <OfficerNote 
              key={note.id} 
              note={note}
              onVolunteer={handleVolunteer}
              onOpenThread={handleOpenThread}
            />
          ))}
        </div>
      )}

      {/* Archived/Resolved Notes */}
      <AnimatePresence>
        {showArchived && resolvedNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="text-sm font-medium text-muted-foreground border-t pt-4">
              Resolved Notes
            </div>
            {resolvedNotes.map((note) => (
              <OfficerNote 
                key={note.id} 
                note={note}
                showActions={false}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More */}
      {maxNotes && unresolvedNotes.length > maxNotes && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({
              title: "Demo only",
              description: "View all notes coming soon"
            })}
          >
            View {unresolvedNotes.length - maxNotes} more notes
          </Button>
        </div>
      )}
    </div>
  );
};

export default OfficerNotesSection;