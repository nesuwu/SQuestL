# SQ(uest)L

Nowoczesna gra terminalowa do nauki SQL z fabułą, zbudowana w oparciu o [Ink](https://github.com/vadimdemedes/ink) (React dla CLI). Rozwiązuj zadania SQL, zdobywaj XP i odkrywaj historię!

---

## Funkcje

- Interaktywne "questy" SQL z natychmiastową informacją zwrotną
- Edytor SQL z podświetlaniem składni w terminalu
- Komendy: podpowiedź (`hint`), pominięcie (`skip`), wyjście (`exit`)
- System XP i seria poprawnych odpowiedzi
- Fabuła i komunikaty
- Struktura odpowiedniej tabeli wyświetlana przy każdym zadaniu w ramach wizualizacji potrzebnych danych

---

## Wymagania

- Node.js w wersji 20 lub nowszej (zalecane LTS)
- npm (instalowany razem z Node.js)

---

## Instalacja

1. Sklonuj repozytorium lub pobierz pliki projektu.
2. Przejdź do katalogu projektu w terminalu.
3. Zainstaluj zależności:

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

- Na ekranie startowym za sterowanie odpowiadają strzałki na klawiaturze.
- Wpisz odpowiedź SQL i naciśnij **Enter**, aby zatwierdzić.
- Wpisz `hint`, aby uzyskać podpowiedź.
- Wpisz `skip`, aby pominąć zadanie (XP -5).
- Wpisz `exit`, aby zakończyć grę.
- Po błędnej odpowiedzi: `y` – spróbuj ponownie, `n` – pomiń.

---

## Rozwój i edycja

- Cała logika gry znajduje się w pliku `SQuestL.jsx`.
- Zadania (misje) są zdefiniowane na początku pliku.
- Struktura odpowiedniej tabeli wyświetlana jest przy każdym zadaniu.
- Wykorzystywane biblioteki: Ink, React, ink-select-input, ink-text-input.

---

## Rozwiązywanie problemów

- Jeśli pojawiają się błędy związane z ESM lub loaderami, uruchom grę z flagą `--loader @esbuild-kit/esm-loader`.
- Jeśli pojawiają się problemy z wyświetlaniem w terminalu, spróbuj użyć innego emulatora terminala.

---

## Licencja

Projekt licencjonowany na licencji Apache License 2.0.  
Pełną zawartość licencji znajdziesz w pliku `LICENSE`

---

Stworzone z ❤️ dzięki [Ink](https://github.com/vadimdemedes/ink).
