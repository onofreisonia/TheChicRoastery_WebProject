# DOCUMENTAȚIE TEHNICĂ – "THE CHIC ROASTERY"

## Proiect Tehnologii Web
### Facultatea de Automatică și Calculatoare


---


## CUPRINS

1. Introducere și Conceptul Proiectului
2. Stiva Tehnologică Utilizată (Tech Stack)
3. Arhitectura și Organizarea Proiectului
4. Sistemul de Roluri și Autentificare
5. Descrierea Completă a Paginilor și Funcționalităților
6. Fluxurile Principale de Navegare (Ghid de Utilizare)
7. Corespondența Cerințelor Academice cu Funcționalitățile Implementate
8. Responsiveness – Adaptabilitate la Rezoluție și Ecrane Diferite
9. Originalitate și Contribuții Personale
10. Instrucțiuni de Instalare și Rulare
11. Probleme Cunoscute și Limitări
12. Conturi de Test pentru Evaluare


---


## Capitolul 1 – Introducere și Conceptul Proiectului

Proiectul „The Chic Roastery" este rezultatul dorinței de a transpune atmosfera și complexitatea operațională a unui lanț modern de cafenele de specialitate într-o platformă web completă. Dincolo de a fi un simplu site de prezentare, aplicația este o punte între lumea fizică (locațiile și cafenelele noastre) și lumea digitală (comerțul online și furnizorii parteneri).

Aplicația este construită ca o Single Page Application (SPA), ceea ce înseamnă că navigarea între pagini se face fără reîncărcarea completă a paginii – totul este fluid, animat și instantaneu.

### A. Miezul Fizic: Locațiile și Sistemul de Rezervări

Prima ancoră majoră a proiectului o reprezintă spațiile fizice. Platforma dispune de o infrastructură pentru „Locații", unde vizitatorii pot vedea fiecare prăjitorie și cafenea a brandului. Pentru fiecare locație se oferă informații detaliate, orar, recenzii și localizare geografică pe hartă interactivă.

Sistemul de Rezervări este interactiv și integrat cu Meniul aplicației. Când un client rezervă o masă pentru o anumită oră și dată, are posibilitatea de a parcurge Meniul digital aferent strict acelei locații alese și de a pre-adăuga produse la rezervare. Practic, atunci când clientul ajunge fizic la cafenea, comanda plasată digital dinainte îl așteaptă deja pregătită.

### B. Miezul Digital: Vendorii, Aprovizionarea și Marketplace-ul

A doua direcție fundamentală o reprezintă componenta de comerț online, sub umbrela „Marketplace". Pe lângă produsele vândute din meniul propriu, platforma acționează ca un hub pentru aprovizionare, bazat pe Vendori externi.

Fiecare vendor beneficiază de o pagină publică unică unde vizitatorul poate citi detaliile și povestea furnizorului și poate vizualiza exclusiv lista produselor vândute de acesta. Vendorii au putere reală de a acționa în aplicație: se pot loga și au unelte prin care încarcă inventar nou, actualizează prețuri și verifică vânzările.

Toate produsele se reunesc în Marketplace. Pentru a gestiona acest ecosistem, am implementat o „Zonă de Checkout" completă cu coș virtual persistent, formulare de adresă, selectare curier, procesator de plăți – o experiență e-commerce modernă de la cap la coadă.


---


## Capitolul 2 – Stiva Tehnologică Utilizată (Tech Stack)

Proiectul este o aplicație SPA construită în întregime în front-end, fără backend real în această versiune. Mai jos sunt listate toate tehnologiile și librăriile utilizate:

**React 18 (Framework UI):**
Nucleul aplicației. Toate paginile și componentele sunt construite ca module React reutilizabile. Se folosesc hook-uri moderne (useState, useEffect, useContext, useNavigate) pentru gestionarea stării și a ciclului de viață al componentelor.

**TypeScript:**
Tot codul sursă este scris în TypeScript (fișiere .tsx și .ts). Am definit interfețe custom pentru toate structurile de date principale: Product, Location, Order, InventoryItem, SupportTicket, MockAccount etc., asigurând type-safety și autocompletare sigură pe tot proiectul.

**Vite (Build Tool):**
Aplicația este inițializată și rulată cu Vite, care oferă un server de development extrem de rapid cu Hot Module Replacement (HMR).

