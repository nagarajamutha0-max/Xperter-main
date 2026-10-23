import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Phone, Video, Mic, Send, Search, Square, PhoneOff, MicOff, VideoOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GlassCard } from "@/components/GlassCard";

export const Route = createFileRoute("/app/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Lumen" },
      { name: "description", content: "Chat with friends by text, voice and video in Lumen." },
      { property: "og:title", content: "Messages — Lumen" },
      { property: "og:description", content: "Chat with friends by text, voice and video in Lumen." },
    ],
  }),
  component: Messages,
});

type Msg = { id: number; me: boolean; text?: string | undefined; audio?: string | undefined; time: string };
type Contact = { id: string; name: string; online: boolean; msgs: Msg[] };

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const seed: Contact[] = [
  { id: "ava", name: "Ava Moreau", online: true, msgs: [{ id: 1, me: false, text: "Did you see the new chrome renders?", time: "09:12" }, { id: 2, me: true, text: "Yes — the reflections are unreal.", time: "09:14" }] },
  { id: "kai", name: "Kai Tanaka", online: true, msgs: [{ id: 1, me: false, text: "Call later tonight?", time: "Yesterday" }] },
  { id: "mira", name: "Mira Sol", online: false, msgs: [{ id: 1, me: false, text: "Sent you the files 📎", time: "Mon" }] },
  { id: "leo", name: "Leo Hart", online: false, msgs: [{ id: 1, me: true, text: "Thanks again!", time: "Sun" }] },
];
const replies = ["Love that.", "Ha, totally.", "Give me a minute 🙂", "Sounds good to me.", "Tell me more!"];

