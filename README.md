# The Chic Roastery - Documentatie Proiect (Tehnologii Web)

> **NOTA:** Acest fisier reprezinta un sumar general al proiectului.
> Toate detaliile complete (arhitectura, pagini, fluxuri, cerinte, originalitate)
> se regasesc in documentatia completa: **documentatie_proiect.pdf**

---

## Descriere Generala si Ideea Principala

The Chic Roastery este o platforma web de tip Single Page Application care transpune complexitatea operationala a unui lant modern de cafenele de specialitate intr-un ecosistem digital complet. Aplicatia imbina doua directii principale: gestionarea unei retele de cafenele fizice (cu locatii, rezervari si meniu digital) si un Marketplace online sustinut de o retea de vendori externi, totul intr-o interfata unitara, moderna si responsiva.

---

## Functionalitati Implementate (Sumar)

1. **Autentificare si Gestionare Cont** - Sistem complet de Inregistrare, Autentificare si Editare Profil. Rolul utilizatorului este determinat automat dupa email. Starea de autentificare este persistata in localStorage.
2. **Sistem de Roluri (4 niveluri)** - Guest (vizitator neautentificat), Client (utilizator inregistrat cu dashboard personal, puncte de loialitate si istoric), Vendor (furnizor cu panou propriu de gestionare inventar si comenzi) si Administrator (control total asupra platformei).
3. **Locatii si Rezervari** - Pagina cu toate cafenelele retelei, carduri cu galerie automata de imagini, harti interactive Leaflet si sistem de rezervari cu selectare data/ora/numar persoane. Functionalitate unica de pre-comanda meniu direct din rezervare, disponibila in ziua sosirii.
4. **Marketplace si Checkout** - Magazin online cu filtrare pe categorii, gestiune dinamica de stoc, cos de cumparaturi global (CartSidebar) si flux complet de checkout in 4 pasi (date livrare, curier, plata, confirmare).
5. **Dashboard Admin** - Panou central cu statistici, management utilizatori/comenzi/inventar/vendori, adaugare locatii noi (cu coordonate GPS) si inbox pentru tichetele de suport ale furnizorilor.
6. **Dashboard Vendor** - Panou dedicat furnizorilor pentru gestionarea propriului portofoliu de produse, vizualizare comenzi si comunicare cu administratorul prin sistem de tichete de suport.
7. **Pagina de Contact** - Date comerciale complete, harta interactiva Leaflet full-width, formular de contact cu animatie de confirmare si linkuri Social Media. Datele de contact sunt editabile inline exclusiv de catre Administrator.

---

## Realizarea Cerintelor (Punctaj Laborator)

| Cerinta | Punctaj | Implementare |
|---|---|---|
| Module autentificare si creare/editare cont | 1p | `AuthPage.tsx` (login + register), `ProfilePage.tsx` (dashboard client), `AdminDashboard.tsx` (management conturi) |
| Pagina de start | 1p | `Home.tsx` cu Hero Section, carusel locatii, harta globala si call-to-action-uri |
| Pagina principala specifica aplicatiei | 1p | `LocationsPage.tsx`, `MarketplacePage.tsx`, `MenuPage.tsx`, `ReservationPage.tsx` |
| Pagina de administrare | 1p | `AdminDashboard.tsx` cu 6 sectiuni + `AdminLocationEditor.tsx` |
| Pagina de contact | 1p | `ContactPage.tsx` cu formular, harta Leaflet, date complete si editare inline Admin |
| Galerie de imagini | 1p | `ImageCarousel` cu auto-slide la 3 secunde si controale manuale (sageti + puncte) |
| Design responsiv | 1p | Breakpoints Tailwind (sm/md/lg), Navbar hamburger, FAB + Drawer pe mobil |
| Calitatea design-ului | 1p | Paleta custom (coffee + gold + cream), Google Fonts, Framer Motion, Glassmorphism |
| Elemente de originalitate | 1p | Pre-comanda la rezervare, 4 roluri izolate, fidelizare, inbox intern, imagini default dinamice |
| Documentatie Readme | 1p | Prezentul fisier |

---

## Modalitati de Utilizare (4 Moduri Principale)

1. **Guest (Vizitator)** - Acces la Homepage, Locatii, Meniu, Marketplace si Contact. Poate cumpara si rezerva mese fara cont.
2. **Client (Utilizator Inregistrat)** - Dashboard personal cu istoric rezervari/comenzi, puncte de loialitate, recenzii si pre-comanda meniu in ziua rezervarii.
3. **Vendor (Furnizor)** - VendorDashboard cu gestionare inventar propriu, vizualizare comenzi si tichete de suport catre Administrator.
4. **Administrator** - AdminDashboard cu control total, editare locatii, moderare recenzii si gestionare furnizori.

---

## Instructiuni de Instalare si Lansare

### Metoda 1: Docker Compose (Recomandata)
> Cerinta: Docker Desktop instalat si pornit.

```bash
git clone <URL_REPOSITORY>
cd Web_P/
docker-compose up --build
# Accesati: http://localhost:5173
```

### Metoda 2: Node.js local
> Cerinta: Node.js 18+ instalat.

```bash
git clone <URL_REPOSITORY>
cd Web_P/frontend
npm install
npm run dev
# Accesati: http://localhost:5173
```

---

## Conturi de Test

| Rol | Email | Redirect |
|---|---|---|
| Administrator | `admin@chic.ro` | `/admin` |
| Client | `alex@test.ro` | `/profile` |
| Vendor 1 | `sage@coffee.ro` | `/vendor` (Sage Coffee) |
| Vendor 2 | `symphony@coffee.ro` | `/vendor` (Symphony Coffee) |
| Client nou | orice alt email valid | profil gol creat pe loc |
| Guest | fara autentificare | navigare directa |

> **Nota:** Parola nu este validata in aceasta versiune — orice valoare este acceptata.

---

## Informatii Tehnice

| | |
|---|---|
| **Arhitectura** | Single Page Application (SPA) - exclusiv frontend in aceasta versiune |
| **Framework** | React 18 + TypeScript + Vite |
| **Rutare** | React Router Dom v6 cu rute protejate per rol |
| **Styling** | Tailwind CSS (paleta custom) + Framer Motion |
| **Harti** | React Leaflet + OpenStreetMap (open-source, fara API key) |
| **State Management** | React Context API (AuthContext + CartContext) + localStorage |
| **Containerizare** | Docker + Docker Compose (node:22-alpine) |
| **Date** | Mock data simulata prin fisiere TypeScript statice |
| **Backend real** | Nu este implementat — datele se reseteaza la refresh complet |