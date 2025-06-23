import React from 'react';

export default function FacePreview({ src, faces = [] }) {
  return (
    <div className="relative inline-block h-32">
      <img src={src} alt="preview" className="h-full w-auto" />
      {faces.map((face, idx) => (
        <div
          key={idx}
          className="absolute border-2 border-red-500 rounded-full"
          style={{
            left: `${face.x * 100}%`,
            top: `${face.y * 100}%`,
            width: `${face.w * 100}%`,
            height: `${face.h * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
