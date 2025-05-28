
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Package, MapPin, Settings, Trash2, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { storage, Photographer, Session, BundlePlan, Location } from '@/lib/storage';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [plans, setPlans] = useState<BundlePlan[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAddPhotographer, setShowAddPhotographer] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);

  // Form states
  const [newPhotographer, setNewPhotographer] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [newPlan, setNewPlan] = useState({
    name: '',
    photoLimit: 0,
    price: 0,
    description: ''
  });
  const [newLocation, setNewLocation] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPhotographers(storage.getPhotographers());
    setSessions(storage.getSessions());
    setPlans(storage.getBundlePlans());
    setLocations(storage.getLocations());
  };

  const handleDeletePhotographer = (id: string) => {
    storage.deletePhotographer(id);
    setPhotographers(storage.getPhotographers());
    toast({
      title: "Photographer Deleted",
      description: "The photographer has been removed successfully.",
    });
  };

  const handleDeleteSession = (id: string) => {
    storage.deleteSession(id);
    setSessions(storage.getSessions());
    toast({
      title: "Session Deleted",
      description: "The session has been removed successfully.",
    });
  };

  const handleDeletePlan = (id: string) => {
    storage.deleteBundlePlan(id);
    setPlans(storage.getBundlePlans());
    toast({
      title: "Plan Deleted",
      description: "The pricing plan has been removed successfully.",
    });
  };

  const handleDeleteLocation = (id: string) => {
    storage.deleteLocation(id);
    setLocations(storage.getLocations());
    toast({
      title: "Location Deleted",
      description: "The location has been removed successfully.",
    });
  };

  const handleAddPhotographer = () => {
    if (!newPhotographer.name || !newPhotographer.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const photographer: Photographer = {
      id: storage.generateId(),
      name: newPhotographer.name,
      email: newPhotographer.email,
      password: newPhotographer.password || 'password123',
      isActive: true,
      createdAt: new Date()
    };

    storage.addPhotographer(photographer);
    setPhotographers(storage.getPhotographers());
    setNewPhotographer({ name: '', email: '', password: '' });
    setShowAddPhotographer(false);
    toast({
      title: "Photographer Added",
      description: "New photographer has been added successfully.",
    });
  };

  const handleAddPlan = () => {
    if (!newPlan.name || newPlan.photoLimit <= 0 || newPlan.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    const plan: BundlePlan = {
      id: storage.generateId(),
      name: newPlan.name,
      photoLimit: newPlan.photoLimit,
      price: newPlan.price,
      description: newPlan.description,
      isActive: true
    };

    storage.addBundlePlan(plan);
    setPlans(storage.getBundlePlans());
    setNewPlan({ name: '', photoLimit: 0, price: 0, description: '' });
    setShowAddPlan(false);
    toast({
      title: "Plan Added",
      description: "New pricing plan has been added successfully.",
    });
  };

  const handleAddLocation = () => {
    if (!newLocation.name) {
      toast({
        title: "Error",
        description: "Please enter a location name.",
        variant: "destructive",
      });
      return;
    }

    const location: Location = {
      id: storage.generateId(),
      name: newLocation.name,
      description: newLocation.description,
      isActive: true
    };

    storage.addLocation(location);
    setLocations(storage.getLocations());
    setNewLocation({ name: '', description: '' });
    setShowAddLocation(false);
    toast({
      title: "Location Added",
      description: "New location has been added successfully.",
    });
  };

  const viewSessionFolder = (sessionId: string) => {
    const files = storage.getSessionFiles(sessionId);
    toast({
      title: "Session Files",
      description: `This session contains ${files.length} files.`,
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/admin">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
          <Button
            onClick={() => {
              localStorage.removeItem('isAdminLoggedIn');
              window.location.href = '/admin';
            }}
            variant="outline"
          >
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="photographers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="photographers">Photographers</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          {/* Photographers Tab */}
          <TabsContent value="photographers">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-blue-700">
                      <Users className="w-6 h-6 mr-2" />
                      Photographers Management
                    </CardTitle>
                    <CardDescription>
                      Manage photographer accounts and permissions
                    </CardDescription>
                  </div>
                  <Dialog open={showAddPhotographer} onOpenChange={setShowAddPhotographer}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Photographer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Photographer</DialogTitle>
                        <DialogDescription>
                          Enter the photographer's information below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={newPhotographer.name}
                            onChange={(e) => setNewPhotographer(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter photographer name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newPhotographer.email}
                            onChange={(e) => setNewPhotographer(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newPhotographer.password}
                            onChange={(e) => setNewPhotographer(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter password (optional)"
                          />
                        </div>
                        <Button onClick={handleAddPhotographer} className="w-full">
                          Add Photographer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {photographers.map((photographer) => (
                    <div key={photographer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{photographer.name}</h3>
                        <p className="text-gray-600">{photographer.email}</p>
                        <p className="text-sm text-gray-500">
                          Active: {photographer.isActive ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={photographer.isActive ? 'default' : 'secondary'}>
                          {photographer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeletePhotographer(photographer.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {photographers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No photographers found. Add one to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Settings className="w-6 h-6 mr-2" />
                  Session Management
                </CardTitle>
                <CardDescription>
                  View and manage all photo sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{session.name}</h3>
                        <p className="text-gray-600">ID: {session.id}</p>
                        <p className="text-sm text-gray-500">Location: {session.location}</p>
                        <p className="text-sm text-gray-500">{session.photos.length} photos</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => viewSessionFolder(session.id)}
                        >
                          <Eye className="w-4 h-4" />
                          View Folder
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No sessions found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-blue-700">
                      <Package className="w-6 h-6 mr-2" />
                      Pricing Plans
                    </CardTitle>
                    <CardDescription>
                      Manage package pricing and photo limits
                    </CardDescription>
                  </div>
                  <Dialog open={showAddPlan} onOpenChange={setShowAddPlan}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Pricing Plan</DialogTitle>
                        <DialogDescription>
                          Create a new pricing plan for customers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="planName">Plan Name</Label>
                          <Input
                            id="planName"
                            value={newPlan.name}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Premium"
                          />
                        </div>
                        <div>
                          <Label htmlFor="photoLimit">Photo Limit</Label>
                          <Input
                            id="photoLimit"
                            type="number"
                            value={newPlan.photoLimit}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, photoLimit: parseInt(e.target.value) || 0 }))}
                            placeholder="Number of photos"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newPlan.price}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                            placeholder="Price in rupees"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={newPlan.description}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Plan description"
                          />
                        </div>
                        <Button onClick={handleAddPlan} className="w-full">
                          Add Plan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-gray-600">{plan.photoLimit} photos</p>
                      <p className="text-2xl font-bold text-blue-700">₹{plan.price}</p>
                      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {plans.length === 0 && (
                    <div className="col-span-4 text-center py-8 text-gray-500">
                      No pricing plans found. Add one to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-blue-700">
                      <MapPin className="w-6 h-6 mr-2" />
                      Location Management
                    </CardTitle>
                    <CardDescription>
                      Manage available photo session locations
                    </CardDescription>
                  </div>
                  <Dialog open={showAddLocation} onOpenChange={setShowAddLocation}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Location
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Location</DialogTitle>
                        <DialogDescription>
                          Add a new location for photo sessions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="locationName">Location Name</Label>
                          <Input
                            id="locationName"
                            value={newLocation.name}
                            onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Central Park"
                          />
                        </div>
                        <div>
                          <Label htmlFor="locationDescription">Description</Label>
                          <Input
                            id="locationDescription"
                            value={newLocation.description}
                            onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the location"
                          />
                        </div>
                        <Button onClick={handleAddLocation} className="w-full">
                          Add Location
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{location.name}</h3>
                        <p className="text-gray-600">{location.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {locations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No locations found. Add one to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
