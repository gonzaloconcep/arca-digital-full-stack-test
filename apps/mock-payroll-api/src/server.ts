import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.MOCK_PAYROLL_PORT || 3002;

// Mock employee data per company
const mockEmployees: Record<string, PayrollEmployee[]> = {
  // TechStartup SL employees (will be matched by any companyId in tests)
  default: [
    {
      email: 'new.employee1@external.com',
      firstName: 'Roberto',
      lastName: 'Díaz',
      nif: '45678901D',
      birthDate: '1992-04-10',
      salary: 4500000, // 45,000€ in cents
    },
    {
      email: 'new.employee2@external.com',
      firstName: 'Elena',
      lastName: 'Torres',
      nif: '56789012E',
      birthDate: '1988-09-25',
      salary: 5200000,
    },
    {
      email: 'new.employee3@external.com',
      firstName: 'Miguel',
      lastName: 'Ruiz',
      nif: '67890123F',
      birthDate: '1995-01-30',
      salary: 3800000,
    },
    {
      email: 'ana.garcia@techstartup.com', // Existing - should update
      firstName: 'Ana María', // Name changed
      lastName: 'García Pérez',
      nif: '12345678A',
      birthDate: '1990-03-15',
      salary: 5500000,
    },
    {
      email: 'invalid.nif@external.com',
      firstName: 'Test',
      lastName: 'Invalid',
      nif: 'INVALID', // Invalid NIF - should be caught by validation
      birthDate: '1990-01-01',
      salary: 4000000,
    },
    {
      email: 'new.employee4@external.com',
      firstName: 'Carmen',
      lastName: 'Vega',
      nif: '78901234G',
      birthDate: '1991-06-18',
      salary: 4800000,
    },
    {
      email: '', // Invalid - empty email
      firstName: 'Empty',
      lastName: 'Email',
      nif: '89012345H',
      birthDate: '1993-12-05',
      salary: 4200000,
    },
    {
      email: 'new.employee5@external.com',
      firstName: 'Jorge',
      lastName: 'Moreno',
      nif: '90123456I',
      birthDate: '1987-08-14',
      salary: 6000000,
    },
    {
      email: 'new.employee6@external.com',
      firstName: 'Patricia',
      lastName: 'Navarro',
      nif: '01234567J',
      birthDate: '1994-02-28',
      salary: 4100000,
    },
    {
      email: 'new.employee7@external.com',
      firstName: 'Andrés',
      lastName: 'Gil',
      nif: '11234567K',
      birthDate: '1989-11-11',
      salary: 5300000,
    },
  ],
};

interface PayrollEmployee {
  email: string;
  firstName: string;
  lastName: string;
  nif: string;
  birthDate: string;
  salary: number;
}

// Simulate random failures
function shouldTimeout(): boolean {
  return Math.random() < 0.1; // 10% timeout
}

function shouldError500(): boolean {
  return Math.random() < 0.05; // 5% server error
}

// Endpoint to get employees
app.get('/api/employees', async (req: Request, res: Response) => {
  const companyId = req.query.companyId as string;

  console.log(`[Mock Payroll] Request for companyId: ${companyId}`);

  // Simulate timeout (10%)
  if (shouldTimeout()) {
    console.log('[Mock Payroll] Simulating timeout...');
    await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 second delay
    return res.status(504).json({ error: 'Gateway Timeout' });
  }

  // Simulate 500 error (5%)
  if (shouldError500()) {
    console.log('[Mock Payroll] Simulating 500 error');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Return employees
  const employees = mockEmployees.default;
  console.log(`[Mock Payroll] Returning ${employees.length} employees`);

  res.json({
    companyId,
    employees,
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'mock-payroll-api' });
});

app.listen(PORT, () => {
  console.log(`Mock Payroll API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET /api/employees?companyId=xxx`);
  console.log(`  GET /health`);
  console.log('');
  console.log('Simulated errors:');
  console.log('  - 10% timeout (10s delay + 504)');
  console.log('  - 5% server error (500)');
  console.log('  - 2 employees with invalid data');
});
