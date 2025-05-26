
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { storage, Location } from '@/lib/storage';

const CreateSession = () => {
  const [sessionName, setSessionName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load locations
    const allLocations = storage.getLocations();
    setLocations(allLocations);
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionName.trim() || !selectedLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const currentPhotographer = localStorage.getItem('currentPhotographer');
      if (!currentPhotographer) {
        navigate('/photographer');
        return;
      }

      const photographer = JSON.parse(currentPhotographer);
      const sessionId = storage.generateId();
      const pin = storage.generatePin();
      
      const newSession = {
        id: sessionId,
        name: sessionName.trim(),
        location: selectedLocation,
        pin: pin,
        photographerId: photographer.id,
        createdAt: new Date(),
        photos: [],
        status: 'active' as const
      };

      storage.addSession(newSession);

      toast({
        title: "Session Created Successfully!",
        description: `Session ID: ${sessionId} | PIN: ${pin}`,
      });

      // Navigate to the session management page
      navigate(`/photographer/session/${sessionId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/photographer/dashboard">
            <Button variant="ghost" className="text-green-600 hover:text-green-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Create New Session</h1>
          <p className="text-gray-600">Set up a new photo session for your clients</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">New Photo Session</CardTitle>
              <CardDescription className="text-gray-600">
                Create a session with a unique ID and PIN for your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSession} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionName">Session Name *</Label>
                  <Input
                    id="sessionName"
                    type="text"
                    placeholder="e.g., Smith Family Wedding, Beach Photoshoot"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    required
                    className="border-gray-300 focus:border-green-500"
                  />
                  <p className="text-sm text-gray-500">
                    Choose a descriptive name that clients can easily identify
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
                    <SelectTrigger className="border-gray-300 focus:border-green-500">
                      <SelectValue placeholder="Select shooting location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.name}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{location.name}</p>
                              {location.description && (
                                <p className="text-sm text-gray-500">{location.description}</p>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Session Info Preview */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">Session Details Preview</h3>
                  <div className="space-y-1 text-sm text-green-700">
                    <p><strong>Name:</strong> {sessionName || 'Session name will appear here'}</p>
                    <p><strong>Location:</strong> {selectedLocation || 'Selected location will appear here'}</p>
                    <p><strong>Session ID:</strong> Will be generated automatically</p>
                    <p><strong>PIN:</strong> 4-digit PIN will be generated for client access</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                  disabled={loading}
                >
                  {loading ? (
                    'Creating Session...'
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Session
                    </>
                  )}
                </Button>
              </form>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• A unique Session ID and 4-digit PIN will be generated</li>
                  <li>• You can upload photos to this session</li>
                  <li>• Clients can search for the session using the session name</li>
                  <li>• Clients will need the PIN to access the photos</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;
