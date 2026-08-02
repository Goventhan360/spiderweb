import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="bg-primary-dark py-[72px] text-center">
      <div className="max-w-[1180px] mx-auto px-8">
        <h2 className="serif text-[clamp(1.8rem,3vw,2.6rem)] font-semibold text-[#FFFFFF] mb-[16px]">
          Start building your career ledger.
        </h2>
        <p className="text-[#F5F7F4]/70 text-[15.5px] mb-[32px]">
          Free to join. No recruiter spam, ever.
        </p>
        <Link to="/register" className="inline-flex items-center justify-center gap-[6px] px-[26px] py-[13px] rounded-[4px] text-[15px] font-semibold cursor-pointer border border-transparent bg-gold text-[#201607] hover:bg-gold-light transition-all whitespace-nowrap">
          Get started — it's free
        </Link>
      </div>
    </section>
  );
}
