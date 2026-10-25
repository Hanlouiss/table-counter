"use client";

import { useState } from "react";
import { Banknote, Eye, EyeOff, Lock } from "lucide-react";

type LoginProps = {
  onActivate: () => void;
};

// TODO: replace with real API data
const EMPLOYEES: Record<string, { name: string; role: string }> = {
  "EMP-0002": { name: "Rina", role: "Staf" },
};

const TABLE_ROWS = [
  { count: 2, circle: 0 },
  { count: 3, circle: 2 },
  { count: 4, circle: 1 },
];

const OPEN_SHIFT = { name: "Dewi", since: "08:00" }; // set to null if no open shift

const formatRupiah = (digits: string) =>
  digits ? new Intl.NumberFormat("id-ID").format(Number(digits)) : "";

/* Custom ID card icon: rounded card, person on the left, two lines on the right */
function IdCardIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" />
      <circle cx="8.5" cy="10.5" r="1.9" />
      <path d="M5.7 16c.5-1.6 1.5-2.4 2.8-2.4s2.3.8 2.8 2.4" />
      <path d="M14.5 9.5h4" />
      <path d="M14.5 13h4" />
    </svg>
  );
}

export default function Login({ onActivate }: LoginProps) {
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cash, setCash] = useState("500000");

  const employee = EMPLOYEES[nik.trim().toUpperCase()];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call your login API here
    console.log({ nik, password, cash: Number(cash) });
  };

  return (
    <main className="grid h-screen overflow-hidden lg:grid-cols-[520px_1fr]">
      {/* Left panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-felt p-11 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            {/* Brand logo */}
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

          <h1 className="mt-16 text-4xl font-extrabold leading-tight">
            Selamat datang.
            <br />
            Siap mulai shift?
          </h1>
          <p className="mt-4 max-w-[300px] text-sm text-white/70">
            Meja, booking, serta makanan &amp; minuman — semua dari kasir ini.
          </p>
        </div>

        {/* Decorative tables (staircase: 2, 3, 4 cards) */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-8 right-6 flex flex-col items-end gap-3 p-3"
        >
          {TABLE_ROWS.map((row, r) => (
            <div key={r} className="flex gap-3">
              {Array.from({ length: row.count }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-28 w-[79px] items-center justify-center rounded-2xl border-3 border-jade/40"
                >
                  {i === row.circle && (
                    <span className="h-5 w-5 rounded-full border-3 border-jade/40" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="relative flex flex-col items-start gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-3 py-1.5">
            Sel, 20 Okt · buka sampai 20:00
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5">3 booking hari ini</span>
        </div>
      </aside>

      {/* Right panel: scrolls only inside itself if the screen is very short */}
      <section className="flex overflow-y-auto bg-ivory p-4">
        <form
          onSubmit={handleSubmit}
          className="m-auto w-full max-w-[500px] rounded-3xl bg-surface p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <h2 className="text-2xl font-bold text-ink">Mulai shift</h2>
          <p className="mt-1 text-[14px] text-muted">
            Login dengan NIK karyawan dan password milikmu sendiri.
          </p>

          {OPEN_SHIFT && (
            <div className="mt-4 rounded-xl bg-amber-soft p-3.5 text-amber">
              <p className="text-[13px] font-bold">
                Shift {OPEN_SHIFT.name} masih terbuka (sejak {OPEN_SHIFT.since})
              </p>
              <p className="mt-0.5 text-[12px] leading-snug">
                {OPEN_SHIFT.name} harus menghitung laci kas dan mengakhiri shift dulu. Hanya
                satu shift terbuka per kasir.
              </p>
            </div>
          )}

          {/* NIK */}
          <label htmlFor="nik" className="mt-4 block text-[13px] font-semibold text-ink">
            NIK (nomor karyawan)
          </label>
          <div className="relative mt-1.5">
            <IdCardIcon
              size={22}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="nik"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="EMP-0000"
              autoComplete="username"
              className="w-full rounded-xl border border-line bg-surface py-3 pl-12 pr-4 text-[15px] font-bold text-ink outline-none placeholder:font-bold focus:border-jade focus:ring-2 focus:ring-jade-soft"
            />
          </div>
          {employee && (
            <p className="mt-1.5 text-[12px] leading-snug text-muted">
              <span className="text-jade">✓</span> NIK ini milik{" "}
              <b className="text-ink">
                {employee.name} · {employee.role}
              </b>{" "}
              — bukan kamu? Cek kartu karyawanmu.
            </p>
          )}

          {/* Password */}
          <label htmlFor="password" className="mt-4 block text-[13px] font-semibold text-ink">
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-line bg-surface py-3 pl-12 pr-12 text-[15px] font-bold text-ink outline-none placeholder:font-normal focus:border-jade focus:ring-2 focus:ring-jade-soft"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Opening cash */}
          <label htmlFor="cash" className="mt-4 block text-[13px] font-semibold text-ink">
            Uang awal di laci kas
          </label>
          <div className="relative mt-1.5">
            <Banknote
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-[15px] font-bold text-ink">
              Rp
            </span>
            <input
              id="cash"
              inputMode="numeric"
              value={formatRupiah(cash)}
              onChange={(e) => setCash(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-line bg-surface py-3 pl-[5.25rem] pr-4 text-[15px] font-bold text-ink outline-none focus:border-jade focus:ring-2 focus:ring-jade-soft"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-jade py-3 text-[15px] font-bold text-white transition hover:bg-jade-deep"
          >
            Mulai shift
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[12px]">
            <span className="text-muted">
              Hari pertama?{" "}
              <button
                type="button"
                onClick={onActivate}
                className="font-bold text-jade hover:underline"
              >
                Aktifkan akun
              </button>
            </span>
            <span className="text-muted">Lupa password? Hubungi Super Admin</span>
          </div>
        </form>
      </section>
    </main>
  );
}