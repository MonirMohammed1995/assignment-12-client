import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddScholarship = () => {
  const [formData, setFormData] = useState({
    scholarshipName: '',
    universityName: '',
    image: '',
    country: '',
    city: '',
    worldRank: '',
    subjectCategory: 'Agriculture',
    scholarshipCategory: 'Full fund',
    degree: 'Diploma',
    tuitionFees: '',
    applicationFees: '',
    serviceCharge: '',
    deadline: '',
    postDate: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://your-server.com/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      Swal.fire('Success!', 'Scholarship Added Successfully!', 'success');
      setFormData({
        scholarshipName: '', universityName: '', image: '', country: '', city: '',
        worldRank: '', subjectCategory: 'Agriculture', scholarshipCategory: 'Full fund',
        degree: 'Diploma', tuitionFees: '', applicationFees: '', serviceCharge: '',
        deadline: '', postDate: '', email: ''
      });
    } else {
      Swal.fire('Error!', 'Something went wrong', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Scholarship</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="scholarshipName" placeholder="Scholarship Name" value={formData.scholarshipName} onChange={handleChange} className="input" required />
        <input type="text" name="universityName" placeholder="University Name" value={formData.universityName} onChange={handleChange} className="input" required />

        <input type="text" name="image" placeholder="University Logo URL" value={formData.image} onChange={handleChange} className="input" required />

        <input type="text" name="country" placeholder="University Country" value={formData.country} onChange={handleChange} className="input" required />
        <input type="text" name="city" placeholder="University City" value={formData.city} onChange={handleChange} className="input" required />
        <input type="text" name="worldRank" placeholder="University World Rank" value={formData.worldRank} onChange={handleChange} className="input" required />

        <select name="subjectCategory" value={formData.subjectCategory} onChange={handleChange} className="input">
          <option value="Agriculture">Agriculture</option>
          <option value="Engineering">Engineering</option>
          <option value="Doctor">Doctor</option>
        </select>

        <select name="scholarshipCategory" value={formData.scholarshipCategory} onChange={handleChange} className="input">
          <option value="Full fund">Full fund</option>
          <option value="Partial">Partial</option>
          <option value="Self-fund">Self-fund</option>
        </select>

        <select name="degree" value={formData.degree} onChange={handleChange} className="input">
          <option value="Diploma">Diploma</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Masters">Masters</option>
        </select>

        <input type="number" name="tuitionFees" placeholder="Tuition Fees (optional)" value={formData.tuitionFees} onChange={handleChange} className="input" />
        <input type="number" name="applicationFees" placeholder="Application Fees" value={formData.applicationFees} onChange={handleChange} className="input" required />
        <input type="number" name="serviceCharge" placeholder="Service Charge" value={formData.serviceCharge} onChange={handleChange} className="input" required />
        <input type="date" name="deadline" placeholder="Application Deadline" value={formData.deadline} onChange={handleChange} className="input" required />
        <input type="date" name="postDate" placeholder="Post Date" value={formData.postDate} onChange={handleChange} className="input" required />
        <input type="email" name="email" placeholder="Posted User Email" value={formData.email} onChange={handleChange} className="input" required />

        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            Add Scholarship
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddScholarship;
