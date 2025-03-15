import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../commponents/Navbar";
import { useParams } from "react-router-dom";
import { Card, Rate, Button, List, Modal, Input, message, Avatar, Spin } from "antd";
import axios from "axios";
import moment from "moment";
import { EnvironmentOutlined, StarFilled } from "@ant-design/icons";
import "./CompanyReviewPage.scss";
import user_img from "../../src/assets/user_img.jpg"
import AddReviewModal from '../modals/AddReviewModal'
import {BASE_API_URL} from '../constant';

const CompanyReviewPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [loder, setLoder] = useState(false)

  const fetchCompanyDetails = async () => {
    try {
      setLoder(true)
      const response = await axios.get(`${BASE_API_URL}/api/companies/${id}`);
      setCompany(response.data);
      setLoder(false)

    } catch (error) {
      setLoder(false)

      message.error("Failed to load company details");
    }
  };

  const fetchCompanyReviewDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/reviews/${id}`);
      setReviews(response?.data);
    } catch (error) {
      message.error("Failed to load company details");
    }
  };
  useEffect(() => {
    fetchCompanyReviewDetails();
    fetchCompanyDetails();
  }, [id]);



  const handleModelOpen = (() => {
    setIsModalOpen(true)

  })

  const averageRating = useMemo(() => {
    if (!company?.reviews?.length) return 0; // Return 0 if no reviews
    return (
      company.reviews.reduce((sum, review) => sum + review.rating, 0) /
      company.reviews.length
    );
  }, [company?.reviews]);
  
  return (
    <>
      <Navbar id={id} setCompanies={setReviews}/>
      {isModalOpen ?
        <AddReviewModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          rating={rating}
          setRating={setRating}
          id={id}
          fetchCompanyDetails={fetchCompanyDetails}
          fetchCompanyReviewDetails={fetchCompanyReviewDetails}
        /> : null}
      {loder == true ? (<div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px", // Adjust height based on modal content
        }}
      >
        <Spin size="large" />
      </div>) :
        <div className="company-review-container-1">
          {/* Company Details Section */}
          <div className="company-card-1">
            <div className="company-header-1">
              <img
                src={`${BASE_API_URL}/uploads/${company?.logo}`}
                alt="Company Logo"
                className="company-logo-1"
              />
              <div className="company-info-1">
                <h2>{company?.name}</h2>
                <p className="company-location-1">
                  <EnvironmentOutlined /> {company?.location}
                </p>
                <div className="rating-section-1">
                  <span className="review-count-2">{averageRating.toFixed(1)}</span>
                  <Rate disabled allowHalf value={averageRating} />
                  <span className="review-count-1">{company?.reviews?.length} Reviews</span>
                </div>
              </div>
              <div className="company-actions-1">
                <span className="founded-date-1">
                  Founded on {company?.foundedOn ? moment(company?.foundedOn).format("DD-MM-YYYY") : "N/A"}
                </span>
                <Button type="primary" className="add-review-btn-1" onClick={handleModelOpen}>
                  + Add Review
                </Button>
              </div>
            </div>
          </div>
          <hr className="section-separator" />

          {/* Reviews Section */}
          <div className="reviews-container-1">
            <p className="review-count-text-1">Result Found: {reviews?.length}</p>
            {reviews?.length > 0 ? reviews?.map((review, index) => (
              <div key={index} className="review-card-1">

                {/* Header Section */}
                <div className="review-header-container-1">
                  <div className="review-header-1">
                    <img
                      src={user_img}
                      alt="Reviewer"
                      className="reviewer-avatar-1"
                    />
                    <div>
                      <h4>{review?.reviewerName}</h4>
                      <p className="review-date-1">
                        {moment(review?.createdAt).format("DD-MM-YYYY, HH:mm")}
                      </p>
                    </div>
                  </div>

                  {/* Rating on top-right */}
                  <div className="review-rating-1">
                    <Rate disabled allowHalf value={review?.rating} />
                  </div>
                </div>

                {/* Review Text Below Date */}
                <p className="review-text-1">{review?.reviewText}</p>
                {/* Review Text Below Date */}
                {/* Separator Between Reviews (Not for Last Review) */}
                {index !== reviews.length - 1 && <hr className="review-separator" />}

              </div>
            )) : <div className="no-data-found"> No Data Found</div>}
          </div>

        </div>}
    </>
  );
};

export default CompanyReviewPage;
