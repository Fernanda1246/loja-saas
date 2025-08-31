// app/(protected)/profile/ProfileForm.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import styles from "./Profile.module.css";

type Props = {
  initialFullName: string;
  initialPhone: string;
};

export default function ProfileForm({ initialFullName, initialPhone }: Props) {
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setOk("");
      setErr("");

      try {
        // Validações simples (mesmo padrão que usamos no projeto)
        const name = String(fullName || "").trim();
        if (name.length < 2) {
          throw new Error("Nome muito curto.");
        }

        const rawPhone = String(phone || "").replace(/\D/g, "");
        if (rawPhone && (rawPhone.length < 10 || rawPhone.length > 15)) {
          throw new Error("Telefone inválido. Ex.: +5511999998888");
        }

        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: name,
            phone: rawPhone || "",
          },
        });

        if (error) throw error;

        setOk("Informações atualizadas com sucesso.");
      } catch (e: any) {
        setErr(e?.message || "Não foi possível salvar.");
      } finally {
        setSaving(false);
      }
    },
    [fullName, phone, supabase]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        <span className={styles.label}>Nome completo</span>
        <input
          className={styles.input}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Seu nome"
          autoComplete="name"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Telefone (opcional)</span>
        <input
          className={styles.input}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+5511999998888"
          autoComplete="tel"
        />
      </label>

      <div className={styles.actions}>
        <button
          className={styles.primaryBtn}
          type="submit"
          disabled={saving}
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>

        {/* Link “Alterar senha” pode ir para uma rota futura, sem tocar no fluxo atual */}
        <a className={styles.linkBtn} href="/forgot-password">
          Alterar senha
        </a>
      </div>

      {ok ? <p className={styles.okText}>{ok}</p> : null}
      {err ? <p className={styles.errorText}>{err}</p> : null}
    </form>
  );
}
