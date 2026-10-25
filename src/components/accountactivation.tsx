"use client";

import { useMemo, useState } from "react";
import { Check, KeyRound, Lock } from "lucide-react";

type AccountActivationProps = {
  onBack: () => void;
  onDone: () => void;
};

// TODO: replace with real API lookup using NIK + activation code
const ACTIVATIONS: Record<string, { code: string; name: string; role: string }> = {
  "EMP-0005": { code: "482913", name: "Sari Wulandari", role: "Staf" },
};

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function AccountActivation({ onBack, onDone }: AccountActivationProps) {
  const [nik, setNik] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const cleanCode = code.replace(/\s/g, "");
  const record = ACTIVATIONS[nik.trim().toUpperCase()];
  const owner = record && record.code === cleanCode ? record : null;

  const rules = useMemo(() => {
    const lower = password.toLowerCase();
    return {
      length: password.length >= 8,
      notNikOrPhone:
        password.length > 0 &&
        !(nik && lower.includes(nik.trim().toLowerCase())) &&
        !/^\+?\d{9,}$/.test(password),
      match: password.length > 0 && password === confirm,
    };
  }, [password, confirm, nik]);

  // 0-4 strength bars
  const strength = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) s++;
    return s;
  }, [password]);

  const canSubmit = !!owner && rules.length && rules.notNikOrPhone && rules.match;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: call your activation API here, then log the user in
    console.log({ nik, code: cleanCode, password });
    onDone();
  };

  

  const step1Done = !!owner;
  const step2Done = step1Done && rules.length && rules.notNikOrPhone && rules.match;

  const steps = [
    { label: "Masukkan NIK + kode", done: step1Done },
    { label: "Buat password", done: step2Done },
    { label: "Mulai shift", done: false },
  ];

  function Rule({ ok, children }) {
  return (
    <li
      className={`flex items-center gap-2 text-sm ${
        ok ? "text-jade" : "text-gray-400"
      }`}
    >
      <Check
        size={16}
        strokeWidth={1.5}
        className="shrink-0"
      />
      <span>{children}</span>
    </li>
  );
}

  return (
    <main className="grid min-h-screen lg:grid-cols-[520px_1fr]">
      {/* Left panel */}
      <aside className="hidden flex-col justify-between bg-felt p-11 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ivory">
              <div className="flex h-[22px] w-4 items-center justify-center rounded-[5px] border-2 border-felt">
                <div className="h-1.5 w-1.5 rounded-full bg-jade" />
              </div>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold">[Nama brand]</p>
              <p className="text-[11px] text-white/60">Aplikasi kasir</p>
            </div>
          </div>

          <h1 className="mt-14 text-4xl font-extrabold leading-tight">Aktifkan akunmu</h1>
          <p className="mt-3 text-[15px] text-white/70">
            Untuk hari pertama kerja, atau saat Super Admin memberimu kode reset.
          </p>

          <ol className="mt-8 space-y-5">
            {steps.map((step, i) => {
              const isActive = i === 0 || steps[i - 1].done;

              return (
                <li key={step.label} className="flex items-center gap-4 text-[17px]">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold leading-none transition-colors ${
                      step.done
                        ? "bg-jade text-white"
                        : isActive
                          ? "border border-white bg-white text-jade"
                          : "border border-white/30 bg-transparent text-white/40"
                    }`}
                  >
                    {step.done ? (
                      <Check size={18} strokeWidth={3} />
                    ) : (
                      <span className="translate-y-[2px]">{i + 1}</span>
                    )}
                  </span>

                  <span
                    className={`transition-colors ${
                      isActive || step.done ? "text-white" : "text-white/40"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-jade/30 p-3 text-[11px] text-white/80">
          <KeyRound size={16} className="mt-0.5 shrink-0" />
          <p>
            Tidak perlu email. Kode berisi 6 digit, hanya bisa dipakai sekali, dan berlaku 24
            jam.
          </p>
        </div>
      </aside>

      {/* Right panel */}
      <section className="flex items-center justify-center bg-ivory p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[500px] rounded-3xl bg-surface p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          {/* NIK + code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nik" className="block text-[13px] font-semibold text-ink">
                NIK
              </label>
              <input
                id="nik"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="EMP-0000"
                className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] font-bold text-ink outline-none placeholder:font-bold focus:border-jade focus:ring-2 focus:ring-jade-soft"
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-[13px] font-semibold text-ink">
                Kode aktivasi
              </label>
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                maxLength={7}
                placeholder="000 000"
                className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] font-bold tracking-wider text-ink outline-none placeholder:font-bold focus:border-jade focus:ring-2 focus:ring-jade-soft"
              />
            </div>
          </div>

          {/* Code owner */}
          {owner && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-jade-soft p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jade text-[12px] font-bold text-white">
                {initials(owner.name)}
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-[11px] text-muted">Kode ini milik</p>
                <p className="text-[14px] font-bold text-ink">
                  {owner.name} · {owner.role}
                </p>
              </div>
              <p className="max-w-[120px] text-right text-[11px] leading-snug text-muted">
                Bukan kamu? Berhenti dan beri tahu Super Admin.
              </p>
            </div>
          )}

          {/* New password */}
          <label htmlFor="password" className="mt-5 block text-[13px] font-semibold text-ink">
            Password baru
          </label>
          <div className="relative mt-2">
            <Lock
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-line bg-surface py-3.5 pl-12 pr-4 text-[15px] font-bold text-ink outline-none focus:border-jade focus:ring-2 focus:ring-jade-soft"
            />
          </div>
          <div className="mt-2.5 grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full ${i < strength ? "bg-jade" : "bg-stone"}`}
              />
            ))}
          </div>

          {/* Confirm */}
          <label htmlFor="confirm" className="mt-5 block text-[13px] font-semibold text-ink">
            Ketik ulang password
          </label>
          <div className="relative mt-2">
            <Lock
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-line bg-surface py-3.5 pl-12 pr-4 text-[15px] font-bold text-ink outline-none focus:border-jade focus:ring-2 focus:ring-jade-soft"
            />
          </div>

          <ul className="mt-4 space-y-2">
            <Rule ok={rules.length}>Minimal 8 karakter</Rule>
            <Rule ok={rules.notNikOrPhone}>Bukan NIK atau nomor HP-mu</Rule>
            <Rule ok={rules.match}>Kedua isian sama</Rule>
          </ul>

          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            Hanya kamu yang tahu password ini. Super Admin tidak bisa melihatnya — hanya bisa
            membuat kode baru.
          </p>

          <div className="mt-7 grid grid-cols-[1fr_1.8fr] gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-line bg-surface py-3.5 text-[15px] font-semibold text-ink hover:bg-stone"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-jade py-3.5 text-[15px] font-bold text-white transition hover:bg-jade-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              Simpan password &amp; login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}