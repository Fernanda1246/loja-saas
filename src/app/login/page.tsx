"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Eye, EyeOff } from "lucide-react"; // ícones do olho

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Não foi possível entrar. Verifique suas credenciais.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - área azul */}
      <div className="w-1/2 bg-gradient-to-br from-[#0F766E] via-[#13827A] to-[#06B6D4] flex items-center justify-center">
        <h1 className="text-white text-3xl font-bold text-center px-6 leading-snug">
          Bem-vindo de volta! <br />
          Acesse sua conta para continuar
        </h1>
      </div>

      {/* Lado direito - formulário */}
      <div className="w-1/2 flex items-center justify-center bg-[#F8FAFC]">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-[380px]">
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-6 text-center">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#06B6D4]"
                placeholder="seuemail@exemplo.com"
              />
            </div>

            {/* Senha com olho */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#06B6D4]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#0F766E]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F766E] hover:bg-[#13827A] text-white py-2 rounded-lg font-semibold transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
