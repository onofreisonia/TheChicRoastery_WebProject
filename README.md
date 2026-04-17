# The Chic Roastery - Documentatie Proiect (Tehnologii Web)

> **NOTA:** Acest fisier reprezinta un sumar general al proiectului.
> Toate detaliile complete (arhitectura, pagini, fluxuri, cerinte, originalitate)
> se regasesc in documentatia completa: **documentatie_proiect.pdf**

---

## 1. Descriere Generala si Ideea Principala

The Chic Roastery este o platforma web de tip Single Page Application care transpune complexitatea operationala a unui lant modern de cafenele de specialitate intr-un ecosistem digital complet.

Aplicatia imbina doua directii principale:
- O retea de cafenele fizice cu locatii, rezervari interactive si meniu digital.
- Un Marketplace online sustinut de o retea de vendori externi, cu cos de cumparaturi, checkout complet si gestiune de stoc dinamica.

Cele doua directii sunt unificate intr-o singura interfata coerenta, cu un sistem avansat de roluri (4 niveluri) si o experienta de utilizare premium bazata pe Glassmorphism, animatii Framer Motion si design complet responsiv.

---

## 2. Functionalitati Implementate

1. **Autentificare si Gestionare Cont** — Sistem complet de Inregistrare, Autentificare si Editare Profil. Rolul utilizatorului este determinat automat dupa adresa de email. Starea de autentificare este persistata in localStorage (ramane activa dupa refresh).

2. **Sistem de Roluri (4 niveluri complet izolate)**
   - **Guest** — vizitator neautentificat, acces la toate paginile publice.
   - **Client** — dashboard personal cu istoric rezervari/comenzi si puncte de loialitate, posibilitate de a scrie recenzii.
   - **Vendor** — panou dedicat pentru gestionarea inventarului propriu, vizualizare comenzi si comunicare cu administratorul prin tichete de suport.
   - **Administrator** — control total asupra platformei (utilizatori, comenzi, locatii, vendori, recenzii, date de contact).

3. **Locatii si Rezervari** — Pagina cu toate cafenelele retelei, fiecare cu galerie automata de imagini, harta interactiva Leaflet cu localizare exacta pe strada, recenzii si orar. Sistemul de rezervari permite selectarea datei, orei (6 sloturi) si numarului de persoane, cu locuri disponibile afisate in timp real. Functionalitate unica: pre-comanda meniu direct din rezervare, activa exclusiv in ziua sosirii.

4. **Marketplace si Checkout** — Magazin online cu filtrare pe categorii (Cafea Boabe, Echipamente, Accesorii, Patiserie), gestiune dinamica de stoc si pagini individuale per produs cu recenzii. Cos de cumparaturi global (CartSidebar) persistent pe toate paginile. Flux de checkout in 4 pasi: date livrare, alegere curier, metoda de plata (card cu animatie flip 3D sau ramburs), confirmare comanda.

5. **Dashboard Administrator (`/admin`)** — Panou central cu 6 sectiuni: Overview cu statistici live, Management Utilizatori (adaugare/stergere conturi inclusiv vendor), Management Comenzi cu filtrare si actualizare status, Inventar & Vendori, Adaugare Date noi (locatii cu coordonate GPS, vendori, produse) si Inbox Vendori (tichete de suport). Editare contextuala: butoanele de editare apar direct pe paginile publice de Locatii si Contact, vizibile exclusiv pentru Admin.

6. **Dashboard Vendor (`/vendor`)** — Panou dedicat cu 4 sectiuni: Overview cu statistici proprii si cereri de reaprovizionare, Inventar cu adaugare/editare/stergere produse proprii, Comenzi in care apar produsele furnizorului si Suport (trimitere tichete catre Administrator).

7. **Pagina de Contact** — Date comerciale complete (adresa, telefon, email, program), harta interactiva Leaflet full-width cu toate locatiile retelei, formular de contact cu animatie de confirmare si linkuri Social Media. Datele comerciale sunt editabile inline exclusiv de catre Administrator.

8. **Galerie de Imagini** — Carusel automat (ImageCarousel) cu auto-slide la 3 secunde, controale manuale (sageti + puncte indicatoare) si reset timer la interactiune manuala. Prezent pe paginile de Locatii si Produse.

