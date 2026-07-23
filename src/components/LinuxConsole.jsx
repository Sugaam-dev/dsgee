import { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, RotateCcw, Send, Terminal, X, ChevronUp, ChevronDown } from "lucide-react";
import { LINUX_COMMAND_OUTPUTS } from "../data/mockData";

export default function LinuxConsole({
  initialLines = [],
  isRunning = false,
  onRunAction,
  assetName = "SRV-PROD-DB-07"
}) {
  const [mode, setMode] = useState("RESTORED"); // RESTORED | FULLSCREEN | MINIMIZED
  const [terminalLines, setTerminalLines] = useState(initialLines);
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState("/home/rajesh/dsgee-platform");
  const terminalRef = useRef(null);

  useEffect(() => {
    if (initialLines.length > 0) {
      setTerminalLines(initialLines);
    }
  }, [initialLines]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  function handleCommandSubmit(e) {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const rawCmd = inputVal.trim();
    setInputVal("");
    setHistoryIndex(-1);
    setCommandHistory(prev => [...prev, rawCmd]);

    // Append executed command line
    const promptLine = { text: `rajesh@dsgee-srv07:${currentDir}$ ${rawCmd}`, type: "cmd" };
    setTerminalLines(prev => [...prev, promptLine]);

    const parts = rawCmd.split(" ");
    const baseCmd = parts[0].toLowerCase();

    // Special command: clear
    if (baseCmd === "clear") {
      setTerminalLines([]);
      return;
    }

    // Special command: history
    if (baseCmd === "history") {
      const histText = commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n") || "  1  history";
      setTerminalLines(prev => [...prev, { text: histText, type: "info" }]);
      return;
    }

    // Special command: cd
    if (baseCmd === "cd") {
      const target = parts[1] || "/home/rajesh";
      if (target === "..") {
        setCurrentDir("/home/rajesh");
      } else {
        setCurrentDir(target.startsWith("/") ? target : `${currentDir}/${target}`);
      }
      return;
    }

    // Look up in simulated output map or build realistic default
    if (LINUX_COMMAND_OUTPUTS[rawCmd]) {
      setTerminalLines(prev => [...prev, { text: LINUX_COMMAND_OUTPUTS[rawCmd], type: "info" }]);
    } else if (LINUX_COMMAND_OUTPUTS[baseCmd]) {
      setTerminalLines(prev => [...prev, { text: LINUX_COMMAND_OUTPUTS[baseCmd], type: "info" }]);
    } else if (baseCmd === "echo") {
      setTerminalLines(prev => [...prev, { text: parts.slice(1).join(" "), type: "info" }]);
    } else if (baseCmd === "touch" || baseCmd === "mkdir" || baseCmd === "rm" || baseCmd === "cp" || baseCmd === "mv" || baseCmd === "chmod" || baseCmd === "chown") {
      setTerminalLines(prev => [...prev, { text: `[SYS] :: Operation '${rawCmd}' executed successfully on ${assetName}.`, type: "success" }]);
    } else if (baseCmd === "cat") {
      setTerminalLines(prev => [...prev, { text: `--- Content of ${parts[1] || 'file.txt'} ---\n[DSGEE SOP v2.4.1 Config]\nSTATUS=ACTIVE\nINTEGRITY_HASH=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`, type: "info" }]);
    } else if (baseCmd === "find" || baseCmd === "grep") {
      setTerminalLines(prev => [...prev, { text: `/forensics/pb0042/iocs.json:14: "hash": "a3f1e2c4d5b6a7f8"\n/logs/audit-2026-07-23.log:88: OCSF_EVENT_3002`, type: "info" }]);
    } else if (baseCmd === "du") {
      setTerminalLines(prev => [...prev, { text: `4.0K\t./config\n142M\t./forensics\n18M\t./logs\n160M\t.`, type: "info" }]);
    } else if (baseCmd === "kill" || baseCmd === "service" || baseCmd === "mount") {
      setTerminalLines(prev => [...prev, { text: `[ADMIN] :: Command '${rawCmd}' dispatched with elevated privileges.`, type: "warn" }]);
    } else if (baseCmd === "crontab") {
      setTerminalLines(prev => [...prev, { text: `*/15 * * * * /usr/local/bin/dsgee-cisa-sync\n0 0 * * * /usr/local/bin/dsgee-evidence-backup`, type: "info" }]);
    } else {
      setTerminalLines(prev => [...prev, { text: `bash: ${baseCmd}: command simulated or not found. Type 'help' or valid Linux command.`, type: "danger" }]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  }

  const termLineColor = {
    info: "text-slate-300",
    success: "text-emerald-400",
    warn: "text-amber-400",
    danger: "text-red-400",
    cmd: "text-sky-300 font-bold",
  };

  const containerClasses =
    mode === "FULLSCREEN"
      ? "fixed inset-4 z-50 rounded-2xl border-2 border-sky-500 shadow-2xl bg-black flex flex-col"
      : mode === "MINIMIZED"
      ? "h-12 rounded-xl border border-slate-700 bg-slate-950 flex flex-col justify-center overflow-hidden"
      : "flex-1 flex flex-col rounded-xl border border-slate-700 bg-black overflow-hidden min-h-[320px]";

  return (
    <div className={containerClasses}>
      {/* Console Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button onClick={() => setMode("MINIMIZED")} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500" title="Minimize" />
            <button onClick={() => setMode(mode === "FULLSCREEN" ? "RESTORED" : "FULLSCREEN")} className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500" title="Maximize/Restore" />
            <button onClick={() => setMode("RESTORED")} className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500" title="Restore" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 font-mono text-slate-300">
            <Terminal size={13} className="text-sky-400" />
            <span>dsgee-console — {assetName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isRunning && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> LIVE EXECUTION
            </span>
          )}
          {mode === "MINIMIZED" ? (
            <button onClick={() => setMode("RESTORED")} className="text-slate-400 hover:text-white flex items-center gap-1">
              <ChevronUp size={14} /> Restore
            </button>
          ) : (
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setMode(mode === "FULLSCREEN" ? "RESTORED" : "FULLSCREEN")}
                className="p-1 hover:text-white rounded hover:bg-slate-800"
                title={mode === "FULLSCREEN" ? "Restore" : "Fullscreen"}
              >
                {mode === "FULLSCREEN" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Viewport */}
      {mode !== "MINIMIZED" && (
        <>
          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 bg-black text-slate-200 select-text"
          >
            {terminalLines.length === 0 && (
              <div className="text-slate-600 space-y-1">
                <p>DSGEE Enterprise Linux Terminal Emulator v2.4.1</p>
                <p>Type any Linux command (<code className="text-sky-400">pwd</code>, <code className="text-sky-400">ls -la</code>, <code className="text-sky-400">ps</code>, <code className="text-sky-400">top</code>, <code className="text-sky-400">htop</code>, <code className="text-sky-400">systemctl</code>, <code className="text-sky-400">df</code>, <code className="text-sky-400">free</code>, <code className="text-sky-400">clear</code>) or click "Run Action".</p>
              </div>
            )}
            {terminalLines.map((line, i) => (
              <div key={i} className={`leading-relaxed whitespace-pre-wrap ${termLineColor[line.type] || "text-slate-300"}`}>
                {line.text}
              </div>
            ))}
            {isRunning && <div className="text-emerald-400 animate-pulse font-mono">█ Executing SOP pipeline step...</div>}
          </div>

          {/* Terminal Input Form */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-slate-800 bg-slate-950 font-mono text-xs">
            <span className="text-emerald-400 font-bold">rajesh@dsgee:{currentDir}$</span>
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type Linux command (e.g. ls, ps, htop, systemctl, uptime)..."
              className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none font-mono"
            />
            <button type="submit" className="text-slate-400 hover:text-emerald-400 transition-colors p-1">
              <Send size={13} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
