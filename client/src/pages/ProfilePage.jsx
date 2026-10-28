import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi, farmApi } from '../api/agriApi';
import { LoadingSpinner, AlertBanner, Modal } from '../components/common/UiFeedback';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Layers, 
  Plus, 
  Check, 
  Trash2, 
  Sparkles, 
  ShieldCheck,
  Edit2
} from 'lucide-react';

export function ProfilePage({ setActivePage }) {
  const { user, isDemoAccount, refreshUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || 'Hassan, Karnataka',
    state: user?.state || 'Karnataka'
  });

  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // New farm modal state
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [newFarm, setNewFarm] = useState({
    farmName: '',
    location: user?.location || 'Hassan, Karnataka',
    district: 'Hassan',
    state: 'Karnataka',
    soilType: 'red_loamy',
    areaAcres: 2.5,
    isPrimary: false
  });

  const loadProfileAndFarms = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [profRes, farmRes] = await Promise.all([
        profileApi.getProfile(),
        farmApi.getFarms()
      ]);

      if (profRes.success && profRes.profile) {
        setProfileData({
          name: profRes.profile.name || '',
          phone: profRes.profile.phone || '',
          location: profRes.profile.location || 'Hassan, Karnataka',
          state: profRes.profile.state || 'Karnataka'
        });
      }

      if (farmRes.success) {
        setFarms(farmRes.farms || []);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setErrorMessage('Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndFarms();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await profileApi.updateProfile(profileData);
      if (res.success) {
        setSuccessMessage('Farmer profile successfully updated!');
        refreshUser();
      } else {
        throw new Error(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error saving profile changes.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      const res = await farmApi.createFarm(newFarm);
      if (res.success && res.farm) {
        setFarms(prev => [...prev, res.farm]);
        setIsAddFarmOpen(false);
        setSuccessMessage('New farm plot registered.');
        setNewFarm({
          farmName: '',
          location: user?.location || 'Hassan, Karnataka',
          district: 'Hassan',
          state: 'Karnataka',
          soilType: 'red_loamy',
          areaAcres: 2.5,
          isPrimary: false
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create farm plot.');
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Are you sure you want to remove this farm plot?')) return;
    try {
      const res = await farmApi.deleteFarm(farmId);
      if (res.success) {
        setFarms(prev => prev.filter(f => f.id !== farmId));
        setSuccessMessage('Farm plot removed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete farm plot.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading farmer profile..." />;
  }

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-soil-200">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-agri/10 text-agri">
            <User className="w-6 h-6" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Farmer Profile & Farm Plots
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Manage your personal details, default agricultural location, and registered land holdings.
        </p>
      </div>

      {errorMessage && (
        <AlertBanner type="danger" message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {successMessage && (
        <AlertBanner type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      {isDemoAccount && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            You are currently logged in with the preloaded <strong>Demo Account (Ramesh Patil)</strong>. You can test editing details and registering new plots freely.
          </span>
        </div>
      )}

      {/* Profile Form */}
      <div className="agri-card p-6 md:p-8 bg-white border-soil-200 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-soil-100 mb-5">
          Personal Information
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm bg-[#faf9f7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-200 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400">Account login identifier</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Primary Farm Location
              </label>
              <input
                type="text"
                required
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm bg-[#faf9f7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm bg-[#faf9f7]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 rounded-xl bg-agri hover:bg-agri-deep text-white text-xs font-bold transition-colors disabled:opacity-70"
            >
              {isUpdating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Farm Plots Management */}
      <div className="agri-card p-6 md:p-8 bg-white border-soil-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-soil-100 mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Registered Farm Plots
            </h3>
            <p className="text-xs text-gray-500">Support for multiple parcels with distinct soil types</p>
          </div>

          <button
            onClick={() => setIsAddFarmOpen(true)}
            className="px-4 py-2 rounded-xl bg-agri/10 hover:bg-agri text-agri hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Farm Plot</span>
          </button>
        </div>

        <div className="space-y-3">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="p-4 rounded-xl bg-[#faf9f6] border border-soil-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900">{farm.farm_name}</h4>
                  {farm.is_primary === 1 && (
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                      Primary Plot
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                  <span>Location: <strong>{farm.location}</strong></span>
                  <span>•</span>
                  <span>Soil: <strong className="capitalize">{farm.soil_type?.replace('_', ' ')}</strong></span>
                  <span>•</span>
                  <span>Area: <strong>{farm.area_acres} Acres</strong></span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDeleteFarm(farm.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove farm plot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Farm Modal */}
      <Modal
        isOpen={isAddFarmOpen}
        onClose={() => setIsAddFarmOpen(false)}
        title="Register New Farm Plot"
      >
        <form onSubmit={handleCreateFarm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Plot Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newFarm.farmName}
              onChange={(e) => setNewFarm({ ...newFarm, farmName: e.target.value })}
              placeholder="e.g. Hemavathi South Field"
              className="w-full px-3 py-2 rounded-lg border border-soil-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Location / Taluk
              </label>
              <input
                type="text"
                required
                value={newFarm.location}
                onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                placeholder="Hassan, Karnataka"
                className="w-full px-3 py-2 rounded-lg border border-soil-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Area (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={newFarm.areaAcres}
                onChange={(e) => setNewFarm({ ...newFarm, areaAcres: parseFloat(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-lg border border-soil-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Soil Type
            </label>
            <select
              value={newFarm.soilType}
              onChange={(e) => setNewFarm({ ...newFarm, soilType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-soil-300 text-xs"
            >
              <option value="red_loamy">Red Sandy / Loamy Soil</option>
              <option value="black_regur">Black / Regur Soil</option>
              <option value="loamy">Loamy Soil</option>
              <option value="laterite">Laterite Soil</option>
              <option value="clayey">Clayey Soil</option>
              <option value="alluvial">Alluvial Soil</option>
              <option value="sandy">Sandy Soil</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={newFarm.isPrimary}
              onChange={(e) => setNewFarm({ ...newFarm, isPrimary: e.target.checked })}
              className="accent-agri w-4 h-4 rounded"
            />
            <label htmlFor="isPrimary" className="text-xs text-gray-700 font-medium">
              Set as primary default farm plot
            </label>
          </div>

          <div className="pt-3 border-t border-soil-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddFarmOpen(false)}
              className="px-4 py-2 rounded-lg border border-soil-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-agri text-white text-xs font-bold hover:bg-agri-deep"
            >
              Save Farm Plot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