---

## 3. Realizarea Cerintelor (Punctaj Laborator)

| Cerinta | Punctaj | Implementare |
|---|---|---|
| Autentificare si creare/editare cont | 1p | `AuthPage.tsx` (login + register cu design split-screen animat), `ProfilePage.tsx` (dashboard client), `AdminDashboard.tsx` sectiunea Utilizatori |
| Pagina de start | 1p | `Home.tsx` cu Hero Section full-screen, carusel interactiv de locatii, harta globala Leaflet cu toti pinii retelei si call-to-action-uri |
| Pagina principala specifica aplicatiei | 1p | `LocationsPage.tsx`, `MarketplacePage.tsx`, `MenuPage.tsx`, `ReservationPage.tsx` |
| Pagina de administrare | 1p | `AdminDashboard.tsx` cu 6 sectiuni complete + `AdminLocationEditor.tsx` pentru editare detaliata per locatie |
| Pagina de contact | 1p | `ContactPage.tsx` cu formular, harta Leaflet full-width, date comerciale complete si editare inline pentru Administrator |
| Galerie de imagini | 1p | `ImageCarousel` cu auto-slide la exact 3 secunde, sageti de navigare manuala si puncte indicatoare; timer resetat la interactiune |
| Design responsiv | 1p | Breakpoints Tailwind (sm/md/lg), Navbar hamburger pe mobil, grid-uri adaptive, FAB + Drawer pe ecrane mici, tabele inlocuite cu carduri pe mobil |
| Calitatea design-ului | 1p | Paleta custom (coffee + gold + cream), Google Fonts, Framer Motion, Glassmorphism pe Navbar, design distinct per pagina dar consistent ca sistem vizual |
| Elemente de originalitate | 1p | Arhitectura hibrida unica (retea fizica + marketplace intr-un ecosistem unitar). Pre-comanda la rezervare (flux personalizat cu modificare cantitati in timp real, activ exclusiv in ziua sosirii). 4 niveluri de roluri complet izolate cu interfete si permisiuni distincte. Program de fidelizare integrat (puncte alocate automat la fiecare comanda finalizata). Inbox intern Admin-Vendor (sistem de tichete de suport direct in aplicatie). Imagini default dinamice per categorie (algoritm de asignare automata la adaugarea unui produs/locatie fara fotografie). Editare contextuala Admin direct din interfata publica, fara pagini separate. Sistem restrictiv de recenzii (o singura recenzie per locatie/produs; formularul inlocuit automat cu recenzia existenta dupa publicare). Integrare geospatiala open-source cu Leaflet + OpenStreetMap. |
| Documentatie Readme | 1p | Prezentul fisier |

---

## 4. Structura Proiectului (Sumar)

```
Web_P/
  frontend/
    src/
      App.tsx              # Configurarea tuturor rutelor
      pages/               # Cate un fisier per pagina (15 pagini)
      components/          # Navbar, CartSidebar, ImageCarousel, MapComponent
      context/             # AuthContext.tsx (autentificare + cos + comenzi + rezervari + recenzii)
      data/                # Mock data: locations.ts, menu.ts, adminData.ts, bookings.ts
    Dockerfile
    docker-compose.yml
  documentatie_proiect.pdf
```

---

## 5. Harta Rutelor Aplicatiei

| Ruta | Componenta | Acces |
|---|---|---|
| `/` | `Home.tsx` | Public |
| `/auth` | `AuthPage.tsx` | Public |
| `/locations` | `LocationsPage.tsx` | Public |
| `/reserve/:locationId` | `ReservationPage.tsx` | Public |
| `/menu` | `MenuPage.tsx` | Public |
| `/marketplace` | `MarketplacePage.tsx` | Public |
| `/marketplace/product/:id` | `ProductPage.tsx` | Public |
| `/checkout` | `CheckoutPage.tsx` | Public |
| `/contact` | `ContactPage.tsx` | Public |
| `/profile` | `ProfilePage.tsx` | Autentificat |
| `/admin` | `AdminDashboard.tsx` | Admin |
| `/admin/location/:id` | `AdminLocationEditor.tsx` | Admin |
| `/vendor` | `VendorDashboard.tsx` | Vendor |
| `/vendor/:vendorId` | `VendorPage.tsx` | Vendor / Admin |

