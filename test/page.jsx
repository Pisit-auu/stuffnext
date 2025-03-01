"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("กรุณาเลือกไฟล์");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/uploadimg", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setImageUrl(data.url);
    } else {
      alert("อัปโหลดไม่สำเร็จ");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">อัปโหลดรูปภาพไปยัง Cloudinary</h1>
      <form onSubmit={handleUpload} className="flex flex-col gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          อัปโหลด
        </button>
      </form>

      {imageUrl && (
        <div className="mt-5">
          <h2 className="text-lg font-bold">รูปที่อัปโหลด:</h2>
          <img src={imageUrl} alt="Uploaded" className="w-64 h-64 object-cover" />
          {imageUrl}
        </div>
      )}
    </div>
  );
}
