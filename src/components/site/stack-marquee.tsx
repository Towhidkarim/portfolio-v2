import { marquee } from '@/content/skills';
import { SkillIcon } from './brand-icons';

// Decorative: the second track is aria-hidden and icons carry empty alt.
export function StackMarquee() {
  return (
    <section aria-label='Technologies I use' className='mt-12'>
      <div className='m-marquee'>
        <div className='m-marquee-track'>
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className='flex gap-3 pr-3'
              aria-hidden={copy === 1 ? true : undefined}
            >
              {marquee.map((s) => (
                <li
                  key={s.name}
                  className='inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-card pr-[18px] pl-3 text-sm font-medium text-ink2'
                >
                  <span
                    className={`grid size-7 place-items-center rounded-lg ${s.mono ? 'bg-plate' : ''}`}
                  >
                    <SkillIcon skill={s} size={20} />
                  </span>
                  {s.name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
