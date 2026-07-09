export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning gold ring */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-700 animate-spin" />
        </div>
        {/* Pulsing brand name */}
        <p className="font-serif text-amber-800 text-lg tracking-widest animate-pulse">
          Kim Thao Trang
        </p>
      </div>
    </div>
  );
}