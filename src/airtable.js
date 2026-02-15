// Airtable API utility functions

const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const EVENTS_TABLE_ID = import.meta.env.VITE_AIRTABLE_EVENTS_TABLE_ID;
const BOOKINGS_TABLE_ID = import.meta.env.VITE_AIRTABLE_BOOKINGS_TABLE_ID;

const AIRTABLE_API = 'https://api.airtable.com/v0';

// Helper function to make Airtable API calls
async function airtableRequest(endpoint, options = {}) {
  const response = await fetch(`${AIRTABLE_API}/${BASE_ID}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Airtable API Error:', error);
    throw new Error(error.error?.message || 'Airtable API request failed');
  }

  return response.json();
}

// Fetch all events from Airtable
export async function fetchEvents() {
  try {
    const data = await airtableRequest(`/${EVENTS_TABLE_ID}`);
    
    // Transform Airtable records to our app format
    const events = {};
    data.records.forEach(record => {
      const fields = record.fields;
      if (fields.Date) {
        events[fields.Date] = {
          id: record.id,
          title: fields.Title || '',
          time: fields.Time || '',
          location: fields.Location || '',
          type: fields.Type || 'Tour',
          description: fields.Description || '',
          price: fields.Price || '',
          capacity: fields.Capacity || 10,
          rating: fields.Rating || 5.0,
          bookings: [] // Will be populated separately
        };
      }
    });

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return {};
  }
}

// Fetch bookings for all events
export async function fetchBookings() {
  try {
    const data = await airtableRequest(`/${BOOKINGS_TABLE_ID}`);
    
    // Group bookings by event
    const bookingsByEvent = {};
    data.records.forEach(record => {
      const fields = record.fields;
      const eventIds = fields.Event; // This is a linked record field
      
      if (eventIds && eventIds.length > 0) {
        eventIds.forEach(eventId => {
          if (!bookingsByEvent[eventId]) {
            bookingsByEvent[eventId] = [];
          }
          
          bookingsByEvent[eventId].push({
            id: record.id,
            name: fields.Name || '',
            email: fields.Email || '',
            phone: fields.Phone || '',
            guests: fields.Guests || 1,
            notes: fields.Notes || '',
            bookedAt: fields['Booking Date'] || new Date().toISOString()
          });
        });
      }
    });

    return bookingsByEvent;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return {};
  }
}

// Create a new event in Airtable
export async function createEvent(eventData) {
  try {
    const response = await airtableRequest(`/${EVENTS_TABLE_ID}`, {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          Title: eventData.title,
          Date: eventData.date,
          Time: eventData.time,
          Location: eventData.location,
          Type: eventData.type,
          Description: eventData.description,
          Price: eventData.price,
          Capacity: eventData.capacity,
          Rating: eventData.rating || 5.0
        }
      })
    });

    return response.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// Update an existing event
export async function updateEvent(eventId, eventData) {
  try {
    await airtableRequest(`/${EVENTS_TABLE_ID}/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          Title: eventData.title,
          Time: eventData.time,
          Location: eventData.location,
          Type: eventData.type,
          Description: eventData.description,
          Price: eventData.price,
          Capacity: eventData.capacity,
          Rating: eventData.rating || 5.0
        }
      })
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

// Delete an event
export async function deleteEvent(eventId) {
  try {
    await airtableRequest(`/${EVENTS_TABLE_ID}/${eventId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

// Create a new booking
export async function createBooking(bookingData, eventId) {
  try {
    const response = await airtableRequest(`/${BOOKINGS_TABLE_ID}`, {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          Name: bookingData.name,
          Email: bookingData.email,
          Phone: bookingData.phone,
          Guests: bookingData.guests,
          Notes: bookingData.notes,
          Event: [eventId] // Link to the event record
        }
      })
    });

    return response.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Load all data (events + bookings combined)
export async function loadAllData() {
  try {
    const [events, bookingsByEvent] = await Promise.all([
      fetchEvents(),
      fetchBookings()
    ]);

    // Merge bookings into events
    Object.keys(events).forEach(date => {
      const event = events[date];
      if (event.id && bookingsByEvent[event.id]) {
        event.bookings = bookingsByEvent[event.id];
      } else {
        event.bookings = [];
      }
    });

    return events;
  } catch (error) {
    console.error('Error loading all data:', error);
    return {};
  }
}
