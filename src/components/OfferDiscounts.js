import React, { Component } from "react";
import {
  OfferDetails,
  CanaraBankOfferDetails,
  CitibankDebitCard,
  CitibankP,
  CanaraP,
  Offer3,
  Offer4,
  Offer5,
  Offer6,
  Offer7,
  Offer8,
  Offer9,
  Offer0,
} from "./OfferDetails.js";

export default class OfferDiscounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: {},
    };
  }

  toggleDetails = (offer) => {
    this.setState((prevState) => ({
      showDetails: {
        ...prevState.showDetails,
        [offer]: !prevState.showDetails[offer],
      },
    }));
  };

  render() {
    return (
      <div className="col-lg-3 col-md-6 col-sm-6">
        <div className="support-wrap mb-30 support-4">
          <div className="support-icon">
            <img
              className="animated"
              src="assets/img/icon-img/image.png"
              alt=""
            />
          </div>
          <div className="col-xl-8 col-lg-8 d-none d-lg-block">
            <div className="main-menu" style={{ backgroundColor: "" }}>
              <nav>
                <ul>
                  <li>
                    <div className="support-content">
                      <h5>All_Offers_&_Discounts</h5>
                      <p>
                        Best Offer <i className="fa fa-angle-down"></i>
                      </p>
                    </div>
                    <ul
                      className="mega-menu"
                      style={{
                        top: "-200px",
                        maxHeight: "400px", // Set max height here
                        overflowY: "auto", // Enable scrolling
                        width: "600px",
                        paddingBottom: "10px",
                        paddingTop: "1px",
                      }}
                    >
                      <div className="" style={{ width: "" }}>
                        <li>
                          <ul style={{ paddingLeft: "0" }}>
                            <li
                              className="mega-menu-title"
                              style={{ marginBottom: "1px" }}
                            >
                              <h3 style={{ fontWeight: "bold" }}>
                                Bank Offers
                              </h3>
                              <br />
                            </li>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((offer) => (
                              <li
                                key={offer}
                                style={{
                                  marginBottom: "1px",
                                  padding: "0px 0",
                                  fontSize: "14px",
                                  lineHeight: "1",
                                }}
                              >
                                <strong>Offer {offer}</strong>
                                {offer === 1 && <CitibankP />}
                                {offer === 2 && <CanaraP />}
                                {offer === 3 && <Offer3 />}{" "}
                                {offer === 4 && <Offer4 />}{" "}
                                {offer === 5 && <Offer5 />}{" "}
                                {offer === 6 && <Offer6 />}{" "}
                                {offer === 7 && <Offer7 />}{" "}
                                {offer === 8 && <Offer8 />}{" "}
                                {offer === 9 && <Offer9 />}{" "}
                                <a
                                  href="##"
                                  className="see-details"
                                  onClick={() => this.toggleDetails(offer)}
                                  style={{
                                    fontSize: "10px",
                                    color: "#007bff",
                                  }}
                                >
                                  {this.state.showDetails[offer]
                                    ? "Hide"
                                    : "See details"}
                                </a>
                                <hr style={{ margin: "2px 0" }} />
                                {this.state.showDetails[offer] && (
                                  <React.Fragment>
                                    <br />
                                    {/* Render corresponding OfferDetails component based on offer */}
                                    {offer === 1 && <OfferDetails />}
                                    {offer === 2 && <CanaraBankOfferDetails />}
                                    {offer === 3 && <CitibankDebitCard />}
                                    {offer === 4 && <CanaraBankOfferDetails />}
                                    {offer === 5 && <CanaraBankOfferDetails />}
                                    {offer === 6 && <CanaraBankOfferDetails />}
                                    {offer === 7 && <CanaraBankOfferDetails />}
                                    {offer === 8 && <CanaraBankOfferDetails />}
                                    {offer === 9 && <CanaraBankOfferDetails />}
                                  </React.Fragment>
                                )}
                              </li>
                            ))}
                            <Offer0 />
                          </ul>
                        </li>
                      </div>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
