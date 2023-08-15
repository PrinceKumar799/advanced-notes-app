export default function ShowNotes({ data }) {
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.text}</p>
    </div>
  );
}
