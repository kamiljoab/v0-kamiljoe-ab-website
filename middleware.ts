export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: ["/vvs-portal-access", "/vvs-portal-access/:path*"],
}
