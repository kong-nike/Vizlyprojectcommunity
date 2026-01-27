import { useState } from 'react';
import { Grid3x3, Mail, Lock, Eye, EyeOff, Moon, Sun, ArrowLeft, Check, X, Shield, KeyRound } from 'lucide-react';
import vizlyLogo from 'figma:asset/96bf4512efe4ad439d153f2c27b017ec43a256da.png';

interface ForgotPasswordProps {
  onComplete: () => void;
  onNavigateToLogin: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export default function ForgotPassword({ onComplete, onNavigateToLogin, darkMode, onToggleDarkMode }: ForgotPasswordProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string; confirmPassword?: string }>({});

  // Password validation rules (same as SignUp)
  const passwordRules = {
    minLength: newPassword.length >= 8,
    maxLength: newPassword.length <= 128,
    noSpaces: !/\s/.test(newPassword),
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRules).every(rule => rule);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setErrors({});
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setErrors({ code: 'Verification code is required' });
      return;
    }
    
    if (verificationCode.length !== 6) {
      setErrors({ code: 'Please enter a valid 6-digit code' });
      return;
    }
    
    setErrors({});
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    if (!newPassword.trim()) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onComplete();
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

      {/* Forgot Password Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-500 hover:shadow-blue-500/10 hover:shadow-3xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 group">
              <div className="relative">
                <img src={vizlyLogo} alt="Vizly" className="w-16 h-16 transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </div>
            <h1 className="text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
              {step === 1 && (
                <>
                  Reset Password
                  <KeyRound className="w-5 h-5 text-blue-500 animate-pulse" />
                </>
              )}
              {step === 2 && (
                <>
                  Verify Code
                  <Shield className="w-5 h-5 text-purple-500 animate-pulse" />
                </>
              )}
              {step === 3 && (
                <>
                  Create New Password
                  <Check className="w-5 h-5 text-green-500 animate-pulse" />
                </>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && 'Enter the 6-digit code sent to your email'}
              {step === 3 && 'Choose a new password for your account'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    s < step ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30' : s === step ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 scale-110' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {s < step ? (
                      <Check className="w-5 h-5 text-white animate-scaleIn" />
                    ) : (
                      <span className={`font-medium ${s === step ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {s}
                      </span>
                    )}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${
                      s < step ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>Request</span>
              <span>Verify</span>
              <span>Reset</span>
            </div>
          </div>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5 animate-fadeIn">
              <div className="group">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.email ? 'border-red-500 animate-shake' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 animate-slideDown flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Send Verification Code
                  <Mail className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5 animate-fadeIn">
              <div className="group">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                    setErrors({ ...errors, code: undefined });
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className={`w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-900/80 border ${
                    errors.code ? 'border-red-500 animate-shake' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all text-center text-3xl tracking-[0.5em] font-bold hover:border-gray-300 dark:hover:border-gray-600`}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1 animate-slideDown flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.code}
                  </p>
                )}
              </div>

              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    className="font-medium hover:underline transition-all"
                  >
                    Resend
                  </button>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Verify Code
                  <Shield className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-5 animate-fadeIn">
              <div className="group">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Enter new password"
                    className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.password ? 'border-red-500 animate-shake' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {newPassword && (
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
                          Special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 animate-slideDown flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    placeholder="Confirm new password"
                    className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900/50 border ${
                      errors.confirmPassword ? 'border-red-500 animate-shake' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 animate-slideDown flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {newPassword && confirmPassword && newPassword === confirmPassword && (
                <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-slideDown">
                  <Check className="w-5 h-5 text-green-500 animate-scaleIn" />
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">Passwords match!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-medium shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Reset Password
                  <Check className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <button
              onClick={onNavigateToLogin}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors flex items-center justify-center space-x-2 mx-auto group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Login</span>
            </button>
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
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
