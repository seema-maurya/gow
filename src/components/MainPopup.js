import React, { Component } from "react";
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";
import "../css/MainPopup.css";
import { FaTimes } from "react-icons/fa";
import "../css/Cart/CartPage.css";
import { toast } from "react-toastify";

class MainPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonthName: "", // State to store the current month name
      showPopup: false, // State to track if the popup should be displayed
      mobileNumber: "", // State to store the mobile number input value
      options: [], // Combined options array for Multiselect
      selectedValue: [], // State to store selected values in Multiselect
      selectedVehicles: [], // Selected vehicles
      pincodeOptions: [],
      selectedPincode: "",
      Name: "",
      disabled: false,
      vehicleBrandModels: [],
      searchValue: "",
    };
    this.popupRef = React.createRef(); // Create a ref for the popup
    this.timeoutId = null; // Variable to store timeout ID
  }

  componentDidMount() {
    this.fetchPincodeData();

    // Set timeout to open popup after 30 seconds
    setTimeout(() => {}, 3000);
    this.timeoutId = setTimeout(() => {
      this.setState({ showPopup: true });
      // Add click event listener to the window
      window.addEventListener("click", this.handleOutsideClick);
    }, 3000); // 30 seconds
    this.fetchCarAndMotoBrandModels(); // Fetch both car and moto brand models

    this.getCurrentMonthName();
  }
  componentWillUnmount() {
    // Remove click event listener when component unmounts
    window.removeEventListener("click", this.handleOutsideClick);
    clearTimeout(this.timeoutId);
  }

  fetchPincodeData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "mumbai/getPincodes"
      );
      if (response.status === 200) {
        const pincode = response.data;
        const pincodeOptions = pincode.map((row) => ({
          name: `${row.PostOfficeName}, ${row.Pincode}, ${row.DistrictsName}, ${row.City}`,
          id: row._id,
        }));
        console.log(pincodeOptions);
        this.setState({ pincodeOptions });
      } else {
        // Handle non-OK response
        console.error(`Failed to fetch data. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
    }
  };

  handleOutsideClick = (event) => {
    if (
      this.popupRef &&
      this.popupRef.current &&
      !this.popupRef.current.contains(event.target)
    ) {
      // this.setState({ showPopup: false });
      // window.removeEventListener("click", this.handleOutsideClick);
      // this.timeoutId = setTimeout(() => {
      //   this.setState({ showPopup: true });
      //   window.addEventListener("click", this.handleOutsideClick);
      // }, 3000);
      this.handleClosePopup();
    }
  };

  handleClosePopup = () => {
    this.setState({ showPopup: false });
    // Reset timeout to open popup again after 30 seconds
    this.timeoutId = setTimeout(() => {
      this.setState({ showPopup: true });
      window.addEventListener("click", this.handleOutsideClick);
    }, 30 * 100000000000);
  };

  handleRefreshPage = () => {
    window.location.reload();
  };
  getCurrentMonthName = () => {
    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleString("default", {
      month: "long",
    });
    this.setState({ currentMonthName });
  };

  handleMobileNumberChange = (e) => {
    const mobileNumber = e.target.value;
    // Check if the entered value is a number and has a maximum length of 10 digits
    if (/^\d*$/.test(mobileNumber) && mobileNumber.length <= 10) {
      this.setState({ mobileNumber });
    }
  };
  handlePincodeChange = (e) => {
    this.setState({ selectedPincode: e.target.value });
  };

  fetchCarAndMotoBrandModels = async () => {
    try {
      const [motoResponse, carResponse] = await Promise.all([
        axios.get(
          process.env.REACT_APP_API_URL + "motoBrandModels/getMotoBrandModels"
        ),
        axios.get(
          process.env.REACT_APP_API_URL + "carBrandModels/getCarBrandModels"
        ),
      ]);

      console.log(carResponse, "Both", motoResponse);
      const motoBrandModels = motoResponse.data.map((brand) => ({
        name: brand.name,
        id: brand._id,
      }));
      const carBrandModels = carResponse.data.map((brand) => ({
        name: brand.name,
        id: brand._id,
      }));

      const options = [...motoBrandModels, ...carBrandModels]; // Merge arrays
      this.setState({ options });
    } catch (error) {
      console.error("Error fetching brand models:", error);
      // Log detailed error information
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  onSelect = (selectedList, selectedItem) => {
    this.setState({ selectedValue: selectedList });
  };

  onRemove = (selectedList, removedItem) => {
    this.setState({ selectedValue: selectedList });
  };
  handleInputChange = (e) => {
    this.setState({ Name: e.target.value });
  };

  handleSubmit = async () => {
    const { Name, mobileNumber, selectedPincode, selectedValue } = this.state;

    try {
      // Make an HTTP POST request to your backend API endpoint
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "mumbai/add",
        {
          Name,
          mobileNumber,
          vehicles: selectedValue.map((vehicle) => vehicle.name),
          pincode: selectedPincode,
        }
      );
      this.setState({
        Name: "",
        mobileNumber: "",
        selectedPincode: "",
        selectedValue: [],
      });
      // Close the popup
      this.handleClosePopup();
      toast.success("Details submitted successfully!");
      console.log("Response:", response.data);
      // Handle success or display a success message to the user
    } catch (error) {
      console.error("Error submitting details:", error);
      toast.error("Failed to submit details. Please try again later.");
      // Handle error or display an error message to the user
    }
  };
  handleSearchChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  render() {
    const {
      showPopup,
      currentMonthName,
      mobileNumber,
      selectedPincode,
      selectedValue,
      searchValue,
    } = this.state;

    return (
      <div>
        {showPopup && (
          <div className="popup" ref={this.popupRef}>
            {/* Popup content */}

            <FaTimes className="close-button" onClick={this.handleClosePopup} />
            <h3>Enter Details:</h3>
            <input
              type="text"
              placeholder="Name"
              value={this.state.Name}
              name="name"
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={this.handleMobileNumberChange}
            />

            {/* Add validation for mobile number */}
            <Multiselect
              placeholder="Select Vehicles (Max 3)"
              options={this.state.options}
              selectedValues={selectedValue}
              onSelect={this.onSelect}
              onRemove={this.onRemove}
              displayValue="name"
              disable={this.state.disabled}
              selectionLimit={3}
            />

            <select
              value={selectedPincode || ""}
              onChange={this.handlePincodeChange}
            >
              <option value="">Select Pincode</option>
              {this.state.pincodeOptions.map(
                (pincode) =>
                  pincode.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) && (
                    <option key={pincode.id} value={pincode.id}>
                      {pincode.name}
                    </option>
                  )
              )}
            </select>

            <button onClick={this.handleSubmit}>
              View {currentMonthName} Offers
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default MainPopup;
