import React, { useEffect, useState } from "react";
import axios from "axios";
import CompanyCard from "./CompanyCard";
import { Spin } from "antd";
import { BASE_API_URL } from "../constant"; // Adjust path if needed

const CompanyList = ({ companies, setCompanies,sortData }) => {
  const [loader, setLoder] = useState(false)
  const getAllCompany = async () => {
    setLoder(true)
    try {
      let response = await axios.get(`${BASE_API_URL}/api/companies`);
      let companies = response?.data || [];
  
      // ✅ Apply sorting logic on the frontend
      if (sortData === "name") {
        companies.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortData === "location") {
        companies.sort((a, b) => a.location.localeCompare(b.location));
      } else if (sortData === "rating" || sortData === "average") {
        companies.sort((a, b) => {
          const avgA = a.reviews.length ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 0;
          const avgB = b.reviews.length ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 0;
          return avgB - avgA; // Higher rating first
        });
      }
      setCompanies(companies)
      setLoder(false)
    } catch (error) {
      setLoder(false)
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    getAllCompany();
  }, []);


  return (
    <div className="company-list">
      {loader ? (<div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px", // Adjust height based on modal content
        }}
      >
        <Spin size="large" />
      </div>) :
      companies?.length>0?
        companies?.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))
         :<div className="no-data-found"> No Data Found</div>
      }
       
    </div>
  );
};

export default CompanyList;
