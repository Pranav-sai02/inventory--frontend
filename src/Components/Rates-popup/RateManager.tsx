import React, { useState } from 'react';
import './RateManager.css';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// Day definitions for toggling
const days = [
  { key: 'M', label: 'MON', full: 'Monday' },
  { key: 'T1', label: 'TUE', full: 'Tuesday' },
  { key: 'W', label: 'WED', full: 'Wednesday' },
  { key: 'T2', label: 'THU', full: 'Thursday' },
  { key: 'F', label: 'FRI', full: 'Friday' },
  { key: 'S1', label: 'SAT', full: 'Saturday' },
  { key: 'S2', label: 'SUN', full: 'Sunday' }
];

// Props interface
interface RateManagerProps {
  ratePlan: {
    roomId: string;
    ratePlanId: string;
  } | null;
  onClose: () => void;
}

const RateManager: React.FC<RateManagerProps> = ({ ratePlan, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDays, setSelectedDays] = useState<string[]>(days.map((d) => d.key));
  const [showNettRate, setShowNettRate] = useState<boolean>(false);
  const [baseRate1, setBaseRate1] = useState<string>('');
  const [baseRate2, setBaseRate2] = useState<string>('');
  const [extraRatesOpen, setExtraRatesOpen] = useState<boolean>(false);
  const [restrictionsOpen, setRestrictionsOpen] = useState<boolean>(false);

  const toggleDay = (dayKey: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey) ? prev.filter((d) => d !== dayKey) : [...prev, dayKey]
    );
  };

  return (
    <div className="rate-card">
      <h2 className="rate-title">Manage Rate - EP (B2C)</h2>

      {/* Date and Day Selection */}
      <div className="rate-section">
        <div className="rate-column">
          <label className="label">Select dates to update inventory for *</label>
          <button className="date-button">
            <CalendarIcon size={16} />
            {selectedDate ? format(selectedDate, 'dd MMM yyyy, EEE') : '02 Jul 2025, Wed'}
          </button>
        </div>

        <div className="rate-column">
          <label className="label">Selected days ({selectedDays.length})</label>
          <div className="day-buttons">
            {days.map((day) => (
              <button
                key={day.key}
                className={`day-button ${selectedDays.includes(day.key) ? 'selected' : ''}`}
                onClick={() => toggleDay(day.key)}
              >
                {day.label}
              </button>
            ))}
          </div>
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="nett-rate"
              checked={showNettRate}
              onChange={(e) => setShowNettRate(e.target.checked)}
            />
            <label htmlFor="nett-rate">Show Nett Rate</label>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="info-box">
        Please note, if you have not set rates for any occupancy, next higher available occupancy rates would be picked.
      </div>

      {/* Base Rate Inputs */}
      <div className="rate-block">
        <label className="rate-label">Base Rates:</label>
        <div className="rate-row">
          <div className="rate-pair">
            <div className="rate-tag-box">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <span>1</span>
            </div>
            <input
              type="text"
              placeholder="Enter"
              value={baseRate1}
              onChange={(e) => setBaseRate1(e.target.value)}
            />
          </div>

          <div className="rate-pair">
            <div className="rate-tag-box">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <span>2</span>
            </div>
            <input
              type="text"
              placeholder="Enter"
              value={baseRate2}
              onChange={(e) => setBaseRate2(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="collapsibles">
        <div className="collapsible" onClick={() => setExtraRatesOpen(!extraRatesOpen)}>
          <span className="toggle-icon">+</span> Extra Adult & Child Rates
        </div>
        {extraRatesOpen && (
          <div className="collapsible-content">
            Extra adult and child rate configuration would go here.
          </div>
        )}

        <div className="collapsible" onClick={() => setRestrictionsOpen(!restrictionsOpen)}>
          <span className="toggle-icon">+</span> Update Rate Restrictions
        </div>
        {restrictionsOpen && (
          <div className="collapsible-content">
            Rate restrictions configuration would go here.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="button-row">
        <button className="btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
};

export default RateManager;
