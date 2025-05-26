
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Users, Settings, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">PhotoKiosk Pro</h1>
          <p className="text-xl text-gray-600">Professional Photo Session Management System</p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* User Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">User Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Search for your photo session and select your photos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/user">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                  Find My Photos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Photographer Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-green-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Photographer</CardTitle>
              <CardDescription className="text-gray-600">
                Create sessions and manage your photo uploads
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/photographer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3">
                  Photographer Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-purple-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-700">Admin Panel</CardTitle>
              <CardDescription className="text-gray-600">
                Manage photographers, pricing, and system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/admin">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">System Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Session Management</h3>
              <p className="text-gray-600 text-sm">Create and organize photo sessions with unique pins</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Photo Editing</h3>
              <p className="text-gray-600 text-sm">Advanced editing tools with filters, crops, and adjustments</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Bundle Plans</h3>
              <p className="text-gray-600 text-sm">Flexible pricing with multiple photo packages</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Print Queue</h3>
              <p className="text-gray-600 text-sm">Manage and track photo printing orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