**React Router Dom v6 (Rutare):**
Navigarea între pagini este gestionată de React Router v6. Rutele sunt definite în App.tsx cu componenta Routes. Sunt implementate rute cu parametri dinamici (ex: /reserve/:locationId, /vendor/:id, /admin/location/:id) și redirecționări condiționale bazate pe rolul utilizatorului.

**Tailwind CSS (Stilizare):**
Framework-ul CSS utilizat pentru design, configurat cu o paletă de culori custom (coffee, gold, cream). Responsivitatea este implementată nativ prin breakpoint-urile Tailwind (sm:, md:, lg:). Toate componentele sunt stilizate exclusiv prin clase utilitare Tailwind.

**Framer Motion (Animații):**
Librărie de animații pentru React, utilizată extensiv: tranziții la montarea/demontarea componentelor (AnimatePresence), animații de apariție pentru carduri și modale, efecte hover și micro-interacțiuni pe butoane.

**React Leaflet + Leaflet (Hărți Interactive):**
Librărie wrapper React peste Leaflet.js, folosită pentru afișarea hărților interactive cu tile-uri OpenStreetMap. Este utilizată pe pagina de Contact (hartă globală cu toate locațiile) și pe paginile individuale ale fiecărei cafenele (hartă cu pin specific pe stradă).

**React Context API (State Management Global):**
Două contexte globale gestionate cu createContext + useContext:
- AuthContext: stochează utilizatorul curent autentificat (rol, nume, id) și funcțiile logout/login.
- CartContext: stochează produsele adăugate în coș și funcțiile de manipulare (add, remove, update quantity).

**Lucide React (Iconițe):**
Librărie de iconițe SVG moderne, utilizate pe tot parcursul interfeței.

**Google Fonts (Tipografie):**
Fonturi importate din Google Fonts: font Serif pentru titluri (eleganță) și font Sans-Serif modern pentru text de corp (lizibilitate).

**Date Mock (Simulare Backend):**
Întregul sistem de date este simulat prin fișiere TypeScript în /src/data/: locations.ts (locațiile fizice), menu.ts (produsele din meniu), adminData.ts (conturi, inventar, comenzi, vendori, tichete suport), bookings.ts (logica de capacitate rezervări).

**Docker + Docker Compose (Containerizare):**
Proiectul este containerizat complet cu Docker, permițând rularea aplicației în orice mediu fără instalarea manuală a Node.js sau a dependențelor. Dockerfile-ul definește imaginea pe bază de node:22-alpine, iar docker-compose.yml orchestrează containerul cu hot-reloading funcțional.


---


## Capitolul 3 – Arhitectura și Organizarea Proiectului

### 3.1 Structura Folderelor

- Web_P/ (Rădăcina proiectului - git root)
  - frontend/ (Aplicația React)
    - src/
      - App.tsx (Configurarea tuturor rutelor - React Router)
      - main.tsx (Entry point - montează aplicația în DOM)
      - index.css (Stiluri globale)
      - pages/ (Ecranele principale - un fișier per pagină)
        - Home.tsx (Pagina de start / Landing Page)
        - AuthPage.tsx (Autentificare - Login + Register)
        - ProfilePage.tsx (Profil Utilizator)
        - LocationsPage.tsx (Locațiile fizice ale rețelei)
        - ReservationPage.tsx (Rezervare masă la o locație)
        - MenuPage.tsx (Meniul cafenelei)
        - MarketplacePage.tsx (Magazin Online - E-commerce)
        - ProductPage.tsx (Pagina de detalii produs)
        - CheckoutPage.tsx (Finalizare comandă)
        - ContactPage.tsx (Pagina de contact)
        - AdminDashboard.tsx (Panou administrare)
        - AdminLocationEditor.tsx (Editor locație - Admin)
        - VendorDashboard.tsx (Panou furnizor)
        - VendorPage.tsx (Pagina publică vendor)
      - components/ (Componente reutilizabile)
        - Navbar.tsx (Bara de navigare globală)
        - CartSidebar.tsx (Coșul de cumpărături - overlay)
        - ImageCarousel.tsx (Slideshow de imagini)
        - MapComponent.tsx (Componentă hartă Leaflet)
      - context/ (State management global)
        - AuthContext.tsx (Autentificare, coș, comenzi, recenzii)
      - data/ (Date mock - simulează baza de date)
        - adminData.ts (Produse, utilizatori, comenzi, vendori)
        - locations.ts (Locațiile fizice cu coordonate GPS)
        - menu.ts (Produsele din meniu)
        - bookings.ts (Capacitate și logică rezervări)
    - index.html (HTML shell cu viewport meta tag)
    - package.json (Dependențe și scripturi npm)
    - vite.config.ts (Configurare Vite)
    - tailwind.config.js (Tailwind - culori custom)
    - tsconfig.json (Configurare TypeScript)
  - Dockerfile (Build imagine Docker)
  - docker-compose.yml (Orchestrare container)
  - documentatie_proiect.md (Acest fișier de documentație)

