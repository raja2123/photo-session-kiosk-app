
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Camera, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const UserPortal = () => {
  const [sessionSearch, setSessionSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    // Mock search results for demo
    const mockResults = [
      {
        id: 'SESS001',
        name: 'Wedding Photography - Sarah & John',
        location: 'Central Park',
        date: '2024-01-15'
      },
      {
        id: 'SESS002', 
        name: 'Birthday Party - Emma',
        location: 'Garden Venue',
        date: '2024-01-10'
      }
    ];
    
    if (sessionSearch.trim()) {
      setSearchResults(mockResults.filter(session => 
        session.name.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        session.id.toLowerCase().includes(sessionSearch.toLowerCase())
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">User Portal</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Card */}
          <Card className="mb-8 bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Find Your Photos
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Enter your session ID or session name to access your photos
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Search Section */}
          <Card className="bg-gradient-to-br from-white/95 to-indigo-50/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Search Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-gray-700">Session ID or Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Enter session ID or name..."
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    className="flex-1 border-gray-300 focus:border-blue-500 bg-white/90"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold text-gray-800">Search Results:</h3>
                  {searchResults.map((session) => (
                    <Card key={session.id} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-gray-800">{session.name}</h4>
                            <p className="text-sm text-gray-600">ID: {session.id}</p>
                            <p className="text-sm text-gray-600">Location: {session.location}</p>
                            <p className="text-sm text-gray-600">Date: {session.date}</p>
                          </div>
                          <Link to={`/user/session/${session.id}`}>
                            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                              Access Session
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Demo Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-orange-800 mb-2">Demo Sessions Available:</h4>
                <div className="space-y-1 text-sm text-orange-700">
                  <p>• Session ID: SESS001 - Wedding Photography</p>
                  <p>• Session ID: SESS002 - Birthday Party</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserPortal;
