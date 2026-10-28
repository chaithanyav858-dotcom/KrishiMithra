import React, { useState, useEffect } from 'react';
import { historyApi } from '../api/agriApi';
import { useFlow } from '../context/FlowContext';
import { useAuth } from '../context/AuthContext';
import { HistoryCard, HistoryDetailModal } from '../components/history/HistoryComponents';
import { LoadingSpinner, AlertBanner } from '../components/common/UiFeedback';
import { 
  History, 
  Search, 
  Filter, 
  Wheat, 
  ArrowRight, 
  Sparkles,
  Inbox
} from 'lucide-react';

export function HistoryPage({ setActivePage, selectedRecordId, onClearSelectedRecordId }) {
  const { loadFromHistoryRecord } = useFlow();
  const { isAuthenticated, demoLogin } = useAuth();

  const [historyList, setHistoryList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [soilFilter, setSoilFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await historyApi.getHistory();
      if (response.success) {
        setHistoryList(response.history || []);
        setFilteredList(response.history || []);
      }
    } catch (err) {
      console.error('History fetch error:', err);
      setErrorMessage(err.message || 'Failed to retrieve consultation history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Handle external inspect trigger from Dashboard
  useEffect(() => {
    if (selectedRecordId) {
      handleInspect(selectedRecordId);
      if (onClearSelectedRecordId) onClearSelectedRecordId();
    }
  }, [selectedRecordId]);

  // Client-side filtering
  useEffect(() => {
    let result = historyList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.crop.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.farmName.toLowerCase().includes(q)
      );
    }

    if (soilFilter !== 'all') {
      result = result.filter(item => item.soilType === soilFilter);
    }

    setFilteredList(result);
  }, [searchQuery, soilFilter, historyList]);

  const handleInspect = async (id) => {
    try {
      const res = await historyApi.getById(id);
      if (res.success && res.record) {
        setSelectedRecord(res.record);
        setIsModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Could not load detailed consultation record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this historical consultation record?')) return;

    try {
      const res = await historyApi.deleteRecord(id);
      if (res.success) {
        setHistoryList(prev => prev.filter(r => r.id !== id));
        setSuccessMessage('Record removed from history.');
      }
    } catch (err) {
      setErrorMessage('Failed to delete record.');
    }
  };

  const handleLoadIntoWizard = (record) => {
    loadFromHistoryRecord(record);
    setActivePage('recommendation');
  };

  const handleDemoSignIn = async () => {
    const res = await demoLogin();
    if (res.success) {
      fetchHistory();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="agri-card p-8 bg-white border-soil-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Sign In to View Saved History</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Saved recommendations, weather conditions at consultation, and irrigation advice are securely associated with your farmer account.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleDemoSignIn}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-soil-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Log In as Demo Farmer (View Seed Records)</span>
            </button>
            <button
              onClick={() => setActivePage('login')}
              className="w-full py-2.5 rounded-xl bg-agri text-white text-xs font-bold hover:bg-agri-deep"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soil-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <History className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Consultation & Recommendation History
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Access previous farm consultations, inspect the exact weather snapshot at the time, and reproduce irrigation guidance.
          </p>
        </div>

        <button
          onClick={() => setActivePage('recommendation')}
          className="px-5 py-2.5 rounded-xl bg-agri hover:bg-agri-deep text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Wheat className="w-4 h-4 text-agri-mist" />
          <span>New Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {errorMessage && (
        <AlertBanner type="danger" message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {successMessage && (
        <AlertBanner type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      {/* Filter and Search Controls */}
      <div className="agri-card p-4 bg-white border-soil-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, farm, location..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-soil-300 focus:border-agri bg-[#faf9f7]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Soil Type:</span>
          <select
            value={soilFilter}
            onChange={(e) => setSoilFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-soil-300 bg-[#faf9f7] text-gray-700"
          >
            <option value="all">All Soil Profiles</option>
            <option value="red_loamy">Red Sandy / Loamy</option>
            <option value="black_regur">Black / Regur</option>
            <option value="loamy">Loamy</option>
            <option value="laterite">Laterite</option>
            <option value="clayey">Clayey</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <LoadingSpinner message="Loading saved consultation records..." />
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredList.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onInspect={handleInspect}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="agri-card p-12 text-center bg-white border-soil-200">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No Saved Recommendations Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || soilFilter !== 'all' 
              ? 'No consultations match your filter criteria. Try resetting search filters.' 
              : 'You have not saved any crop or irrigation consultations yet. Run a recommendation to start building your farm history.'}
          </p>
          <button
            onClick={() => setActivePage('recommendation')}
            className="px-6 py-2.5 rounded-xl bg-agri text-white text-xs font-bold hover:bg-agri-deep shadow-xs"
          >
            Generate First Recommendation
          </button>
        </div>
      )}

      {/* Detail Inspection Modal */}
      <HistoryDetailModal
        record={selectedRecord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoadIntoWizard={handleLoadIntoWizard}
      />
    </div>
  );
}
