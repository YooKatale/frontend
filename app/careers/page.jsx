"use client";

import React, { useState } from "react";
import Button from "@components/Button";
import { MdOutlineLocationOn } from "react-icons/md";
import { jobs } from "@lib/constants/index"; 
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { sendDatabaseLink } from '@slices/applicationSlice';
import firebaseConfig from '@config/firebaseConfig';
import { getDatabase, ref, push, set } from 'firebase/database';


function Careers() {

  return (
    <div className="w-full py-10 bg-white">
      <div className="lg:w-7/12 w-11/12 space-y-10 mx-auto">
        <div className="space-y-2 lg:space-y-3">
          <p className="text-2xl lg:w-10/12 mx-auto lg:text-5xl text-gray-800 font-semibold">
            Join our team
          </p>
          <p className="lg:text-xl text-sm lg:w-10/12 mx-auto">
            Available Positions
          </p>
        </div>

        <div className="lg:w-10/12 mx-auto space-y-10">
          {jobs && Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id} {...job} />)
          ) : (
            <p>No jobs available</p>
          )}
        </div>
      </div>
    </div>
  );
}

const JobCard = ({
  category,
  title,
  reportsTo,
  employment,
  terms,
  location,
  details,
  salary,
  closingDate,
}) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const toggleApplyForm = () => {
    setOpenDetails(false);
    setShowApplyForm(prevState => !prevState);
  };

  const toggleDetails = () => {
    setShowApplyForm(false); 
    setOpenDetails(prevState => !prevState);
  };

  return (
    <div className="w-full border-2 lg:border-4 bg-white drop-shadow-secondary lg:drop-shadow-main transition-all duration-300 ease-in-out space-y-2 lg:space-y-5 border-gray-800 p-5">
      <p className="lg:text-xs text-lg font-semibold">{category}</p>
      <p className="text-3xl font-semibold">{title}</p>
      <div className="ml-1 lg:ml-5">
        <p className="lg:text-lg text-sm text-gray-800">
          <span className="font-semibold">Reports to:</span> {reportsTo}
        </p>
        <p className="lg:text-lg text-sm text-gray-800">
          <span className="font-semibold">Employment : </span>
          {employment}
        </p>
        <p className="text-sm lg:text-lg text-gray-800">
          <span className="font-semibold">Employment terms :</span> {terms}
        </p>
        <p className="text-sm lg:text-lg text-gray-800">
          <span className="font-semibold">Salary :</span> {salary}
        </p>
        <p className="text-sm lg:text-lg text-gray-800">
          <span className="font-semibold">To Apply: </span>Send resume
          <span className="text-blue-700"> info@yookatale.com</span>
        </p>
        <p className="text-sm lg:text-lg text-gray-800">
          <span className="font-semibold">Closing Date</span> {closingDate}
        </p>
      </div>

      <br/>
      
      <button disabled={true} style={{ margin: '5px', padding: '5px', background: 'lightgray', border: '2px solid black', display: 'flex', alignItems: 'center' }}>
        <MdOutlineLocationOn className="lg:text-xl text-sm" />
        <div style={{ marginLeft: '5px' }}>{location}</div>
      </button>

      <br/>
      <button
        onClick={toggleDetails}
        style={{
          margin: '5px',
          padding: '5px',
          background: 'lightgray',
          border: '2px solid black',
          boxShadow: openDetails ? 'none' : '1px 0 2px rgba(0, 0, 0, 0.1)', 
        }}
      >
        {openDetails ? "Close Details" : "View Details"}
      </button>
      <button
        style={{
          margin: "5px",
          padding: "5px",
          background: "lightgray",
          border: "2px solid black",
          alignItems: "center",
          boxShadow: '1px 0 2px rgba(0, 0, 0, 0.1)',
          width: "80px"
        }}
        onClick={toggleApplyForm}
      >
        Apply
      </button>

      <div
        className={`transition-all lg:border-l lg:ml-10 border-gray-800 duration-500 ease-in-out lg:w-10/12 lg:p-2 py-2 lg:pl-5 rounded ${
          openDetails ? "block" : "hidden"
        }`}>
        <p className="font-semibold mb-4">Key Responsibilities</p>
        <ul className="list-disc list-inside">
          {details.responsibilities.map((item, i) => (
            <li className="lg:ml-5 text-xs lg:text-sm" key={i}>
              {item}
            </li>
          ))}
        </ul>

        <p className="font-semibold mb-4 mt-10">Key Requirements</p>
        <ul className="list-disc list-inside">
          {details.requirements.map((item, i) => (
            <li className="lg:ml-5 text-xs lg:text-sm" key={i}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {showApplyForm && <ApplyForm />}
    </div>
  );
};

const ApplyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    coverLetter: "",
    cv: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "cv") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);

      const db = getDatabase();
      const applicationsRef = ref(db, 'applications');
      const newApplicationRef = push(applicationsRef);
      await set(newApplicationRef, formData);
  
      const databaseLink = `${process.env.REACT_APP_DATABASE_LINK}${newApplicationRef.key}`;
      await sendDatabaseLink(databaseLink);
  
      setFormData({
        name: "",
        email: "",
        coverLetter: "",
        cv: null,
      });
  
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again later.");
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="name">
            Name:
          </label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="email">
            Email:
          </label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="coverLetter">
            Cover Letter: (2500 Characters)
          </label>
          <textarea
            className="border rounded px-2 py-1 w-full"
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" htmlFor="cv">
            Attach CV (Resume):
          </label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="file"
            id="cv"
            name="cv"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="text-white font-bold py-2 px-4 rounded"
          style={{ backgroundColor: 'black', color: 'white' }}
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default Careers;
