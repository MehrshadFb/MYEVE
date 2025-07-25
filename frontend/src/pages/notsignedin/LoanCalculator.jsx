import { useState } from "react";
import Header from "../../components/Header";

function LoanCalculator() {
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [years, setYears] = useState("2");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [error, setError] = useState(""); // ⛔ error message state

  const getInterestRate = (years) => {
    if (years === "2" || years === "3") return 0.035;
    if (years === "4" || years === "5") return 0.04;
    return 0.05;
  };

  const rate = getInterestRate(years);

  const calculateLoan = () => {
  setError("");
  setMonthlyPayment(null);

  const priceNum = parseFloat(price);
  const downNum = parseFloat(downPayment);

  // Validate inputs
  if (isNaN(priceNum) || isNaN(downNum)) {
    setError("Please enter valid numbers only.");
    return;
  }

  if (priceNum < 0 || downNum < 0) {
    setError("Price and Down Payment cannot be negative.");
    return;
  }

  if (downNum > priceNum) {
    setError("Down Payment cannot be greater than Vehicle Price.");
    return;
  }

  const loanAmount = priceNum - downNum;
  const termMonths = parseInt(years) * 12;
  const monthlyRate = rate / 12;

  const monthly =
    (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

  setMonthlyPayment(monthly.toFixed(2));
};


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      <Header />

      {/* Header Section */}
      <section style={{
        paddingTop: "120px",
        paddingBottom: "80px",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "white",
        textAlign: "center",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)"
      }}>
        <div style={{ padding: "0 0px", width: "100%" }}>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            marginBottom: "20px"
          }}>
            Estimate Your Monthly Payment
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            opacity: 0.9,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Enter Vehicle Price, Down Payment, and Term Duration
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section style={{
        padding: "60px 20px",
        backgroundColor: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        display: "flex",
        justifyContent: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "500px" }}>

          {/* Price Row */}
          <div>
            <label style={labelStyle}>Vehicle Price ($):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              style={inputStyle}
            />
          </div>
          <hr style={hrStyle} />

          {/* Down Payment Row */}
          <div>
            <label style={labelStyle}>Down Payment ($):</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="Enter down payment"
              style={inputStyle}
            />
          </div>
          <hr style={hrStyle} />

          {/* Duration Row */}
          <div>
            <label style={labelStyle}>Loan Duration :</label>
            <select
              value={years}
              onChange={(e) => setYears(e.target.value)}
              style={inputStyle}
            >
              <option value="2">24 Months</option>
              <option value="3">36 Months</option>
              <option value="4">48 Months</option>
              <option value="5">60 Months</option>
              <option value="6">72 Months</option>
            </select>
          </div>
          <hr style={hrStyle} />

          {/* Rate Row */}
          <div>
            <label style={labelStyle}>Interest Rate:</label>
            <div style={{
              fontSize: "1rem",
              marginBottom: "20px",
              color: "#1e293b",
              padding: "12px 0"
            }}>
              {(rate * 100).toFixed(2)}% annual
            </div>
          </div>
          <hr style={hrStyle} />

{/* Error Message */}
{error && (
  <div style={{
    color: "#dc2626",
    backgroundColor: "#fee2e2",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "500",
    border: "1px solid #fecaca"
  }}>
    {error}
  </div>
)}

          {/* Calculate Button */}
          <div>
            <button
              onClick={calculateLoan}
              style={{
                ...inputStyle,
                backgroundColor: "#3b82f6",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
              }}
            >
              Calculate Monthly Payment
            </button>
          </div>

          {/* Result */}
          {monthlyPayment && (
            <div style={{
              marginTop: "30px",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1e293b"
            }}>
              Estimated Monthly Payment:{" "}
              <span style={{ color: "#16a34a" }}>${monthlyPayment}</span>
              /Month
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// 🎨 Style objects
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: "0px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#374151",
  fontSize: "14px"
};

const hrStyle = {
  margin: "24px 0",
  borderTop: "1px solid #e2e8f0"
};



export default LoanCalculator;
