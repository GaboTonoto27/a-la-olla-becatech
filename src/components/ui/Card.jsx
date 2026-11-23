export default function Card({ className = '', as: Tag = 'div', children, ...resto }) {
  return (
    <Tag
      className={`rounded-2xl border border-borde bg-white p-5 shadow-[0_1px_2px_rgba(28,31,29,0.04)] ${className}`}
      {...resto}
    >
      {children}
    </Tag>
  )
}
