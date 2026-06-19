import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity, BrainCircuit, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth, UserRole, SYSTEM_USERS } from '../contexts/AuthContext';

export default function LoginView() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email or phone number and password');
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      // Find matching user from SYSTEM_USERS
      const user = SYSTEM_USERS.find((u: any) => 
        u.email.toLowerCase() === identifier.toLowerCase().trim() || 
        u.phone === identifier.trim()
      );

      if (user) {
        loginAs(user);
        localStorage.setItem('medcore_auth', JSON.stringify({ role: user.role, isAuthenticated: true }));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-foreground">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
            <Activity className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-foreground">
          Sehati AI CIS
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground font-medium">
          Clinical Information System with AI Microservices
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-card py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium rounded-xl p-3">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="identifier"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium transition-colors"
                  placeholder="name@example.com or phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl pl-11 pr-12 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <BrainCircuit className="w-5 h-5 animate-pulse mr-2" />
                  Authenticating...
                </span>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
