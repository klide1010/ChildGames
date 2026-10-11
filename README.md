# 🎮 Sala Giochi dei Nipoti

Sito di giochi semplici per bambini, pensato per il telefono (funziona anche su tablet e computer).
È fatto solo di HTML, CSS e JavaScript: non serve installare niente.

## I giochi

| Gioco | Come si gioca | Punti e tempo |
|---|---|---|
| 🍉 **Taglia la Frutta** | Striscia il dito sulla frutta che salta, evita le bombe | 60 secondi · +10 frutto, +50 stella, combo, −30 bomba |
| 🃏 **Memory delle Stelle** | Trova le coppie di personaggi (6, 8 o 10 coppie) | +50 a coppia + bonus velocità e bonus mosse |
| 💨 **Sonic Corre** | Sonic corre: un tocco per saltare, un altro tocco in aria per un piccolo balzo | +10 anello, +20 granchio, punti per la distanza · 3 vite: ogni ostacolo ne toglie una, ogni 1000 punti se ne guadagna una (max 5) |
| 🏎️ **Corsa su Strada** | Gara in stile OutRun con moto, auto o camion: tieni premuto a sinistra/destra per sterzare | 35 secondi + bonus ai checkpoint (20s, poi sempre meno) · a ogni livello più traffico che cambia corsia · urto −3s (camion −2s) · +20 sorpasso, +100 checkpoint |
| 🎤 **Canta con le Huntrix** | Ripeti la melodia di Rumi, Mira, Zoey e Derpy | Ogni livello vale livello × 10 · 3 vite |
| 👻 **Acchiappa i Saja Boys** | Tocca i demoni alle finestre, non le Huntrix | 45 secondi · +10, +30 Jinu 👑, −20 amica |
| ❓ **Sonic Indovina** | 10 indovinelli: contare, sommare, ombre, sequenze, intrusi | +100 a risposta + fino a 50 di bonus velocità |
| 🔍 **Trova l’Ombra** | Scova il personaggio nascosto nella folla | 8 round · +100 + bonus velocità, −10 errore |
| 👗 **Vesti la Bambola** | 7 bambole, 111 capi e accessori (Hawaii, Classico, Anni 70, 80, 90, 2000, Principessa, Sport, Supereroi, Huntrix da concerto, Sonic, Halloween, Natale), 13 sfondi e look pronti; 📸 Foto per salvare o condividere sui social | 10 punti a capo + bonus se almeno 3 capi sono dello stesso stile |

Ogni partita mostra **punti, tempo e stelle (da 0 a 3)** e salva la **classifica dei migliori 5** per ogni gioco
con il nome di chi ha giocato (i record restano sul telefono usato).

## Tempo di gioco (sessioni)

In alto a sinistra nel menu c'è il contatore ⏳ con il tempo di gioco rimasto (all'inizio 15 minuti).
Il tempo scorre solo mentre il sito è aperto e resta salvato anche se si ricarica la pagina.

- A 1 minuto dalla fine compare un avviso.
- Finito il tempo, compare la schermata **"Tempo di gioco finito!"** e non si può più giocare.
- Per sbloccare, un adulto tocca **7 volte di fila** (senza fermarsi) il pulsante **🔄 Riavvia sessione**
  e sceglie la durata della nuova sessione (da 1 a 60 minuti).
- Toccando 7 volte di fila il contatore ⏳ si può cambiare la durata in qualunque momento.

## Pubblicarlo con GitHub Pages

1. Unisci questo branch in `main` (oppure scegli direttamente questo branch al passo 3).
2. Su GitHub apri il repository → **Settings** → **Pages**.
3. In *Build and deployment* scegli **Deploy from a branch**, branch `main`, cartella `/ (root)`, poi **Save**.
4. Dopo 1–2 minuti il sito è online su `https://<tuo-utente>.github.io/<nome-repository>/`.

Consiglio: dal telefono apri il link e usa *Aggiungi a schermata Home*, così sembra un'app.

## Provarlo sul computer

Basta aprire `index.html` nel browser.
