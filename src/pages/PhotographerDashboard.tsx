
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Camera, LogOut, Eye, Printer, Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { storage, Session, Order } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const PhotographerDashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [photographer, setPhotographer] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize storage and load data
    storage.init();
    
    const currentPhotographer = localStorage.getItem('currentPhotographer');
    if (!currentPhotographer) {
      navigate('/photographer');
      return;
    }

    const photographerData = JSON.parse(currentPhotographer);
    setPhotographer(photographerData);

    // Load photographer's sessions
    const allSessions = storage.getSessions();
    const photographerSessions = allSessions.filter(s => s.photographerId === photographerData.id);
    setSessions(photographerSessions);

    // Load orders for print queue
    const allOrders = storage.getOrders();
    const pendingOrders = allOrders.filter(o => o.status === 'paid');
    setOrders(pendingOrders);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentPhotographer');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'printed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Photographer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {photographer?.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-green-600">{sessions.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {sessions.filter(s => s.status === 'active').length}
                  </p>
                </div>
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Print Queue</p>
                  <p className="text-2xl font-bold text-orange-600">{orders.length}</p>
                </div>
                <Printer className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {sessions.filter(s => s.status === 'printed').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link to="/photographer/create-session">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Session
            </Button>
          </Link>
          <Link to="/photographer/print-queue">
            <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
              <Printer className="w-4 h-4 mr-2" />
              Print Queue ({orders.length})
            </Button>
          </Link>
        </div>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              My Sessions
            </CardTitle>
            <CardDescription>
              Manage your photo sessions and view client orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No sessions yet</h3>
                <p className="text-gray-400 mb-4">Create your first photo session to get started</p>
                <Link to="/photographer/create-session">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{session.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {session.location}
                          </span>
                          <span>Session ID: {session.id}</span>
                          <span>PIN: {session.pin}</span>
                          <span>{session.photos.length} photos</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Link to={`/photographer/session/${session.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created on {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhotographerDashboard;
