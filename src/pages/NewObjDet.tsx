import React, { useState } from "react";
import axios from "axios";

export default function NewObjDet() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResults([]);
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedImage) return alert("Please upload an image");

    const reader = new FileReader();

    reader.onloadend = async () => {
      const result = reader.result;

      if (typeof result !== "string") {
        alert("Could not read image.");
        return;
      }

      const base64Image = result.split(",")[1]; // Remove prefix

      setLoading(true);
      setError("");

      try {
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/waste-detection-dziuh/1",
          params: {
            api_key: "1Jbcl16oozVix24PZIVQ", // Replace with env in prod
          },
          data: base64Image, // Send pure base64 string directly
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        console.log("Detection Result:", response.data);
        setResults(response.data.predictions || []);
      } catch (err) {
        console.error("Detection failed:", err);
        setError("Detection failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(selectedImage);
  };

  return (
    <div>
      <h1>Waste Object Detection</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {imagePreview && <img src={imagePreview} alt="Preview" width="300" />}

      <button onClick={handleSubmit}>Detect</button>

      {loading && <p>Detecting...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
