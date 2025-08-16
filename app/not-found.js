import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Image src="https://res.cloudinary.com/daspiwjet/image/upload/v1755369237/404_cbnqif.png" alt="Sad Elephant" className="notFound" width={300} height={300} />
    </div>
  );
}
