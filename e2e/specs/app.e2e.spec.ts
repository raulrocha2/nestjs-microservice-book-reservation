import {
  createNewReservation,
  getAllReservations,
  mockCreateReservation,
  mockUserLogin,
} from './mocks';

describe('App', () => {
  describe('reservations', () => {
    let userJWT: string;
    let reservationId: string;
    const mockReservation = mockCreateReservation();
    const mockUser = mockUserLogin();

    beforeAll(async () => {
      await fetch('http://auth:3001/users', {
        method: 'POST',
        body: JSON.stringify(mockUser),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const userLoginResponse = await fetch('http://auth:3001/auth/login', {
        method: 'POST',
        body: JSON.stringify(mockUser),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      userJWT = (await userLoginResponse.json()).token;
      const reservationResponse = await fetch(
        'http://reservations:3000/reservations',
        {
          method: 'POST',
          body: JSON.stringify(mockReservation),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userJWT}`,
          },
        },
      );
      reservationId = (await reservationResponse.json())._id;
    });
    it('should create a new reservation', async () => {
      const reservation = await createNewReservation(userJWT);
      expect(reservation._id).toBeDefined();
      expect(reservation.invoiceId).toBeDefined();
      expect(reservation.timestamp).toBeDefined();
      expect(reservation.startDate).toEqual(mockReservation.startDate);
      expect(reservation.endDate).toEqual(mockReservation.endDate);
    });
    it('should return all reservations', async () => {
      await createNewReservation(userJWT);
      const response = await fetch('http://reservations:3000/reservations', {
        headers: {
          Authorization: `Bearer ${userJWT}`,
        },
      });
      const reservations = await response.json();
      expect(response.status).toBe(200);
      expect(reservations.length).toBeGreaterThan(1);
      expect(reservations[0]._id).toBeDefined();
      expect(reservations[0].userId).toBeDefined();
      expect(reservations[0].invoiceId).toBeDefined();
      expect(reservations[0].timestamp).toBeDefined();
    });
    it('should return a reservation by id', async () => {
      const reservations = await getAllReservations(userJWT);
      const reservationResponse = await fetch(
        `http://reservations:3000/reservations/${reservations[0]._id}`,
        {
          headers: {
            Authorization: `Bearer ${userJWT}`,
          },
        },
      );
      const reservation = await reservationResponse.json();
      expect(reservationResponse.status).toBe(200);
      expect(reservation._id).toEqual(reservations[0]._id);
    });
    it('should update a reservation', async () => {
      const reservations = await getAllReservations(userJWT);
      const response = await fetch(
        `http://reservations:3000/reservations/${reservations[0]._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            endDate: '2027-04-05T11:00:00.000Z',
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userJWT}`,
          },
        },
      );
      const reservation = await response.json();
      expect(response.status).toBe(200);
      expect(reservation._id).toEqual(reservations[0]._id);
    });
    it('should delete a reservation', async () => {
      const reservations = await getAllReservations(userJWT);
      const response = await fetch(
        `http://reservations:3000/reservations/${reservations[0]._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userJWT}`,
          },
        },
      );
      expect(response.status).toBe(200);
    });
    it('should return a 404 if the reservation is not found', async () => {
      const response = await fetch(
        'http://reservations:3000/reservations/69d9bbb10a9475cc82b84d2d',
        {
          headers: {
            Authorization: `Bearer ${userJWT}`,
          },
        },
      );
      expect(response.status).toBe(404);
    });
    it('should return a 403 if the user is not authenticated', async () => {
      const response = await fetch('http://reservations:3000/reservations', {
        headers: {
          Authorization: `Bearer invalid-token`,
        },
      });
      expect(response.status).toBe(403);
    });
  });
});
