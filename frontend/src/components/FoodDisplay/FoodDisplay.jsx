import React, { useContext, useMemo, useState } from 'react';
import { assets } from '../../assets/frontend_assets/assets';
import './FoodDisplay.css';
import { StoreContext } from '../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import { ChevronDown } from 'lucide-react';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [filterType, setFilterType] = useState('veg');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('none');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleToggle = (type) => {
    setFilterType(type);
  };

  const filteredFoodList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const base = (food_list || []).filter((item) => {
      const matchCategory = category === item.category || category === 'All';
      const matchType =
        filterType === 'all' ||
        (filterType === 'veg' && item.type === 'veg') ||
        (filterType === 'non-veg' && item.type === 'nonveg');
      const matchQuery = query === '' || item.name.toLowerCase().includes(query);
      return matchCategory && matchType && matchQuery;
    });

    if (sortOption === 'price-asc') return [...base].sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') return [...base].sort((a, b) => b.price - a.price);
    return base;
  }, [food_list, category, filterType, searchQuery, sortOption]);

  const getSortLabel = () => {
    if (sortOption === 'price-asc') return 'Price: Low → High';
    if (sortOption === 'price-desc') return 'Price: High → Low';
    return 'Default';
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    setShowSortDropdown(false);
  };

  return (
    <div className="food-display">
      <h4>Top Dishes Near You</h4>

      <div className="food-display-controls">
        {/* Search Bar */}
        <div className="food-search-bar">
          <img src={assets.search_icon} alt="Search" className="food-search-icon" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="food-search-input"
          />
        </div>

        {/* Right Controls Container */}
        <div className="food-right-controls">
          {/* Veg Toggle */}
          <label className="food-veg-toggle">
            <input
              type="checkbox"
              checked={filterType === 'veg'}
              onChange={(e) => handleToggle(e.target.checked ? 'veg' : 'non-veg')}
            />
            <div className="food-toggle-track">
              <span className="food-toggle-label">Non‐Veg</span>
              <div className="food-toggle-thumb"></div>
              <span className="food-toggle-label">Veg</span>
            </div>
          </label>

          {/* Sort Dropdown */}
          <div className="food-sort-dropdown-container">
            <button 
              className="food-sort-dropdown-btn"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span className="food-sort-label-text">
                Sort By: <span className="food-sort-value">{getSortLabel()}</span>
              </span>
              <ChevronDown size={18} className={`food-chevron ${showSortDropdown ? "open" : ""}`} />
            </button>
            
            {showSortDropdown && (
              <div className="food-sort-dropdown-menu">
                <button 
                  className={`food-sort-option ${sortOption === 'none' ? "active" : ""}`}
                  onClick={() => handleSortSelect('none')}
                >
                  Default
                </button>
                <button 
                  className={`food-sort-option ${sortOption === 'price-asc' ? "active" : ""}`}
                  onClick={() => handleSortSelect('price-asc')}
                >
                  Price: Low → High
                </button>
                <button 
                  className={`food-sort-option ${sortOption === 'price-desc' ? "active" : ""}`}
                  onClick={() => handleSortSelect('price-desc')}
                >
                  Price: High → Low
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="food-display-list">
        {filteredFoodList.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;