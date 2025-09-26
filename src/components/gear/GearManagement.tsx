import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  FileText, 
  Target, 
  Settings,
  Eye,
  EyeOff,
  Anchor,
  Activity
} from 'lucide-react';
import { SmartRodEntry } from './SmartRodEntry';
import { SmartReelEntry } from './SmartReelEntry';
import { ComboCreator } from './ComboCreator';
import { BoatProfile } from './BoatProfile';
import { useGear } from '@/hooks/useGear';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function GearManagement({ signatureTechniques = [] }: { signatureTechniques?: string[] }) {
  const { rods, reels, combos, boats, loading } = useGear();
  const [activeModal, setActiveModal] = useState<'rod' | 'reel' | 'combo' | 'boat' | null>(null);

  const closeModal = () => setActiveModal(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner message="Loading your gear..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Fishing Gear Management</h2>
        <p className="text-muted-foreground">
          Manage your rods, reels, combos, and boat with smart serial number lookup
        </p>
      </div>

      <Tabs defaultValue="rods" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rods">Rods ({rods.length})</TabsTrigger>
          <TabsTrigger value="reels">Reels ({reels.length})</TabsTrigger>
          <TabsTrigger value="combos">Combos ({combos.length})</TabsTrigger>
          <TabsTrigger value="boats">Boat ({boats.length})</TabsTrigger>
        </TabsList>

        {/* Rods Tab */}
        <TabsContent value="rods" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Rods</h3>
            <Button onClick={() => setActiveModal('rod')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Rod
            </Button>
          </div>

          {rods.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Rods Added Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your fishing rods with smart serial number lookup
                </p>
                <Button onClick={() => setActiveModal('rod')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Rod
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {rods.map((rod) => (
                <Card key={rod.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {rod.nickname || `${rod.brand} ${rod.model}`}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {rod.is_private ? (
                          <Badge variant="secondary" className="text-xs">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                    {rod.nickname && (
                      <p className="text-sm text-muted-foreground">{rod.brand} {rod.model}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Length:</span> {rod.length_feet}'{rod.length_inches ? `${rod.length_inches}"` : ''}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span> {rod.rod_type}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Power:</span> {rod.power}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Action:</span> {rod.action}
                      </div>
                    </div>
                    
                    {rod.primary_technique && (
                      <div className="flex items-center gap-2 mt-3">
                        <Target className="w-4 h-4 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {rod.primary_technique}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reels Tab */}
        <TabsContent value="reels" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Reels</h3>
            <Button onClick={() => setActiveModal('reel')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Reel
            </Button>
          </div>

          {reels.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Reels Added Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your fishing reels with automatic specification lookup
                </p>
                <Button onClick={() => setActiveModal('reel')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Reel
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reels.map((reel) => (
                <Card key={reel.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {reel.nickname || `${reel.brand} ${reel.model}`}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {reel.is_private ? (
                          <Badge variant="secondary" className="text-xs">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                    {reel.nickname && (
                      <p className="text-sm text-muted-foreground">{reel.brand} {reel.model}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span> {reel.reel_type}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ratio:</span> {reel.gear_ratio}
                      </div>
                      {reel.max_drag && (
                        <div>
                          <span className="text-muted-foreground">Max Drag:</span> {reel.max_drag} lbs
                        </div>
                      )}
                      {reel.bearings && (
                        <div>
                          <span className="text-muted-foreground">Bearings:</span> {reel.bearings}
                        </div>
                      )}
                    </div>
                    
                    {reel.line_capacity && (
                      <div className="text-sm mt-2">
                        <span className="text-muted-foreground">Line Capacity:</span> {reel.line_capacity}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Combos Tab */}
        <TabsContent value="combos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Rod & Reel Combos</h3>
            <Button 
              onClick={() => setActiveModal('combo')} 
              disabled={rods.length === 0 || reels.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Combo
            </Button>
          </div>

          {rods.length === 0 || reels.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Add Rods & Reels First</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You need at least one rod and one reel to create combos
                </p>
              </CardContent>
            </Card>
          ) : combos.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Combos Created Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create rod & reel combinations for optimal technique setups
                </p>
                <Button onClick={() => setActiveModal('combo')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Combo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {combos.map((combo) => (
                <Card key={combo.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">"{combo.nickname}"</CardTitle>
                      <div className="flex items-center gap-2">
                        {combo.is_private ? (
                          <Badge variant="secondary" className="text-xs">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Rod:</span> {(combo as any).rod?.brand} {(combo as any).rod?.model}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reel:</span> {(combo as any).reel?.brand} {(combo as any).reel?.model}
                      </div>
                    </div>
                    
                    {combo.primary_techniques && combo.primary_techniques.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Primary Techniques:</p>
                        <div className="flex flex-wrap gap-2">
                          {combo.primary_techniques.map((technique, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Target className="w-3 h-3 mr-1" />
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Boats Tab */}
        <TabsContent value="boats" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Boat</h3>
            <Button onClick={() => setActiveModal('boat')}>
              <Plus className="w-4 h-4 mr-2" />
              {boats.length > 0 ? 'Edit Boat' : 'Add Boat'}
            </Button>
          </div>

          {boats.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Anchor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Boat Profile Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your boat profile to showcase on your public profile
                </p>
                <Button onClick={() => setActiveModal('boat')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Boat
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {boats.map((boat) => (
                <Card key={boat.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        "{boat.nickname}" - {boat.brand} {boat.model}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {boat.is_private ? (
                          <Badge variant="secondary">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Public Showcase
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {boat.photo_url && (
                      <img 
                        src={boat.photo_url} 
                        alt={boat.nickname || 'Boat'}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {boat.year && (
                        <div>
                          <span className="text-muted-foreground">Year:</span> {boat.year}
                        </div>
                      )}
                      {boat.length_feet && (
                        <div>
                          <span className="text-muted-foreground">Length:</span> {boat.length_feet}'
                        </div>
                      )}
                      {boat.motor_brand && boat.motor_horsepower && (
                        <div>
                          <span className="text-muted-foreground">Motor:</span> {boat.motor_brand} {boat.motor_horsepower}HP
                        </div>
                      )}
                      {boat.tournament_wins > 0 && (
                        <div>
                          <span className="text-muted-foreground">Tournament Wins:</span> {boat.tournament_wins}
                        </div>
                      )}
                    </div>

                    {boat.special_features && boat.special_features.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Special Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {boat.special_features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <Dialog open={activeModal !== null} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeModal === 'rod' && 'Add New Rod'}
              {activeModal === 'reel' && 'Add New Reel'}
              {activeModal === 'combo' && 'Create Rod & Reel Combo'}
              {activeModal === 'boat' && 'Boat Profile'}
            </DialogTitle>
            <DialogDescription>
              {activeModal === 'rod' && 'Add a rod with smart serial number lookup'}
              {activeModal === 'reel' && 'Add a reel with automatic specifications'}
              {activeModal === 'combo' && 'Create a rod & reel combination setup'}
              {activeModal === 'boat' && 'Manage your boat profile information'}
            </DialogDescription>
          </DialogHeader>
          
          {activeModal === 'rod' && (
            <SmartRodEntry 
              onClose={closeModal}
              signatureTechniques={signatureTechniques}
            />
          )}
          {activeModal === 'reel' && (
            <SmartReelEntry 
              onClose={closeModal}
              userRods={rods}
            />
          )}
          {activeModal === 'combo' && (
            <ComboCreator
              onClose={closeModal}
              rods={rods}
              reels={reels}
              signatureTechniques={signatureTechniques}
            />
          )}
          {activeModal === 'boat' && (
            <BoatProfile
              onClose={closeModal}
              existingBoat={boats[0]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}