'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone: phone || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al crear la cuenta');
        return;
      }

      router.push('/login?registered=1');
    } catch {
      setError('Error de conexion. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20">
          <span className="text-white font-black text-2xl">P</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Prop<span className="text-brand-500">Data</span></h1>
        <p className="text-gray-500 text-sm mt-1">Crea tu cuenta profesional</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-dark-800 rounded-2xl p-6 border border-gray-800 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Crear Cuenta</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                placeholder="Tu nombre"
              />
            </div>

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

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                Telefono <span className="text-gray-600">(opcional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                placeholder="+34 600 000 000"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-brand-600/20"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4">
            Al registrarte aceptas nuestros terminos de uso y politica de privacidad.
          </p>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Ya tienes cuenta?{' '}
          <a href="/login" className="text-brand-500 hover:underline font-medium">
            Iniciar sesion
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
