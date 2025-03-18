import React, { useEffect } from "react";
import "../css/about.css";

const About = () => {
  useEffect(() => {
    // Load the Google Maps JavaScript API script dynamically
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAP_API}&libraries=places`;
    googleMapScript.async = true;
    window.document.body.appendChild(googleMapScript);
    // Initialize the map once the script is loaded
    googleMapScript.onload = () => {
      const mapOptions = {
        center: { lat: 19.15607743583916, lng: 72.84691536297058 },
        zoom: 18,
      };
      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );

      const GOWLocation = { lat: 19.15607743583916, lng: 72.84691536297058 }; // Replace with actual coordinates
      new window.google.maps.Marker({
        position: GOWLocation,
        map: map,
        title: "GOW",
        label: "GOW",
      });
    };

    // Clean up
    return () => {
      window.document.body.removeChild(googleMapScript);
    };
  }, []);

  return (
    <div className="about">
      <div className="about-header">
        <h2>Welcome to GOW</h2>
        <p className="about-description">
          Founded in 1995, GOW is one of India’s leading clothing brands and
          the flagship company of the RPG GROUP.
        </p>
        <a href="/#" className="about-link">
          Explore Our Collection
        </a>
        <p className="tagline">Discover Style, Discover Happiness</p>
      </div>
      <div className="about-content">
        <div className="about-img">
          <a href="/#">
            <img
              alt="Women's Clothing"
              src="https://thumbs.dreamstime.com/z/womens-clothes-set-isolated-female-clothing-collage-accessories-130694655.jpg?w=768"
            />
            <img
              alt="Women's Clothing"
              src="https://thumbs.dreamstime.com/z/inside-fashion-clothing-shop-autumn-winter-fashion-mannequins-hongkong-china-asia-display-window-also-window-store-47997217.jpg?w=992"
            />
          </a>
        </div>
        <div className="about-text">
          <p>
            Driven by the purpose of helping the world move safely and smartly,
            GOW provides world-class products and services across 110+ states
            in India.
            <br />
            Say hello to happiness! ₹11,315 Cr. of annual revenue.
          </p>
          <div className="contact-info">
            <strong>Contact number:</strong> 7506471096 <br />
            <strong>Address:</strong> Behram Baugh, Jogeshwari West, Mumbai
          </div>
          <p className="clothing-category">
            We have a wide range of clothing for:
          </p>
        </div>
      </div>
      <div className="about-content">
        <div className="social-icons">
          <p>Follow Us:</p>
          <ul>
            <li>
              <a
                className="fa fa-facebook"
                href="https://www.facebook.com/ASHMI6oo7/"
              >
                &nbsp; Facebook
              </a>
            </li>
            <li>
              <a
                className="fa fa-linkedin"
                href="https://www.linkedin.com/in/ashwini-kumar-GOW-531554205/"
              >
                &nbsp; LinkedIn
              </a>
            </li>
            <li>
              <a
                className="fa fa-instagram"
                href="https://www.instagram.com/ashwin_oo7/"
              >
                &nbsp; Instagram
              </a>
            </li>
            <li>
              <a
                className="fa fa-youtube"
                href="https://www.youtube.com/channel/UCXE9IrBDQDwf2If_S6XKKiw"
              >
                &nbsp; Youtube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        id="map"
        style={{ width: "80%", height: "400px", marginTop: "10px" }}
      ></div>
      ;
      <div className="map-container">
        <iframe
          title="GOW Company Location"
          label="GOW"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.204071176514!2d72.8443036!3d19.1561614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7241bee06c7%3A0x1d4f20f78e971dfc!2sASHTHA%20HOSPITAL!5e0!3m2!1sen!2sin!4v1620690224334!5m2!1sen!2sin"
          // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.204071176514!2d72.84537081491185!3d19.144239454791748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b856d44518c3%3A0x590ddaf2fc1d3955!2sBehram%20Baugh%2C%20Jogeshwari%20West%2C%20Mumbai%2C%20Maharashtra%20400060!5e0!3m2!1sen!2sin!4v1620690224334!5m2!1sen!2sin"
          allowfullscreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default About;
