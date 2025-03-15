import React, { useState, useEffect, useRef } from "react";
import { Input, Button, message, Select } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/searchbar.scss";
import AddReviewModal from "../modals/AddReviewModal"
import {BASE_API_URL} from '../constant';

const SearchBar = ({ setCompanies, setSortData, sortData }) => {
  const { Option } = Select;

  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debounceRef = useRef(null);

  const fetchCompanies = async (selectedCity) => {
    try {
      let response;

      if (!selectedCity.trim()) {
        // ✅ If no city is entered, fetch all companies
        response = await axios.get(`${BASE_API_URL}/api/companies`);
      } else {
        // ✅ If city is entered, fetch filtered companies
        response = await axios.get(`${BASE_API_URL}/api/companies/by-city`, {
          params: { city: selectedCity },
        });
      }

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
      setCompanies(companies);
    } catch (error) {
      message.error("Failed to fetch companies");
    }
  };

  // Debounce effect for fetching companies
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchCompanies(city);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(debounceRef.current);
    };
  }, [city, sortData]);
  const handleSortChange = (value) => {
    setSortData(value)
  };

  return (
    <>
      <AddReviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        id=""
        fetchCompanyDetails={fetchCompanies}
      />
      <div className="search-bar">
        <Input
          placeholder="Enter City Name"
          className="city-input"
          prefix={<EnvironmentOutlined />}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onPressEnter={() => fetchCompanies(city)}
        />

        <Button type="primary" className="find-btn" onClick={() => fetchCompanies(city)}>
          Find Company
        </Button>

        <Button type="primary" onClick={() => setIsModalOpen(true)} className="add-btn">
          + Add Company
        </Button>
        <div className="sort-container">
  <label>Sort</label>
  <Select defaultValue="name" className="sort-dropdown" onChange={handleSortChange}>
    <Option value="name">Name</Option>
    <Option value="average">Average</Option>
    <Option value="rating">Rating</Option>
    <Option value="location">Location</Option>
  </Select>
</div>

      </div>
    </>
  );
};

export default SearchBar;
