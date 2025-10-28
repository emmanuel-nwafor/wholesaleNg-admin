import React, { useState, useEffect } from 'react';
import { Search, Star, X, Check, ChevronDown, MapPin, BadgeCheck, Square, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchWithToken } from '../../utils/fetchWithToken';

const fallbackImage = 'https://i.pinimg.com/736x/b3/bc/72/b3bc72d79f7ede15fad9eb29b7ca1768.jpg';

interface ApiSeller {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isVerifiedSeller: boolean;
  createdAt: string;
}

interface SellersResponse {
  sellers: ApiSeller[];
  total: number;
  page: number;
  limit: number;
}

interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  category: string;
  email: string;
  isVerified: boolean;
}

export default function StarterPackVendors({ onSelect, onClose }: { onSelect: (vendors: Vendor[]) => void; onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('All location');
  const [filterStore, setFilterStore] = useState('Store type');
  const [filterRating, setFilterRating] = useState('All');
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);

  const locations = ['All location', 'Lagos', 'Abuja'];
  const stores = ['All stores', 'Verified', 'Unverified'];
  const ratingOptions = [
    { value: 'All', label: 'All Ratings' },
    { value: '4.5', label: '4.5+ stars', rating: 4.5 },
    { value: '3.5', label: '3.5+ stars', rating: 3.5 },
    { value: '2.0', label: '2.0+ stars', rating: 2.0 },
    { value: '1.0', label: '1.0+ stars', rating: 1.0 },
    { value: '0', label: '0-1 stars', rating: 0 },
  ];

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response: SellersResponse = await fetchWithToken('/v1/users/sellers');
        const apiSellers: ApiSeller[] = response.sellers;
        const mappedVendors: Vendor[] = apiSellers.map(seller => ({
          id: seller._id,
          name: seller.fullName,
          location: 'Nigeria', 
          rating: 4.5,
          image: fallbackImage, 
          category: 'Stores',
          email: seller.email,
          isVerified: seller.isVerifiedSeller,
        }));
        setVendors(mappedVendors);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterLocation === 'All location' || vendor.location.includes(filterLocation)) &&
    (filterStore === 'All stores' || (filterStore === 'Verified' ? vendor.isVerified : !vendor.isVerified)) &&
    (filterRating === 'All' || vendor.rating >= parseFloat(filterRating))
  );

  const toggleSelection = (vendor: Vendor) => {
    setSelectedVendors(prev => 
      prev.some(v => v.id === vendor.id) 
        ? prev.filter(v => v.id !== vendor.id)
        : [...prev, vendor]
    );
  };

  const handleSelectAll = () => {
    setSelectedVendors(filteredVendors);
  };

  const handleConfirm = () => {
    onSelect(selectedVendors);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={`${
            i < Math.floor(rating) ? 'text-yellow-500 fill-current' :
            i === Math.floor(rating) && rating % 1 !== 0 ? 'text-yellow-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-6">Loading vendors...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Add vendors</h2>
            <button onClick={handleCancel}><X size={24} className="text-gray-500" /></button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-2xl focus:outline-none text-sm"
              />
            </div>
            <CustomDropdown
              value={filterLocation}
              options={locations}
              onChange={setFilterLocation}
              placeholder="All location"
              open={showLocationDropdown}
              onOpenChange={setShowLocationDropdown}
            />
            <CustomDropdown
              value={filterStore}
              options={stores}
              onChange={setFilterStore}
              placeholder="Store type"
              open={showStoreDropdown}
              onOpenChange={setShowStoreDropdown}
            />
            <RatingDropdown
              value={filterRating}
              options={ratingOptions}
              onChange={setFilterRating}
              placeholder="All ratings"
              open={showRatingDropdown}
              onOpenChange={setShowRatingDropdown}
              renderStars={renderStars}
            />
            <button className="px-4 py-2 bg-gray-900 text-white rounded-2xl text-sm">Search</button>
          </div>
        </div>
        <div className="p-6">
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 mb-4 hover:underline"
          >
            Select all ({filteredVendors.length})
          </button>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredVendors.map(vendor => {
              const isSelected = selectedVendors.some(v => v.id === vendor.id);
              return (
                <motion.div
                  key={vendor.id}
                  className={`relative border-2 rounded-xl px-6 py-5 text-center cursor-pointer transition-colors ${
                    isSelected ? 'border-gray-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleSelection(vendor)}
                >
                  <div className="absolute top-3 right-3">
                    {isSelected ? (
                      <CheckSquare size={20} className="text-blue-500" />
                    ) : (
                      <Square size={20} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                      <img 
                        src={vendor.image} 
                        alt={vendor.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1 mb-1">
                        <h3 className="font-medium text-sm truncate flex-1">{vendor.name}</h3>
                        {vendor.isVerified ? <BadgeCheck size={14} className="text-green-500 flex-shrink-0" /> : null}
                      </div>
                      <p className="text-xs text-gray-500">Category: {vendor.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{vendor.rating}</span>
                      <span className="text-xs text-gray-500">(5+)</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span className="truncate">{vendor.location}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={handleCancel} className="px-6 py-3 border border-gray-300 text-gray-800 text-sm rounded-2xl hover:bg-gray-50">
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={selectedVendors.length === 0}
            className="px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-950 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add vendors
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CustomDropdown({ value, options, onChange, placeholder, open, onOpenChange }: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => onOpenChange(!open)}
        className="px-3 py-2 bg-gray-50 rounded-2xl text-sm border border-gray-200 flex items-center gap-1"
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[120px] z-10"
        >
          {options.map(option => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                onOpenChange(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
            >
              {option}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function RatingDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder, 
  open, 
  onOpenChange, 
  renderStars 
}: {
  value: string;
  options: { value: string; label: string; rating?: number }[];
  onChange: (val: string) => void;
  placeholder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renderStars: (rating: number) => React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => onOpenChange(!open)}
        className="px-3 py-2 bg-gray-50 rounded-2xl text-sm border border-gray-200 flex items-center gap-1"
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[140px] z-10"
        >
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                onOpenChange(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <span className="flex-1">{option.label}</span>
              {option.rating !== undefined && renderStars(option.rating)}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}