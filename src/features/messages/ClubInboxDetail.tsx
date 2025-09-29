import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
// Mock empty club inbox for demo cleanup
const mockClubInbox: any[] = [];

const ClubInboxDetail = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  
  const item = mockClubInbox.find(i => i.id === itemId);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>No club messages yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/messages?tab=club')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{item.title}</h1>
            <p className="text-sm opacity-90">{item.club}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Meta Info */}
        <div className="flex items-center space-x-2 mb-6 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{item.date}</span>
          <span>•</span>
          <span className="capitalize">{item.type}</span>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: item.content }}
            className="space-y-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ClubInboxDetail;