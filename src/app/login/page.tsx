'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      setSuccess('Cuenta creada correctamente. Inicia sesion.');
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesion');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Error de conexion. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {success && (
        <div className="bg-brand-600/10 border border-brand-600/30 text-brand-500 text-sm rounded-lg px-4 py-3 mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            placeholder="tu@inmobiliaria.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            placeholder="Min. 6 caracteres"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-brand-600/20"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20">
          <span className="text-white font-black text-2xl">P</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Prop<span className="text-brand-500">Data</span></h1>
        <p className="text-gray-500 text-sm mt-1">Inteligencia inmobiliaria</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-dark-800 rounded-2xl p-6 border border-gray-800 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Iniciar Sesion</h2>
          <Suspense fallback={<div className="text-center text-gray-500 py-4">Cargando...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          No tienes cuenta?{' '}
          <a href="/registro" className="text-brand-500 hover:underline font-medium">
            Crear cuenta
          </a>
        </p>

        <p className="text-center mt-4">
          <a href="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            Volver a la pagina de inicio
          </a>
        </p>
      </div>
    </div>
  );
}
