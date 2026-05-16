import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GoogleReviews({ placeId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NOTE: To make this work "Directly from Google" without a 3rd party widget,
  // you need a Google Maps API Key with "Places API" enabled.
  // Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual key.
  const API_KEY = ''; 

  useEffect(() => {
    if (!API_KEY) {
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`
        );
        const data = await response.json();
        if (data.result && data.result.reviews) {
          setReviews(data.result.reviews);
        } else {
          setError("No reviews found or API error.");
        }
      } catch (err) {
        setError("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placeId]);

  if (!API_KEY) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: 20, border: '1px dashed #cbd5e1' }}>
        <h3 style={{ color: '#475569', marginBottom: 12 }}>Dynamic Google Reviews Setup</h3>
        <p style={{ color: '#64748b', fontSize: 14, maxWidth: 500, margin: '0 auto 20px' }}>
          To pull reviews <strong>directly from Google</strong> in real-time, you need a Google Maps API Key.
        </p>
        <div style={{ fontSize: 13, background: '#fff', padding: '12px', borderRadius: 8, display: 'inline-block', border: '1px solid #e2e8f0' }}>
          Place ID: <code>{placeId}</code>
        </div>
        <div style={{ marginTop: 24 }}>
          <a 
            href="https://console.cloud.google.com/google/maps-apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
          >
            Get Google API Key →
          </a>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading reviews...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>;

  return (
    <div className="reviews-grid" style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
      gap: 24 
    }}>
      {reviews.map((rev, idx) => (
        <div key={idx} style={{ 
          background: "#fff", 
          padding: 32, 
          borderRadius: 24, 
          border: "1px solid #f1f5f9", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Image 
                src={rev.profile_photo_url} 
                alt={rev.author_name} 
                width={44}
                height={44}
                style={{ borderRadius: '50%' }} 
              />
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{rev.author_name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{rev.relative_time_description}</div>
              </div>
            </div>
            <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_Logo.svg" width={16} height={16} alt="G" />
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            {[...Array(rev.rating)].map((_, i) => (
              <span key={i} style={{ color: "#fbbf24", fontSize: 16 }}>★</span>
            ))}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#475569", margin: 0 }}>
            &quot;{rev.text}&quot;
          </p>
        </div>
      ))}
    </div>
  );
}
