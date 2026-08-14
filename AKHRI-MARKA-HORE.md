# Sida loo deploy garaynayo (Railway + Netlify)

Waxaad haysataa laba qaybood:

- **`emis-backend/`** → waxaa lagu deploy garaynayaa **Railway**. Halkan ayaa xogtu si joogto ah ugu kaydsan tahay (database).
- **`emis-dashboard.html`** → waxaa lagu deploy garaynayaa **Netlify**, sida app-yadaada hore.

## 1) Backend-ka (Railway)

1. Samee GitHub repo cusub, ku dar dhammaan faylasha gudaha `emis-backend/` (server.js, package.json, .gitignore).
2. Railway.app → **New Project** → **Deploy from GitHub repo** → dooro repo-kaas.
3. Isla project-kaas gudihiisa: **New** → **Database** → **PostgreSQL** — Railway si otomaatig ah ayuu backend-kaaga u siin doonaa `DATABASE_URL` (ha wax ka bedelin `server.js`, wuxuu horeba u akhrin doonaa `process.env.DATABASE_URL`).
4. Sug ilaa uu deploy-ku dhammaado, kadibna ka koobiyee URL-ka backend-ka (tusaale: `https://emis-backend-production.up.railway.app`).
5. Hubi inuu shaqeeyo: fur `<URL-kaaga>/api/health` — waa inuu ku soo celiyaa `{"ok":true}`.

## 2) Frontend-ka (Netlify)

1. Fur `emis-dashboard.html`, raadi qorniinka:
   ```js
   const API_BASE_URL = 'https://YOUR-RAILWAY-APP.up.railway.app';
   ```
   ku beddel URL-ka backend-kaaga Railway (tan step 4 kore).
2. Deploy garee `emis-dashboard.html` Netlify sidii hore (drag & drop ama GitHub).

## 3) Isku day

- Fur site-ka Netlify, geli faylka Excel/CSV — wuxuu u dirayaa backend-ka Railway inuu kaydiyo.
- Fur isla site-ka mar kale (xitaa telefoon kale, browser kale) — xogtu waa ay sii jiraysaa, maadaama ay database-ka Railway ku jirto, ma aha browser-ka.
- Riix "Cusbooneysii liiska" haddii aad ka welwelsan tahay in xogtu la beddelay.

## Xasuusin

- Marka aad geliso fayl cusub, wuxuu **beddelayaa** dhammaan xogtii hore ee kaydsanayd (roster oo dhan ayaa la bedelaa, lama darsado). Haddii aad rabto in la daro (append) halkii la bedeli lahaa, waa la bedeli karaa `server.js`.
- Hadda backend-ku wuxuu u ogolyahay codsiyo ka yimaada meel kasta (CORS furan). Haddii aad rabto in loo xaddido site-kaaga Netlify oo keliya, waan kuu qaban karnaa.
