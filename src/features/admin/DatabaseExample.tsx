import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Trophy, 
  Fish, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar,
  DollarSign,
  Weight,
  Ruler
} from 'lucide-react';

// Import the hooks
import { useClubs, useCreateClub, useUpdateClub, useDeleteClub } from '@/hooks/useClubs';
import { useTournaments, useCreateTournament, useUpdateTournament, useDeleteTournament } from '@/hooks/useTournaments';
import { useCatches, useCreateCatch, useUpdateCatch, useDeleteCatch } from '@/hooks/useCatches';

export default function DatabaseExample() {
  const [selectedTab, setSelectedTab] = useState('clubs');

  // Club state
  const [newClub, setNewClub] = useState({ name: '', location: '', description: '' });
  const [editingClub, setEditingClub] = useState<any>(null);

  // Tournament state
  const [newTournament, setNewTournament] = useState({
    name: '',
    date: '',
    location: '',
    entry_fee: 0,
    club_id: ''
  });
  const [editingTournament, setEditingTournament] = useState<any>(null);

  // Catch state
  const [newCatch, setNewCatch] = useState({
    species: '',
    weight: 0,
    length: 0,
    notes: '',
    tournament_id: ''
  });
  const [editingCatch, setEditingCatch] = useState<any>(null);

  // Hooks
  const { data: clubs = [], isLoading: clubsLoading } = useClubs();
  const { data: tournaments = [], isLoading: tournamentsLoading } = useTournaments();
  const { data: catches = [], isLoading: catchesLoading } = useCatches();

  const createClubMutation = useCreateClub();
  const updateClubMutation = useUpdateClub();
  const deleteClubMutation = useDeleteClub();

  const createTournamentMutation = useCreateTournament();
  const updateTournamentMutation = useUpdateTournament();
  const deleteTournamentMutation = useDeleteTournament();

  const createCatchMutation = useCreateCatch();
  const updateCatchMutation = useUpdateCatch();
  const deleteCatchMutation = useDeleteCatch();

  // Club handlers
  const handleCreateClub = async () => {
    if (!newClub.name.trim()) return;
    await createClubMutation.mutateAsync(newClub);
    setNewClub({ name: '', location: '', description: '' });
  };

  const handleUpdateClub = async () => {
    if (!editingClub) return;
    await updateClubMutation.mutateAsync(editingClub);
    setEditingClub(null);
  };

  // Tournament handlers
  const handleCreateTournament = async () => {
    if (!newTournament.name.trim() || !newTournament.date || !newTournament.location.trim()) return;
    await createTournamentMutation.mutateAsync(newTournament);
    setNewTournament({ name: '', date: '', location: '', entry_fee: 0, club_id: '' });
  };

  const handleUpdateTournament = async () => {
    if (!editingTournament) return;
    await updateTournamentMutation.mutateAsync(editingTournament);
    setEditingTournament(null);
  };

  // Catch handlers
  const handleCreateCatch = async () => {
    if (!newCatch.species.trim()) return;
    await createCatchMutation.mutateAsync(newCatch);
    setNewCatch({ species: '', weight: 0, length: 0, notes: '', tournament_id: '' });
  };

  const handleUpdateCatch = async () => {
    if (!editingCatch) return;
    await updateCatchMutation.mutateAsync(editingCatch);
    setEditingCatch(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">TrophyCast Database Example</h1>
        <p className="text-muted-foreground">Demonstrate CRUD operations for clubs, tournaments, and catches</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clubs" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Clubs
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Tournaments
          </TabsTrigger>
          <TabsTrigger value="catches" className="flex items-center gap-2">
            <Fish className="w-4 h-4" />
            Catches
          </TabsTrigger>
        </TabsList>

        {/* Clubs Tab */}
        <TabsContent value="clubs" className="space-y-6">
          {/* Create Club Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Club
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Club name"
                value={newClub.name}
                onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
              />
              <Input
                placeholder="Location (optional)"
                value={newClub.location}
                onChange={(e) => setNewClub({ ...newClub, location: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newClub.description}
                onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
              />
              <Button 
                onClick={handleCreateClub}
                disabled={createClubMutation.isPending || !newClub.name.trim()}
              >
                Create Club
              </Button>
            </CardContent>
          </Card>

          {/* Clubs List */}
          <Card>
            <CardHeader>
              <CardTitle>Clubs ({clubs.length})</CardTitle>
              <CardDescription>Manage your fishing clubs</CardDescription>
            </CardHeader>
            <CardContent>
              {clubsLoading ? (
                <p>Loading clubs...</p>
              ) : clubs.length === 0 ? (
                <p className="text-muted-foreground">No clubs found. Create one above!</p>
              ) : (
                <div className="space-y-4">
                  {clubs.map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{club.name}</h3>
                        {club.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {club.location}
                          </p>
                        )}
                        {club.description && (
                          <p className="text-sm text-muted-foreground">{club.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingClub({ ...club })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteClubMutation.mutate(club.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Club Modal */}
          {editingClub && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Club</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Club name"
                  value={editingClub.name}
                  onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                />
                <Input
                  placeholder="Location"
                  value={editingClub.location || ''}
                  onChange={(e) => setEditingClub({ ...editingClub, location: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={editingClub.description || ''}
                  onChange={(e) => setEditingClub({ ...editingClub, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateClub}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditingClub(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tournaments Tab */}
        <TabsContent value="tournaments" className="space-y-6">
          {/* Create Tournament Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Tournament
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Tournament name"
                value={newTournament.name}
                onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
              />
              <Input
                type="date"
                value={newTournament.date}
                onChange={(e) => setNewTournament({ ...newTournament, date: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={newTournament.location}
                onChange={(e) => setNewTournament({ ...newTournament, location: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Entry fee"
                value={newTournament.entry_fee}
                onChange={(e) => setNewTournament({ ...newTournament, entry_fee: Number(e.target.value) })}
              />
              <Select
                value={newTournament.club_id}
                onValueChange={(value) => setNewTournament({ ...newTournament, club_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select club (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleCreateTournament}
                disabled={createTournamentMutation.isPending || !newTournament.name.trim()}
              >
                Create Tournament
              </Button>
            </CardContent>
          </Card>

          {/* Tournaments List */}
          <Card>
            <CardHeader>
              <CardTitle>Tournaments ({tournaments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tournamentsLoading ? (
                <p>Loading tournaments...</p>
              ) : tournaments.length === 0 ? (
                <p className="text-muted-foreground">No tournaments found. Create one above!</p>
              ) : (
                <div className="space-y-4">
                  {tournaments.map((tournament) => (
                    <div key={tournament.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{tournament.name}</h3>
                        <Badge variant={tournament.status === 'upcoming' ? 'default' : 'secondary'}>
                          {tournament.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(tournament.date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {tournament.location}
                        </p>
                        {tournament.entry_fee && (
                          <p className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ${tournament.entry_fee}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTournament({ ...tournament })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTournamentMutation.mutate(tournament.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catches Tab */}
        <TabsContent value="catches" className="space-y-6">
          {/* Create Catch Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Log New Catch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Species (e.g., Largemouth Bass)"
                value={newCatch.species}
                onChange={(e) => setNewCatch({ ...newCatch, species: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Weight (lbs)"
                  value={newCatch.weight}
                  onChange={(e) => setNewCatch({ ...newCatch, weight: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Length (inches)"
                  value={newCatch.length}
                  onChange={(e) => setNewCatch({ ...newCatch, length: Number(e.target.value) })}
                />
              </div>
              <Select
                value={newCatch.tournament_id}
                onValueChange={(value) => setNewCatch({ ...newCatch, tournament_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tournament (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name} - {new Date(tournament.date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Notes (optional)"
                value={newCatch.notes}
                onChange={(e) => setNewCatch({ ...newCatch, notes: e.target.value })}
              />
              <Button 
                onClick={handleCreateCatch}
                disabled={createCatchMutation.isPending || !newCatch.species.trim()}
              >
                Log Catch
              </Button>
            </CardContent>
          </Card>

          {/* Catches List */}
          <Card>
            <CardHeader>
              <CardTitle>My Catches ({catches.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {catchesLoading ? (
                <p>Loading catches...</p>
              ) : catches.length === 0 ? (
                <p className="text-muted-foreground">No catches logged yet. Log one above!</p>
              ) : (
                <div className="space-y-4">
                  {catches.map((catchData) => (
                    <div key={catchData.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{catchData.species}</h3>
                        <span className="text-sm text-muted-foreground">
                          {new Date(catchData.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {catchData.weight && (
                          <p className="flex items-center gap-1">
                            <Weight className="w-3 h-3" />
                            {catchData.weight} lbs
                          </p>
                        )}
                        {catchData.length && (
                          <p className="flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            {catchData.length} inches
                          </p>
                        )}
                        {catchData.tournament && (
                          <p className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {catchData.tournament.name}
                          </p>
                        )}
                        {catchData.notes && <p>{catchData.notes}</p>}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCatch({ ...catchData })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCatchMutation.mutate(catchData.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}