### 3.2 Harta Rutelor Aplicației

- Rută: / | Componentă: Home.tsx | Acces: Public
- Rută: /auth | Componentă: AuthPage.tsx | Acces: Public
- Rută: /locations | Componentă: LocationsPage.tsx | Acces: Public
- Rută: /reserve/:locationId | Componentă: ReservationPage.tsx | Acces: Public
- Rută: /menu | Componentă: MenuPage.tsx | Acces: Public
- Rută: /contact | Componentă: ContactPage.tsx | Acces: Public
- Rută: /marketplace | Componentă: MarketplacePage.tsx | Acces: Public
- Rută: /marketplace/product/:id | Componentă: ProductPage.tsx | Acces: Public
- Rută: /checkout | Componentă: CheckoutPage.tsx | Acces: Public
- Rută: /profile | Componentă: ProfilePage.tsx | Acces: Utilizator autentificat
- Rută: /admin | Componentă: AdminDashboard.tsx | Acces: Admin
- Rută: /admin/vendor/:vendorId | Componentă: VendorPage.tsx | Acces: Admin
- Rută: /admin/location/:id | Componentă: AdminLocationEditor.tsx | Acces: Admin
- Rută: /vendor | Componentă: VendorDashboard.tsx | Acces: Vendor
- Rută: /vendor/:vendorId | Componentă: VendorPage.tsx | Acces: Vendor

### 3.3 State Management – AuthContext

AuthContext.tsx este nucleul de stare al aplicației și gestionează:
- Starea de autentificare: isLoggedIn, user (id, name, email, role, loyaltyPoints)
- Funcții de autentificare: login(), logout(), register()
- Coșul de cumpărături: cart[], addToCart(), removeFromCart(), updateQuantity(), clearCart()
- Vizibilitatea coșului: isCartOpen, setIsCartOpen
- Comenzile utilizatorului: addOrderToUser(), getUserOrders()
- Rezervările: addBookingToUser(), getUserBookings(), cancelBooking()
- Recenziile: addReview(), getUserReviews()

Toate datele sunt sincronizate cu localStorage pentru persistență la refresh-ul paginii.


---


## Capitolul 4 – Sistemul de Roluri și Autentificare

### 4.1 Cele 4 Roluri Implementate

**A. CLIENTUL (Baza Utilizatorilor):**
Vizitatorul oaspete (Guest) are acces să vadă absolut tot: locații, meniu, marketplace. Poate adăuga produse în coș, finaliza o achiziție și chiar rezerva o masă fără cont. Odată ce își creează un cont, clientul primește un Dashboard personalizat „Contul Meu" cu: istoricul rezervărilor, istoricul comenzilor, puncte de loialitate și dreptul de a scrie recenzii.

**B. VENDORUL (Furnizor / Partener B2B):**
Furnizorul care se loghează vede un panou complet diferit. Vizibilitatea sa se aplică exclusiv la propriul portofoliu de produse. Poate încărca produse noi pe marketplace, edita prețuri, gestiona stocul, vizualiza comenzile ce-l vizează și trimite tichete de suport administratorului.

**C. ADMINISTRATORUL (Controlul Total):**
Adminul are influență asupra întregii platforme. Vede toate datele la un loc: utilizatori, stocuri, vânzări globale. Gestionează furnizorii, citește tichetele de suport, extinde rețeaua fizică de cafenele, moderează recenzii și editează datele publice de contact ale firmei.

**D. VIZITATOR (Guest):**
Utilizator neautentificat. Poate naviga liber, cumpăra din marketplace fără cont și rezerva mese cu date de contact introduse manual.

### 4.2 Cum Funcționează Logarea

Sistemul de autentificare este bazat pe simulare locală (front-end only, fără backend). Rolul utilizatorului este determinat automat în funcție de cuvântul cheie din adresa de email introdusă la logare. Starea de autentificare este stocată în localStorage, deci utilizatorul rămâne logat și după refresh. La logout, localStorage este curățat și utilizatorul este redirecționat spre pagina principală.

### 4.3 Protecția Rutelor

