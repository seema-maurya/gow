import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import "../css/OfferDetails.css";

export const CitibankP = () => {
  return (
    <p>
      10% Instant Discount up to INR 1000 on Citibank Credit Card Non-EMI Trxn.
      Minimum purchase value ₹5,000
    </p>
  );
};

export const CanaraP = () => {
  return (
    <p>
      10% Instant discount up to INR 500 on Canara Bank Credit Card Non EMI
      Trnxs. Minimum purchase value ₹3,000
    </p>
  );
};
export const Offer3 = () => {
  return (
    <p>
      10% Instant Discount up to INR 1000 on Citibank Debit Card Non-EMI Trxn.
      Minimum purchase value ₹5,000
    </p>
  );
};
export const Offer4 = () => {
  return (
    <p>
      10% Instant Discount up to INR 1250 on Citibank Credit Card EMI Trxn.
      Minimum purchase value ₹5,000
    </p>
  );
};
export const Offer5 = () => {
  return (
    <p>
      Additional INR 250 Discount on Citibank Credit Card 9 month and above EMI
      Trxn. Min purchase value ₹15,000
    </p>
  );
};
export const Offer6 = () => {
  return (
    <p>
      Flat INR 2000 Instant Discount on IDFC FIRST Bank Credit Card EMI Trxn.
      Minimum purchase value ₹30,000
    </p>
  );
};
export const Offer7 = () => {
  return (
    <p>
      Additional INR 500 Discount on IDFC FIRST Bank Credit Card EMI Trxn. Min
      purchase value ₹50,000
    </p>
  );
};
export const Offer8 = () => {
  return (
    <p>
      Additional INR 1250 Discount on IDFC FIRST Bank Credit Card EMI Trxn. Min
      purchase value ₹75,000
    </p>
  );
};
export const Offer9 = () => {
  return (
    <p>
      Additional INR 1250 Discount on IDFC FIRST Bank Credit Card EMI Trxn. Min
      purchase value ₹1,00,000
    </p>
  );
};
export const Offer0 = () => {
  return (
    <div>
      <strong>How to avail offer</strong>
      <ul>
        <li>Select eligible card at the time of checkout.</li>
        <li>No promo code required to avail the offer</li>
      </ul>
    </div>
  );
};
export const OfferDetails = () => {
  return (
    <div className="offer-details">
      <h2>Promotion Terms</h2>
      <ol>
        <li>
          <strong>What is the offer?</strong>
          <p>
            Get 10% instant bank discount on Citi-branded Credit Cards, Debit
            Cards and Credit Card EMI on purchase of select products from May
            20th 2024 to June 8th 2024. Please check Product Page to confirm the
            offer eligibility.
          </p>
        </li>
        <li>
          <strong>How can I avail this offer?</strong>
          <p>
            Just go through the normal purchase shopping process. On the payment
            page, please select your saved Citi-branded Cards and check whether
            the transaction is eligible or not. Check product page first to
            confirm if product is eligible for the instant bank discount.
          </p>
        </li>
        <li>
          <strong>
            What is the minimum transaction size for the instant discount?
          </strong>
          <p>The minimum transaction amount to avail discount is ₹5,000.</p>
        </li>
        <li>
          <strong>What is the maximum discount that I can avail?</strong>
          <p>
            The maximum discount possible is up to INR 1,500 for Citi-branded
            Credit and Debit Cards and Credit Card EMI during the offer period.
            Please refer the below table:
          </p>
        </li>
        <li>
          <table>
            <thead>
              <tr>
                <th>Categories</th>
                <th>Min Transaction</th>
                <th>Maximum Discount per Credit and Debit Card</th>
                <th>Maximum Discount per Credit Card EMI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mobiles</td>
                <td>₹5,000</td>
                <td>INR 750</td>
                <td>INR 1,000</td>
              </tr>
              <tr>
                <td>All other categories*</td>
                <td>₹5,000</td>
                <td>INR 1,000</td>
                <td>INR 1,250</td>
              </tr>
              <tr>
                <td>EMI Offer (Only on 9 Months & above EMI)</td>
                <td colSpan="3">
                  Additional Flat INR 250 Instant Discount on Citi-branded
                  Credit Card EMI on single transaction worth INR 15,000 & above
                </td>
                {/* <td >-</td> */}
              </tr>
            </tbody>
          </table>
        </li>
        <li>
          <strong>What if I cancel/return the product?</strong>
          <p>
            Offer is not applicable if the order is cancelled, or product is
            returned.
          </p>
        </li>
        <li>
          <strong>
            Can I avail discount on card payment for cash on delivery order? Are
            net Banking transactions also included in this Offer?
          </strong>
          <p>
            Net Banking and Card Payment on COD transactions are NOT included in
            this Offer.
          </p>
        </li>
        <li>
          <strong>Can I get this offer even with Exchange?</strong>
          <p>
            Yes, you can avail this offer even if the transaction involves
            exchange of an old product but the transaction value after exchange
            should be greater than ₹5,000.
          </p>
        </li>
        <li>
          <strong>
            My payment failed while placing the order, will I be eligible for
            the discount?
          </strong>
          <p>
            If your payment failed while placing the order, Gallaxy Of Wishes.in
            gives you an option to revise your payment. If you revise your
            payment within the offer duration, you will be eligible for the
            cashback. For more information on revise payment, click{" "}
            <a href="##">here</a>.
          </p>
        </li>
      </ol>
      <h2>Offer Terms and Conditions</h2>
      <p>
        This offer ("Offer") is provided by Axis Bank ("Bank") and Gallaxy Of
        Wishes Pay (India) Private Limited (formerly known as Gallaxy Of Wishes
        Online Distribution Services Private Limited) ("Gallaxy Of Wishes") and
        made available on the website www.Gallaxy Of Wishes.in and the mobile
        site, mobile application and Gallaxy Of Wishes Pay Smart Stores thereof
        (collectively, "Gallaxy Of Wishes.in").
        {/* Include the rest of the terms and conditions */}
      </p>
    </div>
  );
};

