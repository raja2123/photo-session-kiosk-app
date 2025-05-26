
import { Link } from 'react-router-dom';
import { Camera, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-6 animate-fade-in">
              Photo Kiosk
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Professional photo session management and editing platform for photographers and clients
            </p>
            <div className="flex justify-center gap-4">
              <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
              <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Cards Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* User Portal */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-2xl hover:shadow-3xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                User Portal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Access your photo sessions and edit your memories
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/user">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Access Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Photographer Portal */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-100 border-0 shadow-2xl hover:shadow-3xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Photographer
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage sessions and upload photos for clients
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/photographer">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Photographer Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-100 border-0 shadow-2xl hover:shadow-3xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Admin Panel
              </CardTitle>
              <CardDescription className="text-gray-600">
                System administration and user management
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/admin">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
              <p className="opacity-90">High-quality photo processing and editing tools</p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
              <p className="opacity-90">Simple session-based access for all users</p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="opacity-90">Your photos are safely stored and managed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
