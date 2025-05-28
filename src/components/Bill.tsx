
import React from 'react';
import { X, Printer, Share } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BillProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    sessionId: string;
    sessionName: string;
    location: string;
    plan: string;
    photoCount: number;
    price: number;
    customerName?: string;
    orderDate: string;
    photos: Array<{ id: string; name: string; url: string }>;
  };
  onPrint: () => void;
}

const Bill: React.FC<BillProps> = ({ isOpen, onClose, orderData, onPrint }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('bill-content');
    if (printContent) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>PhotoKiosk Bill</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: Arial, sans-serif; margin: 20px; }
          .bill-header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
          .bill-details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
          .photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
          .photo-item { text-align: center; }
          .photo-item img { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
    onPrint();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PhotoKiosk Bill',
        text: `Bill for ${orderData.sessionName} - Total: ₹${orderData.price}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const billText = `PhotoKiosk Bill\nSession: ${orderData.sessionName}\nTotal: ₹${orderData.price}`;
      navigator.clipboard.writeText(billText);
      alert('Bill details copied to clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div id="bill-content" className="p-6">
          <div className="bill-header text-center mb-6">
            <h1 className="company-name text-2xl font-bold text-blue-600 mb-2">PhotoKiosk Pro</h1>
            <p className="text-gray-600">Professional Photo Session Management</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Bill No: #{orderData.sessionId}</p>
              <p>Date: {orderData.orderDate}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="bill-details">
            <h2 className="text-lg font-semibold mb-4">Session Details</h2>
            <div className="space-y-2">
              <div className="detail-row flex justify-between">
                <span>Session Name:</span>
                <span>{orderData.sessionName}</span>
              </div>
              <div className="detail-row flex justify-between">
                <span>Location:</span>
                <span>{orderData.location}</span>
              </div>
              <div className="detail-row flex justify-between">
                <span>Package:</span>
                <span>{orderData.plan}</span>
              </div>
              <div className="detail-row flex justify-between">
                <span>Number of Photos:</span>
                <span>{orderData.photoCount}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="bill-details">
            <h2 className="text-lg font-semibold mb-4">Selected Photos</h2>
            <div className="photo-grid grid grid-cols-3 gap-4">
              {orderData.photos.map((photo, index) => (
                <div key={photo.id} className="photo-item text-center">
                  <img 
                    src={photo.url} 
                    alt={photo.name}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <p className="text-xs mt-1 text-gray-600">Photo {index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="bill-details">
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-2">
              <div className="detail-row flex justify-between">
                <span>{orderData.plan} Package:</span>
                <span>₹{orderData.price}</span>
              </div>
              <div className="detail-row flex justify-between">
                <span>Photo Editing:</span>
                <span>Included</span>
              </div>
              <div className="detail-row flex justify-between">
                <span>Service Tax:</span>
                <span>Included</span>
              </div>
              <Separator className="my-2" />
              <div className="total-row detail-row flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>₹{orderData.price}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Thank you for choosing PhotoKiosk Pro!</p>
            <p>Your photos will be ready for pickup shortly.</p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleShare}>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              <Printer className="w-4 h-4 mr-2" />
              Print Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Bill;
