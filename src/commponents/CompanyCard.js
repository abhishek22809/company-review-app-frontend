import React,{useMemo} from "react";
import { Card, Rate, Button } from "antd";
import "../styles/companycard.scss";
import { useNavigate } from "react-router-dom";
import moment from "moment";
 import {BASE_API_URL} from '../constant'

const CompanyCard = ({ company }) => {
  const navigate = useNavigate();
  const averageRating = useMemo(() => {
    if (!company?.reviews?.length) return 0; // Return 0 if no reviews
    return (
      company?.reviews.reduce((sum, review) => sum + review.rating, 0) /
      company?.reviews.length
    );
  }, [company?.reviews]);
   
  return (
    <div className="company-card">
      <div className="logo-container">
        {/* <img src={`${BASE_API_URL}/uploads/${company.logo}`} alt="Company Logo" /> */}
        <img src={`${BASE_API_URL}/uploads/${company?.logo}`} alt="Company Logo" />

      </div>

      <div className="company-info">
        <h3>{company?.name}</h3>
        <p>{company?.location}</p>
        <div className="rating-container">
        <span className="review-count-bold">{averageRating.toFixed(1)}</span>
          <Rate allowHalf disabled value={averageRating} />
          <span className="review-count">{company?.reviews?.length} Reviews</span>
        </div>
      </div>

      {/* Right section for Date + Button */}
      <div className="right-section">
        <span className="founded-date">
          Founded on {moment(company?.foundedOn).format("DD-MM-YYYY")}
        </span>
        <Button
          type="default"
          className="detail-btn"
          onClick={() => navigate(`/company/${company._id}`)}
        >
          Detail Review
        </Button>
      </div>
    </div>

  );
};

export default CompanyCard;
