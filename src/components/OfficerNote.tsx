import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  MessageSquare, 
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Archive
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { OfficerNote as OfficerNoteType } from "@/data/mockMessages";

interface OfficerNoteProps {
  note: OfficerNoteType;
  compact?: boolean;
  showActions?: boolean;
  onVolunteer?: (noteId: string) => void;
  onOpenThread?: (threadId: string) => void;
}

const OfficerNote = ({ 
  note, 
  compact = false, 
  showActions = true,
  onVolunteer,
  onOpenThread 
}: OfficerNoteProps) => {
  const { toast } = useToast();
  const [volunteering, setVolunteering] = useState(false);

  const handleVolunteer = async () => {
    if (!onVolunteer) return;
    
    setVolunteering(true);
    
    // Show confirmation
    toast({
      title: "Volunteer Confirmation",
      description: `Are you volunteering as a ${note.target?.type.slice(0, -1)}?`,
      duration: 3000,
    });
    
    setTimeout(() => {
      onVolunteer(note.id);
      setVolunteering(false);
      toast({
        title: "Thanks for volunteering!",
        description: "Your response has been recorded.",
      });
    }, 1500);
  };

  const handleOpenThread = () => {
    if (note.threadId && onOpenThread) {
      onOpenThread(note.threadId);
    } else {
      toast({
        title: "Demo only",
        description: "Officer note discussions coming soon"
      });
    }
  };

  const handleMenuAction = (action: string) => {
    toast({
      title: "Demo only",
      description: `${action} functionality coming soon`
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'RESOLVED' 
      ? "bg-fishing-green/10 text-fishing-green border-fishing-green/20" 
      : "bg-orange-500/10 text-orange-600 border-orange-500/20";
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <AlertTriangle className="w-3 h-3 text-red-500" />;
    return null;
  };

  const isOverdue = note.dueDate && new Date(note.dueDate) < new Date() && note.status === 'UNRESOLVED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`${isOverdue ? 'border-red-200 bg-red-50/30' : ''} ${compact ? 'p-3' : ''}`}>
        <CardContent className={compact ? "p-0" : "p-4"}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-2 flex-1">
              {getPriorityIcon(note.priority)}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} truncate`}>
                  {note.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {note.contextLine}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(note.status)}`}
              >
                {note.status === 'RESOLVED' ? (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>RESOLVED</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>UNRESOLVED</span>
                  </div>
                )}
              </Badge>
              
              {!compact && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleMenuAction("Edit")}>
                      Edit Note
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuAction("Mark Resolved")}>
                      Mark Resolved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuAction("Archive")}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          {/* Target Progress */}
          {note.target && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{note.target.current}/{note.target.needed} {note.target.type}</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(note.target.current / note.target.needed) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Author Info */}
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <Users className="w-3 h-3 mr-1" />
            <span>{note.author.name} • {note.author.role}</span>
            <span className="mx-1">•</span>
            <Calendar className="w-3 h-3 mr-1" />
            <span>{note.createdAt}</span>
          </div>
          
          {/* Actions */}
          {showActions && note.status === 'UNRESOLVED' && (
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                onClick={handleVolunteer}
                disabled={volunteering}
                className="h-6 px-3 text-xs bg-fishing-green hover:bg-fishing-green/90"
              >
                {volunteering ? "..." : "Volunteer"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleMenuAction("Message Officers")}
                className="h-6 px-3 text-xs"
              >
                Message Officers
              </Button>
              
              {note.eventDetails?.tournamentId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleMenuAction("View Event")}
                  className="h-6 px-3 text-xs"
                >
                  View Event
                </Button>
              )}
              
              {note.threadId && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleOpenThread}
                  className="h-6 px-2"
                >
                  <MessageSquare className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
          
          {/* Resolved Info */}
          {note.status === 'RESOLVED' && note.resolvedAt && (
            <div className="text-xs text-fishing-green flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>Resolved on {note.resolvedAt}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OfficerNote;