import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import {
  getCart,
  createOrder,
  getAllAddressesByUserId,
} from "../../services/api";
import useAuth from "../../context/useAuth";

function Checkout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Address management
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [useNewBillingAddress, setUseNewBillingAddress] = useState(false);
  const [useNewShippingAddress, setUseNewShippingAddress] = useState(false);

  // Window resize handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Form states
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    province: "",
    country: "Canada",
    zip: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    province: "",
    country: "Canada",
    zip: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [detectedCardType, setDetectedCardType] = useState("");

  // Credit card type detection
  const detectCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]|^2[2-7]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
      dinersclub: /^3[0689]/,
      jcb: /^35/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanNumber)) {
        return type;
      }
    }

    return "";
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    const chunks = cleanValue.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 4);
    }
    return cleanValue;
  };

  // Calculate tax (13% HST)
  const calculateTax = (amount) => {
    return parseFloat((amount * 0.13).toFixed(2));
  };

  // Fetch saved addresses
  const fetchSavedAddresses = async () => {
    try {
      const addresses = await getAllAddressesByUserId(user.id);
      setSavedAddresses(addresses);

      // If user has saved addresses, select the first one by default
      if (addresses.length > 0) {
        setSelectedBillingAddress(addresses[0]);
        setSelectedShippingAddress(addresses[0]);
        setUseShippingAsBilling(true);

        // Populate billing info with selected address
        setBillingInfo({
          firstName: user.username?.split(" ")[0] || "",
          lastName: user.username?.split(" ")[1] || "",
          email: user.email || "",
          phone: addresses[0].phone || "",
          street: addresses[0].street,
          city: addresses[0].city,
          province: addresses[0].province,
          country: addresses[0].country,
          zip: addresses[0].zip,
        });
      } else {
        // No saved addresses, user needs to enter new address
        setUseNewBillingAddress(true);
        setUseNewShippingAddress(true);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      // If no addresses found, enable new address forms
      setUseNewBillingAddress(true);
      setUseNewShippingAddress(true);
    }
  };

  // Fetch cart data
  const fetchCart = async () => {
    try {
      console.log("Fetching cart for user:", user?.id);
      const data = await getCart();
      console.log("Cart data received:", data);
      const items = data.CartItems || data.items || [];

      const normalizedItems = items.map((item) => ({
        ...item,
        vehicle: item.Vehicle || item.vehicle || {},
      }));

      setCartItems(normalizedItems);

      const sub = normalizedItems.reduce((sum, item) => {
        return sum + parseFloat(item.vehicle.price || 0) * item.quantity;
      }, 0);

      const tax = calculateTax(sub);
      const total = sub + tax;

      setSubtotal(sub);
      setTaxAmount(tax);
      setTotalAmount(total);
    } catch (err) {
      console.error("Error fetching cart:", err);
      // Don't fail silently - show error to user
      setErrors({ cart: "Failed to load cart. Please refresh the page." });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        console.log("User authenticated, fetching data for user:", user.id);
        try {
          await fetchCart();
          await fetchSavedAddresses();
        } catch (error) {
          console.error("Error fetching checkout data:", error);
        }
      } else {
        console.log("User not authenticated or missing ID:", user);
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user.id

  // Handle input changes
  const handleBillingChange = (field, value) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[`billing.${field}`]) {
      setErrors((prev) => ({ ...prev, [`billing.${field}`]: "" }));
    }
  };

  // Handle address selection
  const handleAddressSelection = (address, type) => {
    if (type === "billing") {
      setSelectedBillingAddress(address);
      setBillingInfo({
        firstName: user.username?.split(" ")[0] || "",
        lastName: user.username?.split(" ")[1] || "",
        email: user.email || "",
        phone: address.phone || "",
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
      });
    } else if (type === "shipping") {
      setSelectedShippingAddress(address);
      setShippingInfo({
        firstName: user.username?.split(" ")[0] || "",
        lastName: user.username?.split(" ")[1] || "",
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
      });
    }
  };

  const handleShippingChange = (field, value) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[`shipping.${field}`]) {
      setErrors((prev) => ({ ...prev, [`shipping.${field}`]: "" }));
    }
  };

  const handlePaymentChange = (field, value) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
      if (formattedValue.length <= 19) {
        // Max length for formatted card number
        setDetectedCardType(detectCardType(formattedValue));
      }
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setPaymentInfo((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[`payment.${field}`]) {
      setErrors((prev) => ({ ...prev, [`payment.${field}`]: "" }));
    }
  };

  // Validation functions
  const validateBilling = () => {
    const newErrors = {};

    // Only validate if using new address or no saved addresses
    if (useNewBillingAddress || savedAddresses.length === 0) {
      if (!billingInfo.firstName.trim())
        newErrors["billing.firstName"] = "First name is required";
      if (!billingInfo.lastName.trim())
        newErrors["billing.lastName"] = "Last name is required";
      if (!billingInfo.email.trim())
        newErrors["billing.email"] = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(billingInfo.email))
        newErrors["billing.email"] = "Invalid email format";
      if (!billingInfo.phone.trim())
        newErrors["billing.phone"] = "Phone number is required";
      if (!billingInfo.street.trim())
        newErrors["billing.street"] = "Street address is required";
      if (!billingInfo.city.trim())
        newErrors["billing.city"] = "City is required";
      if (!billingInfo.province.trim())
        newErrors["billing.province"] = "Province is required";
      if (!billingInfo.zip.trim())
        newErrors["billing.zip"] = "Postal code is required";
    } else if (!selectedBillingAddress) {
      newErrors["billing.address"] = "Please select a billing address";
    }

    return newErrors;
  };

  const validateShipping = () => {
    if (useShippingAsBilling) return {};

    const newErrors = {};

    // Only validate if using new address or no saved addresses
    if (useNewShippingAddress || savedAddresses.length === 0) {
      if (!shippingInfo.firstName.trim())
        newErrors["shipping.firstName"] = "First name is required";
      if (!shippingInfo.lastName.trim())
        newErrors["shipping.lastName"] = "Last name is required";
      if (!shippingInfo.street.trim())
        newErrors["shipping.street"] = "Street address is required";
      if (!shippingInfo.city.trim())
        newErrors["shipping.city"] = "City is required";
      if (!shippingInfo.province.trim())
        newErrors["shipping.province"] = "Province is required";
      if (!shippingInfo.zip.trim())
        newErrors["shipping.zip"] = "Postal code is required";
    } else if (!selectedShippingAddress) {
      newErrors["shipping.address"] = "Please select a shipping address";
    }

    return newErrors;
  };

  const validatePayment = () => {
    const newErrors = {};

    const cleanCardNumber = paymentInfo.cardNumber.replace(/[\s-]/g, "");
    if (!cleanCardNumber) {
      newErrors["payment.cardNumber"] = "Card number is required";
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      newErrors["payment.cardNumber"] = "Invalid card number length";
    } else if (!detectedCardType) {
      newErrors["payment.cardNumber"] = "Invalid card number";
    }

    if (!paymentInfo.expiryDate) {
      newErrors["payment.expiryDate"] = "Expiry date is required";
    } else {
      const [month, year] = paymentInfo.expiryDate.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (
        !month ||
        !year ||
        parseInt(month) < 1 ||
        parseInt(month) > 12 ||
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors["payment.expiryDate"] = "Invalid or expired date";
      }
    }

    if (!paymentInfo.cvv) {
      newErrors["payment.cvv"] = "CVV is required";
    } else if (paymentInfo.cvv.length < 3 || paymentInfo.cvv.length > 4) {
      newErrors["payment.cvv"] = "Invalid CVV";
    }

    if (!paymentInfo.cardholderName.trim()) {
      newErrors["payment.cardholderName"] = "Cardholder name is required";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const billingErrors = validateBilling();
    const shippingErrors = validateShipping();
    const paymentErrors = validatePayment();

    const allErrors = { ...billingErrors, ...shippingErrors, ...paymentErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setLoading(true);

    try {
      const finalBillingInfo = selectedBillingAddress
        ? {
            firstName: user.username?.split(" ")[0] || "",
            lastName: user.username?.split(" ")[1] || "",
            email: user.email || "",
            phone: selectedBillingAddress.phone || "",
            street: selectedBillingAddress.street,
            city: selectedBillingAddress.city,
            province: selectedBillingAddress.province,
            country: selectedBillingAddress.country,
            zip: selectedBillingAddress.zip,
          }
        : billingInfo;

      const finalShippingInfo = useShippingAsBilling
        ? finalBillingInfo
        : selectedShippingAddress
          ? {
              firstName: user.username?.split(" ")[0] || "",
              lastName: user.username?.split(" ")[1] || "",
              street: selectedShippingAddress.street,
              city: selectedShippingAddress.city,
              province: selectedShippingAddress.province,
              country: selectedShippingAddress.country,
              zip: selectedShippingAddress.zip,
            }
          : shippingInfo;

      const orderData = {
        billingInfo: finalBillingInfo,
        shippingInfo: finalShippingInfo,
        paymentInfo,
        useShippingAsBilling,
      };

      const response = await createOrder(orderData);

      // Redirect to success page or order confirmation
      navigate(`/order-confirmation/${response.order.orderNumber}`, {
        state: { order: response.order },
      });
    } catch (error) {
      console.error("Order creation failed:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to process order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add debugging and proper auth state handling
  console.log("Checkout - Auth state:", { user, authLoading });

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ padding: "200px 20px", textAlign: "center" }}>
          <p style={{ color: "#1e293b", fontSize: "1.1rem" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ padding: "200px 20px", textAlign: "center" }}>
          <p style={{ color: "#1e293b", fontSize: "1.1rem" }}>
            Please sign in to proceed with checkout.
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !errors.cart) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ padding: "200px 20px", textAlign: "center" }}>
          <p style={{ color: "#1e293b", fontSize: "1.1rem" }}>
            Your cart is empty. Add some vehicles before checkout.
          </p>
        </div>
      </div>
    );
  }

  if (errors.cart) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ padding: "200px 20px", textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: "1.1rem" }}>
            {errors.cart}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
    color: "#1e293b",
  };

  const sectionTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1e293b",
  };

  const textStyle = {
    color: "#374151",
    fontSize: "1rem",
    lineHeight: "1.5",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#374151",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.3s ease",
    backgroundColor: "#ffffff",
    color: "#1e293b",
  };

  const errorStyle = {
    color: "#ef4444",
    fontSize: "0.875rem",
    marginTop: "4px",
  };

  const sectionStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px",
    color: "#1e293b",
  };

  // Address card component
  const AddressCard = ({ address, isSelected, onSelect, type }) => (
    <div
      style={{
        border: isSelected ? "2px solid #059669" : "2px solid #e5e7eb",
        borderRadius: "8px",
        padding: "15px",
        cursor: "pointer",
        backgroundColor: isSelected ? "#f0fdf4" : "#ffffff",
        transition: "all 0.3s ease",
        marginBottom: "10px",
      }}
      onClick={() => onSelect(address, type)}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <input
          type="radio"
          checked={isSelected}
          onChange={() => onSelect(address, type)}
          style={{ marginRight: "10px" }}
        />
        <strong style={{ color: "#1e293b" }}>Saved Address</strong>
      </div>
      <div style={{ color: "#374151", fontSize: "0.9rem", lineHeight: "1.4" }}>
        <div>{address.street}</div>
        <div>
          {address.city}, {address.province} {address.zip}
        </div>
        <div>{address.country}</div>
        {address.phone && <div>Phone: {address.phone}</div>}
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <Header />

      {/* Header Section */}
      <section
        style={{
          paddingTop: "120px",
          paddingBottom: "60px",
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "white",
          textAlign: "center",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Checkout
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Complete your purchase
        </p>
      </section>

      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "40px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: windowWidth > 768 ? "2fr 1fr" : "1fr",
            gap: "40px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Main Form */}
          <div>
            <form onSubmit={handleSubmit}>
              {/* Billing Information */}
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Billing Information</h3>

                {/* Show saved addresses if available */}
                {savedAddresses.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ marginBottom: "15px" }}>
                      <h4
                        style={{
                          color: "#374151",
                          fontSize: "1.1rem",
                          marginBottom: "10px",
                        }}
                      >
                        Choose from saved addresses:
                      </h4>
                      {savedAddresses.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          isSelected={selectedBillingAddress?.id === address.id}
                          onSelect={(addr) => {
                            handleAddressSelection(addr, "billing");
                            setUseNewBillingAddress(false);
                          }}
                          type="billing"
                        />
                      ))}
                    </div>

                    <div
                      style={{
                        border: useNewBillingAddress
                          ? "2px solid #059669"
                          : "2px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "15px",
                        cursor: "pointer",
                        backgroundColor: useNewBillingAddress
                          ? "#f0fdf4"
                          : "#ffffff",
                        transition: "all 0.3s ease",
                        marginBottom: "20px",
                      }}
                      onClick={() => {
                        setUseNewBillingAddress(true);
                        setSelectedBillingAddress(null);
                        setBillingInfo({
                          firstName: "",
                          lastName: "",
                          email: user?.email || "",
                          phone: "",
                          street: "",
                          city: "",
                          province: "",
                          country: "Canada",
                          zip: "",
                        });
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="radio"
                          checked={useNewBillingAddress}
                          onChange={() => setUseNewBillingAddress(true)}
                          style={{ marginRight: "10px" }}
                        />
                        <strong style={{ color: "#1e293b" }}>
                          Use New Address
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show billing form only if using new address or no saved addresses */}
                {(useNewBillingAddress || savedAddresses.length === 0) && (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <label style={labelStyle}>First Name *</label>
                        <input
                          type="text"
                          value={billingInfo.firstName}
                          onChange={(e) =>
                            handleBillingChange("firstName", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            borderColor: errors["billing.firstName"]
                              ? "#ef4444"
                              : "#e5e7eb",
                          }}
                        />
                        {errors["billing.firstName"] && (
                          <div style={errorStyle}>
                            {errors["billing.firstName"]}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={labelStyle}>Last Name *</label>
                        <input
                          type="text"
                          value={billingInfo.lastName}
                          onChange={(e) =>
                            handleBillingChange("lastName", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            borderColor: errors["billing.lastName"]
                              ? "#ef4444"
                              : "#e5e7eb",
                          }}
                        />
                        {errors["billing.lastName"] && (
                          <div style={errorStyle}>
                            {errors["billing.lastName"]}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <label style={labelStyle}>Email *</label>
                        <input
                          type="email"
                          value={billingInfo.email}
                          onChange={(e) =>
                            handleBillingChange("email", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            borderColor: errors["billing.email"]
                              ? "#ef4444"
                              : "#e5e7eb",
                          }}
                        />
                        {errors["billing.email"] && (
                          <div style={errorStyle}>
                            {errors["billing.email"]}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={labelStyle}>Phone *</label>
                        <input
                          type="tel"
                          value={billingInfo.phone}
                          onChange={(e) =>
                            handleBillingChange("phone", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            borderColor: errors["billing.phone"]
                              ? "#ef4444"
                              : "#e5e7eb",
                          }}
                        />
                        {errors["billing.phone"] && (
                          <div style={errorStyle}>
                            {errors["billing.phone"]}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>Street Address *</label>
                      <input
                        type="text"
                        value={billingInfo.street}
                        onChange={(e) =>
                          handleBillingChange("street", e.target.value)
                        }
                        style={{
                          ...inputStyle,
                          borderColor: errors["billing.street"]
                            ? "#ef4444"
                            : "#e5e7eb",
                        }}
                      />
                      {errors["billing.street"] && (
                        <div style={errorStyle}>{errors["billing.street"]}</div>
                      )}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <label style={labelStyle}>City *</label>
                        <input
                          type="text"
                          value={billingInfo.city}
                          onChange={(e) =>
                            handleBillingChange("city", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            borderColor: errors["billing.city"]
                              ? "#ef4444"
                              : "#e5e7eb",
                          }}
                        />
                        {errors["billing.city"] && (
                          <div style={errorStyle}>{errors["billing.city"]}</div>
                        )}
                      </div>

                      <div>
                        <label style={labelStyle}>Province *</label>
                        <select
                          value={billingInfo.province}
                          onChange={(e) =>
                            handleBillingChange("province", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            borderColor: errors["billing.province"]
                              ? "#ef4444"
                              : "#e5e7eb",
                          }}
                        >
                          <option value="">Select Province</option>
                          <option value="ON">Ontario</option>
                          <option value="QC">Quebec</option>
                          <option value="BC">British Columbia</option>
                          <option value="AB">Alberta</option>
                          <option value="MB">Manitoba</option>
                          <option value="SK">Saskatchewan</option>
                          <option value="NS">Nova Scotia</option>
                          <option value="NB">New Brunswick</option>
                          <option value="NL">Newfoundland and Labrador</option>
                          <option value="PE">Prince Edward Island</option>
                          <option value="NT">Northwest Territories</option>
                          <option value="NU">Nunavut</option>
                          <option value="YT">Yukon</option>
                        </select>
                        {errors["billing.province"] && (
                          <div style={errorStyle}>
                            {errors["billing.province"]}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={labelStyle}>Postal Code *</label>
                        <input
                          type="text"
                          value={billingInfo.zip}
                          onChange={(e) =>
                            handleBillingChange(
                              "zip",
                              e.target.value.toUpperCase()
                            )
                          }
                          style={{
                            ...inputStyle,
                            borderColor: errors["billing.zip"]
                              ? "#ef4444"
                              : "#e5e7eb",
                          }}
                          placeholder="A1A 1A1"
                        />
                        {errors["billing.zip"] && (
                          <div style={errorStyle}>{errors["billing.zip"]}</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Shipping Information */}
              <div style={sectionStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={sectionTitleStyle}>Shipping Information</h3>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={useShippingAsBilling}
                      onChange={(e) => {
                        setUseShippingAsBilling(e.target.checked);
                        if (e.target.checked) {
                          setSelectedShippingAddress(selectedBillingAddress);
                          setShippingInfo(billingInfo);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                      Same as billing address
                    </span>
                  </label>
                </div>

                {!useShippingAsBilling && savedAddresses.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ marginBottom: "15px" }}>
                      <h4
                        style={{
                          color: "#374151",
                          fontSize: "1.1rem",
                          marginBottom: "10px",
                        }}
                      >
                        Choose shipping address:
                      </h4>
                      {savedAddresses.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          isSelected={
                            selectedShippingAddress?.id === address.id
                          }
                          onSelect={(addr) => {
                            handleAddressSelection(addr, "shipping");
                            setUseNewShippingAddress(false);
                          }}
                          type="shipping"
                        />
                      ))}
                    </div>

                    <div
                      style={{
                        border: useNewShippingAddress
                          ? "2px solid #059669"
                          : "2px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "15px",
                        cursor: "pointer",
                        backgroundColor: useNewShippingAddress
                          ? "#f0fdf4"
                          : "#ffffff",
                        transition: "all 0.3s ease",
                        marginBottom: "20px",
                      }}
                      onClick={() => {
                        setUseNewShippingAddress(true);
                        setSelectedShippingAddress(null);
                        setShippingInfo({
                          firstName: "",
                          lastName: "",
                          street: "",
                          city: "",
                          province: "",
                          country: "Canada",
                          zip: "",
                        });
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="radio"
                          checked={useNewShippingAddress}
                          onChange={() => setUseNewShippingAddress(true)}
                          style={{ marginRight: "10px" }}
                        />
                        <strong style={{ color: "#1e293b" }}>
                          Use New Address
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {!useShippingAsBilling &&
                  (useNewShippingAddress || savedAddresses.length === 0) && (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "20px",
                          marginBottom: "20px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.firstName}
                            onChange={(e) =>
                              handleShippingChange("firstName", e.target.value)
                            }
                            style={{
                              ...inputStyle,
                              borderColor: errors["shipping.firstName"]
                                ? "#ef4444"
                                : "#e5e7eb",
                            }}
                          />
                          {errors["shipping.firstName"] && (
                            <div style={errorStyle}>
                              {errors["shipping.firstName"]}
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.lastName}
                            onChange={(e) =>
                              handleShippingChange("lastName", e.target.value)
                            }
                            style={{
                              ...inputStyle,
                              borderColor: errors["shipping.lastName"]
                                ? "#ef4444"
                                : "#e5e7eb",
                            }}
                          />
                          {errors["shipping.lastName"] && (
                            <div style={errorStyle}>
                              {errors["shipping.lastName"]}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ marginBottom: "20px" }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: "500",
                            marginBottom: "8px",
                          }}
                        >
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.street}
                          onChange={(e) =>
                            handleShippingChange("street", e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            borderColor: errors["shipping.street"]
                              ? "#ef4444"
                              : "#e5e7eb",
                          }}
                        />
                        {errors["shipping.street"] && (
                          <div style={errorStyle}>
                            {errors["shipping.street"]}
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "20px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            City *
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.city}
                            onChange={(e) =>
                              handleShippingChange("city", e.target.value)
                            }
                            style={{
                              ...inputStyle,
                              borderColor: errors["shipping.city"]
                                ? "#ef4444"
                                : "#e5e7eb",
                            }}
                          />
                          {errors["shipping.city"] && (
                            <div style={errorStyle}>
                              {errors["shipping.city"]}
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            Province *
                          </label>
                          <select
                            value={shippingInfo.province}
                            onChange={(e) =>
                              handleShippingChange("province", e.target.value)
                            }
                            style={{
                              ...inputStyle,
                              borderColor: errors["shipping.province"]
                                ? "#ef4444"
                                : "#e5e7eb",
                            }}
                          >
                            <option value="">Select Province</option>
                            <option value="ON">Ontario</option>
                            <option value="QC">Quebec</option>
                            <option value="BC">British Columbia</option>
                            <option value="AB">Alberta</option>
                            <option value="MB">Manitoba</option>
                            <option value="SK">Saskatchewan</option>
                            <option value="NS">Nova Scotia</option>
                            <option value="NB">New Brunswick</option>
                            <option value="NL">
                              Newfoundland and Labrador
                            </option>
                            <option value="PE">Prince Edward Island</option>
                            <option value="NT">Northwest Territories</option>
                            <option value="NU">Nunavut</option>
                            <option value="YT">Yukon</option>
                          </select>
                          {errors["shipping.province"] && (
                            <div style={errorStyle}>
                              {errors["shipping.province"]}
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.zip}
                            onChange={(e) =>
                              handleShippingChange(
                                "zip",
                                e.target.value.toUpperCase()
                              )
                            }
                            style={{
                              ...inputStyle,
                              borderColor: errors["shipping.zip"]
                                ? "#ef4444"
                                : "#e5e7eb",
                            }}
                            placeholder="A1A 1A1"
                          />
                          {errors["shipping.zip"] && (
                            <div style={errorStyle}>
                              {errors["shipping.zip"]}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
              </div>

              {/* Payment Information */}
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Payment Information</h3>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardholderName}
                    onChange={(e) =>
                      handlePaymentChange("cardholderName", e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      borderColor: errors["payment.cardholderName"]
                        ? "#ef4444"
                        : "#e5e7eb",
                    }}
                  />
                  {errors["payment.cardholderName"] && (
                    <div style={errorStyle}>
                      {errors["payment.cardholderName"]}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    Card Number *
                    {detectedCardType && (
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "0.875rem",
                          color: "#059669",
                          textTransform: "capitalize",
                          fontWeight: "600",
                        }}
                      >
                        {detectedCardType}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardNumber}
                    onChange={(e) =>
                      handlePaymentChange("cardNumber", e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      borderColor: errors["payment.cardNumber"]
                        ? "#ef4444"
                        : "#e5e7eb",
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {errors["payment.cardNumber"] && (
                    <div style={errorStyle}>{errors["payment.cardNumber"]}</div>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: "500",
                        marginBottom: "8px",
                      }}
                    >
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.expiryDate}
                      onChange={(e) =>
                        handlePaymentChange("expiryDate", e.target.value)
                      }
                      style={{
                        ...inputStyle,
                        borderColor: errors["payment.expiryDate"]
                          ? "#ef4444"
                          : "#e5e7eb",
                      }}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors["payment.expiryDate"] && (
                      <div style={errorStyle}>
                        {errors["payment.expiryDate"]}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: "500",
                        marginBottom: "8px",
                      }}
                    >
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        handlePaymentChange("cvv", e.target.value)
                      }
                      style={{
                        ...inputStyle,
                        borderColor: errors["payment.cvv"]
                          ? "#ef4444"
                          : "#e5e7eb",
                      }}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors["payment.cvv"] && (
                      <div style={errorStyle}>{errors["payment.cvv"]}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: "center", marginTop: "30px" }}>
                {errors.submit && (
                  <div
                    style={{
                      ...errorStyle,
                      textAlign: "center",
                      marginBottom: "20px",
                      fontSize: "1rem",
                    }}
                  >
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#9ca3af" : "#059669",
                    color: "white",
                    padding: "15px 40px",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "10px",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading
                    ? "Processing..."
                    : `Complete Order - $${Number(totalAmount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Order Summary</h3>

              {cartItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 0",
                    borderBottom:
                      index < cartItems.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "500" }}>
                      {item.vehicle.brand} {item.vehicle.model}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    $
                    {Number(parseFloat(item.vehicle.price) * item.quantity).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "2px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span>Subtotal:</span>
                  <span>${Number(subtotal).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <span>Tax (HST 13%):</span>
                  <span>${Number(taxAmount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    paddingTop: "15px",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <span>Total:</span>
                  <span>${Number(totalAmount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
