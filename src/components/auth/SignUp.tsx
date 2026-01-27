import { useState } from 'react';
import { Grid3x3, User, Mail, Lock, Eye, EyeOff, Moon, Sun, Check, X, Sparkles, Zap } from 'lucide-react';
import vizlyLogo from 'figma:asset/96bf4512efe4ad439d153f2c27b017ec43a256da.png';

interface SignUpProps {
  onSignUp: () => void;
  onNavigateToLogin: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export default function SignUp({ onSignUp, onNavigateToLogin, darkMode, onToggleDarkMode }: SignUpProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ username?: boolean; email?: boolean; password?: boolean }>({});

  // Password validation rules
  const passwordRules = {
    minLength: password.length >= 8,
    maxLength: password.length <= 128,
    noSpaces: !/\s/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(rule => rule);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { username?: string; email?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password does not meet all requirements';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ username: true, email: true, password: true });
      return;
    }
    
    // Clear errors and sign up
    setErrors({});
    onSignUp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => onToggleDarkMode(!darkMode)}
        className="fixed top-6 right-6 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10 group"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-45 transition-transform duration-300" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600 group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>

      {/* Sign Up Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-500 hover:shadow-purple-500/10 hover:shadow-3xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 group">
              <div className="relative">
                <img src={vizlyLogo} alt="Vizly" className="w-16 h-16 transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </div>
            <h1 className="text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
              Create Account
              <Zap className="w-5 h-5 text-purple-500 animate-pulse" />
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Join Vizly today</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="group">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({ ...errors, username: undefined });
                  }}
                  onBlur={() => setTouched({ ...touched, username: true })}
                  placeholder="Choose a username"
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border ${
                    errors.username && touched.username ? 'border-red-500 animate-shake' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600`}
                />
              </div>
              {errors.username && touched.username && (
                <p className="text-red-500 text-sm mt-1 animate-slideDown flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: undefined });
                  }}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border ${
                    errors.email && touched.email ? 'border-red-500 animate-shake' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600`}
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1 animate-slideDown flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: undefined });
                  }}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  placeholder="Create a strong password"
                  className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900/50 border ${
                    errors.password && touched.password ? 'border-red-500 animate-shake' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 space-y-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-900/80 p-4 rounded-xl border border-gray-200 dark:border-gray-700 animate-slideDown">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Password strength:</p>
                    <div className="flex gap-1">
                      {[passwordRules.minLength, passwordRules.hasUpperCase, passwordRules.hasLowerCase, passwordRules.hasNumber, passwordRules.hasSpecialChar].map((rule, i) => (
                        <div key={i} className={`h-1 w-6 rounded-full transition-all ${rule ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      {passwordRules.minLength ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordRules.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        8+ chars
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordRules.hasUpperCase ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordRules.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        Uppercase
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordRules.hasLowerCase ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordRules.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        Lowercase
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordRules.hasNumber ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordRules.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        Number
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      {passwordRules.hasSpecialChar ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordRules.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        Special character (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer transition-transform hover:scale-110"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                I agree to the{' '}
                <button type="button" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Create Account</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-600 dark:after:bg-purple-400 hover:after:w-full after:transition-all"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}