- Ruta /admin este accesibilă exclusiv utilizatorilor cu rol Admin.
- Ruta /vendor este accesibilă exclusiv utilizatorilor cu rol Vendor.
- Ruta /profile este accesibilă exclusiv utilizatorilor autentificați.
- Dacă un utilizator neautorizat încearcă să acceseze o rută protejată, este redirecționat automat.


---


## Capitolul 5 – Descrierea Completă a Paginilor și Funcționalităților

### 5.1 Pagina Principală – Home (/)
Fișier: src/pages/Home.tsx

Pagina de landing a aplicației. Conține:
- Hero Section – prezentare vizuală premium cu fundal full-screen, titlu animat și două butoane principale ("Vezi Locațiile" și "Explorează Marketplace")
- Secțiunea Locații (Carusel Interactiv) – afișare dinamică a cafenelelor din rețea (câte 3 vizibile simultan) prevăzut cu săgeți de navigare. Pe fiecare card există butoane directe de "Rezervă masă" și "Vezi Meniu".
- Hartă globală interactivă – implementată cu Leaflet (`MapComponent`), afișând pinii tuturor locațiilor din rețea direct sub carusel

Navigare din această pagină: Navbar (global), butoane Hero (/locations, /marketplace), scurtături rapide de pe cardurile locațiilor (/reserve/:id și /menu?loc=:id).


### 5.2 Pagina de Autentificare – AuthPage (/auth)
Fișier: src/pages/AuthPage.tsx

Pagină cu design split-screen animat, conținând două moduri comutabile:

Modul Sign In (Logare): câmp email și parolă. La succes: redirect automat spre /profile (User), /admin (Admin) sau /vendor (Vendor).

Modul Sign Up (Înregistrare): câmpuri Nume Complet, Email, Parolă, Confirmare Parolă. Creează profilul utilizatorului în context și localStorage. La succes: redirect spre /profile.

Tranziția între Sign In și Sign Up este animată printr-un overlay glisant central.


### 5.3 Profilul Utilizatorului – ProfilePage (/profile)
Fișier: src/pages/ProfilePage.tsx
Acces: Exclusiv utilizatori autentificați

Pagina personalizată a utilizatorului logat. Secțiuni:
- Header profil – Avatar generat din inițiale, nume, email, badge nivel de loialitate
- Puncte de Fidelitate – punctele acumulate, bară de progres spre nivelul următor
- Rezervările Active – lista rezervărilor viitoare, cu opțiunea de anulare
- Istoricul Comenzilor – toate comenzile, cu status live, articole, preț total
- Recenzii Scrise – recenziile lăsate pentru produse

La fiecare comandă cu status „Livrat", utilizatorul poate scrie o recenzie dacă nu a scris deja una.

Navigare: Navbar (oriunde), buton Logout (/), link produs din comenzi (/marketplace/product/:id).


### 5.4 Locații – LocationsPage (/locations)
Fișier: src/pages/LocationsPage.tsx

Pagina cu toate locațiile fizice ale rețelei. Conține:
- Carduri de locație cu carusel automat de 3 fotografii per locație (la interval de 3 secunde)
- Adresă, orar, scor de recenzii
- Buton „Rezervă" pe fiecare card
- Pagini extinse per locație: la click, se deschide pagina cu hartă interactivă Leaflet cu localizarea exactă pe stradă, lista recenziilor, produsele din meniu disponibile
- Buton de editare vizibil exclusiv pentru Admin

Navigare: Buton „Rezervă" (/reserve/:locationId), click pe card (pagina extinsă), Navbar.


### 5.5 Rezervare Masă – ReservationPage (/reserve/:locationId)
Fișier: src/pages/ReservationPage.tsx

Pagina de rezervare funcționează în 3 stări:

Starea 1 – Alegere mod (doar vizitatori neautentificați): Card „Membru Elite" (redirect /auth), Card „Vizitator" (continuă fără cont).

Starea 2 – Formularul de rezervare: Dacă vizitator, câmpuri suplimentare Nume și Telefon. Selectare dată (min: azi, max: 30 zile), număr persoane (1–20), oră din 6 sloturi (09:00–19:00) cu locuri disponibile în timp real. Posibilitate de pre-adăugare produse din meniu.

Starea 3 – Confirmare: Card animat cu iconița de succes și detalii rezervare. Redirect automat: /profile (autentificat) sau /locations (vizitator).


### 5.6 Meniu – MenuPage (/menu)
Fișier: src/pages/MenuPage.tsx

