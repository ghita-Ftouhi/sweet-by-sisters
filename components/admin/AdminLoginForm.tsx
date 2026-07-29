'use client';
import { useState } from 'react';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Mot de passe incorrect');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <span className="text-4xl">🍪</span>
          <h1 className="font-display text-xl font-bold text-plum mt-2">Accès admin</h1>
          <p className="text-xs text-gray-400 mt-1">Sweet by Sister — Tableau de bord</p>
        </div>

        <label className="text-sm font-semibold text-plum block mb-2">Mot de passe</label>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum focus:outline-none focus:border-rose-main mb-4"
        />

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-rose-main text-white py-3 rounded-full font-semibold hover:bg-rose-deep transition-all disabled:opacity-60">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
