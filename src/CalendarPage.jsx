import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, X, Users, CheckCircle, Star, Calendar as CalendarIcon, Sparkles, Loader } from 'lucide-react';
import { loadAllData, createEvent, updateEvent, deleteEvent, createBooking } from './airtable';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    location: '',
    type: 'Tour',
    description: '',
    price: '',
    capacity: 10,
    rating: 5.0
  });

  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    notes: ''
  });

  const eventTypes = ['Tour', 'Workshop', 'Food Tour', 'Performance', 'Festival', 'Exhibition'];

  // Load events from Airtable on mount
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const data = await loadAllData();
      setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getTotalBookedSpots = (event) => {
    if (!event || !event.bookings) return 0;
    return event.bookings.reduce((sum, booking) => sum + booking.guests, 0);
  };

  const getAvailableSpots = (event) => {
    if (!event) return 0;
    return event.capacity - getTotalBookedSpots(event);
  };

  const isEventFull = (event) => {
    return getAvailableSpots(event) <= 0;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setSelectedDate(dateStr);
    
    if (events[dateStr]) {
      setFormData({
        title: events[dateStr].title,
        time: events[dateStr].time,
        location: events[dateStr].location,
        type: events[dateStr].type,
        description: events[dateStr].description,
        price: events[dateStr].price,
        capacity: events[dateStr].capacity,
        rating: events[dateStr].rating || 5.0
      });
    } else {
      setFormData({
        title: '',
        time: '',
        location: '',
        type: 'Tour',
        description: '',
        price: '',
        capacity: 10,
        rating: 5.0
      });
    }
    
    setShowModal(true);
  };

  const handleBookNow = (dateStr) => {
    setSelectedDate(dateStr);
    setBookingData({
      name: '',
      email: '',
      phone: '',
      guests: 1,
      notes: ''
    });
    setBookingSuccess(false);
    setShowBookingModal(true);
  };

  const handleSaveEvent = async () => {
    if (!formData.title || !formData.time || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const eventData = {
        ...formData,
        date: selectedDate
      };

      if (events[selectedDate] && events[selectedDate].id) {
        // Update existing event
        await updateEvent(events[selectedDate].id, eventData);
      } else {
        // Create new event
        const newId = await createEvent(eventData);
        eventData.id = newId;
      }

      // Reload all data to get fresh state
      const updatedEvents = await loadAllData();
      setEvents(updatedEvents);
      setShowModal(false);
      alert('Event saved successfully!');
    } catch (error) {
      alert('Failed to save event. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    const event = events[selectedDate];
    const availableSpots = getAvailableSpots(event);
    
    if (bookingData.guests > availableSpots) {
      alert(`Sorry, only ${availableSpots} spots remaining!`);
      return;
    }

    setSaving(true);
    try {
      await createBooking(bookingData, event.id);
      
      // Reload all data to get updated bookings
      const updatedEvents = await loadAllData();
      setEvents(updatedEvents);
      
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
      }, 2000);
    } catch (error) {
      alert('Failed to create booking. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    setSaving(true);
    try {
      if (events[selectedDate] && events[selectedDate].id) {
        await deleteEvent(events[selectedDate].id);
        
        // Reload all data
        const updatedEvents = await loadAllData();
        setEvents(updatedEvents);
        setShowModal(false);
        alert('Event deleted successfully!');
      }
    } catch (error) {
      alert('Failed to delete event. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getUpcomingEvents = () => {
    const today = new Date();
    return Object.entries(events)
      .filter(([date]) => new Date(date) >= today)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .slice(0, 6);
  };

  const renderCalendar = () => {
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      const hasEvent = events[dateStr];
      const isToday = dateStr === formatDate(new Date());
      const isPast = new Date(dateStr) < new Date(new Date().setHours(0,0,0,0));
      const isFull = hasEvent && isEventFull(hasEvent);
      
      days.push(
        <div
          key={day}
          onClick={() => !isPast && handleDayClick(day)}
          className={`
            aspect-square p-2 border-2 transition-all relative rounded-xl group
            ${isPast ? 'bg-gray-50 cursor-not-allowed opacity-40 border-gray-200' : 'cursor-pointer border-gray-200'}
            ${hasEvent && !isPast ? (isFull ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-purple-500 to-pink-500') + ' text-white hover:shadow-xl border-transparent transform hover:scale-105' : !isPast ? 'bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 hover:shadow-lg' : ''}
            ${isToday ? 'ring-4 ring-purple-400 ring-opacity-50' : ''}
          `}
        >
          <div className="font-bold text-sm">{day}</div>
          {hasEvent && (
            <>
              <div className="mt-1 text-xs truncate font-bold">
                {hasEvent.title}
              </div>
              <div className="text-xs opacity-90 flex items-center gap-1 mt-1">
                <Users size={10} />
                {getTotalBookedSpots(hasEvent)}/{hasEvent.capacity}
              </div>
              {isFull && <div className="text-xs font-bold mt-1 bg-red-500 rounded px-1">FULL</div>}
            </>
          )}
        </div>
      );
    }
    
    return days;
  };

  const upcomingEvents = getUpcomingEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading events from Airtable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={32} className="animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold">Discover Korea</h1>
            <Sparkles size={32} className="animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-purple-100 mb-2">
            Authentic Cultural Experiences in Seoul & Suwon
          </p>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Small groups • Expert guides • Unforgettable memories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <CalendarIcon className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Event Calendar</h2>
                    <p className="text-sm text-gray-500">Click a day to view or add events</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-3 hover:bg-purple-100 rounded-xl transition"
                  >
                    <ChevronLeft size={24} className="text-purple-600" />
                  </button>
                  <span className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
                    {monthName}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-3 hover:bg-purple-100 rounded-xl transition"
                  >
                    <ChevronRight size={24} className="text-purple-600" />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span>Full</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border rounded"></div>
                  <span>No Event</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-bold text-gray-600 py-2 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Star className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(([date, event]) => {
                    const availableSpots = getAvailableSpots(event);
                    const isFull = isEventFull(event);
                    
                    return (
                      <div key={date} className="border-2 border-gray-100 rounded-xl p-4 hover:shadow-lg transition bg-gradient-to-br from-white to-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-2 text-center min-w-[50px]">
                            <div className="text-xs font-semibold">
                              {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            <div className="text-2xl font-bold">
                              {new Date(date).getDate()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 mb-2">{event.title}</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-purple-500" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-pink-500" />
                                <span className="text-xs">{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users size={14} className={isFull ? 'text-red-500' : 'text-green-500'} />
                                <span className={`text-xs font-semibold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                                  {availableSpots} spots left
                                </span>
                              </div>
                              {event.rating && (
                                <div className="flex items-center gap-2">
                                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs font-semibold">{event.rating}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="font-bold text-purple-600">{event.price}</div>
                              {!isFull ? (
                                <button
                                  onClick={() => handleBookNow(date)}
                                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:shadow-lg transition font-semibold"
                                >
                                  Book Now
                                </button>
                              ) : (
                                <span className="px-4 py-2 bg-gray-300 text-gray-600 text-sm rounded-lg font-semibold">
                                  Sold Out
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">No upcoming events scheduled</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Management Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {events[selectedDate] ? 'Event Details' : 'Add New Event'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition" disabled={saving}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <input
                  type="text"
                  value={new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  disabled
                  className="w-full p-3 border-2 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  disabled={saving}
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Traditional Tea Ceremony"
                  className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  disabled={saving}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                    placeholder="10"
                    min="1"
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Insadong, Seoul"
                  className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the event"
                  className="w-full p-3 border-2 rounded-lg h-20 focus:ring-2 focus:ring-purple-500"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g., ₩35,000"
                  className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  disabled={saving}
                />
              </div>

              {events[selectedDate] && events[selectedDate].bookings && events[selectedDate].bookings.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Bookings ({events[selectedDate].bookings.length})</label>
                  <div className="bg-purple-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                    {events[selectedDate].bookings.map((booking, idx) => (
                      <div key={idx} className="text-sm mb-2 pb-2 border-b border-purple-200 last:border-0">
                        <div className="font-bold">{booking.name}</div>
                        <div className="text-gray-600">{booking.email}</div>
                        <div className="text-gray-600">Guests: {booking.guests}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEvent}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:shadow-lg transition font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader size={20} className="animate-spin" /> : null}
                {saving ? 'Saving...' : (events[selectedDate] ? 'Update Event' : 'Save Event')}
              </button>
              {events[selectedDate] && (
                <button
                  onClick={handleDeleteEvent}
                  disabled={saving}
                  className="px-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-bold disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && events[selectedDate] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {!bookingSuccess ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Book Your Spot</h2>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition" disabled={saving}>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl mb-6 border-2 border-purple-200">
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{events[selectedDate].title}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} />
                      {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {events[selectedDate].time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {events[selectedDate].location}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-200">
                      <div className="font-bold text-purple-600 text-lg">{events[selectedDate].price}</div>
                      <div className="text-green-600 font-bold flex items-center gap-1">
                        <Users size={14} />
                        {getAvailableSpots(events[selectedDate])} spots left
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                      required
                      placeholder="Kim Minho"
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      required
                      placeholder="your.email@example.com"
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      required
                      placeholder="010-1234-5678"
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Number of Guests *</label>
                    <select
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                      disabled={saving}
                    >
                      {[...Array(Math.min(getAvailableSpots(events[selectedDate]), 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      placeholder="Any dietary restrictions, accessibility needs, etc."
                      className="w-full p-3 border-2 rounded-lg h-20 focus:ring-2 focus:ring-purple-500"
                      disabled={saving}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg hover:shadow-lg transition font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader size={20} className="animate-spin" /> : null}
                    {saving ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h3>
                <p className="text-gray-600 text-lg">
                  We'll send a confirmation email to<br/>
                  <span className="font-semibold text-purple-600">{bookingData.email}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
