import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Eye, X, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const PrintQueue = () => {
  const { toast } = useToast();
  const [printRequests, setPrintRequests] = useState<any[]>([]);

  useEffect(() => {
    // Load print requests from localStorage
    const storedQueue = localStorage.getItem('printQueue');
    if (storedQueue) {
      setPrintRequests(JSON.parse(storedQueue));
    }
  }, []);

  const updatePrintQueue = (updatedRequests: any[]) => {
    setPrintRequests(updatedRequests);
    localStorage.setItem('printQueue', JSON.stringify(updatedRequests));
  };

  const handlePrint = (requestId: number) => {
    const updatedRequests = printRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'completed' }
        : req
    );
    updatePrintQueue(updatedRequests);
    
    // Simulate printing the photos - each photo on separate page
    const request = printRequests.find(req => req.id === requestId);
    if (request) {
      const printWindow = window.open('', '', 'height=800,width=1000');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Photos</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0;
            text-align: center; 
          }
          .page {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            page-break-after: always;
            padding: 20px;
            box-sizing: border-box;
          }
          .page:last-child {
            page-break-after: avoid;
          }
          .photo-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 80%;
            width: 100%;
          }
          .photo-container img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border: 2px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .photo-info {
            margin-top: 20px;
            text-align: center;
          }
          .session-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .photo-label {
            font-size: 18px;
            font-weight: 600;
            color: #666;
            margin-bottom: 5px;
          }
          .print-date {
            font-size: 14px;
            color: #888;
          }
          @media print {
            .page {
              page-break-after: always;
            }
            .page:last-child {
              page-break-after: avoid;
            }
          }
        `);
        printWindow.document.write('</style></head><body>');
        
        request.photos.forEach((photo: any, index: number) => {
          printWindow.document.write(`
            <div class="page">
              <div class="photo-container">
                <img src="${photo.url}" alt="${photo.name}" />
              </div>
              <div class="photo-info">
                <div class="session-title">${request.sessionName}</div>
                <div class="photo-label">Photo ${index + 1} of ${request.photos.length}</div>
                <div class="print-date">Printed on ${new Date().toLocaleDateString()}</div>
              </div>
            </div>
          `);
        });
        
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
    
    toast({
      title: "Photos Printed Successfully",
      description: "Each photo has been printed on a separate page.",
    });
  };

  const handleCancel = (requestId: number) => {
    const updatedRequests = printRequests.filter(req => req.id !== requestId);
    updatePrintQueue(updatedRequests);
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
                    ₹{completedRequests.reduce((sum, req) => sum + (req.totalAmount || req.price || 0), 0)}
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
                        <p className="text-gray-600">Customer: {request.customerName || 'Customer'}</p>
                        <p className="text-gray-600">Order Date: {request.orderDate}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {request.plan} Plan
                        </Badge>
                        <p className="text-lg font-bold">₹{request.totalAmount || request.price}</p>
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
                              Preview of edited photos ready for printing (each will print on separate page)
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-h-96 overflow-y-auto">
                            {request.photos.map((photo: any) => (
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
                        <p className="text-gray-600">Customer: {request.customerName || 'Customer'}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="bg-green-600 mb-2">
                          Completed
                        </Badge>
                        <p className="text-lg font-bold">₹{request.totalAmount || request.price}</p>
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
