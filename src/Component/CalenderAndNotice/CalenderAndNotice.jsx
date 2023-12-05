import { useEffect, useState } from "react";
import './CalenderAndNotice.scss'

export default function CalenderAndNotice() {

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  
  return (
    <div className='CalenderAndNotice'>
     
      <section className="Calender-Hero">
          <h1>Calender</h1>
          <p>Discovering the Way of Words</p>
      </section>

      <section className="Notice-Hero">
          <h1>Notice</h1>
          <p>Discovering the Way of Words</p>
      </section>
    </div>
  )
}
