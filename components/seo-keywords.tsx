/**
 * SEO Keywords Component
 * Renders hidden but crawlable text for search engine indexing.
 * Uses sr-only (screen-reader only) technique - invisible to sighted users
 * but fully accessible to search engine crawlers and screen readers.
 */

const LOCATIONS = [
  "Alvik", "Bjursås", "Bonäs", "Brintbodarna", "Dala-Floda", "Dala-Järna",
  "Danholn", "Djurås", "Enviken", "Fredriksberg", "Fryksås", "Furudal",
  "Garsås", "Gesunda", "Grangärde", "Grängesberg", "Grycksbo", "Gräv",
  "Gråda", "Gärde", "Grövelsjön", "Horndal", "Idre", "Insjön", "Linghed",
  "Långshyttan", "Mockfjärd", "Nusnäs", "Nyhammar", "Ornäs", "Siljansnäs",
  "Sollerön", "Sunnansjö", "Svärdsjö", "Sälen", "Tällberg", "Toftbyn",
  "Vikarbyn", "Vika", "Avesta", "Borlänge", "Falun", "Hedemora", "Leksand",
  "Ludvika", "Malung", "Mora", "Orsa", "Rättvik", "Smedjebacken", "Säter",
  "Vansbro", "Älvdalen",
]

const SERVICES = [
  "Rörmokare", "VVS",
  "Installera diskmaskin", "Installera tvättmaskin",
  "Montera tvättställ", "Installera diskho",
  "Kylskåp med ismaskin",
  "Byta element", "Byta radiator",
  "Installera toalett",
  "Montera duschkabin", "Takdusch",
  "Demontering av gamla rör",
  "Installera pannrum", "Rördragning i pannrum",
  "Nyinstallation av VVS",
  "Installera vattenutkastare", "Kran ute",
  "Installera värmepump", "Service bergvärme",
  "Vattenrening", "Installera vattenfilter",
  "Laga läckage", "Vattenskada rör",
  "Installera golvvärme", "Reparera golvvärme",
  "Vattenmätarbyte", "Installera vattenmätare",
  "Byte av köksblandare", "Installera tvättställsblandare",
  "Luftning av värmesystem", "Lufta radiatorer",
  "Byta varmvattenberedare", "Installera varmvattenberedare",
  "Byta avstängningsventil", "Installera Ballofix",
  "Rörinspektion", "VVS-besiktning",
  "Rörmokare nu", "VVS snabbt",
  "Byta cirkulationspump", "Installera cirkulationspump",
  "Byta expansionskärl", "Kontrollera expansionskärl",
  "Byta säkerhetsventil", "Installera säkerhetsventil",
  "Byta termostater", "Installera radiatortermostat",
  "Byta shuntventil", "Installera shuntstyrning",
  "Rörmokare med ROT-avdrag", "VVS-tjänster med ROT",
  "Rörmokare med F-skattsedel", "VVS-firma F-skatt",
  "Auktoriserad rörmokare", "Certifierad VVS",
]

export function SeoKeywords() {
  return (
    <section aria-label="Tjänsteområden" className="sr-only">
      <h2>VVS-tjänster i Dalarna</h2>
      <p>
        Kamiljö AB erbjuder professionella VVS-tjänster i hela Dalarna.
        Vi är auktoriserade rörmokare med yrkesbevis och erbjuder ROT-avdrag.
        Kontakta oss för installation, reparation och service av VVS i ditt område.
      </p>
      {SERVICES.map((service) => (
        <div key={service}>
          <h3>{service}</h3>
          <p>
            {LOCATIONS.map((loc) => `${service} ${loc}`).join(", ")}.
          </p>
        </div>
      ))}
      <div>
        <h3>Orter vi betjänar</h3>
        <p>
          {LOCATIONS.map((loc) => `Rörmokare ${loc}, VVS ${loc}, VVS-jour ${loc}, Akut rörmokare ${loc}`).join(", ")}.
        </p>
      </div>
    </section>
  )
}
