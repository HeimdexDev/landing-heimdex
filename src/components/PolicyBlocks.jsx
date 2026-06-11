// Renders policy document blocks (paragraphs / numbered / bullet lists with one nesting level).
// Shared by the Policy page and the 전문보기 modal.
export function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.p) return <p key={i} className="leading-[1.7]">{b.p}</p>
    if (b.ol)
      return (
        <ol key={i} className="list-decimal space-y-1 pl-5">
          {b.ol.map((it, j) =>
            typeof it === 'string' ? (
              <li key={j} className="leading-[1.7]">{it}</li>
            ) : (
              <li key={j} className="leading-[1.7]">
                {it.t}
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {it.sub.map((s, k) => <li key={k}>{s}</li>)}
                </ul>
              </li>
            )
          )}
        </ol>
      )
    if (b.ul)
      return (
        <ul key={i} className="list-disc space-y-1 pl-5">
          {b.ul.map((it, j) => <li key={j} className="leading-[1.7]">{it}</li>)}
        </ul>
      )
    return null
  })
}
