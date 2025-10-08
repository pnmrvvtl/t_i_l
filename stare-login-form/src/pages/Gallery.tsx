import React from "react";

export default function Gallery() {
  const images = Array.from({ length: 6 }).map((_, i) => 
    `https://picsum.photos/seed/${i}/400/300`
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <img key={i} src={src} alt={`Random ${i}`} className="rounded shadow" />
        ))}
      </div>
    </div>
  );
}
