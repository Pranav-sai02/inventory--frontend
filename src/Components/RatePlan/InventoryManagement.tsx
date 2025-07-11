import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, Plus, AlertTriangle, Upload, User, Users } from 'lucide-react';
import './InventoryManagement.css';

interface RoomType {
  id: string;
  name: string;
  isExpanded: boolean;
  ratePlans: RatePlan[];
}

interface RatePlan {
  id: string;
  name: string;
  type: string;
}

interface DayData {
  date: string;
  day: string;
  month: string;
  inventory: number;
  sold: number;
  rates: { [key: string]: number };
  warnings: string[];
}

interface InventoryData {
  hotelId: string;
  weekStartDate: string;
  rooms: {
    [roomId: string]: {
      inventory: number[];
      sold: number[];
      rates: {
        [ratePlanId: string]: {
          twoPersonRate: number[];
          onePersonRate: number[];
          
        }
      };
    };
  };
}
type RateMap = Record<string, { twoPersonRate: number[]; onePersonRate: number[] }>;


const InventoryManagement: React.FC = () => {
  const [selectedHotel, setSelectedHotel] = useState('Hotel Vista - 41365364');
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  // Generate week days based on current week start
  const generateWeekDays = (startDate: Date): DayData[] => {
    const days = [];
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        date: date.getDate().toString().padStart(2, '0'),
        day: dayNames[date.getDay()],
        month: monthNames[date.getMonth()],
        inventory: 0,
        sold: 0,
        rates: {},
        warnings: []
      });
    }
    
    return days;
  };

  const [weekDays, setWeekDays] = useState<DayData[]>(generateWeekDays(currentWeekStart));

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      id: 'beach-room',
      name: 'Beach Room',
      isExpanded: true,
      ratePlans: [
        { id: 'cp', name: 'CP', type: 'Base Rate' }
      ]
    },
    {
      id: 'executive-room',
      name: 'Executive Room',
      isExpanded: false,
      ratePlans: [
        { id: 'exec-cp', name: 'CP', type: 'Base Rate' }
      ]
    },
    {
      id: 'twin-bed-room',
      name: 'Twin Bed Room',
      isExpanded: false,
      ratePlans: [
        { id: 'twin-cp', name: 'CP', type: 'Base Rate' }
      ]
    }
  ]);

  // Initialize data with sample values
  const initializeInventoryData = (): InventoryData => {
    const data: InventoryData = {
      hotelId: selectedHotel,
      weekStartDate: currentWeekStart.toISOString(),
      rooms: {}
    };

    roomTypes.forEach(room => {
      data.rooms[room.id] = {
        inventory: [0, 0, 0, 0, 0, 0, 0],
        sold: [0, 0, 0, 0, 0, 0, 0],
        rates: {}
      };

      room.ratePlans.forEach(ratePlan => {
        data.rooms[room.id].rates[ratePlan.id] = {
          twoPersonRate: [0, 0, 0, 0, 0, 0, 0],
          onePersonRate: [0, 0, 0, 0, 0, 0, 0]
        };
      });
    });

    return data;
  };

  // Load data from backend (simulated)
  const loadInventoryData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = initializeInventoryData();
      setInventoryData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [roomTypes, currentWeekStart]);

  useEffect(() => {
    setWeekDays(generateWeekDays(currentWeekStart));
    loadInventoryData();
  }, [currentWeekStart, loadInventoryData]);

  const toggleRoomExpansion = (roomId: string) => {
    setRoomTypes(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, isExpanded: !room.isExpanded }
        : room
    ));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const updateRate = (roomId: string, ratePlanId: string, dayIndex: number, rateType: 'twoPersonRate' | 'onePersonRate', value: number) => {
    if (!inventoryData) return;
    
    setInventoryData(prev => {
      if (!prev) return prev;
      
      const updated = { ...prev };
      if (!updated.rooms[roomId]) {
        updated.rooms[roomId] = {
          inventory: new Array(7).fill(0),
          sold: new Array(7).fill(0),
          rates: {}
        };
      }
      if (!updated.rooms[roomId].rates[ratePlanId]) {
        updated.rooms[roomId].rates[ratePlanId] = {
          twoPersonRate: new Array(7).fill(0),
          onePersonRate: new Array(7).fill(0)
        };
      }
      
      updated.rooms[roomId].rates[ratePlanId][rateType][dayIndex] = value;
      return updated;
    });
  };

  const updateInventory = (roomId: string, dayIndex: number, value: number) => {
    if (!inventoryData) return;
    
    setInventoryData(prev => {
      if (!prev) return prev;
      
      const updated = { ...prev };
      if (!updated.rooms[roomId]) {
        updated.rooms[roomId] = {
          inventory: new Array(7).fill(0),
          sold: new Array(7).fill(0),
          rates: {}
        };
      }
      
      updated.rooms[roomId].inventory[dayIndex] = value;
      return updated;
    });
  };

  const getRoomData = (roomId: string) => {
    return inventoryData?.rooms[roomId] || {
      inventory: new Array(7).fill(0),
      sold: new Array(7).fill(0),
      rates: {},
    };
  };

  const getRateValue = (
  roomId: string,
  ratePlanId: string,
  dayIndex: number,
  rateType: 'twoPersonRate' | 'onePersonRate'
): number => {
  const roomData = getRoomData(roomId);

  const rates = roomData.rates as Record<string, { twoPersonRate: number[]; onePersonRate: number[] }>;

  if (rates[ratePlanId] && rates[ratePlanId][rateType]) {
    return rates[ratePlanId][rateType][dayIndex] || 0;
  }

  return 0;
};


  const formatWeekRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 6);
    
    return `${currentWeekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-management">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button">
              <ChevronLeft className="icon" />
            </button>
            <div className="hotel-info">
              <h1 className="hotel-name">Hotel Name: Hotel Vista</h1>
              <p className="hotel-address">Address: 3-12 Ayodhya nagara, intu Hyderabad Telangana</p>
            </div>
          </div>
          <div className="hotel-selector">
            <select 
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="hotel-select"
            >
              <option value="Hotel Vista - 41365364">Hotel Vista - 41365364</option>
              <option value="Hotel Paradise - 41365365">Hotel Paradise - 41365365</option>
              <option value="Hotel Luxury - 41365366">Hotel Luxury - 41365366</option>
            </select>
            <ChevronDown className="select-icon" />
          </div>
        </div>
      </div>

      {/* Management Header */}
      <div className="management-header">
        <div className="management-content">
          <h2 className="management-title">Manage Inventory, Rates & Restrictions</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-container">
          {/* Navigation Header */}
          <div className="navigation-header">
            <div className="navigation-left">
              <div className="rooms-rates-label">
                <Calendar className="icon" />
                <span className="label-text">Rooms & Rates</span>
              </div>
              {/* <button 
                onClick={() => setRoomTypes(prev => prev.map(room => ({ ...room, isExpanded: true })))}
                className="expand-all-button"
              >
                EXPAND ALL ROOMS & RATEPLANS
              </button> */}
            </div>
            
            <div className="navigation-right">
              <button className="bulk-update-button">
                <Upload className="icon" />
                <span>BULK UPDATE</span>
              </button>
              
              <div className="calendar-navigation">
                <button 
                  onClick={() => navigateWeek('prev')}
                  className="nav-button"
                >
                  <ChevronLeft className="icon" />
                </button>
                
                <div className="calendar-picker">
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="calendar-button"
                  >
                    <Calendar className="icon" />
                    <span className="date-range">{formatWeekRange()}</span>
                    <ChevronDown className="icon" />
                  </button>
                  
                  {showCalendar && (
                    <div className="calendar-dropdown">
                      <input
                        type="date"
                        value={currentWeekStart.toISOString().split('T')[0]}
                        onChange={(e) => {
                          setCurrentWeekStart(new Date(e.target.value));
                          setShowCalendar(false);
                        }}
                        className="date-input"
                      />
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => navigateWeek('next')}
                  className="nav-button"
                >
                  <ChevronRight className="icon" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            <table className="inventory-table">
              {/* Header Row */}
              <thead>
                <tr className="table-header">
                  <th className="room-header">
                    <span className="header-text">Rooms & Rates</span>
                  </th>
                  {weekDays.map((day, index) => {
                    const isToday = new Date().toDateString() === new Date(currentWeekStart.getTime() + index * 24 * 60 * 60 * 1000).toDateString();
                    return (
                      <th key={index} className="day-header">
                        <div className={`day-card ${
                          isToday 
                            ? 'day-card-current' 
                            : 'day-card-normal'
                        }`}>
                          <div className="day-name">{day.day}</div>
                          <div className="day-number">{day.date}</div>
                          <div className="day-month">{day.month}</div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <button 
                onClick={() => setRoomTypes(prev => prev.map(room => ({ ...room, isExpanded: true })))}
                className="expand-all-button"
              >
                EXPAND ALL ROOMS & RATEPLANS
              </button>

              <tbody>
                {roomTypes.map((roomType) => (
                  <React.Fragment key={roomType.id}>
                    {/* Room Type Header */}
                    <tr className="room-type-row">
                      <td className="room-type-cell">
                        <button
                          onClick={() => toggleRoomExpansion(roomType.id)}
                          className="room-type-button"
                        >
                          <ChevronRight className={`chevron-icon ${
                            roomType.isExpanded ? 'chevron-expanded' : ''
                          }`} />
                          <span className="room-type-name">{roomType.name}</span>
                        </button>
                      </td>
                      {weekDays.map((day, dayIndex) => {
                        const roomData = getRoomData(roomType.id);
                        const inventory = roomData.inventory[dayIndex];
                        const sold = roomData.sold[dayIndex];
                        
                        return (
                          <td key={dayIndex} className="inventory-cell">
                            <div className="inventory-content">
                              <div className="inventory-input-container">
                                <span className="inventory-number">{inventory}</span>
                                {inventory === 0 && (
                                  <AlertTriangle className="warning-icon" />
                                )}
                              </div>
                              <div className="sold-text">{sold} sold</div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Rate Plans */}
                    {roomType.isExpanded && roomType.ratePlans.map((ratePlan) => (
                      <tr key={ratePlan.id} className="rate-plan-row">
                        <td className="rate-plan-cell">
                          <div className="rate-plan-info-custom">
                            <div className="rate-plan-left">
                              <span className="rate-plan-dash">−</span>
                              <div className="rate-plan-details">
                                <div className="cp-layout">
                                  <div className="cp-row-1">
                                    <span className="cp-text">{ratePlan.name}</span>
                                    <div className="person-2-info">
                                      <Users className="capacity-icon" />
                                      <span className="capacity-text">2</span>
                                      <span className="base-rate-text">Base Rate</span>
                                    </div>
                                  </div>
                                  <div className="cp-row-2">
                                    <button className="update-rate-button">
                                      UPDATE RATE
                                    </button>
                                    <div className="person-1-info">
                                      <User className="capacity-icon" />
                                      <span className="capacity-text">1</span>
                                      <span className="person-text">person</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        {weekDays.map((day, dayIndex) => (
                          <td key={dayIndex} className="rate-cell">
                            <div className="rate-inputs-container">
                              <input
                                type="number"
                                value={getRateValue(roomType.id, ratePlan.id, dayIndex, 'twoPersonRate')}
                                onChange={(e) => updateRate(roomType.id, ratePlan.id, dayIndex, 'twoPersonRate', parseInt(e.target.value) || 0)}
                                className="rate-input"
                                min="0"
                                placeholder="0"
                              />
                              <div className="rate-separator"></div>
                              <input
                                type="number"
                                value={getRateValue(roomType.id, ratePlan.id, dayIndex, 'onePersonRate')}
                                onChange={(e) => updateRate(roomType.id, ratePlan.id, dayIndex, 'onePersonRate', parseInt(e.target.value) || 0)}
                                className="rate-input"
                                min="0"
                                placeholder="0"
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Collapsed room show rates button */}
                    {!roomType.isExpanded && (
                      <tr className="collapsed-room-row">
                        <td className="collapsed-room-cell">
                          <button 
                            onClick={() => toggleRoomExpansion(roomType.id)}
                            className="show-rates-button"
                          >
                            <Plus className="icon" />
                            <span className="show-rates-text">Show {roomType.name} rates</span>
                          </button>
                        </td>
                        {weekDays.map((day, dayIndex) => {
                          const roomData = getRoomData(roomType.id);
                          const inventory = roomData.inventory[dayIndex];
                          const sold = roomData.sold[dayIndex];
                          
                          return (
                            <td key={dayIndex} className="collapsed-inventory-cell">
                              <div className="collapsed-inventory-content">
                                <div className="collapsed-inventory-display">
                                  <span className="inventory-number">{inventory}</span>
                                  {inventory === 0 && (
                                    <AlertTriangle className="warning-icon" />
                                  )}
                                </div>
                                <div className="sold-text">{sold} sold</div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;