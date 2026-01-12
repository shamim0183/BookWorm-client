'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import gsap from 'gsap';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // GSAP Animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from(formRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3
      });
    });

    return () => ctx.revert();
  }, []);

  // Password validation
  const passwordChecks = {
    minLength: formData.password.length >= 6,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  };

  const allChecksPassed = Object.values(passwordChecks).every(Boolean);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadToImgBB = async () => {
    if (!photoFile) return '';
    
    const formData = new FormData();
    formData.append('image', photoFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      toast.error('Image upload failed');
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allChecksPassed) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const photoURL = await uploadToImgBB();

      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photoURL
      });

      localStorage.setItem('token', response.data.token);
      toast.success('Registration successful!');
      
      setTimeout(() => {
        router.push(response.data.user.role === 'admin' ? '/admin' : '/library');
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F242E]/95 via-[#2C5F4F]/90 to-[#1F242E]/95 backdrop-blur-sm"></div>
      
      <Toaster position="top-right" />
      
      <div ref={containerRef} className="max-w-md w-full relative z-10">
        <h1 className="text-5xl font-heading font-bold text-white text-center mb-8">
          Join BookWorm
        </h1>

        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {/* Photo Upload */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#084935] to-[#2C5F4F] mb-4 border-4 border-white shadow-lg">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>
              <label className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-[#084935] to-[#2C5F4F] text-white rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition text-sm font-medium">
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084935] focus:border-transparent outline-none transition"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084935] focus:border-transparent outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084935] focus:border-transparent outline-none transition"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.password && (
                <div className="mt-3 space-y-1.5 text-xs bg-gray-50 p-3 rounded-lg">
                  <p className={passwordChecks.minLength ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {passwordChecks.minLength ? '✓' : '○'} At least 6 characters
                  </p>
                  <p className={passwordChecks.hasUpperCase ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {passwordChecks.hasUpperCase ? '✓' : '○'} One uppercase letter
                  </p>
                  <p className={passwordChecks.hasLowerCase ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {passwordChecks.hasLowerCase ? '✓' : '○'} One lowercase letter
                  </p>
                  <p className={passwordChecks.hasNumber ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {passwordChecks.hasNumber ? '✓' : '○'} One number
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084935] focus:border-transparent outline-none transition"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`mt-2 text-xs font-medium ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#084935] to-[#2C5F4F] text-white py-3.5 rounded-full font-medium text-lg hover:shadow-xl transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-[#084935] font-semibold hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
