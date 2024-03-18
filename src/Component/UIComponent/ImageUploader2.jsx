import React, { useState } from "react";

const ImageUploader = () => {
  const [image, setImage] = useState("");

  const setProfile = (e) => {
    setImage(e.target.files[0]);
  };

  const submitUserData = async () => {
    const data = new FormData();
    data.append("user_profile", image);

    const config = {
      "Content-Type": "multipart/form-data",
    };

    const response = await registerfunc(data, config);

    if (response.status === 200) {
      setInputData({
        ...inputdata,
      });
      setImage("");
      setUseradd(response.data);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={setProfile} />
      <button onClick={submitUserData}>Upload Images</button>
    </div>
  );
};

export default ImageUploader;
