import React, { useState } from "react";
import { Button, Modal, Input, Rate, message, Spin, Form, Upload } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import {BASE_API_URL} from '../constant';

const AddReviewModal = ({ isModalOpen, setIsModalOpen, rating, setRating, id, fetchCompanyDetails,
  fetchCompanyReviewDetails }) => {

  const [newReview, setNewReview] = useState({
    name: "",
    subject: "",
    reviewText: "",
    rating: 0,
  });
  const [loder, setLoader] = useState(false)
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
    setLoader(true);

    try {
      if (!id) {
        // If `id` is empty, add a new company
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("location", values.location);
        formData.append("foundedOn", values.foundedOn);

        if (values.logo && values.logo.file) {
          formData.append("logo", values.logo.file);
        }

        const response = await axios.post(`${BASE_API_URL}/api/companies`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        fetchCompanyDetails(""); 
        message.success("Company added successfully!");
      } else {
        
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("subject", values.subject || ""); // Default empty if not required
        formData.append("reviewText", values.reviewText);
        formData.append("rating", values.rating)
        const response = await axios.post(`${BASE_API_URL}/api/reviews`, {
          companyId: id,
          name:values.name,
          subject: values.subject,
          reviewText: values.reviewText,
          rating: values.rating,
        });

        if (response?.status === 201) {
          message.info("Review added successfully!", 3);
        }

        fetchCompanyDetails();
        fetchCompanyReviewDetails();
      }
    } catch (error) {
      message.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoader(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Review Modal */}
      <Modal
        title="Add Review"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Remove default footer buttons
        centered
      >
        {/* Review Form */}
        {loder == true ? (
          <Spin size="medium" />
        ) : id ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Form layout="vertical" onFinish={handleSubmit} >
              <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter name" }]}>
                <Input
                  placeholder="Full Name"
                />
              </Form.Item>

              <Form.Item label="Subject" name="subject" rules={[{ required: true, message: "Please enter subject" }]}>
                <Input
                  placeholder="Subject"

                />
              </Form.Item>

              <Form.Item label="Review" name="reviewText" rules={[{ required: true, message: "Please enter reviewText" }]} >
                <Input.TextArea
                  placeholder="Write your review"

                />
              </Form.Item>

              <Form.Item label="Rating" name="rating" rules={[{ required: true, message: "Please enter rating" }]}>
                <Rate />
              </Form.Item>

              <Button
                type="primary"
                // onClick={handleSubmit}
                htmlType="submit" block
                style={{
                  marginTop: "15px",
                  background: "linear-gradient(90deg, #7b48db, #f04a7d)",
                }}
              >
                Save
              </Button>
            </Form>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Company Name"
                name="name"
                rules={[{ required: true, message: "Please enter company name" }]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input placeholder="Enter location" />
              </Form.Item>

              <Form.Item label="Founded On" name="foundedOn" rules={[{ required: true, message: "Please enter logo" }]}>
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>

              <Form.Item label="Logo" name="logo" rules={[{ required: true, message: "Please enter logo" }]}              >
                <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                </Upload>
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AddReviewModal;
