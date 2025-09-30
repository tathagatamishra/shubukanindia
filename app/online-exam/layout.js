// online-exam/layout.js
import ExamNav from "@/components/Exam/UI/ExamNav";
import "./ExamLayout.css"

export default function Layout({ children }) {
  return (
    <div className="ExamLayout bg-[#ffffff] w-full h-screen px-[20px] pb-[40px] flex flex-col items-center">
      <nav className="w-full p-[20px]">
        <div className="w-full h-[60px] p-[10px]"></div>
      </nav>
      <ExamNav />
      {children}
    </div>
  );
}