Pagina cu meniul de cafenea. Categorii filtrabile: Cafea, Băuturi Reci, Specialități, Patiserie. Fiecare produs cu imagine, descriere și preț.


### 5.7 Marketplace – MarketplacePage (/marketplace)
Fișier: src/pages/MarketplacePage.tsx

Pagina de magazin online – scena principală a scenariului E-commerce. Conține:
- Bară de filtrare pe categorii: Toate, Cafea Boabe, Echipamente, Accesorii, Patiserie
- Bară de căutare cu filtrare live după nume produs
- Grid de produse: imagine, rating cu stele, badge categorie, indicator stoc, preț, buton „Adaugă în Coș"
- Gestionare dinamică a stocului: cantitatea scade la fiecare adăugare; produsele fără stoc nu pot fi adăugate

Navigare: Click pe produs (/marketplace/product/:id), buton coș (CartSidebar), link vendor (pagina publică vendor).


### 5.8 Pagina Produs – ProductPage (/marketplace/product/:id)
Fișier: src/pages/ProductPage.tsx

Pagina de detalii a unui produs. Conține:
- Imagine mare, descriere detaliată, specificații
- Rating agregat și numărul de recenzii
- Selector cantitate + buton „Adaugă în Coș"
- Secțiunea de recenzii: recenzii de la utilizatori autentificați, cu stele, text și dată


### 5.9 Coșul de Cumpărături – CartSidebar (global)
Fișier: src/components/CartSidebar.tsx

Componentă globală prezentă pe toate paginile. Overlay care se deschide din dreapta:
- Lista produselor cu imagine, nume, preț
- Selector de cantitate (+ / –), buton eliminare
- Total calculat dinamic
- Buton „Finalizează Comanda" (/checkout)


### 5.10 Checkout – CheckoutPage (/checkout)
Fișier: src/pages/CheckoutPage.tsx

Pagina de finalizare a comenzii, structurată în 4 pași vizuali (stepper):
1. Date de Livrare – Nume, Adresă, Oraș, Cod Poștal, Telefon
2. Alegere Curier – opțiuni cu timpi de livrare și prețuri diferite
3. Metodă de Plată – Card bancar (formular cu animație flip card 3D) sau Ramburs (cash)
4. Confirmare – sumar comandă, total final, buton „Plasează Comanda"

La confirmare: comanda este salvată în profil, stocurile actualizate, coșul golit, puncte de loialitate acordate.


### 5.11 Contact – ContactPage (/contact)
Fișier: src/pages/ContactPage.tsx

Conține:
- Formular de trimitere mesaj (Nume, Email, Subiect, Mesaj) cu animație de confirmare
- Date comerciale complete ale sediului central (adresă, telefon, email, program)
- Hartă interactivă Leaflet full-width cu toate locațiile rețelei
- Linkuri Social Media (Instagram, Facebook, LinkedIn) cu efecte hover
- Editare inline vizibilă exclusiv pentru Admin: câmpurile cu datele comerciale devin editabile pentru administratori


### 5.12 Dashboard Admin – AdminDashboard (/admin)
Fișier: src/pages/AdminDashboard.tsx
Acces: Exclusiv utilizatori cu rol Admin

Dashboardul central de management cu 6 secțiuni principale navigate prin sidebar:

a) OVERVIEW – Statistici globale live: utilizatori, venit, alerte stoc scăzut.

b) UTILIZATORI – Tabel complet cu toate conturile (clienți + vendori). Funcții: adăugare cont nou (inclusiv vendor), ștergere cont existent.

c) COMENZI – Toate comenzile platformei cu filtrare după status. Adminul poate actualiza statusul.

d) INVENTAR & VENDORI – Vederea completă a tuturor produselor din marketplace. Actualizare stoc, gestionare listă furnizori, adăugare vendor nou.

e) ADĂUGARE DATE – Formular adăugare locație nouă (nume, adresă, coordonate GPS, orar, produse meniu); formular adăugare vendor; formular adăugare produs.

f) INBOX VENDORI – Tichete de suport trimise de vendori. Afișare subiect, mesaj, dată. Marcare ca „Rezolvat".

Navigare mobilă: Pe ecrane mici, sidebar-ul dispare și apare un FAB circular fix în colțul dreapta-jos. Apăsarea lui deschide un drawer animat (Framer Motion) cu backdrop blur.


### 5.13 Editor Locație Admin – AdminLocationEditor (/admin/location/:id)
Fișier: src/pages/AdminLocationEditor.tsx
Acces: Exclusiv Admin

