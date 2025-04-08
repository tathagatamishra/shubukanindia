// app/404.js
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Image src="/404.png" alt="Sad Elephant" width={300} height={300} />
    </div>
  );
}
