
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const PhotographerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Allow any email and password for testing
      if (email.trim() && password.trim()) {
        // Store photographer session with entered email
        const photographer = {
          id: '1',
          name: email.split('@')[0] || 'Test Photographer',
          email: email,
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        localStorage.setItem('currentPhotographer', JSON.stringify(photographer));
        toast({
          title: "Login Successful",
          description: `Welcome, ${photographer.name}!`,
        });
        navigate('/photographer/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter any email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-green-600 hover:text-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Photographer Login</CardTitle>
            <CardDescription className="text-gray-600">
              Access your photo session dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="photographer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter any password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Test Mode Info */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium mb-1">Test Mode:</p>
              <p className="text-xs text-green-600">Enter any email and password to access photographer dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhotographerLogin;
