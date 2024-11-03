import React, { useState } from "react";
import { Card, Typography, Input, Button, Upload, Image, Spin, Select } from "antd";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "config/firebase";

const { Option } = Select;

const Add = () => {
  const [formData, setFormData] = useState({
    authorName: "",
    itemName: "",
    price: "",
    description: "",
    category: "", 
    productId: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Generate 10-digit ID initially
  });
  const [fileListMain, setFileListMain] = useState([]);
  const [fileListSecondary, setFileListSecondary] = useState([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [secondaryImageUrls, setSecondaryImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const auth = getAuth();
  const storage = getStorage();

  // Single function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleMainImageUpload = async ({ fileList: newFileList }) => {
    setFileListMain(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `images/${file.name}`);

      setUploading(true); // Show spinner
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setMainImageUrl(url);
        setUploading(false); // Hide spinner
      } catch (error) {
        setUploading(false); // Hide spinner
        window.toastify("Error uploading file", "error");
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleSecondaryImagesUpload = async ({ fileList: newFileList }) => {
    setFileListSecondary(newFileList);
    const urls = [];
    setUploading(true); // Show spinner

    for (const fileObj of newFileList) {
      const file = fileObj.originFileObj;
      const storageRef = ref(storage, `images/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        urls.push(url);
      } catch (error) {
        window.toastify("Error uploading secondary images", "error");
        console.error("Error uploading file:", error);
      }
    }

    setSecondaryImageUrls(urls);
    setUploading(false); // Hide spinner
  };

  const handleAddItem = async () => {
    if (!auth.currentUser) {
      window.toastify("No user is signed in", "error");
      return;
    }

    if ( !mainImageUrl || !formData.authorName || !formData.category || !formData.itemName || secondaryImageUrls.length < 2) {
      window.toastify("Please fill in all fields and upload all images", "error");
      return;
    }

    const uid = auth.currentUser.uid;
    const productRef = doc(firestore, "items", formData.productId); // Use productId as document ID

    try {
      await setDoc(productRef, {
        ...formData,
        mainImageUrl: mainImageUrl,
        secondaryImageUrls: secondaryImageUrls,
        createdBy: uid,
      });
      window.toastify("Item added successfully", "success");

      // Reset form
      setFileListMain([]);
      setFileListSecondary([]);
      setMainImageUrl("");
      setSecondaryImageUrls([]);
      setFormData({
        authorName: "",
        itemName: "",
        price: "",
        description: "",
        category: "",
        productId: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Generate new ID for next item
      });
    } catch (error) {
      window.toastify("Error adding item", "error");
      console.error("Error adding item:", error);
    }
  };

  return (
    <Card
      style={{
        border: "none",
        width: "100%",
        margin: "20px auto",
      }}
    >
      <Typography.Title level={1}>New Note</Typography.Title>
      <Input
        name="authorName"
        placeholder="Author Name"
        style={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px",
          borderRadius: "5px",
        }}
        value={formData.authorName}
        onChange={handleInputChange}
      />
      <Input
        name="itemName"
        placeholder="Item Name"
        style={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px",
          borderRadius: "5px",
        }}
        value={formData.itemName}
        onChange={handleInputChange}
      />
      <Input
        name="description"
        placeholder="Description"
        style={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px",
          borderRadius: "5px",
        }}
        value={formData.description}
        onChange={handleInputChange}
      />
      <label htmlFor="category">Select Category</label>
      <Select
        placeholder="Select a category"
        style={{ width: "100%", marginBottom: "10px" }}
        onChange={handleCategoryChange}
        value={formData.category}
      >
        <Option value="Study">Study</Option>
        <Option value="Evilness">Evilness</Option>
        <Option value="Spritual">Spritual</Option>
        <Option value="World">World</Option>
        <Option value="Humans">Humans</Option>
      </Select>

      <Typography.Title level={5}>Upload one Main Image</Typography.Title>
      <Upload
        style={{ width: "100%" }}
        listType="picture-card"
        fileList={fileListMain}
        onChange={handleMainImageUpload}
        accept=".jpg, .jpeg, .png"
        beforeUpload={() => false}
      >
        {fileListMain.length < 1 && "+ Upload"}
      </Upload>
      {uploading && <Spin tip="Uploading main image..." />}
      {mainImageUrl && (
        <Image
          src={mainImageUrl}
          alt="Uploaded Main Image"
          style={{ width: "100px", height: "100px", margin: "10px" }}
          onClick={() => {
            window.open(mainImageUrl);
          }}
        />
      )}

      <Typography.Title level={5}>Upload 2 Secondary Images</Typography.Title>
      <Upload
        style={{ width: "100%" }}
        listType="picture-card"
        fileList={fileListSecondary}
        onChange={handleSecondaryImagesUpload}
        accept=".jpg, .jpeg, .png"
        beforeUpload={() => false}
        multiple
      >
        {fileListSecondary.length < 2 && "+ Upload"}
      </Upload>
      {uploading && <Spin tip="Uploading secondary images..." />}
      {secondaryImageUrls.length > 0 &&
        secondaryImageUrls.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`Secondary Image ${index + 1}`}
            style={{ width: "100px", height: "100px", margin: "10px" }}
            onClick={() => {
              window.open(url);
            }}
          />
        ))}

      <Button
        type="primary"
        style={{
          backgroundColor: "#000",
          width: "100%",
          margin: "10px 0px",
        }}
        onClick={handleAddItem}
      >
        Add Item
      </Button>
    </Card>
  );
};

export default Add;
