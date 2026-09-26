# GhoulHouse / Editorial Brutalism — design system v1
**Art direction:** editorial brutalism + kaupallinen selkeys. Suunta pohjautuu Hannan toimittamaan moodboardiin sekä Margot Prioletin ja Rémi Jousselmen visuaalisiin viitteisiin. Referenssisivustojen taittoa, koodia tai kuvia ei kopioida.

## Visuaaliset perustukset
| Token | Arvo | Käyttö |
|---|---|---|
| `--gh-ed-black` | `#0B0B0B` | Noir-hero, prosessi, yhteys |
| `--gh-ed-paper` | `#F6F4EF` | Editorial-vaalea peruspinta |
| `--gh-ed-red` | `#B80F1A` | Yksi näyttävä punainen osio ja CTA:t |
| `--gh-ed-ink` | `#171513` | Luettava leipäteksti |
| `--gh-ed-rule` | `rgba(23,21,19,.27)` | Print-tyyppiset jakoviivat |
| `--gh-ed-serif` | Georgia | Pääotsikot, valitut lausumat, art direction |
| `--gh-ed-sans` | Montserrat | Leipäteksti, lomakkeet, palvelusisällöt |
| `--gh-ed-label` | Courier New | Metatieto, numerointi, painike- ja navigaatiotekstit |

Vanhat sivustotokenit säilyvät taaksepäinyhteensopivuuden vuoksi. Uudet komponentit käyttävät `--gh-ed-*`-tokeneita; tuotannon lomake-, consent- ja analytiikkatoimintoja ei uudisteta samalla PR:llä.

## Komponentit
- **HeroSpread:** oikea kaksisarakkeinen editorial-asettelu leveällä näytöllä; 390px: otsikko, pääviesti ja CTA ensin, kuva niiden jälkeen. Musta, off-white, punainen korostus. Ä/Ö-pisteet eivät kosketa edellistä riviä; rivikorkeus vähintään 1.1.
- **DocumentaryVisual:** suuri yksivärinen/voimakkaasti käsitelty kuva. Jokainen synteettinen konsepti merkitään näkyvästi `KONSEPTI — EI ASIAKASTYÖ`. Ei keksittyjä asiakasreferenssejä, sijainteja tai tuloksia.
- **ServicesIndex:** oikeat palvelut näkyvillä kolmena numeroituna rivinä; sivuston nykyiset reitit ja hinnan oikeellisuus säilyvät.
- **OwnWorkFeature:** ainoastaan GhoulHousen julkaistusta omasta sivustosta kertova työnäyte, aiempi kuvakaappaus nimenomaisesti aiemmaksi merkitty.
- **ProcessRail:** neljä vaihetta mustassa editorial-välissä, ei uusia kortteja tai viittä päällekkäistä jättiotsikkoa.
- **RedRoutesIndex:** palveluyritysten toimiala-/kanavalinkit `/rakennusyrityksille`, `/lvi-yrityksille` ja `/instagram-sisallontuotanto`, toimivat ilman JavaScriptiä.
- **QuietResourceIndex:** vain kaksi keskeistä opasta etusivulla. Muu sisältö pysyy /resurssit-sivulla.
- **Contact:** alkuperäinen `LeadForm`, `#yhteys`, `POST /api/leads`, valinnan tallennus, suostumus ja muut natiivitoiminnot ennallaan.
- **InnerPageTypography / EditorialCards:** jaetut otsikot, monospace-labelit, jakoviivat ja kulmikkaat pinnat kaikille SEO-, palvelu- ja työnäytesivuille.

## Sommittelu ja saavutettavuus
- **390 × 844:** ilmoitus-/navigaatiorivi, pääotsikko ja pää-CTA mahtuvat ensimmäiseen näkymään; yksi kuva koko leveydelle viestin jälkeen. H1 ei leikkaudu, kaksirivinen rakenne pysyy semanttisena.
- **1440 × 900:** hero on oikea typografinen editorial-levite, jossa suuri otsikko vasemmalla ja kuvapinta oikealla. Ensisijainen CTA näkyy ilman vieritystä.
- Lisäksi nykyiset testileveydet **320 / 640 / 768 / 1024 / 1280**: ei vaakavieritystä, tekstin peittymistä tai pintoihin katkeavaa H2-otsikkoa.
- Navigaatio, lomakkeet ja sisäiset linkit toimivat JavaScript pois päältä. Contrast ja keyboard focus tarkistetaan, redukoidun liikkeen asetus säilyy.
- Vältä SaaS-korttiruudukon toistoa, tarpeettomia efektikomponentteja, yltiötiivistä Anton-fonttia, käsittelemätöntä stock-kuvaa ja vahingossa eri palveluksi muuttuneita linkkejä.

## Säilytysehdot
`metadata`, schema, sitemap, canonical, consent, lead-API, lomakkeen palvelukohtainen esivalinta, 19 kanonista sivua ja niihin kuratoidut sisäiset linkit säilyvät. Muuta sisältöä, hintaa tai väitteitä vain erillisellä hyväksytyllä sisällönmuutoksella.
