import React, { useState, useEffect, useRef } from "react";
import { Input, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../styles/navbar.scss";
import axios from "axios";
import startIcon from '../assets/star.png'
import {BASE_API_URL} from '../constant'

const Navbar = ({ setCompanies, id = "" }) => {
  const [comapnyName, setCompanyName] = useState("");
  const debounceRef = useRef(null);

  const fetchCompanies = async (companyName) => {
    try {
      let response;

      if (!id) {
        // If `id` is empty, fetch companies
        if (!companyName.trim()) {
          response = await axios.get(`${BASE_API_URL}/api/companies`);
        } else {
          response = await axios.get(`${BASE_API_URL}/api/companies/by-city`, {
            params: { city: "", name: companyName },
          });
        }
        setCompanies(response.data);
      } else {
        // If `id` exists, fetch reviews
        if (companyName.trim()) {
          // Use search API only if query is provided
          response = await axios.get(`${BASE_API_URL}/api/reviews/search`, {
            params: { companyId: id, query: companyName },
          });
        } else {
          // Fetch all reviews for the company
          response = await axios.get(`${BASE_API_URL}/api/reviews/${id}`);
        }
        setCompanies(response.data);
      }
    } catch (error) {
      message.error("Failed to fetch data");
    }
  };


  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchCompanies(comapnyName);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(debounceRef.current);
    };
  }, [comapnyName]);

  return (
    <nav className="navbar">
      <h2 className="logo">
     <img  src={startIcon}/>        
      <span className="reviewtext"  >Review</span><span className="highlight">&</span><span className="bold">RATE</span>
      </h2>
      <Input
        placeholder="Search..."
        onChange={(e) => setCompanyName(e.target.value)}
        onPressEnter={() => fetchCompanies(comapnyName)}
        prefix={<SearchOutlined />} className="search"
        value={comapnyName}
      />

      <div>
        <Button type="text">SignUp</Button>
        <Button type="text">Login</Button>
      </div>
    </nav>
  );
};

export default Navbar;
