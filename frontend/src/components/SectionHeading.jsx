import { Reveal } from '../animation';

export default function SectionHeading({ eyebrow, title, text, align = 'left', light = false, reveal = true }) {
  const inner = (
    <div className={`section-heading text-${align} ${light ? 'is-light' : ''}`}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
  if (!reveal) return inner;
  return <Reveal anim="up">{inner}</Reveal>;
}
