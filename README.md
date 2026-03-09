# ekstraktor.pilotarium.eu

Automatyczny ekstraktor pytań lotniczych z Twoich notatek. Mając numer pytania przekieruje Cię na https://awiacja.edu.pl, aby umoliwić Ci utrwalenie wiedzy. Projekt jest statyczną aplikacją Next.js, co pozwala na bardzo łatwą publikację i gwarantuje 100% prywatności.

## Prywatność danych
Aplikacja jest w pełni statyczna. Wszystkie operacje (ekstrakcja kodów, generowanie linków) odbywają się lokalnie w Twojej przeglądarce. Historia pytań jest zapisywana wyłącznie w `localStorage` Twojej przeglądarki. Żadne dane nie są przesyłane na serwer.

---

## Uruchomienie projektu lokalnie
Projekt zawiera plik konfigurujący **Dev Container** — po otwarciu folderu w VS Code kontener automatycznie zainstaluje zależności.

1. Otwórz repozytorium w VS Code i wybierz **Reopen in Container** (polecenie `Dev Containers: Reopen in Container`).
2. Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

Jeśli z jakiegoś powodu pracujesz poza devcontainerem, możesz oczywiście ręcznie uruchomić `npm install` przed pierwszym startem, oraz `npm run dev`.

## Kontrybuowanie do projektu na GitHubie
1. **Sforkuj** repozytorium na GitHubie, aby mieć prywatną kopię w swoim profilu.
2. Sklonuj forka:
   ```bash
   git clone <URL_TWOJEGO_FORKA>
   ```
3. Stwórz osobną gałąź na swoje zmiany:
   ```bash
   git checkout -b nazwa-galezi
   ```
4. Wprowadź zmiany, przetestuj lokalnie, a następnie zatwierdź (`git commit`).
5. Wypchnij gałąź na zdalne repozytorium (`git push origin nazwa-galezi`).
6. Na stronie oryginalnego repozytorium otwórz Pull Request wskazując na swoją gałąź z forka i opisz proponowane zmiany.
> Dzięki za zainteresowanie projektem! Twoje poprawki pomagają uczynić aplikację lepszą dla wszystkich.

