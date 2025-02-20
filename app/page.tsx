"use client";

import { useState } from "react";
import { createApi } from "unsplash-js";
import { TypeAnimation } from "react-type-animation";
import { saveAs } from "file-saver";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "",
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const searchPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const result = await unsplash.search.getPhotos({
        query,
        page: 1,
        perPage: 12,
      });

      if (result.response) {
        setImages(result.response.results);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden flex items-center justify-center">
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 text-white">
            Unsplash Gallery
          </h1>
          <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-4"></div>
          <p className="text-gray-400 text-lg mb-8">
            Discover stunning high-resolution photos
          </p>
          
          <div className="relative mb-8">
            <div className="relative">
              <form onSubmit={searchPhotos} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-4 bg-black rounded-full border border-white/30 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm shadow-[0_0_10px_rgba(255,255,255,0.05)] focus:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  placeholder=""
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {!query && (
                  <TypeAnimation
                    sequence={[
                      "Search for mountains...",
                      2000,
                      "Search for oceans...",
                      2000,
                      "Search for cities...",
                      2000,
                      "Search for nature...",
                      2000,
                    ]}
                    wrapper="span"
                    speed={50}
                    className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none"
                    repeat={Infinity}
                  />
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 disabled:opacity-75"
                  disabled={loading}
                >
                  <svg
                    className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {loading ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    )}
                  </svg>
                </button>
              </form>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {["flowers", "nature", "building", "cars", "technology", "food", "travel", "architecture"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-4 py-2 bg-black text-sm text-white border border-white/30 rounded-full hover:border-white/50 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image: any) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.urls.regular}
                alt={image.alt_description}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white font-medium">{image.user.name}</p>
                  <a
                    href={image.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    View on Unsplash
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-5xl w-full p-4" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                onClick={() => setSelectedImage(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage.urls.full}
                alt={selectedImage.alt_description}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/50 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-white">
                  <p className="font-medium">{selectedImage.user.name}</p>
                  <a
                    href={selectedImage.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    View on Unsplash
                  </a>
                </div>
                <button
                  onClick={() => {
                    saveAs(selectedImage.urls.full, `unsplash-${selectedImage.id}.jpg`);
                  }}
                  className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
