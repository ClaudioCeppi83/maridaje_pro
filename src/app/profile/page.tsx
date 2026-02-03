'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUserProfile, updateUserProfile, getWineCellar, updateWineCellar, getSavedPairings } from '@/app/actions/user';
import { UserProfile, SavedPairing } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Save, Wine, User as UserIcon, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const status = sessionContext?.status;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cellar, setCellar] = useState<string>('');
  const [savedPairings, setSavedPairings] = useState<SavedPairing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);

  async function loadData() {
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([
        getUserProfile(),
        getWineCellar(),
        getSavedPairings(),
      ]);
      setProfile(p);
      setCellar(c.join('\n'));
      setSavedPairings(s);
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos del perfil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await updateUserProfile({
        displayName: profile.displayName || '',
        isCellarModeEnabled: profile.isCellarModeEnabled,
      });
      toast({ title: 'Perfil actualizado', description: 'Tus cambios han sido guardados.' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el perfil.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCellar() {
    setSaving(true);
    try {
      const winesList = cellar.split('\n').map(w => w.trim()).filter(w => w !== '');
      await updateWineCellar(winesList);
      toast({ title: 'Bodega actualizada', description: 'Tu lista de vinos ha sido guardada.' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar la bodega.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="flex items-center justify-center min-vh-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-vh-100 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Inicia sesión para ver tu perfil</h1>
        <p className="text-muted-foreground mb-6">Necesitas estar autenticado para gestionar tu bodega y ver tus maridajes guardados.</p>
        <Button onClick={() => window.location.href = '/'}>Volver al Inicio</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 px-4">
      <div className="flex items-center gap-6 mb-10">
        <Avatar className="w-24 h-24 border-4 border-primary/10">
          <AvatarImage src={profile?.photoURL || ''} alt={profile?.displayName || ''} />
          <AvatarFallback className="text-2xl">{profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{profile?.displayName || 'Usuario'}</h1>
          <p className="text-muted-foreground">{profile?.email}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex gap-2">
            <UserIcon className="w-4 h-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger value="cellar" className="flex gap-2">
            <Wine className="w-4 h-4" /> Mi Bodega
          </TabsTrigger>
          <TabsTrigger value="history" className="flex gap-2">
            <History className="w-4 h-4" /> Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Ajustes de Perfil</CardTitle>
              <CardDescription>Gestiona tu información personal y preferencias.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre para mostrar</Label>
                  <Input 
                    id="name" 
                    value={profile?.displayName || ''} 
                    onChange={(e) => setProfile(prev => prev ? { ...prev, displayName: e.target.value } : null)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">Modo Bodega Personal</Label>
                    <p className="text-sm text-muted-foreground">
                      Priorizar siempre recomendaciones de "Mi Bodega" automáticamente.
                    </p>
                  </div>
                  <Switch 
                    checked={profile?.isCellarModeEnabled || false}
                    onCheckedChange={(checked) => setProfile(prev => prev ? { ...prev, isCellarModeEnabled: checked } : null)}
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar Cambios
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cellar">
          <Card>
            <CardHeader>
              <CardTitle>Mi Bodega de Vinos</CardTitle>
              <CardDescription>
                Ingresa los vinos que tienes disponibles (uno por línea). 
                La IA intentará encontrarte el maridaje perfecto usando solo lo que tienes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cellar-data">Lista de Vinos</Label>
                <Textarea 
                  id="cellar-data"
                  placeholder="Ej: Casillero del Diablo Cabernet Sauvignon&#10;Luigi Bosca Malbec&#10;Chardonnay Santa Julia..."
                  className="min-h-[300px] font-mono whitespace-pre"
                  value={cellar}
                  onChange={(e) => setCellar(e.target.value)}
                />
              </div>
              <Button onClick={handleUpdateCellar} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Actualizar Bodega
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid gap-4">
            {savedPairings.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
                <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">Aún no has guardado ningún maridaje.</p>
              </div>
            ) : (
              savedPairings.map((pairing) => (
                <Card key={pairing.id} className="overflow-hidden">
                  <div className="flex p-4 gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{pairing.dishName}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{pairing.dishDescription || pairing.dishCategory}</p>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Wine className="w-4 h-4" />
                        <span>{pairing.recommendation.recommendedGrapeVarietals}</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {new Date(pairing.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
