import { useState } from 'react'
import axios from "axios";
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image to upload")
      return
    }

    setLoading(true)

    setTimeout(async () => {
      try {
        const bucketName = "dev-image-upload-test2";
        const objectKey =`$test-image-upload/${file.name}`;
        //  const objectKey =`test-image-upload/testFileNewName`;

        // const fakeUrl = URL.createObjectURL(file);

        const fakeUrl = await axios.get("http://localhost:8095/test/api/presigned-url", {
          params: { bucketName, objectKey, expiry: 10 }
        });

    const presignedUrl = fakeUrl.data;
    // const presignedUrl="https://dev-image-upload-test2.s3.ap-southeast-2.amazonaws.com/test-image-upload/testFileName?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251224T064843Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIA3QOEY64SZG4PQRYJ%2F20251224%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Signature=3f7f238ad45e7a43536a4aa4c7a93070753d9afef37d1befb1295e5bad220bc5"
    
      await fetch(presignedUrl, {
        method: "PUT",
        body: file
      });

      const newUrl = presignedUrl.split("?")[0];
      setImageUrl(newUrl);
      setLoading(false);


      }
      catch (error) {
        console.error("Error uploading image:", error);
      }
      finally {
        setLoading(false);
      }
    }, 1000);
  }



  return (

    <div className="uploader-container">
      <h3 className="uploader-title">Image Upload</h3>

      <input
        type="file"
        accept="image/*"  
        className="file-input"
        onChange={handleFileChange}
      />

      {file && !imageUrl && (
        <div className="preview-container">
          <p>Preview:</p>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="preview-image"
          />
        </div>
      )}
      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div className="result">
          <label className="url-label">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            readOnly
            className="url-input"
          />

          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded"
            className="preview-image"
          />

        </div>
      )}
    </div>

  )
}

export default App