export const CanaraBankOfferDetails = () => {
  return (
    <div className="offer-details">
      <strong style={{ fontSize: "30px" }}>
        Frequently Asked Questions (FAQs)
      </strong>
      <p>
        <strong>
          Offer period – 15th May 00:00 HRS to 31st May 2024 23:59 HRS
        </strong>
      </p>
      <ol>
        <li>
          <strong>What is the Canara Bank Card Offer?</strong>
          <p>
            Get 10% instant discount on Canara Bank Credit Card payment
            transactions. Any cancelled, rejected, or returned order(s) will not
            be eligible for the offer, and the refund amount of such orders will
            be adjusted with the instant discount amount.
          </p>
        </li>
        <li>
          <strong>What is the maximum discount that I can avail?</strong>
          <p>
            The maximum discount possible is up to INR 500. Refer to the table
            below:
          </p>
          <table>
            <thead>
              <tr>
                <th>Categories</th>
                <th>Min Transaction</th>
                <th>Maximum Discount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>All categories*</td>
                <td>₹3,000</td>
                <td>INR 500</td>
              </tr>
            </tbody>
          </table>
          <p>
            * Mobiles, Large Appliances, TV, Electronics, Fashion, and Devices
          </p>
        </li>
        <li>
          <strong>How can I avail this offer?</strong>
          <p>
            There are no special steps to avail this offer. Just complete the
            normal purchase process and use your Canara Bank Credit Card to pay.
          </p>
        </li>
        <li>
          <strong>Can I get this offer with the Exchange offer?</strong>
          <p>
            Yes, the offer is valid on exchange as long as the minimum purchase
            value (after Exchange discount) is spent on the Bank Card.
          </p>
        </li>
        <li>
          <strong>
            Can I avail discount on card payment for cash on delivery orders?
            Are net Banking transactions also included in this Offer?
          </strong>
          <p>
            COD and Net Banking transactions are NOT included in this offer.
          </p>
        </li>
        <li>
          <strong>
            Would I get the Bank offer even if I make a part payment using my
            Gallaxy Of Wishes Pay Balance?
          </strong>
          <p>
            Yes, the offer is available on partial payments as long as the
            minimum purchase value is spent on the Canara Credit Card. The
            customer cannot use the EMI option if Gallaxy Of Wishes Pay balance
            is selected.
          </p>
        </li>
        <li>
          <strong>Is the offer applicable on EMI?</strong>
          <p>No, the offer is not applicable to EMI payments.</p>
        </li>
        <li>
          <strong>What if I cancel my order?</strong>
          <p>
            The offer is applicable for a successful purchase. If Instant
            Discount is availed on any purchase and it is subsequently
            cancelled, the refund amount of such purchases will be posted
            adjusting the instant discount amount availed on the purchase.
            However, if you place another order within the offer period, you
            shall get the instant bank discount subject to offer eligibility.
          </p>
        </li>
        <li>
          <strong>
            My payment failed while placing the order; will I be eligible for
            the cashback?
          </strong>
          <p>
            If your payment failed while placing the order, Gallaxy Of Wishes.in
            gives you an option to revise your payment. If you revise your
            payment within the offer duration, you will be eligible for the
            cashback. For more information on revising payments, click{" "}
            <a href="##">here</a>.
          </p>
        </li>
      </ol>
      <h2>Schedule 1 - Offer Terms and Conditions</h2>
      <p>
        This "Offer" is provided to you by Canara Bank ("Bank") and Gallaxy Of
        Wishes Pay (India) Private Limited (formerly known as Gallaxy Of Wishes
        Online Distribution Services Private Limited) ("Gallaxy Of Wishes") and
        made available on the website www.Gallaxy Of Wishes.in and the mobile
        site and mobile application thereof (collectively, "Gallaxy Of
        Wishes.in").
        {/* Include the rest of the terms and conditions */}
      </p>
    </div>
  );
};

export const CitibankDebitCard = () => {
  return (
    <div>
      <strong>CitibankDebitCard</strong>
      <h2>Promotion Terms</h2>
      <p>
        Get 10% instant bank discount on Citi-branded Credit Cards, Debit Cards
        and Credit Card EMI on purchase of select products from May 20th 2024 to
        June 8th 2024. Please check Product Page to confirm the offer
        eligibility.
      </p>

      <h2>FAQs</h2>
      <ol>
        <li>
          <strong>What is the offer?</strong>
          <br />
          Get 10% instant bank discount on Citi-branded Credit Cards, Debit
          Cards and Credit Card EMI on purchase of select products from May 20th
          2024 to June 8th 2024. Please check Product Page to confirm the offer
          eligibility.
        </li>

        <li>
          <strong>How can I avail this offer?</strong>
          <br />
          Just go through the normal purchase shopping process. On the payment
          page, please select your saved Citi-branded Cards and check whether
          the transaction is eligible or not. Check product page first to
          confirm if product is eligible for the instant bank discount.
        </li>

        <li>
          <strong>
            What is the minimum transaction size for the instant discount?
          </strong>
          <br />
          The minimum transaction amount to avail discount is ₹5,000.
        </li>

        {/* Add more FAQs as needed */}
      </ol>

      <h2>Offer Terms and Conditions</h2>
      <p>
        This offer is provided by Axis Bank and Gallaxy Of Wishes Pay (India)
        Private Limited and made available on the website www.Gallaxy Of
        Wishes.in and the mobile site, mobile application and Gallaxy Of Wishes
        Pay Smart Stores thereof.
      </p>

      <h2>Offer Details</h2>
      <table>
        <thead>
          <tr>
            <th>Categories</th>
            <th>Min Transaction</th>
            <th>Maximum Discount per Credit and Debit Card</th>
            <th>Maximum Discount per Credit Card EMI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mobiles</td>
            <td>₹5,000</td>
            <td>INR 750</td>
            <td>INR 1,000</td>
          </tr>
          <tr>
            <td>All other categories</td>
            <td>₹5,000</td>
            <td>INR 1,000</td>
            <td>INR 1,250</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export const SizeChart = () => {
  return (
    <div className="size-chart-container col-lg-3 col-md-6 col-sm-6">
      <div className="support-wrap mb-30 support-2">
        <div className="size-chart-header d-none d-lg-block">
          <div className="main-menu">
            <nav>
              <ul>
                <li>
                  <div className="support-content">
                    <p>
                      <i className="fa fa-angle-down"></i> Size Chart
                    </p>
                  </div>
                  <ul className="mega-menu" style={{ width: "600px" }}>
                    <li>
                      <div className="size-chart-content">
                        <h3>GRECIILOOKS Size Chart</h3>
                        <p className="size-chart-description">IN REGULAR</p>
                        <table>
                          <thead>
                            <tr>
                              <th>Brand Size</th>
                              <th>Label Size</th>
                              <th>Bust (in)</th>
                              <th>Waist (in)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>XS</td>
                              <td>XS</td>
                              <td>30</td>
                              <td>26</td>
                            </tr>
                            <tr>
                              <td>S</td>
                              <td>S</td>
                              <td>32</td>
                              <td>28</td>
                            </tr>
                            <tr>
                              <td>M</td>
                              <td>M</td>
                              <td>34</td>
                              <td>32</td>
                            </tr>
                            <tr>
                              <td>L</td>
                              <td>L</td>
                              <td>36</td>
                              <td>34</td>
                            </tr>
                            <tr>
                              <td>XL</td>
                              <td>XL</td>
                              <td>38</td>
                              <td>36</td>
                            </tr>
                            <tr>
                              <td>2XL</td>
                              <td>2XL</td>
                              <td>40</td>
                              <td>38</td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="size-chart-note">
                          * Mobiles, Large Appliances, TV, Electronics, Fashion
                          and Devices
                        </p>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SizeGuide = () => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="support-wrap mb-30 support-2">
        <div className="col-xl-8 col-lg-8 d-none d-lg-block">
          <div className="main-menu">
            <nav>
              <ul>
                <li>
                  <div className="support-content">
                    <p>
                      <i className="fa fa-angle-down">Size_guide</i>
                    </p>
                  </div>
                  <ul className="mega-menu" style={{ width: "600px" }}>
                    {" "}
                    <div className="support-icon">
                      <img
                        className="animated"
                        src="assets/img/icon-img/clothe_size.jpg"
                        alt=""
                      />
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
};

export const PrivacyNotice = () => {
  return (
    <div className="privacy-notice-container">
      <h1>Privacy Notice</h1>
      <label>
        <strong>Last Updated:</strong> April 25, 2024.{" "}
        <a href="##">Click here to see prior version</a>
      </label>

      <h2>Introduction</h2>
      <div className="paragraph">
        <label className="paragraph">
          We appreciate your trust in us and are committed to handling your
          personal information carefully and sensibly. <br />
          This Privacy Notice outlines how Gallaxy Of Wishes Seller Services
          Private Limited and its affiliates, including Gallaxy Of Wishes.com,{" "}
          <br />
          Inc. ("Gallaxy Of Wishes"), collect and process your personal
          information through Gallaxy Of Wishes Services.
        </label>
        <label className="paragraph">
          By using Gallaxy Of Wishes Services, you agree to our use of your
          personal information in accordance with this Privacy Notice. <br />
          We may update this notice from time to time at our discretion.
          <br /> Your continued use of Gallaxy Of Wishes Services constitutes
          acceptance of any amendments.
        </label>
        <h2>Personal Information Collection</h2>
        <h3>
          What Personal Information About Customers Does Gallaxy Of Wishes
          Collect?
        </h3>
        <table>
          <tr>
            <td>
              <strong>Information You Give Us:</strong>
            </td>
            <td>
              We collect information you provide to us in relation to Gallaxy Of
              Wishes Services.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Automatic Information:</strong>
            </td>
            <td>
              We automatically collect and store certain information about your
              use of Gallaxy Of Wishes Services.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Information from Other Sources:</strong>
            </td>
            <td>We may receive information about you from other sources. </td>
          </tr>
        </table>
        <h3>
          For What Purposes Does Gallaxy Of Wishes Use Your Personal
          Information?
        </h3>
        <label style={{ fontSize: "20px" }}>
          We use your personal information for various purposes, including:
        </label>
        <br />
        <table style={{ fontSize: "15px" }}>
          <tbody>
            <tr>
              <td>- Purchase and delivery of products and services.</td>
            </tr>
            <tr>
              <td>
                - Provide, troubleshoot, and improve Gallaxy Of Wishes Services.
              </td>
            </tr>
            <tr>
              <td>- Recommendations and personalization.</td>
            </tr>
            <tr>
              <td>- Provide voice, image, and camera services.</td>
            </tr>
            <tr>
              <td>- Comply with legal obligations.</td>
            </tr>
            <tr>
              <td>- Communicate with you.</td>
            </tr>
            <tr>
              <td>- Advertising.</td>
            </tr>
            <tr>
              <td>- Fraud Prevention and Credit Risks.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SecureTransaction = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOn, setIsOn] = useState(false);

  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  const toggleVisibilitys = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="support-wrap mb-30 support-4">
        <div className="col-xl-8 col-lg-8 d-none d-lg-block">
          <div className="main-menu" style={{ backgroundColor: "" }}>
            <nav>
              <ul>
                <li>
                  <a href="##" onClick={toggleVisibility}>
                    <div className="support-content">
                      <p>
                        <strong>
                          <FaLock /> Secure Transaction
                          <i
                            className={`fa fa-angle-${isOpen ? "up" : "down"}`}
                          ></i>
                        </strong>
                      </p>
                    </div>
                  </a>

                  {isOpen && (
                    <ul
                      className="mega-menu"
                      style={{
                        top: "-200px",
                        width: "1000px",
                        overflowY: "auto",
                        whiteSpace: "nowrap",
                        maxHeight: "400px",
                      }}
                    >
                      <div className="privacy-notice " style={{ width: "" }}>
                        <li>
                          <ul>
                            <li className="mega-menu-title">
                              <strong>Your transaction is secure</strong>
                              <p>
                                We work hard to protect your security and
                                privacy.
                                <br /> Our payment security system encrypts your
                                information during transmission.
                                <br /> We don’t share your credit card details
                                with third-party sellers, and we don’t sell your
                                information to others.
                                <br />
                                <a href="##" onClick={toggleVisibilitys}>
                                  {isOn ? "Hide" : "Learn more"}
                                  {isOn && (
                                    <p>
                                      <PrivacyNotice />
                                    </p>
                                  )}
                                </a>
                              </p>
                            </li>
                          </ul>
                        </li>
                      </div>
                    </ul>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
