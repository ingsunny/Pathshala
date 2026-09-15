import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-[#dfe6e1] bg-[#12241c] text-white">
      <div className="northstar-shell grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <BrandLogo inverse href={null} />
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#aebdb5]">
            Focused learning for people building what comes next. Understand
            deeply, make visible progress, and earn proof that means something.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#86b19c]">
            Learn
          </p>
          <div className="mt-4 space-y-3 text-sm text-[#d7e0db]">
            <Link className="block hover:text-white" href="/search_courses">
              Explore courses
            </Link>
            <Link className="block hover:text-white" href="/dashboard">
              Dashboard
            </Link>
            <Link
              className="block hover:text-white"
              href="/verifiy_certificate"
            >
              Verify certificate
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#86b19c]">
            Northstar
          </p>
          <div className="mt-4 space-y-3 text-sm text-[#d7e0db]">
            <a
              className="block hover:text-white"
              href="mailto:hello@northstar.local"
            >
              Contact
            </a>
            <span className="block">Built for lifelong learners</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="northstar-shell flex flex-col gap-2 py-6 text-xs text-[#91a39a] sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Northstar Learning</span>
          <span>Clarity over noise. Progress over promises.</span>
        </div>
      </div>
    </footer>
  );
}
