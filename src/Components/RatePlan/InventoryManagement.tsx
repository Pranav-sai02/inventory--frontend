import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, Plus, AlertTriangle, Upload, User, Users } from 'lucide-react';
import './InventoryManagement.css';
import { Room } from '../../type/room';
import { RatePlanPriceDTO } from '../../type/RatePlanPriceDto';
import { useHotels } from '../../hooks/useHotels';
import { useRooms } from '../../hooks/useRooms';
import { useNavigate } from 'react-router-dom';
import { useRatePlanPrices, useUpdateRatePlanPrices } from '../../hooks/useRatePlanPrices';




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
        [roomId: number]: {
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

// ✅ Converts InventoryData (UI state) into a list of RatePlanPriceDTOs to send to backend
function convertInventoryToRatePlanPrices(
    data: InventoryData,
    weekDays: DayData[]
): RatePlanPriceDTO[] {
    const ratePrices: RatePlanPriceDTO[] = [];

    Object.entries(data.rooms).forEach(([roomId, roomData]) => {
        weekDays.forEach((day, index) => {
            Object.entries(roomData.rates).forEach(([ratePlanId, rateData]) => {
                ratePrices.push({
                    hotelId: parseInt(data.hotelId),
                    roomId: parseInt(roomId),
                    ratePlanId: parseInt(ratePlanId),
                    date: formatDateToISO(new Date(data.weekStartDate), index),
                    availableCount: roomData.inventory[index],
                    pricePerOne: rateData.onePersonRate[index],
                    pricePerTwo: rateData.twoPersonRate[index],
                });
            });
        });
    });

    return ratePrices;
}

// ✅ Utility to format each date in the 7-day range
function formatDateToISO(start: Date, offset: number): string {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    return date.toISOString().split('T')[0];
}

const InventoryManagement: React.FC = () => {
    const navigate = useNavigate();
    const [expandedRooms, setExpandedRooms] = useState<Record<number, boolean>>({});

    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const { data: hotels = [], isLoading: hotelsLoading } = useHotels();
    const selectedHotel = hotels.find(hotel => hotel.hotelId === selectedHotelId);

    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { mutate: saveRates, isPending: savingRates } = useUpdateRatePlanPrices();

    const [showCalendar, setShowCalendar] = useState(false);
    const startDateStr = currentWeekStart.toISOString().split('T')[0];

    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    const endDateStr = endDate.toISOString().split('T')[0];

    const DAY_COUNT = 7;



    useEffect(() => {
        if (!selectedHotelId && hotels.length > 0) {
            setSelectedHotelId(hotels[0].hotelId);
        }
    }, [hotels, selectedHotelId]);

    // Generate week days based on current week start
    const generateWeekDays = (startDate: Date): DayData[] => {
        const days = [];
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        for (let i = 0; i < DAY_COUNT; i++) {
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

    const { data: room = [], isLoading: roomLoading } = useRooms(selectedHotelId ?? 0);
    const { data: fetchedPrices = [], isLoading: ratesLoading } = useRatePlanPrices(
        selectedHotelId ?? 0,
        startDateStr,
        endDateStr
    );




    // Initialize data with sample values
    const initializeInventoryData = (): InventoryData => {
        const data: InventoryData = {
            hotelId: selectedHotelId?.toString() ?? '',
            weekStartDate: currentWeekStart.toISOString(),
            rooms: {}
        };

        room.forEach(room => {
            data.rooms[room.roomId] = {
                inventory: [],
                sold: [],
                rates: {}
            };
        });

        return data;
    };



    // ✅ Just updates weekdays when week changes
    useEffect(() => {
        setWeekDays(generateWeekDays(currentWeekStart));
    }, [currentWeekStart]);

    // ✅ Loads inventory data only when roomTypes or week changes
    useEffect(() => {
        if (room.length === 0 || inventoryData) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = initializeInventoryData();
                fetchedPrices.forEach((item) => {
                    if (item.ratePlanId == null) {
                        console.warn("Skipping item with null ratePlanId", item);
                        return;
                    }

                    const roomEntry = data.rooms[item.roomId];
                    if (!roomEntry) return;

                    // Calculate index (0 to 6)
                    const date = new Date(item.date);
                    const start = new Date(currentWeekStart);
                    const dayIndex = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                    if (dayIndex < 0 || dayIndex >= DAY_COUNT) return;

                    roomEntry.inventory[dayIndex] = item.availableCount ?? 0;
                    roomEntry.rates[String(item.ratePlanId)] = roomEntry.rates[String(item.ratePlanId)] || {
                        onePersonRate: new Array(DAY_COUNT).fill(0),
                        twoPersonRate: new Array(DAY_COUNT).fill(0),
                    };

                    roomEntry.rates[String(item.ratePlanId)].onePersonRate[dayIndex] = item.pricePerOne ?? 0;
                    roomEntry.rates[String(item.ratePlanId)].twoPersonRate[dayIndex] = item.pricePerTwo ?? 0;
                });
                setInventoryData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [room, currentWeekStart, inventoryData]);


    const toggleRoomExpansion = (roomId: number) => {
        setExpandedRooms((prev) => ({
            ...prev,
            [roomId]: !prev[roomId],
        }));
    };


    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newDate);
    };

    const updateRate = (
        roomId: number,
        ratePlanId: string,
        dayIndex: number,
        rateType: 'twoPersonRate' | 'onePersonRate',
        value: number
    ) => {
        if (!inventoryData) return;

        setInventoryData(prev => {
            if (!prev) return prev;

            const updated = { ...prev };

            if (!updated.rooms[roomId]) {
                updated.rooms[roomId] = {
                    inventory: [],
                    sold: [],
                    rates: {}
                };
            }

            // Lazy init rates object
            if (!updated.rooms[roomId].rates[ratePlanId]) {
                updated.rooms[roomId].rates[ratePlanId] = {
                    twoPersonRate: [],
                    onePersonRate: []
                };
            }

            // Lazy init the array itself if not set
            if (!Array.isArray(updated.rooms[roomId].rates[ratePlanId][rateType])) {
                updated.rooms[roomId].rates[ratePlanId][rateType] = [];
            }

            updated.rooms[roomId].rates[ratePlanId][rateType][dayIndex] = value;
            return updated;
        });
    };


    const updateInventory = (roomId: number, dayIndex: number, value: number) => {
        if (!inventoryData) return;

        setInventoryData(prev => {
            if (!prev) return prev;

            const updated = { ...prev };

            if (!updated.rooms[roomId]) {
                updated.rooms[roomId] = {
                    inventory: [],
                    sold: [],
                    rates: {}
                };
            }

            // Lazy init inventory array
            if (!Array.isArray(updated.rooms[roomId].inventory)) {
                updated.rooms[roomId].inventory = [];
            }

            updated.rooms[roomId].inventory[dayIndex] = value;
            return updated;
        });
    };


    const getRoomData = (roomId: number) => {
        return inventoryData?.rooms[roomId] || {
            inventory: new Array(DAY_COUNT).fill(0),
            sold: new Array(DAY_COUNT).fill(0),
            rates: {},
        };
    };

    const getRateValue = (
        roomId: number,
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

    if (isLoading || roomLoading) {
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
                            <h1 className="hotel-name">
                                Hotel Name: {selectedHotel?.hotelName || 'Please select a hotel'}
                            </h1>
                            <p className="hotel-address">
                                Address: {selectedHotel?.hotelAddress || 'No address available'}
                            </p>
                        </div>
                    </div>
                    <div className="hotel-selector">
                        <div className="hotel-selector">
                            <select
                                value={selectedHotelId ?? ''}
                                onChange={(e) => setSelectedHotelId(Number(e.target.value))}
                                className="hotel-select"
                            >
                                <option value="">Select a Hotel</option>
                                {hotels.map((hotel) => (
                                    <option key={hotel.hotelId} value={hotel.hotelId}>
                                        {hotel.hotelName} - {hotel.hotelId}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="select-icon" />
                        </div>

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
                            <button
                                className="save-button"
                                disabled={savingRates}
                                onClick={() => {
                                    if (inventoryData) {
                                        const payload = convertInventoryToRatePlanPrices(inventoryData, weekDays);
                                        console.log('Submitting to backend:', payload);
                                        saveRates(payload, {
                                            onSuccess: () => {
                                                alert('Inventory saved successfully!');
                                            },
                                            onError: (err) => {
                                                console.error(err);
                                                alert('Failed to save inventory.');
                                            },
                                        });
                                    }
                                }}
                            >
                                {savingRates ? 'Saving...' : 'Save Inventory'}
                            </button>
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
                                                <div className={`day-card ${isToday
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
                                onClick={() => {
                                    const allExpanded: Record<number, boolean> = {};
                                    room.forEach((room) => {
                                        allExpanded[room.roomId] = true;
                                    });
                                    setExpandedRooms(allExpanded);
                                }}
                                className="expand-all-button"
                            >
                                EXPAND ALL ROOMS & RATEPLANS
                            </button>

                            <tbody>
                                {room.map((room) => (
                                    <React.Fragment key={room.roomId}>
                                        {/* Room Type Header */}
                                        <tr className="room-type-row">
                                            <td className="room-type-cell">
                                                <button
                                                    onClick={() => toggleRoomExpansion(room.roomId)}
                                                    className="room-type-button"
                                                >
                                                    <ChevronRight
                                                        className={`chevron-icon ${expandedRooms[room.roomId] ? 'chevron-expanded' : ''}`}
                                                    />
                                                    <span className="room-type-name">{room.roomName}</span>
                                                </button>
                                            </td>

                                            {weekDays.map((day, dayIndex) => {
                                                const roomData = getRoomData(room.roomId);

                                                // ✅ Use optional chaining with fallback default values to avoid crashing
                                                const inventory = roomData.inventory?.[dayIndex] ?? 0;
                                                const sold = roomData.sold?.[dayIndex] ?? 0;

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
                                        {expandedRooms[room.roomId] && (room.ratePlans ?? []).map((ratePlan) => (
                                            <tr key={ratePlan.ratePlanId} className="rate-plan-row">
                                                <td className="rate-plan-cell">
                                                    <div className="rate-plan-info-custom">
                                                        <div className="rate-plan-left">
                                                            <span className="rate-plan-dash">−</span>
                                                            <div className="rate-plan-details">
                                                                <div className="cp-layout">
                                                                    <div className="cp-row-1">
                                                                        <span className="cp-text">{ratePlan.ratePlanName}</span>
                                                                        <div className="person-2-info">
                                                                            <Users className="capacity-icon" />
                                                                            <span className="capacity-text">2</span>
                                                                            <span className="base-rate-text">Base Rate</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="cp-row-2">
                                                                        <button
                                                                            className="update-rate-button"
                                                                            onClick={() =>
                                                                                navigate('/rate-plan-popup', {
                                                                                    state: {
                                                                                        ratePlan,
                                                                                        roomId: room.roomId,
                                                                                        hotelId: selectedHotelId,
                                                                                    },
                                                                                })
                                                                            }
                                                                        >
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
                                                                value={getRateValue(room.roomId, String(ratePlan.ratePlanId ?? ''), dayIndex, 'twoPersonRate')}
                                                                onChange={(e) => updateRate(
                                                                    room.roomId,
                                                                    String(ratePlan.ratePlanId ?? ''),
                                                                    dayIndex,
                                                                    'twoPersonRate',
                                                                    parseInt(e.target.value) || 0
                                                                )}
                                                                className="rate-input"
                                                                min="0"
                                                                placeholder="0"
                                                            />
                                                            <div className="rate-separator"></div>
                                                            <input
                                                                type="number"
                                                                value={getRateValue(room.roomId, String(ratePlan.ratePlanId ?? ''), dayIndex, 'onePersonRate')}
                                                                onChange={(e) => updateRate(
                                                                    room.roomId,
                                                                    String(ratePlan.ratePlanId ?? ''),
                                                                    dayIndex,
                                                                    'onePersonRate',
                                                                    parseInt(e.target.value) || 0
                                                                )}
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
                                        {!expandedRooms[room.roomId] && (
                                            <tr className="collapsed-room-row">
                                                <td className="collapsed-room-cell">
                                                    <button
                                                        onClick={() => toggleRoomExpansion(room.roomId)}
                                                        className="show-rates-button"
                                                    >
                                                        <Plus className="icon" />
                                                        <span className="show-rates-text">Show {room.roomName} rates</span>
                                                    </button>
                                                </td>

                                                {weekDays.map((day, dayIndex) => {
                                                    const roomData = getRoomData(room.roomId);

                                                    // ✅ Safe fallback handling
                                                    const inventory = roomData.inventory?.[dayIndex] ?? 0;
                                                    const sold = roomData.sold?.[dayIndex] ?? 0;

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