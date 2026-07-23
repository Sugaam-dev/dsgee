import { useState } from "react";
import {
  Shield, Terminal, Lock, Mail, User, ArrowRight, CheckCircle2,
  Sparkles, Layers, Activity, Eye, EyeOff, RefreshCw, KeyRound, Globe, ChevronRight
} from "lucide-react";
import pmrgLogo from "../assets/PMRG logo_orig.png";

export default function AuthPages({ onLoginSuccess }) {
  const [view, setView] = useState("LANDING"); // LANDING | LOGIN | SIGNUP | FORGOT
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("rajesh.sharma@dsgee.enterprise.in");
  const [password, setPassword] = useState("••••••••••••");
  const [fullName, setFullName] = useState("Rajesh Sharma");
  const [resetSent, setResetSent] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    onLoginSuccess({
      name: fullName || "Rajesh Sharma",
      role: "DevSecOps & SOC Architect",
    });
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Background Glow Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="h-16 px-8 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("LANDING")}>
          <div className="bg-white rounded-lg p-1.5 w-32 flex items-center justify-center border border-white/20">
            <img src={pmrgLogo} alt="PMRG Logo" className="h-6 w-auto object-contain" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400">
              DSGEE
            </span>
            <span className="text-[10px] text-sky-400 font-mono ml-2 uppercase tracking-widest bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              Enterprise v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setView("LANDING")}
            className={`transition-colors ${view === "LANDING" ? "text-sky-400" : "text-slate-400 hover:text-white"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setView("LOGIN")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => setView("SIGNUP")}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-900/40 transition-all"
          >
            Create Enterprise Account
          </button>
        </div>
      </header>

      {/* Body Views */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        {/* LANDING PAGE VIEW */}
        {view === "LANDING" && (
          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-semibold">
                <Sparkles size={14} /> AI-Powered SOP Governance & Execution Engine
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Enterprise Autonomous DevSecOps & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-emerald-400">AIOps Intelligence</span>
              </h1>

              <p className="text-slate-400 text-sm leading-relaxed">
                Streamline incident response, SOP-as-Code workflows, automated threat triage, and break-glass governance across multi-cloud infrastructure with zero compliance drift.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <Terminal size={16} /> DevSecOps Execution
                  </div>
                  <p className="text-slate-400 text-[11px]">Live Linux Console • Volatility Memory Triage • Break-Glass</p>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Activity size={16} /> SOC Observability
                  </div>
                  <p className="text-slate-400 text-[11px]">Real-time Telemetry • ISO 27001 & SOC 2 Compliance Scoring</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setView("LOGIN")}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-sky-900/40 flex items-center gap-2 transition-all"
                >
                  Enter Workspace <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => setView("SIGNUP")}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-xl border border-slate-800 transition-all"
                >
                  Register Organization
                </button>
              </div>
            </div>

            {/* Feature Cards Matrix */}
            <div className="space-y-4">
              {[
                { title: "Live Incident Triage", desc: "Automated volumetric memory extraction & MISP correlation", icon: Shield, color: "text-sky-400 bg-sky-500/10 border-sky-500/30" },
                { title: "Interactive Linux Console", desc: "30+ Linux admin commands with simulated OCSF logging", icon: Terminal, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                { title: "Governance & Lifecycle", desc: "ISO 27001 & SOC 2 compliance sign-offs & PR verification", icon: Layers, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-4 shadow-xl hover:border-slate-700 transition-all">
                    <div className={`p-3 rounded-xl border ${f.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{f.title}</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOGIN VIEW */}
        {view === "LOGIN" && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-scale-up">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400 mb-1">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-black text-white">Enterprise Sign In</h2>
              <p className="text-xs text-slate-400">Access your DSGEE DevSecOps & Governance Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Enterprise Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => setView("FORGOT")}
                    className="text-sky-400 hover:underline text-[11px]"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-900/40 transition-all flex items-center justify-center gap-2"
              >
                Sign In to Platform <ArrowRight size={16} />
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2">
              Don't have an account?{" "}
              <button onClick={() => setView("SIGNUP")} className="text-sky-400 font-bold hover:underline">
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* SIGNUP VIEW */}
        {view === "SIGNUP" && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-scale-up">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 mb-1">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-black text-white">Create Enterprise Account</h2>
              <p className="text-xs text-slate-400">Join DSGEE Security Governance Network</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Enterprise Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="name@organization.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-900/40 transition-all"
              >
                Register & Initialize Portal
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already registered?{" "}
              <button onClick={() => setView("LOGIN")} className="text-sky-400 font-bold hover:underline">
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {view === "FORGOT" && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-scale-up">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 mb-1">
                <KeyRound size={24} />
              </div>
              <h2 className="text-2xl font-black text-white">Reset Credentials</h2>
              <p className="text-xs text-slate-400">Receive an encrypted MFA break-glass reset link</p>
            </div>

            {!resetSent ? (
              <form onSubmit={e => { e.preventDefault(); setResetSent(true); }} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Registered Enterprise Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-900/40 transition-all"
                >
                  Send Reset Authorization
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2 text-xs">
                <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Verification Link Dispatched</h4>
                <p className="text-slate-300">An encrypted password reset token has been sent to <strong>{email}</strong>.</p>
              </div>
            )}

            <div className="text-center text-xs text-slate-500 pt-2">
              <button onClick={() => setView("LOGIN")} className="text-sky-400 font-bold hover:underline">
                Return to Login
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-slate-900 bg-slate-950 px-8 flex items-center justify-between text-[11px] text-slate-500 z-10">
        <span>© 2026 PMRG DSGEE Enterprise Platform. ISO 27001 & SOC 2 Certified.</span>
        <span className="font-mono">Security Operations Center — India (IST)</span>
      </footer>
    </div>
  );
}