Pagină dedicată de editare per-locație: modificare detalii (nume, adresă, orar, descriere), activare/dezactivare produse din meniu per locație, moderare recenzii (vizualizare + ștergere), ștergere completă locație.


### 5.14 Dashboard Vendor – VendorDashboard (/vendor)
Fișier: src/pages/VendorDashboard.tsx
Acces: Exclusiv utilizatori cu rol Vendor

Fiecare furnizor vede exclusiv produsele propriului brand. 4 tab-uri:

a) PREZENTARE GENERALĂ – Statistici: Vânzări Totale, Unități Vândute, Produse cu Stoc Redus. Cereri de Reaprovizionare (produse pentru care Adminul a solicitat restoc; vendorul poate „onora" cererea).

b) INVENTAR – Pe desktop: tabel cu produsele proprii. Pe mobil: carduri individuale per produs (fără overflow). Câmp de căutare, buton „Adaugă Produs" (modal cu formular), butoane Editare și Ștergere produs. La adăugarea unui produs fără imagine, sistemul asignează automat o fotografie reprezentativă în funcție de categoria selectată.

c) COMENZI – Lista comenzilor în care apar produsele furnizorului. Detalii: ID, dată, client, articole, status, total.

d) SUPORT / INBOX – Formular de trimitere mesaj (tichet de suport) direct către Admin.

Navigare mobilă: Același pattern ca AdminDashboard – FAB + Drawer animat.


### 5.15 Pagina Publică Vendor – VendorPage (/vendor/:vendorId)
Fișier: src/pages/VendorPage.tsx

Profilul public al unui furnizor: descrierea companiei, istoricul și specializarea, ratingul general, toate produsele listate pe platformă de acel vendor. Accesibilă atât din Admin cât și din Marketplace.


---


## Capitolul 6 – Fluxurile Principale de Navigare (Ghid de Utilizare)

### Flux 1 – Navigarea ca Vizitator (Guest / Oaspete) – Fără count
Homepage (/) → Locații (/locations) → Detalii locație → Meniu (/menu) → Marketplace (/marketplace) → Detalii produs → Adăugare în Coș → Checkout (/checkout) → Confirmare

Vizitatorul poate parcurge întregul flux de cumpărare fără autentificare. La checkout completează datele manual.

### Flux 2 – Utilizarea ca Client Înregistrat
AuthPage (/auth – login) → Navbar actualizat „Contul Meu" → Explorare identică cu vizitatorul + posibilitate recenzii → Rezervare masă (cu pre-comandă meniu) → Cumpărare din Marketplace → ProfilePage (/profile – istoric, puncte, recenzii)

### Flux 3 – Utilizarea ca Vendor
AuthPage (/auth – login vendor) → Redirecționare automată → VendorDashboard (/vendor) → Overview / Inventar / Comenzi / Suport → Deconectare (/)

### Flux 4 – Utilizarea ca Administrator
AuthPage (/auth – login admin) → Redirecționare automată → AdminDashboard (/admin) → Overview / Utilizatori / Comenzi / Inventar / Adăugare Date / Inbox → Editare locație din pagina publică → Editare date contact din /contact → Deconectare (/)


---


## Capitolul 7 – Corespondența Cerințelor Academice cu Funcționalitățile Implementate

### Cerința 1 – Modulele de Autentificare și Creare / Editare Cont (1 punct)

AUTENTIFICARE (LOGIN): Pagină dedicată la /auth cu design split-screen. Câmpuri email și parolă, validare față de baza de date internă.

ÎNREGISTRARE (REGISTER): Formular pe aceeași pagină /auth. Completare nume, email, parolă. Contul se creează cu rolul „client" și 0 puncte de loialitate.

EDITARE PROFIL: Dashboard personalizat „Contul Meu" la /profile cu interacțiune pe datele proprii.

GESTIONARE AVANSATĂ (ADMIN): Secțiune „Management Utilizatori" în panoul Admin, unde se pot vedea, adăuga și șterge conturi (inclusiv conturi vendor cu ID furnizor).

### Cerința 2 – Pagina de Start a Aplicației / Homepage (1 punct)

Pagina de start la ruta / cu Hero Section de impact vizual, prezentarea ecosistemului (locații + marketplace), call-to-action-uri clare, Navbar global responsive care colapsează în meniu hamburger pe mobil, adaptare dinamică a navbar-ului în funcție de rolul utilizatorului logat.

### Cerința 3 – Pagina Principală Specifică Aplicației (1 punct)

