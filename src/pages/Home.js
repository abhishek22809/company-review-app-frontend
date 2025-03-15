import React,{useState} from "react";
import Navbar from "../commponents/Navbar";
import SearchBar from "../commponents/SearchBar";
import CompanyList from "../commponents/CompanyList";

const Home = () => {
  const [companies, setCompanies] =useState([]);
   const [sortData,setSortData]=useState("name")
  return (
    <div>
    <Navbar setCompanies={setCompanies} />
    <div className="container">
      {/* Search Bar in its own container */}
      <div className="search-container">
        <SearchBar setCompanies={setCompanies} setSortData={setSortData} sortData={sortData}/>
      </div>
      <div className="separator"></div>

      {/* Company List */}
      <CompanyList companies={companies} setCompanies={setCompanies} setSortData={setSortData} />
    </div>
  </div>
  
  );
};

export default Home;
