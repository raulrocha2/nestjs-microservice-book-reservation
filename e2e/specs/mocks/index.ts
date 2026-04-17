export function mockUserLogin() {
  return {
    email: 'teste2e@gmail.com',
    password: 'SenhaDaora@123!',
  };
}

export function mockCreateReservation() {
  return {
    startDate: '2026-04-01T14:00:00.000Z',
    endDate: '2027-06-05T11:00:00.000Z',
    charge: {
      amount: '55.00',
      card: {
        cvc: '120',
        exp_month: 12,
        exp_year: 2027,
        number: '4242424242424242',
        token: 'tok_visa',
      },
    },
  };
}

export async function createNewReservation(userJWT: string) {
  const response = await fetch('http://reservations:3000/reservations', {
    method: 'POST',
    body: JSON.stringify(mockCreateReservation()),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userJWT}`,
    },
  });
  return response.json();
}
export async function getAllReservations(userJWT: string) {
  const response = await fetch('http://reservations:3000/reservations', {
    headers: {
      Authorization: `Bearer ${userJWT}`,
    },
  });
  return response.json();
}
