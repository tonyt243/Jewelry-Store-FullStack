async function slowData() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return 'done';
}

export default async function TestPage() {
  await slowData();
  return <div className="p-20 text-center">Loaded!</div>;
}