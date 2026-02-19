import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin, settings }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        username: username.trim(),
        password
      });

      if (response.data.requiresTwoFactor) {
        navigate('/2fa', { state: { tempToken: response.data.tempToken } });
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 503) {
        setError('System is initializing. Please wait a moment and try again.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Please contact your system administrator to reset your password.');
  };

  const primaryColor = settings?.primaryColor || '#2563eb'; // Default blue-600

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-slate-950 font-sans selection:bg-blue-600 selection:text-white"
      style={{ '--primary-color': primaryColor }}>
      <div className="w-full max-w-md px-6">

        {/* Logo & Header */}
        <div className="mb-10 text-center">
          {settings?.companyLogo ? (
            <img src={settings.companyLogo} alt="Logo" className="h-16 w-auto mx-auto mb-6 rounded-lg shadow-md" />
          ) : (
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-6 shadow-md" style={{ backgroundColor: primaryColor }}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">{settings?.companyName || 'Nexus Asset Manager'}</h1>
          <p className="text-slate-400 text-sm">{settings?.headerText || 'Maintained by IT Operations'}</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-white">Sign in</h2>
            {loading && <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" style={{ borderColor: `${primaryColor} transparent ${primaryColor} ${primaryColor}` }}></div>}
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-900/50 rounded-lg flex items-center gap-3">
              <svg width="20" height="20" className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-600"
                style={{ '--tw-ring-color': primaryColor }}
                placeholder="Ex. admin"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-xs text-blue-400 hover:text-blue-300 transition-colors" style={{ color: primaryColor }}>Forgot password?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-600"
                style={{ '--tw-ring-color': primaryColor }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              Sign in
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} {settings?.companyName || 'Nexus Systems Inc.'} <br />
            Protected by SSO & 256-bit Encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
