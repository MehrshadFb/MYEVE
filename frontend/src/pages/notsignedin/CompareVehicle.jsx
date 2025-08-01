import { useEffect, useState, useRef } from "react";
import { getAllVehicles, addToCart } from "../../services/api";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { getAverageRating } from "../../utils/AnalyticsHelper";
import OrangeCheck from "../../../public/OrangeCheck.png"; // adjust path if needed


// Price ranges constant
const priceRanges = [
  { label: "Under $25,000", min: 0, max: 25000 },
  { label: "$25,000 - $50,000", min: 25000, max: 50000 },
  { label: "$50,000 - $75,000", min: 50000, max: 75000 },
  { label: "$75,000 - $100,000", min: 75000, max: 100000 },
  { label: "Over $100,000", min: 100000, max: Infinity },
];

function CompareVehicle() {
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const getBestIndexes = () => {
  const prices = selectedVehicles.map(v => Number(String(v.price).replace(/[^0-9.-]+/g, "")));
  const ranges = selectedVehicles.map(v => v.range);
  const seats = selectedVehicles.map(v => v.seats);

  const minPrice = Math.min(...prices);
  const maxRange = Math.max(...ranges);
  const maxSeats = Math.max(...seats);

  return {
    price: prices.map(p => p === minPrice),
    range: ranges.map(r => r === maxRange),
    seats: seats.map(s => s === maxSeats)
  };
};


  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("brand");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [minReviewRating, setMinReviewRating] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const imageIntervals = useRef({});

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getAllVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Get unique values for filters
  const uniqueBrands = [...new Set(vehicles.map((vehicle) => vehicle.brand))];
  const uniqueTypes = [...new Set(vehicles.map((vehicle) => vehicle.type))];
  const uniqueSeats = [
    ...new Set(vehicles.map((vehicle) => vehicle.seats)),
  ].sort((a, b) => a - b);
  const uniqueRanges = [
    ...new Set(vehicles.map((vehicle) => vehicle.range)),
  ].sort((a, b) => a - b);

  // Filter and search vehicles
  useEffect(() => {
    let filtered = vehicles;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (vehicle.description &&
            vehicle.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((vehicle) =>
        selectedBrands.includes(vehicle.brand)
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((vehicle) =>
        selectedTypes.includes(vehicle.type)
      );
    }

    // Apply seats filter
    if (selectedSeats.length > 0) {
      filtered = filtered.filter((vehicle) =>
        selectedSeats.includes(vehicle.seats)
      );
    }

    // Apply range filter
    if (selectedRanges.length > 0) {
      filtered = filtered.filter((vehicle) =>
        selectedRanges.includes(vehicle.range)
      );
    }

    // Apply price range filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((vehicle) => {
        return selectedPriceRanges.some((rangeLabel) => {
          const range = priceRanges.find((r) => r.label === rangeLabel);
          if (!range) return false;
          return vehicle.price >= range.min && vehicle.price <= range.max;
        });
      });
    }

    // Apply minimum review rating filter
    if (minReviewRating > 0) {
      filtered = filtered.filter((vehicle) => {
        const avg = getAverageRating(vehicle.reviews);
        return avg >= minReviewRating && avg < minReviewRating + 1;
      });
    }

    // Sorting
    let sorted = [...filtered];
    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "brand-asc":
        sorted.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      case "brand-desc":
        sorted.sort((a, b) => b.brand.localeCompare(a.brand));
        break;
      case "model-asc":
        sorted.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case "model-desc":
        sorted.sort((a, b) => b.model.localeCompare(a.model));
        break;
      case "range-asc":
        sorted.sort((a, b) => a.range - b.range);
        break;
      case "range-desc":
        sorted.sort((a, b) => b.range - a.range);
        break;
      case "seats-asc":
        sorted.sort((a, b) => a.seats - b.seats);
        break;
      case "seats-desc":
        sorted.sort((a, b) => b.seats - a.seats);
        break;
      case "rating-desc":
        sorted.sort((a, b) => getAverageRating(b.reviews) - getAverageRating(a.reviews));
        break;
      case "rating-asc":
        sorted.sort((a, b) => getAverageRating(a.reviews) - getAverageRating(b.reviews));
        break;
      default:
        break;
    }

    setFilteredVehicles(sorted);
  }, [
    vehicles,
    searchTerm,
    selectedBrands,
    selectedTypes,
    selectedSeats,
    selectedRanges,
    selectedPriceRanges,
    sortOption,
    minReviewRating,
  ]);

  // Toggle filter selections
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSeats = (seats) => {
    setSelectedSeats((prev) =>
      prev.includes(seats) ? prev.filter((s) => s !== seats) : [...prev, seats]
    );
  };

  const toggleRange = (range) => {
    setSelectedRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const togglePriceRange = (rangeLabel) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeLabel)
        ? prev.filter((r) => r !== rangeLabel)
        : [...prev, rangeLabel]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedSeats([]);
    setSelectedRanges([]);
    setSelectedPriceRanges([]);
    setSearchTerm("");
    setSortOption("");
    setMinReviewRating(0);
  };

  // Get total active filters count
  const getActiveFiltersCount = () => {
    return (
      selectedBrands.length +
      selectedTypes.length +
      selectedSeats.length +
      selectedRanges.length +
      selectedPriceRanges.length
    );
  };

  // Image cycling functions
  const startImageCycling = (vehicleId, imageCount) => {
    if (imageCount <= 1) return; // Don't cycle if only one image
    
    // Clear existing interval if any
    if (imageIntervals.current[vehicleId]) {
      clearInterval(imageIntervals.current[vehicleId]);
    }
    
    // Start new interval
    imageIntervals.current[vehicleId] = setInterval(() => {
      setCurrentImageIndexes(prev => ({
        ...prev,
        [vehicleId]: ((prev[vehicleId] || 0) + 1) % imageCount
      }));
    }, 5000); // 5 seconds
  };

  const stopImageCycling = (vehicleId) => {
    if (imageIntervals.current[vehicleId]) {
      clearInterval(imageIntervals.current[vehicleId]);
      delete imageIntervals.current[vehicleId];
    }
    // Reset to first image when hover ends
    setCurrentImageIndexes(prev => ({
      ...prev,
      [vehicleId]: 0
    }));
  };

  const navigateImage = (vehicleId, direction, imageCount) => {
    // Stop auto-cycling when user manually navigates
    if (imageIntervals.current[vehicleId]) {
      clearInterval(imageIntervals.current[vehicleId]);
      delete imageIntervals.current[vehicleId];
    }
    
    setCurrentImageIndexes(prev => {
      const currentIndex = prev[vehicleId] || 0;
      let newIndex;
      
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % imageCount;
      } else {
        newIndex = currentIndex === 0 ? imageCount - 1 : currentIndex - 1;
      }
      
      return {
        ...prev,
        [vehicleId]: newIndex
      };
    });
    
    // Restart auto-cycling after manual navigation
    setTimeout(() => {
      if (hoveredCard === vehicleId) {
        startImageCycling(vehicleId, imageCount);
      }
    }, 1000); // Wait 1 second before restarting auto-cycle
  };

  const jumpToImage = (vehicleId, targetIndex, imageCount) => {
    // Stop auto-cycling when user manually navigates
    if (imageIntervals.current[vehicleId]) {
      clearInterval(imageIntervals.current[vehicleId]);
      delete imageIntervals.current[vehicleId];
    }
    
    setCurrentImageIndexes(prev => ({
      ...prev,
      [vehicleId]: targetIndex
    }));
    
    // Restart auto-cycling after manual navigation
    setTimeout(() => {
      if (hoveredCard === vehicleId) {
        startImageCycling(vehicleId, imageCount);
      }
    }, 1000);
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    const intervals = imageIntervals.current;
    return () => {
      Object.values(intervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

   

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

      {/* Hero Section */}
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
            Vehicle Comparison
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            opacity: 0.9,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Choose 2 Vehicles to Compare
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section
        style={{
          padding: "40px 0",
          backgroundColor: "white",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "0 40px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "20px",
                color: "#1e293b",
              }}
            >
              Search & Filter Vehicles
            </h3>

            {/* Search Bar and Filter Button */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "20px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, position: "relative", minWidth: 220 }}>
                <input
                  type="text"
                  placeholder="Search by type, brand, model, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              {/* Sorting Dropdown */}
              <div style={{ minWidth: 220 }}>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Sort By</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="brand-asc">Brand: A-Z</option>
                  <option value="brand-desc">Brand: Z-A</option>
                  <option value="model-asc">Model: A-Z</option>
                  <option value="model-desc">Model: Z-A</option>
                  <option value="range-asc">Range: Low to High</option>
                  <option value="range-desc">Range: High to Low</option>
                  <option value="seats-asc">Seats: Low to High</option>
                  <option value="seats-desc">Seats: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                </select>
              </div>
              {/* Review Filter */}
              <div style={{ minWidth: 180 }}>
                <select
                  value={minReviewRating}
                  onChange={(e) => setMinReviewRating(Number(e.target.value))}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    color: "#1e293b",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={0}>All Ratings</option>
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  color: "#1e293b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.color = "#1e293b";
                }}
              >
                <span style={{ fontSize: "16px" }}>🔍</span>
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Dropdown */}
            {showFilters && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  padding: "20px",
                  marginTop: "16px",
                }}
              >
                {/* Filter Tabs */}
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #e2e8f0",
                    marginBottom: "20px",
                  }}
                >
                  {[
                    {
                      id: "brand",
                      label: "Brand",
                      count: selectedBrands.length,
                    },
                    { id: "type", label: "Type", count: selectedTypes.length },
                    {
                      id: "seats",
                      label: "Seats",
                      count: selectedSeats.length,
                    },
                    {
                      id: "range",
                      label: "Range",
                      count: selectedRanges.length,
                    },
                    {
                      id: "pricing",
                      label: "Pricing",
                      count: selectedPriceRanges.length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilterTab(tab.id)}
                      style={{
                        padding: "12px 20px",
                        border: "none",
                        backgroundColor: "transparent",
                        color:
                          activeFilterTab === tab.id ? "#3b82f6" : "#64748b",
                        fontWeight: "500",
                        cursor: "pointer",
                        borderBottom:
                          activeFilterTab === tab.id
                            ? "2px solid #3b82f6"
                            : "2px solid transparent",
                        transition: "all 0.3s ease",
                        position: "relative",
                      }}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span
                          style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            marginLeft: "6px",
                          }}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Filter Content */}
                <div style={{ minHeight: "200px" }}>
                  {/* Brand Filters */}
                  {activeFilterTab === "brand" && (
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          marginBottom: "16px",
                          color: "#1e293b",
                        }}
                      >
                        Select Brands
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {uniqueBrands.map((brand) => (
                          <label
                            key={brand}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              padding: "8px",
                              borderRadius: "6px",
                              backgroundColor: selectedBrands.includes(brand)
                                ? "#eff6ff"
                                : "transparent",
                              border: selectedBrands.includes(brand)
                                ? "1px solid #3b82f6"
                                : "1px solid transparent",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#3b82f6",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#374151",
                              }}
                            >
                              {brand}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Type Filters */}
                  {activeFilterTab === "type" && (
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          marginBottom: "16px",
                          color: "#1e293b",
                        }}
                      >
                        Select Types
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {uniqueTypes.map((type) => (
                          <label
                            key={type}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              padding: "8px",
                              borderRadius: "6px",
                              backgroundColor: selectedTypes.includes(type)
                                ? "#eff6ff"
                                : "transparent",
                              border: selectedTypes.includes(type)
                                ? "1px solid #3b82f6"
                                : "1px solid transparent",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(type)}
                              onChange={() => toggleType(type)}
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#3b82f6",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#374151",
                              }}
                            >
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seats Filters */}
                  {activeFilterTab === "seats" && (
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          marginBottom: "16px",
                          color: "#1e293b",
                        }}
                      >
                        Select Number of Seats
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(150px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {uniqueSeats.map((seats) => (
                          <label
                            key={seats}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              padding: "8px",
                              borderRadius: "6px",
                              backgroundColor: selectedSeats.includes(seats)
                                ? "#eff6ff"
                                : "transparent",
                              border: selectedSeats.includes(seats)
                                ? "1px solid #3b82f6"
                                : "1px solid transparent",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedSeats.includes(seats)}
                              onChange={() => toggleSeats(seats)}
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#3b82f6",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#374151",
                              }}
                            >
                              {seats} {seats === 1 ? "Seat" : "Seats"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Range Filters */}
                  {activeFilterTab === "range" && (
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          marginBottom: "16px",
                          color: "#1e293b",
                        }}
                      >
                        Select Range (miles)
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(150px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {uniqueRanges.map((range) => (
                          <label
                            key={range}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              padding: "8px",
                              borderRadius: "6px",
                              backgroundColor: selectedRanges.includes(range)
                                ? "#eff6ff"
                                : "transparent",
                              border: selectedRanges.includes(range)
                                ? "1px solid #3b82f6"
                                : "1px solid transparent",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedRanges.includes(range)}
                              onChange={() => toggleRange(range)}
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#3b82f6",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#374151",
                              }}
                            >
                              {range.toLocaleString()} miles
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range Filters */}
                  {activeFilterTab === "pricing" && (
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          marginBottom: "16px",
                          color: "#1e293b",
                        }}
                      >
                        Select Price Ranges
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {priceRanges.map((range) => (
                          <label
                            key={range.label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              padding: "8px",
                              borderRadius: "6px",
                              backgroundColor: selectedPriceRanges.includes(
                                range.label
                              )
                                ? "#eff6ff"
                                : "transparent",
                              border: selectedPriceRanges.includes(range.label)
                                ? "1px solid #3b82f6"
                                : "1px solid transparent",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPriceRanges.includes(
                                range.label
                              )}
                              onChange={() => togglePriceRange(range.label)}
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#3b82f6",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#374151",
                              }}
                            >
                              {range.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <button
                    onClick={clearAllFilters}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "white",
                      color: "#64748b",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#9ca3af";
                      e.target.style.color = "#374151";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#d1d5db";
                      e.target.style.color = "#64748b";
                    }}
                  >
                    Clear All Filters
                  </button>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                    }}
                  >
                    {filteredVehicles.length} of {vehicles.length} vehicles
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section
        style={{
          padding: "40px 0",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "0 40px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "#64748b",
                }}
              >
                Loading vehicles...
              </div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  color: "#64748b",
                  marginBottom: "16px",
                }}
              >
                No vehicles found
              </div>
              <p
                style={{
                  color: "#94a3b8",
                  marginBottom: "24px",
                }}
              >
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearAllFilters}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid #3b82f6",
                  backgroundColor: "white",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#3b82f6";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "#3b82f6";
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "24px",
              }}
            >
              {filteredVehicles.map((vehicle) => {
                const avgRating = getAverageRating(vehicle.reviews);
                const isHovered = hoveredCard === vehicle.vid;
                return (
                  <div
                    key={vehicle.vid}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: isHovered ? "0 8px 30px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.1)",
                      transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                      willChange: "transform"
                    }}
                    onMouseEnter={() => {
                      setHoveredCard(vehicle.vid);
                      if (vehicle.images && vehicle.images.length > 1) {
                        startImageCycling(vehicle.vid, vehicle.images.length);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCard(null);
                      stopImageCycling(vehicle.vid);
                    }}
                  >
                    {/* Vehicle Image */}
                    <div
                      style={{
                        height: "200px",
                        backgroundColor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[currentImageIndexes[vehicle.vid] || 0]?.url || vehicle.images[0].url}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "all 0.4s ease-in-out",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "3rem",
                          }}
                        >
                          🚗
                        </div>
                      )}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          backgroundColor: "rgba(255,255,255,0.9)",
                          color: "#fbbf24",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "16px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: avgRating >= star ? "#fbbf24" : "#e0e0e0",
                            }}
                          >
                            ★
                          </span>
                        ))}
                        <span
                          style={{
                            color: "#64748b",
                            fontSize: "13px",
                            marginLeft: "6px",
                          }}
                        >
                          {avgRating ? avgRating.toFixed(1) : "No rating"}
                        </span>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        ${parseFloat(vehicle.price).toLocaleString()}
                      </div>
                      
                      {/* Image indicators */}
                      {vehicle.images && vehicle.images.length > 1 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "12px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: "4px",
                            padding: "4px 8px",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderRadius: "12px",
                            alignItems: "center",
                          }}
                        >
                          {vehicle.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                jumpToImage(vehicle.vid, index, vehicle.images.length);
                              }}
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: (currentImageIndexes[vehicle.vid] || 0) === index ? "white" : "rgba(255,255,255,0.4)",
                                transition: "all 0.3s ease",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                              }}
                              onMouseEnter={(e) => {
                                if ((currentImageIndexes[vehicle.vid] || 0) !== index) {
                                  e.target.style.backgroundColor = "rgba(255,255,255,0.7)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if ((currentImageIndexes[vehicle.vid] || 0) !== index) {
                                  e.target.style.backgroundColor = "rgba(255,255,255,0.4)";
                                }
                              }}
                            />
                          ))}
                          {isHovered && (
                            <span
                              style={{
                                color: "white",
                                fontSize: "10px",
                                marginLeft: "6px",
                                fontWeight: "500",
                              }}
                            >
                              {(currentImageIndexes[vehicle.vid] || 0) + 1}/{vehicle.images.length}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Navigation Arrows */}
                      {vehicle.images && vehicle.images.length > 1 && isHovered && (
                        <>
                          {/* Previous Arrow */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateImage(vehicle.vid, 'prev', vehicle.images.length);
                            }}
                            style={{
                              position: "absolute",
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              backgroundColor: "rgba(255, 255, 255, 0)",
                              color: "#ffffffff",
                              border: "none",
                              borderRadius: "50%",
                              width: "36px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              fontSize: "10px",
                              fontWeight: "bold",
                              transition: "all 0.3s ease",
                              zIndex: 10,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "rgba(255, 255, 255, 0)";
                              e.target.style.transform = "translateY(-50%) scale(1.1)";
                              e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "rgba(255, 255, 255, 0)";
                              e.target.style.transform = "translateY(-50%) scale(1)";
                              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
                            }}
                          >
                            ‹
                          </button>

                          {/* Next Arrow */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateImage(vehicle.vid, 'next', vehicle.images.length);
                            }}
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              backgroundColor: "rgba(255, 255, 255, 0)",
                              color: "#ffffffff",
                              border: "none",
                              borderRadius: "50%",
                              width: "36px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              fontSize: "10px",
                              fontWeight: "bold",
                              transition: "all 0.3s ease",
                              zIndex: 10,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "rgba(255, 255, 255, 0)";
                              e.target.style.transform = "translateY(-50%) scale(1.1)";
                              e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "rgba(255, 255, 255, 0)";
                              e.target.style.transform = "translateY(-50%) scale(1)";
                              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
                            }}
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {/* Vehicle Info */}
                    <div style={{ padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "700",
                              color: "#1e293b",
                              margin: "0 0 4px 0",
                            }}
                          >
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#64748b",
                              margin: "0",
                              textTransform: "capitalize",
                            }}
                          >
                            {vehicle.type}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "600",
                              color: "#3b82f6",
                              marginBottom: "4px",
                            }}
                          >
                            {vehicle.year}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Year
                          </span>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.875rem",
                            color: "#64748b",
                          }}
                        >
                          <span>👥</span>
                          <span>
                            {vehicle.seats}{" "}
                            {vehicle.seats === 1 ? "Seat" : "Seats"}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.875rem",
                            color: "#64748b",
                          }}
                        >
                          <span>🔋</span>
                          <span>{vehicle.range.toLocaleString()} miles</span>
                        </div>
                      </div>

                      {vehicle.description && (
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#64748b",
                            marginBottom: "16px",
                            lineHeight: "1.5",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {vehicle.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                        }}
                      >
                        <button
                          style={{
                            flex: 1,
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: "1px solid #3b82f6",
                            backgroundColor: "white",
                            color: "#3b82f6",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#3b82f6";
                            e.target.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "white";
                            e.target.style.color = "#3b82f6";
                          }}
                          onClick={() => {
                            setSelectedVehicles((prev) => {
                            if (prev.some(v => v.vid === vehicle.vid)) return prev; // avoid duplicates
                            if (prev.length < 2) return [...prev, vehicle];
                            return prev; // ignore if already 2 selected
                          });
                        }}
                        >
                          Select Vehicle
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {/* Compare Vehicles */}
      {selectedVehicles.length === 2 && (
      <section style={{ padding: "40px 20px", backgroundColor: "#ffffffff" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "30px", color: "black" }}>
          Vehicle Comparison
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: `1fr repeat(${selectedVehicles.length}, 1fr)`,
          gap: "24px",
          maxWidth: "1000px",
          margin: "0 auto",
          fontSize: "1.25rem",
          color: "black"
        }}>
          {/* Labels column */}
          <div style={{ fontWeight: "700" }}>
            <div style={rowStyle}>Vehicle</div>
            <div style={rowStyle}>Price</div>
            <div style={rowStyle}>Mileage</div>
            <div style={rowStyle}>Seats</div>
          </div>

          {/* Value columns */}
          {(() => {
            const best = getBestIndexes();
            return selectedVehicles.map((v, index) => (
              <div key={v.vid}>
                <div style={rowStyle}>
                  {v.brand} {v.model} {v.year}
                </div>
                <div style={rowStyle}>
                  ${parseFloat(v.price).toLocaleString()}
                  {best.price[index] && (
                    <img src={OrangeCheck} alt="best price" style={{ width: 20, marginLeft: 8, verticalAlign: "middle" }} />
                  )}
                </div>
                <div style={rowStyle}>
                  {v.range.toLocaleString()} miles
                  {best.range[index] && (
                    <img src={OrangeCheck} alt="best mileage" style={{ width: 20, marginLeft: 8, verticalAlign: "middle" }} />
                  )}
                </div>
                <div style={rowStyle}>
                  {v.seats} {v.seats === 1 ? "seat" : "seats"}
                  {best.seats[index] && (
                    <img src={OrangeCheck} alt="most seats" style={{ width: 20, marginLeft: 8, verticalAlign: "middle" }} />
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
    {/* Clear button */}
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <button
        onClick={() => setSelectedVehicles([])}
        style={{
          padding: "12px 24px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "1rem"
        }}
      >
        Clear Comparison
      </button>
    </div>
  </section>
)}
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
  borderTop: "1px solid #f0e7e2ff"
};

const rowStyle = {
  borderBottom: "2px solid black",
  padding: "12px 0"
};


export default CompareVehicle;