function Avatar({ name, online }: { name: string; online?: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className="bg-pearl flex h-10 w-10 items-center justify-center rounded-full border border-glass-edge text-sm font-medium sm:h-11 sm:w-11">{name.split(" ").map((s) => s[0]).join("")}</div>
      {online !== undefined && <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${online ? "bg-chart-2" : "bg-faint"}`} />}
    </div>
  );
}

function Messages() {
  const [contacts, setContacts] = useState(seed);
  const [activeId, setActiveId] = useState<string | null>("ava");
  const [q, setQ] = useState("");
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [call, setCall] = useState<null | "audio" | "video">(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const active = contacts.find((c) => c.id === activeId);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.msgs.length, typing]);

  const push = (id: string, m: Omit<Msg, "id" | "time">) =>
    setContacts((cs) => cs.map((c) => (c.id === id ? { ...c, msgs: [...c.msgs, { ...m, id: Date.now() + Math.random(), time: now() }] } : c)));

  const autoReply = (id: string) => {
    setTyping(true);
    setTimeout(() => { setTyping(false); push(id, { me: false, text: replies[Math.floor(Math.random() * replies.length)] }); }, 1400);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    push(active.id, { me: true, text: text.trim() });
    setText("");
    autoReply(active.id);
  };

  const toggleRecord = async () => {
    if (recording) { recRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        if (active) { push(active.id, { me: true, audio: URL.createObjectURL(new Blob(chunks, { type: "audio/webm" })) }); autoReply(active.id); }
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Microphone access was blocked");
    }
  };

  const list = contacts.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row md:gap-4">
      <GlassCard
        as="section"
        variant="panel"
        padding="sm"
        className={`flex h-full min-h-0 w-full flex-col md:w-72 lg:w-80 ${active ? "hidden md:flex" : "flex"}`}
      >
        <div className="flex min-h-11 items-center pl-14 pr-2">
          <h1 className="text-2xl sm:text-3xl">Messages</h1>
        </div>
        <div className="glass-input mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search contacts" className="w-full bg-transparent text-sm outline-none placeholder:text-faint" />
        </div>
        <ul className="mt-3 flex-1 space-y-1 overflow-y-auto sm:mt-4">
          {list.map((c) => {
            const last = c.msgs[c.msgs.length - 1];
            return (
              <li key={c.id}>
                <button onClick={() => setActiveId(c.id)} className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors ${c.id === activeId ? "bg-glass-strong" : "hover:bg-glass"}`}>
                  <Avatar name={c.name} online={c.online} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2"><span className="truncate text-sm font-medium">{c.name}</span><span className="shrink-0 text-[11px] text-muted-foreground">{last?.time}</span></div>
                    <p className="truncate text-xs text-muted-foreground">{last?.audio ? "🎙 Voice message" : last?.text}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </GlassCard>

      {active ? (
        <GlassCard
          as="section"
          variant="panel"
          padding="none"
          className="flex h-full min-h-0 min-w-0 flex-1 flex-col"
        >
          <header className="flex items-center gap-2.5 border-b border-glass-edge py-3.5 pl-16 pr-4 sm:gap-3 sm:py-4 sm:pr-5 md:pl-5">
            <button aria-label="Back" onClick={() => setActiveId(null)} className="glass-input flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:hidden"><ArrowLeft className="h-4 w-4" /></button>
            <Avatar name={active.name} online={active.online} />
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{active.name}</p><p className="truncate text-xs text-muted-foreground">{typing ? "typing…" : active.online ? "Online" : "Offline"}</p></div>
            <button aria-label="Start voice call" onClick={() => setCall("audio")} className="glass-input liquid-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-glass-strong"><Phone className="h-4 w-4" /></button>
            <button aria-label="Start video call" onClick={() => setCall("video")} className="glass-input liquid-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-glass-strong"><Video className="h-4 w-4" /></button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5 sm:py-6">
            {active.msgs.map((m) => (
              <div key={m.id} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div className={`animate-liquid max-w-[85%] rounded-3xl px-4 py-2.5 text-sm sm:max-w-[75%] ${m.me ? "btn-ink rounded-br-md" : "glass-input rounded-bl-md"}`}>
                  {m.audio ? <audio controls src={m.audio} className="h-9 max-w-[200px] sm:max-w-[240px]" /> : m.text}
                  <span className="mt-1 block text-right text-[10px] opacity-60">{m.time}</span>
                </div>
              </div>
            ))}
            {typing && <div className="glass-input w-16 rounded-3xl px-4 py-3 text-center text-xs tracking-widest text-muted-foreground">•••</div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex items-center gap-2 p-3 sm:p-4">
            <div className="glass-input flex h-11 flex-1 items-center rounded-full px-4 sm:h-12 sm:px-5">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={recording ? "Recording… tap stop to send" : "Write a message"} aria-label="Message" disabled={recording} className="w-full bg-transparent text-sm outline-none placeholder:text-faint" />
            </div>
            <button type="button" onClick={toggleRecord} aria-label={recording ? "Stop recording" : "Record voice message"} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${recording ? "bg-destructive text-destructive-foreground animate-pulse" : "glass-input"}`}>
              {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button type="submit" aria-label="Send" className="btn-ink liquid-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"><Send className="h-4 w-4" /></button>
          </form>
        </GlassCard>
      ) : (
        <GlassCard
          as="section"
          variant="panel"
          padding="md"
          className="hidden flex-1 items-center justify-center text-muted-foreground md:flex"
        >
          Select a conversation
        </GlassCard>
      )}

      {active && call && <CallDialog kind={call} name={active.name} onEnd={() => setCall(null)} />}
    </div>
  );
}

function CallDialog({ kind, name, onEnd }: { kind: "audio" | "video"; name: string; onEnd: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [status, setStatus] = useState("Calling…");

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ audio: true, video: kind === "video" })
      .then((s) => { streamRef.current = s; if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => setStatus("Camera/mic unavailable"));
    const t = setTimeout(() => setStatus((s) => (s === "Calling…" ? "No answer — demo call" : s)), 4000);
    return () => { clearTimeout(t); streamRef.current?.getTracks().forEach((tr) => tr.stop()); };
  }, [kind]);

  const toggle = (k: "audio" | "video") => {
    streamRef.current?.getTracks().filter((t) => t.kind === k).forEach((t) => (t.enabled = !t.enabled));
    k === "audio" ? setMuted((m) => !m) : setCamOff((c) => !c);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onEnd()}>
      <DialogContent className="glass bg-transparent max-w-md rounded-[2.25rem] border-0 p-6">
        <DialogTitle className="text-center text-2xl font-light">{name}</DialogTitle>
        <DialogDescription className="text-center">{kind === "video" ? "Video" : "Voice"} call · {status}</DialogDescription>
        <div className="bg-pearl relative mt-2 flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-glass-edge">
          {kind === "video" && <video ref={videoRef} autoPlay muted playsInline className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${camOff ? "invisible" : ""}`} />}
          {(kind === "audio" || camOff) && <Avatar name={name} />}
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button aria-label={muted ? "Unmute" : "Mute"} onClick={() => toggle("audio")} className="glass-input liquid-press flex h-12 w-12 items-center justify-center rounded-full">{muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</button>
          {kind === "video" && <button aria-label={camOff ? "Turn camera on" : "Turn camera off"} onClick={() => toggle("video")} className="glass-input liquid-press flex h-12 w-12 items-center justify-center rounded-full">{camOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}</button>}
          <button aria-label="End call" onClick={onEnd} className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-destructive-foreground"><PhoneOff className="h-4 w-4" /></button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
