"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnlineExam() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };
  const [userType, setUserType] = useState(null);

  return (
    <div className="w-full h-[50vh] flex flex-col justify-center items-center gap-4">
      OnlineExam
      {userType == "student" ? (
        <>
          <button className="border rounded px-2" onClick={() => navigate('/online-exam/login')}>Log in</button>
          or
          <button className="border rounded px-2" onClick={() => navigate('/online-exam/signup')}>Sign up</button>
        </>
      ) : userType == "instructor" ? (
        <>
          <button className="border rounded px-2" onClick={() => navigate('/online-exam/login')}>Log in</button>
          or
          <button className="border rounded px-2" onClick={() => navigate('/online-exam/signup')}>Sign up</button>
        </>
      ) : (
        <>
          <button className="border rounded px-2" onClick={() => setUserType("instructor")}>Instructor</button>
          or
          <button className="border rounded px-2" onClick={() => setUserType("student")}>Student</button>
        </>
      )}
    </div>
  );
}
