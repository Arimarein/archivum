# Archivum Website Project Rules

Jesteś agentem programistycznym pracującym nad istniejącą stroną internetową.

Twoim zadaniem jest rozwijanie obecnego projektu, a nie tworzenie nowego od zera.

---

# Struktura projektu

Projekt jest statyczną stroną HTML/CSS/JavaScript.

Główne pliki:

- index.html — struktura HTML strony
- style.css — wszystkie style CSS
- script.js — logika JavaScript
- data/ — dane JSON oraz system tłumaczeń
- data/lang/pl.json — tłumaczenia polskie
- data/lang/en.json — tłumaczenia angielskie
- data/works.json — dane projektów/prac
- images/ — grafiki strony
- fonts/ — lokalne fonty

Nie istnieje folder:
- src/
- components/
- app/
- node_modules/

Nie zakładaj użycia frameworków takich jak React, Vue lub Angular.

---

# Zasady pracy z kodem

1. Nie dodawaj CSS do index.html.
2. Nie dodawaj JavaScript inline do HTML.
3. Nie usuwaj istniejących funkcji bez wyjaśnienia.
4. Zachowuj istniejącą strukturę HTML, CSS i JavaScript.
5. Nie twórz nowych bibliotek ani frameworków bez zgody.
6. Wykorzystuj istniejące zasoby:
   - obrazy
   - fonty
   - pliki JSON
   - istniejące klasy CSS
7. Nie zmieniaj nazw istniejących plików i folderów bez wyraźnej potrzeby.
8. Nie twórz duplikatów funkcji lub styli.
9. Preferuj małe, precyzyjne zmiany zamiast przepisywania całych plików.

---

# Zasady analizy projektu

1. Przed zmianą kodu sprawdź istniejące pliki projektu.
2. Nie zgaduj struktury projektu.
3. Nie zakładaj istnienia plików, których nie widzisz.
4. Używaj dokładnych ścieżek znajdujących się w projekcie.
5. Jeśli potrzebujesz informacji o pliku — najpierw go odczytaj.
6. Przed większymi zmianami przeanalizuj zależności między plikami.

---

# Zasady używania narzędzi

Przed odpowiedzią dotyczącą kodu:

- sprawdź odpowiednie pliki projektu,
- przeczytaj aktualną zawartość plików,
- użyj dostępnych narzędzi zamiast zgadywania.

Przed edycją pliku:

- zawsze odczytaj jego aktualną wersję,
- upewnij się, że zmiana pasuje do istniejącej architektury.

---

# Bezpieczeństwo zmian

1. Edytuj tylko pliki znajdujące się w tym projekcie.
2. Nie wykonuj zmian poza katalogiem projektu.
3. Nie instaluj pakietów systemowych.
4. Nie modyfikuj konfiguracji systemu operacyjnego.
5. Nie usuwaj plików bez potwierdzenia.
6. Nie wykonuj destrukcyjnych poleceń terminala.

---

# Planowanie zmian

Przy większych zmianach:

1. Najpierw opisz plan.
2. Wymień pliki, które zostaną zmienione.
3. Wyjaśnij potencjalny wpływ zmian.
4. Dopiero potem wykonaj edycję.

---

# Po wykonaniu zmian

Po każdej większej zmianie:

- podsumuj zmodyfikowane pliki,
- opisz co zostało zmienione,
- wskaż ewentualne ryzyka,
- nie ukrywaj błędów lub problemów.
