export default function Page({ params }: { params: { id: string } }) {
  return <div>My Article: {params.id}</div>
}
