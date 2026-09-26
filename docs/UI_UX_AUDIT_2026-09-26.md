# GhoulHouse — käyttöliittymän, visuaalisen ilmeen ja koodin auditointi
26.9.2026 | Korjaushaara: `fix/cleanup-ui-audit-20260926`

## Lähteet ja rajaus

- Nykyisen `main`-version (2b9b9ce) lähdekoodi ja Vercelin tuotanto-HTML (HTTP 200).
- PR #93:n onnistuneen, samaa etusivun versiota vastaavan testiajon kuvakaappaukset: [GitHub Actions 36243211274](https://github.com/Jambovisuaalit/ghoulhouse-landing/actions/runs/36243211274). Mukana etusivu 320, 390, 640, 768, 1024, 1280 ja 1440 px sekä koko sivun ja sisäsivujen kuvakaappaukset.
- Tämä on lähdekoodiin ja kuvakaappauksiin perustuva auditointi, ei käyttäjätutkimus eikä mitattu PageSpeed-/Core Web Vitals -raportti. Uudet kuvakaappaukset ja testitulokset tarkistetaan erillisestä korjaus-PR:n ajosta.

## Auditoinnin havainnot ja toteutus

| Prioriteetti | Havainto | Toteutettu tässä PR:ssä |
|---|---|---|
| P0 | Etusivun yhteydenottolomakkeessa oli erillinen checkbox ja saman asian valitseva painike. Ne saattoivat ilmoittaa ristiriitaisia profiilitietoja. | Yksi oikea, saavutettava checkbox. Valinta tyhjentää vanhan URL:n ja lukitsee profiilikentän; valinnan peruminen avaa kentän. Vanha datalist-arvo hyväksytään edelleen palvelinvalidoinnissa taaksepäinyhteensopivuuden vuoksi. |
| P1 | Mobiilin työnäytteessä vanhan oman sivuston kuvakaappaus leikkautui `object-fit: cover` -asetuksella. | `object-fit: contain`, alkuperäistä 16:10-kuvasuhdetta vastaava kehys ja muuttumaton selitys: oma julkaistu työ, ei asiakasreferenssi. |
| P1 | Heron toimintakehotteen aputeksti oli mobiilissa vain 10 px ja kontrasti hillitty. | Teksti 13 px, rivikorkeus 1.55 ja vaaleampi sävy; ensisijainen CTA pidetään ensimmäisessä mobiilinäkymässä. |
| P1 | Etusivu latasi edelleen aiempien hero-/3D-karuselliversioiden saavuttamattomia tyylejä ja neljä käyttämätöntä komponenttia. | Poistettu käyttämättömät komponentit ja niihin sidotut tyylisäännöt kahdesta historiallisesta homepage-CSS-tiedostosta; nykyiset editorial- ja lomaketyylit jätetty paikoilleen. |
| P2 | Palvelukortin Social-linkki nimettiin paketiksi vaikka linkki vie yleiselle palvelusivulle; resurssilistassa oli kolmas, koskaan renderöimätön alkio. | Linkin kuvaus vastaa kohdesivua; tarpeeton lista-alkio poistettu ja kahden näkyvän resurssin intro täsmennetty. |

## Brändi ja visuaalinen johdonmukaisuus

**Vahvuudet:** 390- ja 1440-kuvissa on selkeä typografinen hierarkia, yksi hallitseva hero-CTA, käyttöön otetut oikeat GhoulHouse-logot ja konseptikuvan näkyvä alkuperämerkintä. Pääpalvelut, oma julkaistu työnäyte, työprosessi ja yhteydenotto on erotettu toisistaan.

**Jatkoauditointiin:** Kolme punaisen määritelmää näkyy lähdekoodissa: perusdesign `#C9282D`, editorial-järjestelmä `#B80F1A` ja toimitettujen logoassetien oma punainen. Niitä ei yhtenäistetä arvaamalla, koska logoassetien värejä ei pidä muuttaa. Selvitetään hyväksyttävä kanoninen käyttö värisävyjen, nappien ja tekstin kontrastin tasolla erillisessä design-päätöksessä.

Myös etusivun tyyli jakautuu vielä `homepage.css`-, `homepage-swiss.css`- ja `editorial-home.css`-kerroksiin. Tässä korjauksessa poistettiin vain varmasti saavuttamattomat vanhat säännöt. Laajempi CSS-uudelleenjärjestely edellyttää kuvavertailua jokaisessa vakiokatselukoossa.

## Julkaisuportti

Vaaditaan: kaikki nykyiset CI-testit, `next build`, typecheck, lint, no-JS-testaus, 320/390/768/1440-kuvakaappaukset, lomakkeen opt-out-testaus, Vercel Preview READY ja sen SHA:n vastaavuus PR:n viimeisimpään commitiin. Tuotantoon vasta onnistuneen portin jälkeen. Oikeaa asiakasliidiä ei lähetetä testissä.