---

## 6. Fluxurile Principale de Navigare

**Flux 1 — Guest (fara cont):**
`/` → `/locations` → `/menu` → `/marketplace` → `/checkout` → Confirmare
Vizitatorul poate parcurge intregul flux de cumparare fara autentificare.

**Flux 2 — Client inregistrat:**
`/auth` (login) → `/profile` → `/reserve/:id` → Pre-comanda meniu in ziua rezervarii → Cumparare Marketplace → Scriere recenzii

**Flux 3 — Vendor:**
`/auth` (login vendor) → redirect automat `/vendor` → Overview / Inventar / Comenzi / Suport → Logout

**Flux 4 — Administrator:**
`/auth` (login admin) → redirect automat `/admin` → Overview / Utilizatori / Comenzi / Inventar / Adaugare Date / Inbox → Editare locatie din pagina publica → Editare date contact din `/contact` → Logout

---

## 7. Instructiuni de Instalare si Lansare

### Metoda 1: Docker Compose (Recomandata)
> Cerinta: Docker Desktop instalat si pornit.

```bash
git clone <URL_REPOSITORY>
cd Web_P/
docker-compose up --build
# Asteptati mesajul: Local: http://localhost:5173/
# Accesati in browser: http://localhost:5173
```

### Metoda 2: Node.js local
> Cerinta: Node.js 18+ instalat.

```bash
git clone <URL_REPOSITORY>
cd Web_P/frontend
npm install
npm run dev
# Accesati in browser: http://localhost:5173
```

---

## 8. Conturi de Test pentru Evaluare

| Rol | Email | Redirect automat |
|---|---|---|
| Administrator | `admin@chic.ro` | `/admin` |
| Client | `alex@test.ro` | `/profile` |
| Vendor 1 | `sage@coffee.ro` | `/vendor` (produse Sage Coffee) |
| Vendor 2 | `symphony@coffee.ro` | `/vendor` (produse Symphony Coffee) |
| Client nou | orice alt email valid | `/profile` (profil gol creat pe loc) |
| Guest | fara autentificare | navigare directa pe site |

> **Nota:** Parola nu este validata in aceasta versiune — orice valoare este acceptata. Rolul este determinat automat pe baza email-ului introdus.

---

## 9. Probleme Cunoscute si Limitari

**1. Harti Leaflet (React Leaflet)**
Libraria React Leaflet poate prezenta comportamente minore cunoscute in ecosistemul open-source: tile-urile se pot incarca incomplet la prima randare, harta poate necesita un moment pentru re-randare la redimensionarea ferestrei, marcajele pot avea un offset minor pe anumite rezolutii. Acestea sunt probleme documentate ale librariei Leaflet.js (issues deschise pe GitHub-ul oficial) si nu afecteaza functionalitatea de baza — coordonatele GPS sunt corecte, marcajele indica locatiile reale, harta este complet interactiva (zoom, pan, click pe marker).

**2. Simulare Frontend-Only**
Aplicatia nu dispune de un backend real in aceasta versiune. Toate datele (utilizatori, produse, comenzi, rezervari) sunt simulate prin fisiere TypeScript statice si se reseteaza la refresh-ul complet al paginii. Datele persistate in localStorage (sesiune, cos) supravietuiesc refresh-ului. Intr-un mediu de productie, acestea ar fi stocate intr-o baza de date reala comunicand prin REST API.

---

## 10. Informatii Tehnice

| | |
|---|---|
| **Arhitectura** | Single Page Application (SPA) — exclusiv frontend in aceasta versiune |
| **Framework** | React 18 + TypeScript + Vite |
| **Rutare** | React Router Dom v6 (rute protejate per rol) |
| **Styling** | Tailwind CSS (paleta custom) + Framer Motion (animatii) |
| **Harti** | React Leaflet + OpenStreetMap (open-source, fara API key) |
| **State Management** | React Context API (AuthContext + CartContext) + localStorage |
| **Containerizare** | Docker + Docker Compose (node:22-alpine) |
| **Date** | Mock data simulata prin fisiere TypeScript statice |
| **Backend real** | Nu este implementat in aceasta versiune |
