# Sida loo deploy garaynayo (Railway oo keliya, GitHub)

Hadda wax walba — frontend-ka iyo backend-ka — waxay isku wada jiraan hal Railway service, hal URL. Netlify uma baahnid.

## Qaab-dhismeedka faylasha (GitHub repo)

```
emis-backend/
  server.js
  package.json
  .gitignore
  public/
    index.html      <- dashboard-ka (frontend-ka)
```

Waxaa muhiim ah in `index.html` uu ku jiro gudaha folder `public/` -- kani waa sida `server.js` ugu heli karo.

## Tallaabooyinka

1. Ku dar/cusboonaysii dhammaan faylashan repo-gaaga GitHub (`Howlwadaag-Emis`), adiga oo ilaalinaya qaab-dhismeedka sare (`public/index.html`).
2. Railway wuu ogaan doonaa isbeddelka oo si otomaatig ah ayuu u deploy garayn doonaa (haddii aad horey u isku xidhay GitHub repo-ga).
3. Sug ilaa deploy-ku dhammaado (fiiri "Deployments" tab-ka), kadibna fur URL-kaaga Railway (tusaale: https://howlwadaag-emis-production.up.railway.app).
4. Waa inuu si toos ah kuu tuso dashboard-ka -- ma aha "Cannot GET /" mar dambe, ee waxaad arki doontaa bogga search-ka.

## Isku day

- Geli faylka Excel/CSV ee ardayda.
- Hubi in "arday oo diyaar ah" uu soo muuqdo.
- Qor magac (tusaale "cabdulaahi") -- hubi in suggestions-ku soo baxaan.
- Fur isla URL-ka telefoon kale ama browser kale -- xogtu waa ay sii jiraysaa, maadaama ay database-ka Railway ku jirto.

## Xasuusin

- `DATABASE_URL` waa inuu weli isku xidhan yahay (sidii aad horey u sameysay -- Variables tab -> Add Reference -> Postgres -> DATABASE_URL).
- Marka aad geliso fayl cusub, wuxuu **beddelayaa** dhammaan xogtii hore.
