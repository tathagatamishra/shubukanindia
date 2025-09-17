"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };
  const [userType, setUserType] = useState(null);

  return (
    <div className="w-full h-[50vh] flex flex-col justify-center items-center gap-4">
      Login
    </div>
  );
}
