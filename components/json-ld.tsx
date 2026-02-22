export function JsonLd() {
  const locations = [
    "Ludvika", "Smedjebacken", "Borlänge", "Falun", "Avesta", "Hedemora",
    "Leksand", "Malung", "Mora", "Orsa", "Rättvik", "Säter", "Vansbro",
    "Älvdalen", "Alvik", "Bjursås", "Bonäs", "Brintbodarna", "Dala-Floda",
    "Dala-Järna", "Danholn", "Djurås", "Enviken", "Fredriksberg", "Fryksås",
    "Furudal", "Garsås", "Gesunda", "Grangärde", "Grängesberg", "Grycksbo",
    "Gräv", "Gråda", "Gärde", "Grövelsjön", "Horndal", "Idre", "Insjön",
    "Linghed", "Långshyttan", "Mockfjärd", "Nusnäs", "Nyhammar", "Ornäs",
    "Siljansnäs", "Sollerön", "Sunnansjö", "Svärdsjö", "Sälen", "Tällberg",
    "Toftbyn", "Vikarbyn", "Vika",
  ]

  const services = [
    { name: "Rörmokare & VVS", description: "Professionell rörmokare och VVS-service i hela Dalarna." },
    { name: "Installation & Inkoppling", description: "Installation av diskmaskin, tvättmaskin, diskho, tvättställ, toalett och blandare." },
    { name: "Värme & Pannor", description: "Installation och byte av pannor, radiatorer, golvvärme, värmepumpar och bergvärme." },
    { name: "Komponentbyte", description: "Byte av varmvattenberedare, cirkulationspump, expansionskärl, säkerhetsventil, termostat och shuntventil." },
    { name: "Rördragning & Demontering", description: "Rördragning i pannrum, demontering av gamla rör, nyinstallation av VVS." },
    { name: "Duschkabin & Badrum", description: "Montera duschkabin, takdusch, badrumsrenovering." },
    { name: "Vattenrening & Filter", description: "Vattenrening, installation av vattenfilter och vattenutkastare." },
    { name: "Läckage & Akut", description: "Laga läckage, vattenskada, rörjour 24/7, akut rörmokare." },
    { name: "VVS-besiktning", description: "Rörinspektion, VVS-besiktning, kontroll av värmesystem." },
    { name: "Innovativa lösningar", description: "Egenutvecklade innovativa lösningar för husuppvärmning baserade på kavitationsteknik." },
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: "Kamiljö AB",
    description:
      "Professionell rörmokare i Ludvika och hela Dalarna. VVS-installation, rörjour 24/7, värme & pannor, badrumsrenovering, värmepumpar, vattenrening. Auktoriserade VVS-montörer med yrkesbevis. ROT-avdrag. F-skattsedel.",
    url: "https://kamiljo.se",
    telephone: "+46762124124",
    email: "info@kamiljo.se",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ludvika",
      addressRegion: "Dalarna",
      addressCountry: "SE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 60.1497,
      longitude: 15.1876,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Dalarna" },
      ...locations.map((loc) => ({ "@type": "City", name: loc })),
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "15",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "VVS-tjänster",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          areaServed: locations.map((loc) => ({ "@type": "City", name: loc })),
        },
      })),
    },
    knowsAbout: [
      "Rörmokare", "VVS", "Installera diskmaskin", "Installera tvättmaskin",
      "Montera tvättställ", "Installera diskho", "Byta element", "Byta radiator",
      "Installera toalett", "Montera duschkabin", "Takdusch", "Installera pannrum",
      "Rördragning", "Nyinstallation av VVS", "Installera värmepump", "Bergvärme",
      "Vattenrening", "Laga läckage", "Installera golvvärme", "Varmvattenberedare",
      "Cirkulationspump", "Expansionskärl", "Säkerhetsventil", "Termostat",
      "Shuntventil", "ROT-avdrag", "F-skattsedel", "Auktoriserad rörmokare",
      "VVS-besiktning", "Rörinspektion", "Kavitationsteknik",
    ],
    taxID: "559572-5366",
    legalName: "Kamiljö AB",
    paymentAccepted: "ROT-avdrag, Faktura, Swish",
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: "Auktoriserad VVS-montör" },
      { "@type": "EducationalOccupationalCredential", name: "Yrkesbevis VVS" },
      { "@type": "EducationalOccupationalCredential", name: "F-skattsedel" },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
