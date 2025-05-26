
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Camera, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { storage, Session } from '@/lib/storage';

const UserPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Session[]>([]);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Load all active sessions for display
    const sessions = storage.getSessions().filter(s => s.status === 'active');
    setAllSessions(sessions);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const results = storage.searchSessions(searchTerm);
    setSearchResults(results.filter(s => s.status === 'active'));
    setHasSearched(true);
  };

  const displaySessions = hasSearched ? searchResults : allSessions.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Photos</h1>
          <p className="text-gray-600">Search for your photo session and view your memories</p>
        </div>

        {/* Search Section */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-700">Search Photo Sessions</CardTitle>
            <CardDescription>
              Enter the session name provided by your photographer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Session Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    type="text"
                    placeholder="e.g., Smith Family Wedding, Beach Photoshoot"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 flex-1"
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {hasSearched ? (
              searchResults.length > 0 ? `Found ${searchResults.length} session(s)` : 'No sessions found'
            ) : (
              'Recent Photo Sessions'
            )}
          </h2>
          {hasSearched && searchResults.length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No sessions found</h3>
                <p className="text-gray-400 mb-4">
                  Please check the session name and try again, or contact your photographer
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setHasSearched(false);
                  }}
                  variant="outline"
                >
                  View All Sessions
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sessions Grid */}
        {displaySessions.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySessions.map((session) => (
              <Card key={session.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-2 border-blue-100">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                      {session.name}
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {session.photos.length} photos
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Session ID</p>
                      <p className="text-blue-600 font-mono">{session.id}</p>
                    </div>
                    <Link to={`/user/session/${session.id}`} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Camera className="w-4 h-4 mr-2" />
                        Access Session
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">Need Help?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-medium mb-2">Finding Your Session:</h4>
                <ul className="space-y-1">
                  <li>• Ask your photographer for the session name</li>
                  <li>• Session names are usually descriptive (e.g., "Wedding Photos")</li>
                  <li>• Search is case-insensitive</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Accessing Photos:</h4>
                <ul className="space-y-1">
                  <li>• You'll need a 4-digit PIN from your photographer</li>
                  <li>• Choose a bundle plan to select your photos</li>
                  <li>• Edit and customize your selected photos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserPortal;
