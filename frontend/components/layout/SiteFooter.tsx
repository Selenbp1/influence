import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { navItems, site } from "@/lib/site";
import type { SiteSetting } from "@/lib/types";

export function SiteFooter({ settings }: { settings?: SiteSetting | null }) {
  const email = settings?.email || site.email;
  const phone = settings?.phone || site.phone;
  const address = settings?.address || site.address;
  const instagram = settings?.instagram || "influence.official";
  const tagline = settings?.tagline || site.tagline;

  return (
    <footer className="border-t border-black/8 bg-neutral-50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-display text-2xl tracking-[0.2em]">{site.name}</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-neutral-500">{tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-black">
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="hover:text-black">
            관리자
          </Link>
        </div>
        <div className="space-y-3 text-sm text-neutral-600">
          <p className="flex items-center gap-2">
            <Mail className="size-4" /> {email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4" /> {phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4" /> {address}
          </p>
          <p className="flex items-center gap-2">
            <InstagramIcon className="size-4" /> @{instagram}
          </p>
        </div>
      </div>
      <div className="border-t border-black/8 py-6 text-center text-xs tracking-[0.18em] text-neutral-400 uppercase">
        © {new Date().getFullYear()} {site.name}. Naver Influencer Connection.
      </div>
    </footer>
  );
}
