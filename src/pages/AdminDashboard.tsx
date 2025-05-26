
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Package, MapPin, Settings, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();

  // Mock data
  const [photographers] = useState([
    { id: 1, name: 'John Smith', email: 'john@photo.com', status: 'active', sessions: 5 },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@photo.com', status: 'inactive', sessions: 3 },
  ]);

  const [sessions] = useState([
    { id: 'SESS001', name: 'Beach Session', photographer: 'John Smith', status: 'active', photos: 12 },
    { id: 'SESS002', name: 'Wedding Photos', photographer: 'Sarah Wilson', status: 'completed', photos: 25 },
  ]);

  const [plans] = useState([
    { id: 'basic', name: 'Basic', photos: 2, price: 100 },
    { id: 'standard', name: 'Standard', photos: 5, price: 250 },
    { id: 'premium', name: 'Premium', photos: 10, price: 500 },
    { id: 'unlimited', name: 'Unlimited', photos: 20, price: 1000 },
  ]);

  const [locations] = useState([
    { id: 1, name: 'Marina Beach', city: 'Chennai' },
    { id: 2, name: 'Central Park', city: 'Mumbai' },
    { id: 3, name: 'India Gate', city: 'Delhi' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/admin">
            <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-purple-700">Admin Dashboard</h1>
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
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-purple-700">
                      <Users className="w-6 h-6 mr-2" />
                      Photographers Management
                    </CardTitle>
                    <CardDescription>
                      Manage photographer accounts and permissions
                    </CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Photographer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {photographers.map((photographer) => (
                    <div key={photographer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{photographer.name}</h3>
                        <p className="text-gray-600">{photographer.email}</p>
                        <p className="text-sm text-gray-500">{photographer.sessions} active sessions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={photographer.status === 'active' ? 'default' : 'secondary'}>
                          {photographer.status}
                        </Badge>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
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
                        <p className="text-sm text-gray-500">Photographer: {session.photographer}</p>
                        <p className="text-sm text-gray-500">{session.photos} photos</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Folder
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-purple-700">
                      <Package className="w-6 h-6 mr-2" />
                      Pricing Plans
                    </CardTitle>
                    <CardDescription>
                      Manage package pricing and photo limits
                    </CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-gray-600">{plan.photos} photos</p>
                      <p className="text-2xl font-bold text-purple-700">₹{plan.price}</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-purple-700">
                      <MapPin className="w-6 h-6 mr-2" />
                      Location Management
                    </CardTitle>
                    <CardDescription>
                      Manage available photo session locations
                    </CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{location.name}</h3>
                        <p className="text-gray-600">{location.city}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
