import { ping } from 'tcp-ping';
describe('Health Check', () => {
  describe('Auth Service', () => {
    test('should return 200', async () => {
      const result = await fetch('http://auth:3001/auth/health-check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await result.json();
      expect(body).toEqual({ status: 'ok' });
      expect(result.status).toBe(200);
    });
  });

  describe('Reservations Service', () => {
    test('should return 200', async () => {
      const result = await fetch(
        'http://reservations:3000/reservations/health-check',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const body = await result.json();
      expect(body).toEqual({ status: 'ok' });
      expect(result.status).toBe(200);
    });
  });
  describe('Payments Service', () => {
    test('should return true', (done) => {
      ping({ address: 'payments', port: 3003 }, function (err, data) {
        if (err) {
          fail(err);
        }
        done();
      });
    });
  });
  describe('Notifications Service', () => {
    test('should return true', (done) => {
      ping({ address: 'notifications', port: 3004 }, function (err, data) {
        if (err) {
          fail(err);
        }
        done();
      });
    });
  });
});
