'use client'

import { useState } from 'react';

interface StationModalProps {
  onStationSelect?: (station: string) => void;
}

export default function StationModal({ onStationSelect }: StationModalProps = {}) {
  const [selectedStation, setSelectedStation] = useState('');
  const [activeModal, setActiveModal] = useState(false);

  const stations = [
    '渋谷駅', '新宿駅', '原宿駅', '表参道駅', '銀座駅', '池袋駅',
    '心斎橋駅', '梅田駅', '横浜駅', '名古屋駅', '博多駅', '札幌駅'
  ];

  const openModal = () => {
    setActiveModal(true);
  };

  const closeModal = () => {
    setActiveModal(false);
  };

  const selectStation = (station: string) => {
    setSelectedStation(station);
    onStationSelect?.(station);
    closeModal();
  };

  return (
    <>
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3 sm:mb-4 text-center">最寄り駅を選択</label>
        <button
          onClick={openModal}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 bg-white rounded-lg sm:rounded-xl text-base sm:text-lg text-left hover:border-pink-500 focus:border-pink-500 focus:outline-none transition-colors flex items-center justify-between shadow-sm"
        >
          <span className={selectedStation ? 'text-gray-900' : 'text-gray-500'}>
            {selectedStation || '駅を選択してください'}
          </span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* モーダル */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-medium">最寄り駅を選択</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-1 sm:space-y-2">
                {stations.map((station) => (
                  <button
                    key={station}
                    onClick={() => selectStation(station)}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    {station}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}