Aplicația are mai multe pagini principale funcționale: Pagina Locații (/locations) cu carduri, carușel automat, hărți, recenzii. Pagina Marketplace (/marketplace) cu filtre, căutare, rating. Pagina Vendor (/vendor/:id) cu profil furnizor. Pagina Meniu (/menu) cu categorii. Pagina Rezervare (/reserve/:locationId) cu selectare dată/oră/meniu.

### Cerința 4 – Pagina de Administrare a Site-ului (1 punct)

Panou complet la /admin cu: Overview și statistici, Management Utilizatori (tabel + CRUD), Management Comenzi (filtrare, actualizare status), Inventar & Vendori, Adăugare locații noi (cu coordonate GPS, orar, meniu), Editare locații existente (/admin/location/:id), Inbox asistență vendori (tichete de suport), Editare date contact (binding live pe /contact).

### Cerința 5 – Pagina de Contact (1 punct)

Pagina /contact cu: date complete de contact (adresă, telefon, email, program), hartă interactivă Leaflet full-width cu toate locațiile, formular de trimitere email cu confirmare animată, linkuri Social Media (Instagram, Facebook, LinkedIn). Hărți prezente și pe paginile individuale de locații. Secțiune separată de asistență pentru vendori în panoul lor.

### Cerința 6 – Galerie de Imagini cu schimbare automată la 3 secunde (1 punct)

Carusel automat pe pagina de locații (componenta ImageCarousel) care se derulează la interval de exact 3 secunde. Control manual simultan: butoane săgeată stânga/dreapta și puncte indicatoare. Timer-ul se resetează la interacțiune manuală. Galerii multi-imagine și pe paginile produselor și vendorilor.

### Cerința 7 – Site Responsive (1 punct)

Navbar responsive (hamburger pe mobil). Grid-uri adaptive (3 coloane desktop, 2 tabletă, 1 mobil). Formulare adaptive (câmpuri reorganizate vertical). Imagini responsive (object-cover). Dashboarduri adaptive (FAB + Drawer pe mobil). Tabele responsive (carduri pe mobil, tabel pe desktop).

### Cerința 8 – Design-ul Paginilor (1 punct)

Paletă de culori consistentă (coffee + gold + cream), fără culori generice. Tipografie premium din Google Fonts. Animații cu Framer Motion. Glassmorphism pe navbar (blur + transparență). Design distinct per pagină dar consistent ca sistem.

### Cerința 9 – Originalitate și Contribuții Personale (1 punct)

Sistem hibrid unic (fizic + digital), pre-comandă la rezervare, 4 niveluri de roluri, program de fidelitate integrat, inbox de mesagerie internă admin-vendor, imagine default dinamică per categorie, editare admin direct din interfața publică (context-aware UX).


---


## Capitolul 8 – Responsiveness (UI/UX Adaptiv)

Aplicația este complet responsivă, cu strategia integrată de la design prin Tailwind CSS:

- Breakpoints utilizate: sm: (640px), md: (768px), lg: (1024px)
- Navbar: pe desktop afișează link-urile în linie orizontală; pe mobil colapsează într-un hamburger animat
- Grid-uri: trecere automată de la multi-coloană la coloană unică
- Dashboarduri Admin/Vendor: pe ecrane sub lg (1024px), sidebar-ul dispare (hidden lg:block) și apare un FAB circular fix în dreapta-jos; la click deschide drawer glisant animat (Framer Motion) cu backdrop blur; la selecție tab, drawer-ul se închide automat
- Tabele responsive: pe mobil, tabelele din inventar sunt înlocuite cu carduri individuale (lg:hidden pentru carduri, hidden lg:block pentru tabel)
- Viewport: <meta name="viewport" content="width=device-width, initial-scale=1.0"> prezent în index.html


---


## Capitolul 9 – Originalitate și Contribuții Personale

Proiectul depășește semnificativ cerințele minime:
- Sistem hibrid unic: combinarea unui lanț de cafenele fizice (cu rezervări, meniu per-locație) cu un Marketplace online și o rețea de Vendori externi
- Pre-comandă la rezervare: posibilitatea de a adăuga produse din meniu la o rezervare, pentru servire la ora sosirii
- 4 niveluri de roluri: Guest, Client, Vendor, Admin cu interfețe complet diferite
- Program de fidelitate integrat: puncte acumulate la fiecare comandă
- Inbox mesagerie internă: sistem de tichete de suport între vendori și admin, în interiorul aplicației
- Imagine default dinamică: la adăugarea unui produs fără imagine, sistemul asignează automat o fotografie reprezentativă în funcție de categoria selectată
- Editare contextuală: pagina de Contact și paginile de Locații au editare inline vizibilă exclusiv pentru admin, fără pagină separată


