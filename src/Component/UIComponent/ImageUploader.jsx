import React, { useState } from "react";

const ImageUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    const token =
      "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";
    const repoOwner = "tathagatamishra";
    const repoName = "shubukanindia";
    const branchName = "main";
    const folderPath = "src/Component/uploadedImages";

    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            message: "Add new images",
            branch: branchName,
            content: formData,
          }),
        }
      );

      if (response.ok) {
        console.log("Images uploaded successfully.");
        // Optionally, you can handle success here.
      } else {
        console.error("Failed to upload images:", response.statusText);
        // Optionally, you can handle failure here.
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Images</button>
    </div>
  );
};

export default ImageUploader;
