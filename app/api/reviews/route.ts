import { NextResponse } from "next/server"

interface Review {
  id: string
  author: string
  rating: number
  date: string
  text: string
  avatar: string
}

function getStaticReviews(): Review[] {
  return [
    {
      id: "1",
      author: "Martin Svensson",
      rating: 5,
      date: "2024-02-10",
      text: "Utmarkt service! Snabb och professionell hjalp med vattenlaeckan. Rekommenderas starkt!",
      avatar: "MS",
    },
    {
      id: "2",
      author: "Anna Karlsson",
      rating: 5,
      date: "2024-01-25",
      text: "Mycket nojd med installationen av var nya varmepump. Bra pris och fantastiskt arbete.",
      avatar: "AK",
    },
    {
      id: "3",
      author: "Erik Lindberg",
      rating: 5,
      date: "2024-01-15",
      text: "Kamiljo fixade vara ror pa nolltid. Proffsigt bemotande och rent efter sig. Toppenbetyd!",
      avatar: "EL",
    },
    {
      id: "4",
      author: "Sofia Nilsson",
      rating: 5,
      date: "2023-12-20",
      text: "Anlitade dem for badrumsrenovering. Mycket noggranna och punktliga. Helt fantastiskt resultat!",
      avatar: "SN",
    },
    {
      id: "5",
      author: "Johan Bergqvist",
      rating: 5,
      date: "2023-12-05",
      text: "Akut hjalp mitt i natten - de kom inom en timme! Professionellt och schysst pris.",
      avatar: "JB",
    },
    {
      id: "6",
      author: "Lisa Andersson",
      rating: 5,
      date: "2023-11-18",
      text: "Basta VVS-firman i Ludvika! Har anlitat dem flera ganger och alltid lika nojd.",
      avatar: "LA",
    },
    {
      id: "7",
      author: "Peter Johansson",
      rating: 5,
      date: "2023-11-02",
      text: "Toppenkvalitet pa arbetet. Installerade ny diskmaskin och allt fungerar perfekt.",
      avatar: "PJ",
    },
    {
      id: "8",
      author: "Maria Eklund",
      rating: 5,
      date: "2023-10-15",
      text: "Snabb offert och annu snabbare utforande. Rekommenderar Kamiljo till alla!",
      avatar: "ME",
    },
    {
      id: "9",
      author: "Anders Holmgren",
      rating: 5,
      date: "2023-09-28",
      text: "Fantastisk kundservice. De forklarade allt och holl vad de lovade. 5 av 5!",
      avatar: "AH",
    },
    {
      id: "10",
      author: "Karin Stromberg",
      rating: 5,
      date: "2023-09-10",
      text: "Professionellt fran borjan till slut. Vart nya badrum ar precis som vi ville ha det.",
      avatar: "KS",
    },
    {
      id: "11",
      author: "Mikael Larsson",
      rating: 5,
      date: "2023-08-22",
      text: "Snabb och palitlig service. Fixade problemet direkt och priset var mycket bra.",
      avatar: "ML",
    },
  ]
}

export async function GET() {
  const reviews = getStaticReviews()
  
  return NextResponse.json({
    reviews,
    total: reviews.length,
    rating: 5.0,
  })
}
