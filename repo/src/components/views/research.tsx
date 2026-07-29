"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Microscope, Plus, Trash2, Copy, Check, BookOpen, Video, Globe, FileText,
  Lightbulb, Quote, ClipboardList, StickyNote,
} from "lucide-react";

/* ---------- types ---------- */
type SourceType = "book" | "website" | "video";
interface Source {
  id: string;
  title: string;
  author: string;
  url: string;
  type: SourceType;
  year: string;
}
interface Note {
  id: string;
  text: string;
  sourceId: string | null;
  date: number;
}
interface ResearchData {
  sources: Source[];
  notes: Note[];
}

const STORAGE_KEY = "research-data";
const EMPTY_DATA: ResearchData = { sources: [], notes: [] };

const SOURCE_TYPE_META: Record<SourceType, { label: string; icon: React.ReactNode; color: string }> = {
  book: { label: "Book", icon: <BookOpen className="size-3.5" />, color: "#a78bfa" },
  website: { label: "Website", icon: <Globe className="size-3.5" />, color: "#22d3ee" },
  video: { label: "Video", icon: <Video className="size-3.5" />, color: "#fb923c" },
};

/* ---------- citation helpers ---------- */
function authorParts(author: string): { last: string; initials: string } {
  const trimmed = author.trim();
  if (!trimmed) return { last: "Anon.", initials: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { last: parts[0], initials: "" };
  const last = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map((p) => p[0]?.toUpperCase() ?? "").filter(Boolean).join(". ");
  return { last, initials: initials ? initials + "." : "" };
}

function citeMLA(s: Source): string {
  const { last, initials } = authorParts(s.author);
  const year = s.year ? ` ${s.year}.` : "";
  const title = s.title ? `"${s.title}."` : "";
  const container = s.type === "book" ? "Print" : "Web";
  const urlPart = s.type !== "book" && s.url ? ` ${s.url}.` : "";
  return `${last}${initials ? ", " + initials : ""} ${title}${year} ${container}.${urlPart}`.replace(/\s+/g, " ").trim();
}

function citeAPA(s: Source): string {
  const { last, initials } = authorParts(s.author);
  const authorStr = initials ? `${last}, ${initials}` : last;
  const year = s.year ? ` (${s.year}).` : " (n.d.).";
  const title = s.title ? ` ${s.title}.` : "";
  const retr = s.url ? ` Retrieved from ${s.url}` : "";
  return `${authorStr}.${year}${title}${retr}`.replace(/\s+/g, " ").trim();
}

function citeHarvard(s: Source): string {
  const { last, initials } = authorParts(s.author);
  const authorStr = initials ? `${last}, ${initials}` : last;
  const year = s.year ? ` ${s.year}.` : " n.d.";
  const title = s.title ? ` ${s.title}.` : "";
  const fmt = s.type === "book" ? "Print." : "[Online]. Available at:";
  const urlPart = s.url && s.type !== "book" ? ` ${s.url}` : "";
  return `${authorStr}${year}${title} ${fmt}${urlPart}`.replace(/\s+/g, " ").trim();
}

/* ---------- 10 CBSE-relevant research topics ---------- */
const RESEARCH_TOPICS: string[] = [
  "Impact of social media on teenagers",
  "Renewable energy adoption in India",
  "Water conservation methods in urban India",
  "Climate change effects on Indian agriculture",
  "Role of artificial intelligence in education",
  "Plastic pollution in Indian rivers",
  "Traditional medicinal plants of India",
  "Digital India and rural connectivity",
  "Sustainable transportation in Indian cities",
  "Mental health awareness among school students",
];

/* ---------- main view ---------- */
export function ResearchView() {
  const mounted = useMounted();
  const track = useStudyStore((s) => s.track);
  const pushToast = useStudyStore((s) => s.pushToast);
  const accent = SUBJECT_META[track].accent;

  const [data, setData] = useState<ResearchData>(EMPTY_DATA);
  const [hydrated, setHydrated] = useState(false);

  // source form
  const [sTitle, setSTitle] = useState("");
  const [sAuthor, setSAuthor] = useState("");
  const [sUrl, setSUrl] = useState("");
  const [sType, setSType] = useState<SourceType>("website");
  const [sYear, setSYear] = useState("");

  // note form
  const [noteText, setNoteText] = useState("");
  const [noteSourceId, setNoteSourceId] = useState<string>("none");

  // citation form
  const [citeSourceId, setCiteSourceId] = useState<string>("");
  const [citeFormat, setCiteFormat] = useState<"MLA" | "APA" | "Harvard">("MLA");
  const [copied, setCopied] = useState(false);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ResearchData;
        setData({ sources: parsed.sources ?? [], notes: parsed.notes ?? [] });
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  }, [data, hydrated]);

  const addSource = useCallback(() => {
    if (!sTitle.trim()) {
      pushToast("⚠️", "Title is required", "error");
      return;
    }
    const s: Source = {
      id: `src-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: sTitle.trim(),
      author: sAuthor.trim() || "Anonymous",
      url: sUrl.trim(),
      type: sType,
      year: sYear.trim(),
    };
    setData((d) => ({ ...d, sources: [s, ...d.sources] }));
    setSTitle(""); setSAuthor(""); setSUrl(""); setSYear("");
    pushToast("✅", "Source added", "success");
  }, [sTitle, sAuthor, sUrl, sType, sYear, pushToast]);

  const deleteSource = useCallback((id: string) => {
    setData((d) => ({
      sources: d.sources.filter((s) => s.id !== id),
      notes: d.notes.map((n) => (n.sourceId === id ? { ...n, sourceId: null } : n)),
    }));
  }, []);

  const addNote = useCallback(() => {
    if (!noteText.trim()) {
      pushToast("⚠️", "Note text is required", "error");
      return;
    }
    const n: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: noteText.trim(),
      sourceId: noteSourceId === "none" ? null : noteSourceId,
      date: Date.now(),
    };
    setData((d) => ({ ...d, notes: [n, ...d.notes] }));
    setNoteText("");
    pushToast("📝", "Note saved", "success");
  }, [noteText, noteSourceId, pushToast]);

  const deleteNote = useCallback((id: string) => {
    setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }));
  }, []);

  const citeSource = useMemo<Source | null>(
    () => data.sources.find((s) => s.id === citeSourceId) ?? null,
    [data.sources, citeSourceId],
  );

  const citation = useMemo(() => {
    if (!citeSource) return "";
    if (citeFormat === "MLA") return citeMLA(citeSource);
    if (citeFormat === "APA") return citeAPA(citeSource);
    return citeHarvard(citeSource);
  }, [citeSource, citeFormat]);

  const copyCitation = useCallback(async () => {
    if (!citation) return;
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      pushToast("📋", "Citation copied", "success");
    } catch {
      pushToast("⚠️", "Could not copy — select and copy manually", "error");
    }
  }, [citation, pushToast]);

  if (!mounted || !hydrated) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded bg-muted/40 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Microscope className="size-7 text-cyan-400" />
          Research Mode <span aria-hidden>🔬</span>
        </h1>
        <p className="text-sm text-muted-foreground">Organize sources, take notes, build citations</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sources */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="size-4" style={{ color: accent }} /> Sources
              <Badge variant="secondary" className="ml-auto tabular-nums">{data.sources.length}</Badge>
            </CardTitle>
            <CardDescription>Track books, websites, and videos you use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="src-title" className="text-xs">Title</Label>
                <Input id="src-title" value={sTitle} onChange={(e) => setSTitle(e.target.value)} placeholder="e.g. NCERT Science Textbook — Chapter 1" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="src-author" className="text-xs">Author</Label>
                <Input id="src-author" value={sAuthor} onChange={(e) => setSAuthor(e.target.value)} placeholder="Author or publisher" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="src-year" className="text-xs">Year</Label>
                <Input id="src-year" value={sYear} onChange={(e) => setSYear(e.target.value)} placeholder="2024" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="src-url" className="text-xs">URL (optional)</Label>
                <Input id="src-url" value={sUrl} onChange={(e) => setSUrl(e.target.value)} placeholder="https://…" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select value={sType} onValueChange={(v) => setSType(v as SourceType)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">📚 Book</SelectItem>
                    <SelectItem value="website">🌐 Website</SelectItem>
                    <SelectItem value="video">🎬 Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={addSource} className="w-full">
              <Plus className="size-4 mr-1" /> Add source
            </Button>

            <Separator />

            {data.sources.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No sources yet — add your first one above.</p>
            ) : (
              <ScrollArea className="max-h-72 -mx-1 px-1">
                <ul className="space-y-2">
                  {data.sources.map((s) => {
                    const m = SOURCE_TYPE_META[s.type];
                    return (
                      <li key={s.id} className="rounded-lg border bg-muted/20 p-3">
                        <div className="flex items-start gap-2">
                          <span
                            className="size-7 shrink-0 rounded-md flex items-center justify-center mt-0.5"
                            style={{ backgroundColor: `${m.color}22`, color: m.color }}
                          >{m.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{s.title}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {s.author}{s.year ? ` · ${s.year}` : ""} · {m.label}
                            </div>
                            {s.url && (
                              <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline truncate block">
                                {s.url}
                              </a>
                            )}
                          </div>
                          <Button size="icon" variant="ghost" className="size-7 shrink-0 text-muted-foreground hover:text-rose-400" onClick={() => deleteSource(s.id)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <StickyNote className="size-4" style={{ color: accent }} /> Notes
              <Badge variant="secondary" className="ml-auto tabular-nums">{data.notes.length}</Badge>
            </CardTitle>
            <CardDescription>Attach each note to a source</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="note-text" className="text-xs">Note</Label>
              <Textarea id="note-text" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write a key insight, quote, or summary…" rows={3} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Linked source</Label>
              <Select value={noteSourceId} onValueChange={setNoteSourceId}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pick a source (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— No linked source —</SelectItem>
                  {data.sources.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addNote} className="w-full">
              <Plus className="size-4 mr-1" /> Save note
            </Button>

            <Separator />

            {data.notes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No notes yet.</p>
            ) : (
              <ScrollArea className="max-h-72 -mx-1 px-1">
                <ul className="space-y-2">
                  {data.notes.map((n) => {
                    const src = n.sourceId ? data.sources.find((s) => s.id === n.sourceId) : null;
                    return (
                      <li key={n.id} className="rounded-lg border bg-muted/20 p-3">
                        <div className="flex items-start gap-2">
                          <Quote className="size-3.5 text-muted-foreground mt-1 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm whitespace-pre-wrap break-words">{n.text}</p>
                            {src && (
                              <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                                <FileText className="size-3" /> {src.title}
                              </div>
                            )}
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {new Date(n.date).toLocaleString()}
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="size-7 shrink-0 text-muted-foreground hover:text-rose-400" onClick={() => deleteNote(n.id)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Citation Generator */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="size-4" style={{ color: accent }} /> Citation Generator
            </CardTitle>
            <CardDescription>Pick a source and format — auto-generate a citation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Source</Label>
                <Select value={citeSourceId} onValueChange={setCiteSourceId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Pick a source" /></SelectTrigger>
                  <SelectContent>
                    {data.sources.length === 0 && <SelectItem value="_none" disabled>No sources yet</SelectItem>}
                    {data.sources.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Format</Label>
                <Select value={citeFormat} onValueChange={(v) => setCiteFormat(v as "MLA" | "APA" | "Harvard")}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MLA">MLA</SelectItem>
                    <SelectItem value="APA">APA</SelectItem>
                    <SelectItem value="Harvard">Harvard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 min-h-[80px]">
              {citation ? (
                <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">{citation}</p>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Pick a source to generate a citation.
                </p>
              )}
            </div>
            <Button onClick={copyCitation} disabled={!citation} className="w-full">
              {copied ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />}
              {copied ? "Copied!" : "Copy citation"}
            </Button>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Citations are auto-generated based on common MLA/APA/Harvard templates. Always double-check against your school&apos;s official style guide.
            </p>
          </CardContent>
        </Card>

        {/* Research Topics */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="size-4" style={{ color: accent }} /> Research Topics
            </CardTitle>
            <CardDescription>10 CBSE-relevant research ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scroll">
              {RESEARCH_TOPICS.map((t, i) => (
                <li key={i}>
                  <button
                    onClick={() => { setSTitle(t); pushToast("💡", "Topic loaded into source form", "info"); }}
                    className="w-full text-left rounded-lg border bg-muted/20 p-3 hover:border-primary/40 hover:bg-muted/40 transition-colors flex items-center gap-3"
                  >
                    <span className="size-6 shrink-0 rounded-md bg-primary/15 text-primary text-xs font-bold flex items-center justify-center tabular-nums">{i + 1}</span>
                    <span className="text-sm flex-1">{t}</span>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-[10px] text-muted-foreground">
              Tap any topic to start a new source with that title.
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="rounded-2xl glass border p-4 flex items-start gap-3 text-xs text-muted-foreground">
        <Globe className="size-4 shrink-0 text-cyan-400 mt-0.5" />
        <p className="whitespace-pre-wrap">
          All sources and notes are stored only in your browser&apos;s local storage under the key <code className="px-1 py-0.5 rounded bg-muted/60 font-mono">research-data</code>. They never leave your device. Clearing your browser data will erase this research.
        </p>
      </div>
    </div>
  );
}
