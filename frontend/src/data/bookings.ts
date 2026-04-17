
// Structura: { locationId: { dateString: { timeString: totalGuests } } }

export const bookingsDB: Record<string, Record<string, Record<string, number>>> = {};

//Mock data
bookingsDB["loc-1"] = {

};

export const MAX_CAPACITY = 50;

export const getBookedCount = (locId: string, date: string, time: string): number => {
  if (!bookingsDB[locId]) return 0;
  if (!bookingsDB[locId][date]) return 0;
  return bookingsDB[locId][date][time] || 0;
};

export const addBooking = (locId: string, date: string, time: string, guests: number): boolean => {
  const current = getBookedCount(locId, date, time);
  if (current + guests > MAX_CAPACITY) {
    return false;
  }

  if (!bookingsDB[locId]) bookingsDB[locId] = {};
  if (!bookingsDB[locId][date]) bookingsDB[locId][date] = {};

  bookingsDB[locId][date][time] = current + guests;
  return true;
};
