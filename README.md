# SQ(uest)L

**SQ(uest)L** to nowoczesna, interaktywna gra terminalowa do nauki SQL z fabułą, stworzona przez **Nesu**. Gra została zbudowana w oparciu o [Ink](https://github.com/vadimdemedes/ink) (React dla CLI) i pozwala na rozwiązywanie zadań SQL, zdobywanie XP oraz odkrywanie historii sabotażu w cyberpunkowej firmie.

---

## Funkcje

- **Interaktywne questy SQL** – rozwiązywanie zadań z natychmiastową informacją zwrotną.
- **Edytor SQL z podświetlaniem składni** – wygodne pisanie zapytań bezpośrednio w terminalu.
- **Komendy specjalne**:
  - `hint` – podpowiedź do zadania,
  - `skip` – pominięcie misji (kosztuje 5 XP),
  - `exit` – zakończenie gry w dowolnym momencie.
- **System XP i streaków** – zdobywaj punkty doświadczenia i buduj serię poprawnych odpowiedzi.
- **Fabuła i komunikaty** – cyberpunkowa historia z odkrywaniem sabotażysty.
- **Wizualizacja tabel** – przy każdym zadaniu wyświetlana jest struktura odpowiedniej tabeli, by łatwiej zrozumieć kontekst.
- **Przyjazny interfejs** – obsługa klawiatury, czytelne komunikaty, kolorowe podświetlenia.

---

## Wymagania

- Node.js w wersji **20 lub nowszej** (zalecane 20 LTS)
- npm (instalowany razem z Node.js)
- System operacyjny: Windows, Linux lub macOS (testowane głównie na Windows)

---

## Instalacja

1. Sklonuj repozytorium lub pobierz pliki projektu:
   ```sh
   git clone https://github.com/nesu/SQuestL.git
   cd SQuestL
   ```
2. Zainstaluj zależności:
   ```sh
   npm install
   ```

---

## Uruchamianie gry

Najprościej uruchomić grę przez [tsx](https://github.com/esbuild-kit/tsx) (już w devDependencies):

```sh
npx tsx SQuestL.jsx
```

Alternatywnie, możesz uruchomić bezpośrednio przez Node.js (z loaderem ESM):

```sh
node --loader @esbuild-kit/esm-loader SQuestL.jsx
```

---

## Sterowanie

- **Menu główne**: nawigacja strzałkami, wybór Enterem.
- **Rozwiązywanie zadań**: wpisz odpowiedź SQL i zatwierdź Enterem.
- **Podpowiedź**: wpisz `hint` i Enter.
- **Pominięcie zadania**: wpisz `skip` (tracisz 5 XP).
- **Wyjście z gry**: wpisz `exit`.
- **Po błędnej odpowiedzi**: `y` – spróbuj ponownie, `n` – pomiń (tracisz 5 XP).

---

## Struktura projektu

- **SQuestL.jsx** – cała logika gry, definicje misji, obsługa interfejsu i fabuły.
- **README.md** – ten plik, szczegółowa dokumentacja.
- **LICENSE** – licencja projektu (Apache License 2.0).

---

## Rozwój i edycja

- Zadania (misje) są zdefiniowane na początku pliku `SQuestL.jsx` – możesz je łatwo edytować lub dodawać własne.
- Struktura tabeli do każdego zadania jest wyświetlana automatycznie.
- Wykorzystywane biblioteki: Ink, React, ink-select-input, ink-text-input.

---

## Rozwiązywanie problemów

- Jeśli pojawiają się błędy związane z ESM lub loaderami, uruchom grę z flagą `--loader @esbuild-kit/esm-loader`.
- Jeśli pojawiają się problemy z wyświetlaniem w terminalu, spróbuj użyć innego emulatora terminala (np. Windows Terminal, iTerm2, Alacritty).

---

## Licencja

Projekt jest dostępny na licencji [Apache License 2.0](./LICENSE).

---

Stworzone z ❤️ przez **Nesu** dzięki [Ink](https://github.com/vadimdemedes/ink).
