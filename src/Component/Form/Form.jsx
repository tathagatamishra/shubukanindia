import { useEffect, useState } from "react";
import "./Form.scss";

export default function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    dob: '',
    gender: '',
    karateExperience: '',      // Changed to store 'yes' or 'no' string
    otherMartialArtsExperience: '' // Changed to store 'yes' or 'no' string
  });

  const handleExperienceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        console.log('Registration successful!');
        // Reset form or show success message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="Form">
      <section className="Form-Hero">
        <h1>Registration</h1>
        <p>Registration for Karate and Kobudo classes</p>
        <div className="underline"></div>
      </section>

      <section className="data">
        <form onSubmit={handleSubmit}>
          {/* Previous input fields remain the same */}
          <div className="inputBox">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="inputBox">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="inputBox">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Enter your mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div className="inputBox">
            <label htmlFor="state">State</label>
            <input
              type="text"
              name="state"
              id="state"
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              required
            />
          </div>

          <div className="inputBox">
            <label htmlFor="dob">Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              id="dob" 
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              required
            />
          </div>

          <div className="inputBox">
            <label htmlFor="gender">Gender</label>
            <select 
              name="gender" 
              id="gender" 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="inputBox checkbox-group">
            <label>Do you have previous experience in Karate?</label>
            <div className="checkbox-options">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="karateExperienceYes"
                  checked={formData.karateExperience === 'yes'}
                  onChange={() => handleExperienceChange('karateExperience', 'yes')}
                />
                <label htmlFor="karateExperienceYes">Yes</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="karateExperienceNo"
                  checked={formData.karateExperience === 'no'}
                  onChange={() => handleExperienceChange('karateExperience', 'no')}
                />
                <label htmlFor="karateExperienceNo">No</label>
              </div>
            </div>
          </div>

          <div className="inputBox checkbox-group">
            <label>Do you have previous experience in other Martial Arts?</label>
            <div className="checkbox-options">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="otherExperienceYes"
                  checked={formData.otherMartialArtsExperience === 'yes'}
                  onChange={() => handleExperienceChange('otherMartialArtsExperience', 'yes')}
                />
                <label htmlFor="otherExperienceYes">Yes</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="otherExperienceNo"
                  checked={formData.otherMartialArtsExperience === 'no'}
                  onChange={() => handleExperienceChange('otherMartialArtsExperience', 'no')}
                />
                <label htmlFor="otherExperienceNo">No</label>
              </div>
            </div>
          </div>

          <div className="BtnDiv">
            <button className="button-54" type="submit">
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}