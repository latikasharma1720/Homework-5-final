export default function Home() {
  return (
    <main className="page home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-subtitle">SINCE 1998 • FORT WAYNE</p>
          <h1>Explore our menu of delicious delights</h1>
          <p className="hero-description">
            Welcome to <strong>The Great Indian Kitchen</strong> — modern Indian cuisine
            crafted with fresh spices, seasonal produce, and a whole lot of love.
          </p>
          <p className="hero-quote"><em>"Good food is the foundation of genuine happiness."</em></p>
          <div className="hero-features">
            <span className="feature-badge">Fresh Spices</span>
            <span className="feature-badge">Vegetarian Friendly</span>
            <span className="feature-badge">Online Reservations</span>
          </div>
        </div>
        <div className="hero-image-container">
          <img src="/assets/images/Image.png" alt="Delicious Indian cuisine" className="hero-image" />
        </div>
      </section>

      <section className="video-section">
        <h2>Experience Our Restaurant</h2>
        <div className="video-container">
          <video controls>
            <source src="/assets/video/Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </main>
  );
}
