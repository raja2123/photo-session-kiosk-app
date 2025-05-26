
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo credentials
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-amber-700 font-bold">
              Admin Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              System administration access
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">Admin Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                  className="border-gray-300 focus:border-amber-500 bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                    className="border-gray-300 focus:border-amber-500 bg-white/90 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Accessing...' : 'Access Admin Panel'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-amber-600">Username: admin</p>
              <p className="text-xs text-amber-600">Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