---


## Capitolul 10 – Instrucțiuni de Instalare și Rulare

### Metoda 1 – Docker Compose (RECOMANDATĂ)

Cerință: Docker Desktop instalat și pornit pe mașina gazdă.
Descarcă de la: https://www.docker.com/products/docker-desktop

```
Pasul 1: Clonează repository-ul
         git clone <URL_REPOSITORY>

Pasul 2: Deschide un terminal în folderul rădăcină al proiectului (Web_P/)

Pasul 3: Rulează comanda:
         docker-compose up --build

Pasul 4: Așteaptă câteva secunde până apare mesajul Vite:
         ➜  Local:   http://localhost:5173/

Pasul 5: Deschide browserul și accesează:
         http://localhost:5173
```

Ce se întâmplă în spate:
- Dockerfile folosește imaginea node:22-alpine, copiază codul din frontend/, rulează npm install și pornește serverul Vite pe portul 5173 cu flag-ul --host
- docker-compose.yml mapează portul 5173 al containerului la portul 5173 al mașinii gazdă, montează folderul local ./frontend ca volum (schimbările de cod se reflectă instant) și setează CHOKIDAR_USEPOLLING=true (necesar pentru Hot Reload pe Windows)

Oprire: Ctrl+C în terminal sau comanda docker-compose down.

### Metoda 2 – Node.js local (alternativă fără Docker)

Cerință: Node.js 18+ instalat pe mașina gazdă.

```
Pasul 1: Clonează repository-ul
         git clone <URL_REPOSITORY>

Pasul 2: Navighează în folderul frontend
         cd Web_P/frontend

Pasul 3: Instalează dependențele
         npm install

Pasul 4: Pornește serverul de development
         npm run dev

Pasul 5: Accesează în browser
         http://localhost:5173
```


---


## Capitolul 11 – Probleme Cunoscute și Limitări

### Hărțile Leaflet (React Leaflet)
Librăria React Leaflet utilizată pentru afișarea hărților interactive prezintă câteva probleme minore de afișare care sunt cunoscute în ecosistemul open-source al Leaflet.js și nu țin de codul aplicației noastre. Aceste bug-uri pot manifesta următoarele simptome:
- Tile-urile hărții se pot încărca incomplet sau cu artefacte vizuale minore la prima randare
- La redimensionarea ferestrei browserului, harta poate necesita un moment pentru a se re-randa corect
- Pe anumite rezoluții, marcajele (pin-urile) pot prezenta un offset minor față de poziția exactă

Aceste comportamente sunt documentate ca probleme cunoscute ale librăriei Leaflet.js (issues deschise pe GitHub-ul oficial) și nu afectează funcționalitatea de bază: toate coordonatele GPS sunt corecte, marcajele indică locațiile reale, iar harta este complet interactivă (zoom, pan, click pe marker).

### Simulare Frontend-Only
Aplicația nu dispune de un backend real în această versiune. Toate datele (utilizatori, produse, comenzi) sunt simulate prin fișiere TypeScript statice care se resetează la refresh-ul complet al paginii. Într-un mediu de producție, aceste date ar fi stocate într-o bază de date reală comunicând prin REST API.


---


## Capitolul 12 – Conturi de Test pentru Evaluare

Aplicația funcționează imediat după pornire cu date simulate (mock data). Nu este necesară nicio configurare suplimentară.

| Tip Cont | Email de introdus la Login | Parolă | Ce se întâmplă |
|---|---|---|---|
| Administrator | admin@chic.ro | orice | Redirecționare automată la /admin |
| Client cu istoric | alex@test.ro | orice | Profil cu rezervări și comenzi prepopulate |
| Vendor 1 (Sage) | sage@coffee.ro | orice | Dashboard vendor cu produsele Sage |
| Vendor 2 (Symphony) | symphony@coffee.ro | orice | Dashboard vendor cu produsele Symphony |
| Client nou | orice altă adresă validă | orice | Profil gol creat pe loc |
| Vizitator (Guest) | fără autentificare | – | Navigare directă pe site |

Notă: Câmpul de parolă nu este validat în această versiune de simulare – orice valoare este acceptată. Rolul este determinat automat pe baza email-ului introdus.
