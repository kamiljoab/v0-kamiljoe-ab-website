import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Integritetspolicy | Kamiljö AB",
  description: "Integritetspolicy och GDPR-information för Kamiljö AB - VVS och Rörmokare i Ludvika",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till startsidan
        </Link>

        <h1 className="mb-8 font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Integritetspolicy
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="lead text-lg text-muted-foreground">
            Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}
          </p>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">1. Personuppgiftsansvarig</h2>
            <p className="mt-3 text-muted-foreground">
              Kamiljö AB (org.nr 559572-5366) är personuppgiftsansvarig för behandlingen av dina personuppgifter enligt denna policy.
            </p>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground">
              <li>Företag: Kamiljö AB</li>
              <li>Organisationsnummer: 559572-5366</li>
              <li>Adress: Ludvika, Dalarna</li>
              <li>E-post: info@kamiljo.se</li>
              <li>Telefon: +46 762 124 124</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">2. Vilka uppgifter samlar vi in?</h2>
            <p className="mt-3 text-muted-foreground">Vi samlar in följande personuppgifter när du kontaktar oss via webbplatsen:</p>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground">
              <li>Namn</li>
              <li>E-postadress</li>
              <li>Telefonnummer</li>
              <li>Meddelande/förfrågan</li>
              <li>Typ av tjänst du är intresserad av</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">3. Varför behandlar vi dina uppgifter?</h2>
            <p className="mt-3 text-muted-foreground">Vi behandlar dina personuppgifter för följande ändamål:</p>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground">
              <li>För att besvara dina förfrågningar och ge dig offert</li>
              <li>För att utföra och leverera beställda tjänster</li>
              <li>För att följa lagkrav (bokföring, skatt)</li>
              <li>För att förbättra våra tjänster</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">4. Rättslig grund</h2>
            <p className="mt-3 text-muted-foreground">
              Vi behandlar dina personuppgifter baserat på följande rättsliga grunder enligt GDPR:
            </p>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground">
              <li><strong>Avtal:</strong> För att fullgöra vårt avtal med dig när du beställer våra tjänster</li>
              <li><strong>Berättigat intresse:</strong> För att besvara förfrågningar och förbättra våra tjänster</li>
              <li><strong>Rättslig förpliktelse:</strong> För att följa bokförings- och skattelagstiftning</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">5. Hur länge sparar vi uppgifterna?</h2>
            <p className="mt-3 text-muted-foreground">
              Vi sparar dina personuppgifter endast så länge det är nödvändigt för de ändamål de samlades in:
            </p>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground">
              <li>Förfrågningar: Raderas efter 12 månader om inget avtal ingås</li>
              <li>Kunduppgifter: Sparas under avtalsperioden plus 36 månader för garantiärenden</li>
              <li>Bokföringsmaterial: Sparas i 7 år enligt bokföringslagen</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">6. Delning av uppgifter</h2>
            <p className="mt-3 text-muted-foreground">
              Vi delar inte dina personuppgifter med tredje part förutom:
            </p>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground">
              <li>Underleverantörer som hjälper oss utföra tjänster (ex. e-postleverantör)</li>
              <li>Myndigheter när lag kräver det</li>
            </ul>
            <p className="mt-3 text-muted-foreground">
              Vi säljer aldrig dina personuppgifter till tredje part.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">7. Dina rättigheter</h2>
            <p className="mt-3 text-muted-foreground">Enligt GDPR har du följande rättigheter:</p>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground">
              <li><strong>Rätt till tillgång:</strong> Du kan begära att få veta vilka uppgifter vi har om dig</li>
              <li><strong>Rätt till rättelse:</strong> Du kan begära att felaktiga uppgifter rättas</li>
              <li><strong>Rätt till radering:</strong> Du kan begära att dina uppgifter raderas</li>
              <li><strong>Rätt till begränsning:</strong> Du kan begära begränsad behandling</li>
              <li><strong>Rätt till dataportabilitet:</strong> Du kan få ut dina uppgifter i maskinläsbart format</li>
              <li><strong>Rätt att invända:</strong> Du kan invända mot viss behandling</li>
            </ul>
            <p className="mt-3 text-muted-foreground">
              För att utöva dina rättigheter, kontakta oss på info@kamiljo.se
            </p>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">8. Cookies</h2>
            <p className="mt-3 text-muted-foreground">
              Vår webbplats använder endast nödvändiga tekniska cookies för att webbplatsen ska fungera korrekt. 
              Vi använder inga spårningscookies eller tredjepartscookies för marknadsföring.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">9. Säkerhet</h2>
            <p className="mt-3 text-muted-foreground">
              Vi vidtar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda dina personuppgifter mot obehörig åtkomst, 
              ändring, spridning eller förstöring. Vår webbplats använder SSL-kryptering (HTTPS).
            </p>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">10. Klagomål</h2>
            <p className="mt-3 text-muted-foreground">
              Om du är missnöjd med hur vi behandlar dina personuppgifter har du rätt att lämna klagomål till 
              Integritetsskyddsmyndigheten (IMY):
            </p>
            <ul className="mt-3 list-disc pl-6 text-muted-foreground">
              <li>Webb: <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.imy.se</a></li>
              <li>E-post: imy@imy.se</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-foreground">11. Ändringar</h2>
            <p className="mt-3 text-muted-foreground">
              Vi kan uppdatera denna integritetspolicy vid behov. Eventuella ändringar publiceras på denna sida.
            </p>
          </section>

          <section className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold text-foreground">Kontakta oss</h2>
            <p className="mt-3 text-muted-foreground">
              Har du frågor om hur vi hanterar dina personuppgifter? Kontakta oss:
            </p>
            <ul className="mt-3 text-muted-foreground">
              <li>E-post: <a href="mailto:info@kamiljo.se" className="text-primary hover:underline">info@kamiljo.se</a></li>
              <li>Telefon: <a href="tel:+46762124124" className="text-primary hover:underline">+46 762 124 124</a></li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
