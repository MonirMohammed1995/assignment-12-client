import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ModeratorAddScholarship = () => {
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

  const inputClass = 'input input-bordered w-full';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/scholarships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to add scholarship');

      Swal.fire('Success!', 'Scholarship added successfully!', 'success');
      setFormData({
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

    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong!', 'error');
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-8 px-4 py-6 bg-base-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Add New Scholarship</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input type="text" name="scholarshipName" placeholder="Scholarship Name" value={formData.scholarshipName} onChange={handleChange} className={inputClass} required />
        <input type="text" name="universityName" placeholder="University Name" value={formData.universityName} onChange={handleChange} className={inputClass} required />

        <input type="text" name="image" placeholder="University Logo URL" value={formData.image} onChange={handleChange} className={inputClass} required />
        <input type="text" name="country" placeholder="University Country" value={formData.country} onChange={handleChange} className={inputClass} required />
        <input type="text" name="city" placeholder="University City" value={formData.city} onChange={handleChange} className={inputClass} required />
        <input type="text" name="worldRank" placeholder="University World Rank" value={formData.worldRank} onChange={handleChange} className={inputClass} required />

        <select name="subjectCategory" value={formData.subjectCategory} onChange={handleChange} className={inputClass}>
          <option>Agriculture</option>
          <option>Engineering</option>
          <option>Doctor</option>
        </select>

        <select name="scholarshipCategory" value={formData.scholarshipCategory} onChange={handleChange} className={inputClass}>
          <option>Full fund</option>
          <option>Partial</option>
          <option>Self-fund</option>
        </select>

        <select name="degree" value={formData.degree} onChange={handleChange} className={inputClass}>
          <option>Diploma</option>
          <option>Bachelor</option>
          <option>Masters</option>
        </select>

        <input type="number" name="tuitionFees" placeholder="Tuition Fees (optional)" value={formData.tuitionFees} onChange={handleChange} className={inputClass} />
        <input type="number" name="applicationFees" placeholder="Application Fees" value={formData.applicationFees} onChange={handleChange} className={inputClass} required />
        <input type="number" name="serviceCharge" placeholder="Service Charge" value={formData.serviceCharge} onChange={handleChange} className={inputClass} required />
        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className={inputClass} required />
        <input type="date" name="postDate" value={formData.postDate} onChange={handleChange} className={inputClass} required />
        <input type="email" name="email" placeholder="Posted User Email" value={formData.email} onChange={handleChange} className={inputClass} required />

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary w-full">
            Add Scholarship
          </button>
        </div>
      </form>
    </section>
  );
};

export default ModeratorAddScholarship;
