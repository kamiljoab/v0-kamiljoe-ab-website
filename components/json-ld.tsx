export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: "Kamiljö AB",
    description:
      "Professionell rörmokare i Ludvika. VVS-installation, rörjour 24/7, värme & pannor, badrumsrenovering. Auktoriserade VVS-montörer med yrkesbevis.",
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
      { "@type": "City", name: "Ludvika" },
      { "@type": "City", name: "Smedjebacken" },
      { "@type": "City", name: "Borlänge" },
      { "@type": "City", name: "Falun" },
      { "@type": "AdministrativeArea", name: "Dalarna" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
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
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Installation & Inkoppling",
            description: "Installation av vask, tvättställ, dusch, toalett och blandare.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Värme & Pannor",
            description: "Installation och byte av pannor, radiatorer och värmesystem.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Komponentbyte",
            description: "Byte av varmvattenberedare, värmeväxlare och hydroforer.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Nyinstallation",
            description: "Kompletta VVS-installationer för nya maskiner i hemmet.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Innovativa lösningar",
            description:
              "Egenutvecklade innovativa lösningar för husuppvärmning baserade på kavitationsteknik.",
          },
        },
      ],
    },
    taxID: "559572-5366",
    legalName: "Kamiljö AB",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
