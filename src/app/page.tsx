"use client";

import { useState, useMemo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Files, Plane, ClipboardList, Trash2, History, Save, Check } from "lucide-react";
import { extractQuestionCodes, TOPIC_MAPPINGS, getLinkForCode } from "@/lib/aviation-data";
import { useToast } from "@/lib/use-toast";

const STORAGE_KEY = "aerolink_history_v1";

const SAMPLE_NOTE = `PL010-0579 - przestrzeń klasy C = separacja VFR | IFR 
PL010-0452 - vfr fir warszawa klasa G = FL85
PL010-0058 - dolna granica TMA = <200AGL  górna granica > FL460 (1400m STD)
PL010-0404 - VFR NOC = samodzielne 2 godziny lotu w noocy 
PL010-0157 
PL010-0590 - QNH
PL010-0590 - 15km PL010-0448 - FL75`;

export default function AeroLinkPage() {
  const [inputText, setInputText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setHistory(parsed);
          }
        } catch (e) {
          toast({
            title: "Błąd ładowania historii",
            description: "Nie udało się wczytać zapisanej historii. Dane mogą być uszkodzone.",
            variant: "destructive",
          });
        }
      }
    }
    setIsHydrated(true);
  }, []);

  const extractedCodes = useMemo(() => extractQuestionCodes(inputText), [inputText]);

  const syncWithStorage = (newHistory: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        if (newHistory && newHistory.length > 0) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        toast({
          title: "Błąd zapisu",
          description: "Nie udało się zapisać historii do pamięci przeglądarki. Sprawdź ustawienia prywatności.",
          variant: "destructive",
        });
      }
    }
  };

  const saveToHistory = () => {
    setHistory(prev => {
      const newItems = Array.from(new Set([...prev, ...extractedCodes]));
      syncWithStorage(newItems);
      return newItems;
    });
  };

  const saveSingleToHistory = (code: string) => {
    setHistory(prev => {
      if (prev.includes(code)) return prev;
      const newItems = [...prev, code];
      syncWithStorage(newItems);
      return newItems;
    });
  };

  const removeFromHistory = (code: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(c => c !== code);
      syncWithStorage(newHistory);
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const openAllLinks = (codes: string[]) => {
    let blockedCount = 0;
    codes.forEach(code => {
      const popup = window.open(getLinkForCode(code), "_blank");
      if (popup === null || typeof popup === 'undefined') {
        blockedCount++;
      }
    });
    if (blockedCount > 0) {
      toast({
        title: "Blokowanie pop-upów",
        description: `Przeglądarka zablokowała otwarcie ${blockedCount} linków. Zezwól na pop-upy dla tej strony.`,
        variant: "destructive",
      });
    }
  };

  const clearInput = () => {
    setInputText("");
  };
  
  const loadSample = () => setInputText(SAMPLE_NOTE);

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">ekstraktor.pilotarium.eu</h1>
              <p className="text-muted-foreground text-sm">Automatyczny ekstraktor pytań lotniczych z Twoich notatek.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadSample} className="text-xs">
              <ClipboardList className="w-4 h-4 mr-1" /> Wczytaj przykład
            </Button>
            {inputText && (
              <Button variant="ghost" size="sm" onClick={clearInput} className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-1" /> Wyczyść notatkę
              </Button>
            )}
          </div>
        </header>

        <Card className="border-none shadow-xl overflow-hidden bg-white/50 backdrop-blur-md">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Files className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Twoje Notatki</CardTitle>
            </div>
            <CardDescription>
              Wklej tutaj swoje notatki zawierające kody typu PLXXX-YYYY. Dane są przetwarzane wyłącznie w Twojej przeglądarce.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea
              placeholder="Wklej notatki tutaj... (np. PL010-0579 - separacja VFR)"
              className="min-h-[200px] border-none focus-visible:ring-0 rounded-none p-6 text-base leading-relaxed resize-none bg-transparent"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </CardContent>
        </Card>

        {extractedCodes.length > 0 && (
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white/80 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <Files className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Wykryte w tekście</CardTitle>
                    <CardDescription>Znaleziono {extractedCodes.length} unikalnych kodów.</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={saveToHistory}
                    className="border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <Save className="w-4 h-4 mr-2" /> Zapisz wszystkie
                  </Button>
                  <Button 
                    onClick={() => openAllLinks(extractedCodes)} 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Otwórz Wszystkie
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[200px] font-bold">Numer Pytania</TableHead>
                      <TableHead className="font-bold">Temat</TableHead>
                      <TableHead className="text-right font-bold">Akcja</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractedCodes.map((code) => {
                      const prefix = code.split('-')[0];
                      const isSaved = history.includes(code);
                      return (
                        <TableRow key={code} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="font-mono font-semibold">
                            <Badge variant="outline" className="text-primary border-primary/30 group-hover:border-primary">
                              {code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground group-hover:text-foreground">
                            {TOPIC_MAPPINGS[prefix] || "Nieznany temat"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => saveSingleToHistory(code)}
                                disabled={isSaved}
                                className={`h-8 ${isSaved ? "text-green-600" : "text-primary hover:text-primary hover:bg-primary/10"}`}
                              >
                                {isSaved ? (
                                  <><Check className="w-3.5 h-3.5 mr-1" /> Zapisano</>
                                ) : (
                                  <><Save className="w-3.5 h-3.5 mr-1" /> Zapisz</>
                                )}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                asChild 
                                className="h-8 text-primary hover:text-primary hover:bg-primary/10"
                              >
                                <a href={getLinkForCode(code)} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-1" /> Przejdź
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {history.length > 0 && (
          <Card className="border-none shadow-xl bg-white/80 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-primary/5">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Twoja Historia</CardTitle>
                  <CardDescription>Zapisane pytania ({history.length}).</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => openAllLinks(history)} 
                  variant="secondary"
                  size="sm"
                  className="font-semibold"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Otwórz historię
                </Button>
                <Button 
                  onClick={clearHistory} 
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Wyczyść historię
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[200px] font-bold">Numer Pytania</TableHead>
                    <TableHead className="font-bold">Temat</TableHead>
                    <TableHead className="text-right font-bold">Akcja</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...history].reverse().map((code) => {
                    const prefix = code.split('-')[0];
                    return (
                      <TableRow key={`hist-${code}`} className="hover:bg-primary/5 transition-colors group">
                        <TableCell className="font-mono font-semibold">
                          <Badge variant="outline" className="text-primary border-primary/30 group-hover:border-primary">
                            {code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground group-hover:text-foreground">
                          {TOPIC_MAPPINGS[prefix] || "Nieznany temat"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFromHistory(code)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild 
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <a href={getLinkForCode(code)} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" /> Przejdź
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {!inputText && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
            <ClipboardList className="w-16 h-16 text-primary/40" />
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Zacznij od wklejenia notatek</h3>
              <p className="text-sm max-w-sm mx-auto">
                System automatycznie przetworzy tekst, wygeneruje linki do bazy pytań PPL(A) i pozwoli Ci je zapisać. Twoje dane nie opuszczają Twojej przeglądarki.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}