
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Eye, X, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const PrintQueue = () => {
  const { toast } = useToast();
  
  const [printRequests, setPrintRequests] = useState([
    {
      id: 1,
      sessionId: 'SESS001',
      sessionName: 'Beach Photo Session',
      customerName: 'John Doe',
      plan: 'Standard',
      photoCount: 3,
      totalAmount: 250,
      status: 'pending',
      orderDate: '2024-01-15',
      photos: [
        { id: 1, name: 'Photo 1', url: '/placeholder.svg?height=200&width=200&text=Photo1' },
        { id: 2, name: 'Photo 2', url: '/placeholder.svg?height=200&width=200&text=Photo2' },
        { id: 3, name: 'Photo 3', url: '/placeholder.svg?height=200&width=200&text=Photo3' },
      ]
    },
    {
      id: 2,
      sessionId: 'SESS002',
      sessionName: 'Wedding Photos',
      customerName: 'Jane Smith',
      plan: 'Premium',
      photoCount: 5,
      totalAmount: 500,
      status: 'pending',
      orderDate: '2024-01-14',
      photos: [
        { id: 4, name: 'Photo 4', url: '/placeholder.svg?height=200&width=200&text=Photo4' },
        { id: 5, name: 'Photo 5', url: '/placeholder.svg?height=200&width=200&text=Photo5' },
      ]
    }
  ]);

  const handlePrint = (requestId: number) => {
    setPrintRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'completed' }
          : req
      )
    );
    toast({
      title: "Photos Printed Successfully",
      description: "The order has been marked as completed.",
    });
  };

  const handleCancel = (requestId: number) => {
    setPrintRequests(prev => prev.filter(req => req.id !== requestId));
    toast({
      title: "Order Cancelled",
      description: "The print request has been cancelled and removed.",
      variant: "destructive",
    });
  };

  const pendingRequests = printRequests.filter(req => req.status === 'pending');
  const completedRequests = printRequests.filter(req => req.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/photographer/dashboard">
            <Button variant="ghost" className="text-green-600 hover:text-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-green-700">Print Queue</h1>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingRequests.length}</p>
                </div>
                <Printer className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Orders</p>
                  <p className="text-3xl font-bold text-green-600">{completedRequests.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{completedRequests.reduce((sum, req) => sum + req.totalAmount, 0)}
                  </p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Printer className="w-6 h-6 mr-2" />
              Pending Print Requests
            </CardTitle>
            <CardDescription>
              Orders ready for printing and payment processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending print requests</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{request.sessionName}</h3>
                        <p className="text-gray-600">Session ID: {request.sessionId}</p>
                        <p className="text-gray-600">Customer: {request.customerName}</p>
                        <p className="text-gray-600">Order Date: {request.orderDate}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {request.plan} Plan
                        </Badge>
                        <p className="text-lg font-bold">₹{request.totalAmount}</p>
                        <p className="text-sm text-gray-500">{request.photoCount} photos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Photos
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Photo Preview - {request.sessionName}</DialogTitle>
                            <DialogDescription>
                              Preview of edited photos ready for printing
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {request.photos.map((photo) => (
                              <div key={photo.id} className="aspect-square">
                                <img
                                  src={photo.url}
                                  alt={photo.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        onClick={() => handlePrint(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Photos
                      </Button>
                      
                      <Button
                        onClick={() => handleCancel(request.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Orders */}
        {completedRequests.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="w-6 h-6 mr-2" />
                Completed Orders
              </CardTitle>
              <CardDescription>
                Successfully printed and paid orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{request.sessionName}</h3>
                        <p className="text-gray-600">Session ID: {request.sessionId}</p>
                        <p className="text-gray-600">Customer: {request.customerName}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="bg-green-600 mb-2">
                          Completed
                        </Badge>
                        <p className="text-lg font-bold">₹{request.totalAmount}</p>
                        <p className="text-sm text-gray-500">{request.photoCount} photos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrintQueue;
