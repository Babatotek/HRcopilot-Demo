// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED DEMO DATA  –  single source of truth for all HR360 modules
// Every module imports from here so numbers stay consistent across the app.
// ─────────────────────────────────────────────────────────────────────────────

// ── BRANCHES ─────────────────────────────────────────────────────────────────
export const DEMO_BRANCHES = [
  { id: 'B1', code: 'HQ-ABJ', name: 'Abuja Head Office', type: 'HQ',      status: 'Active',   city: 'Abuja',   country: 'Nigeria', timezone: 'Africa/Lagos', is_hq: true,  manager_name: 'Alex Rivera',    employee_count: 10, device_count: 4, latitude: 9.0579,  longitude: 7.4951,  attendance_today: { present: 9, late: 1, absent: 1 }, image: 'https://picsum.photos/seed/abj/400/200' },
  { id: 'B2', code: 'REG-LAG', name: 'Lagos Regional',   type: 'Regional', status: 'Active',   city: 'Lagos',   country: 'Nigeria', timezone: 'Africa/Lagos', is_hq: false, manager_name: 'Sarah Mitchell', employee_count: 5,  device_count: 3, latitude: 6.5244,  longitude: 3.3792,  attendance_today: { present: 4, late: 2, absent: 0 }, image: 'https://picsum.photos/seed/lag/400/200' },
  { id: 'B3', code: 'SAT-PHC', name: 'Port Harcourt',    type: 'Satellite',status: 'Active',   city: 'PH City', country: 'Nigeria', timezone: 'Africa/Lagos', is_hq: false, manager_name: 'Ethan Parker',   employee_count: 2,  device_count: 2, latitude: 4.8156,  longitude: 7.0498,  attendance_today: { present: 2, late: 0, absent: 0 }, image: 'https://picsum.photos/seed/phc/400/200' },
  { id: 'B4', code: 'VRT-RMT', name: 'Remote / Virtual', type: 'Virtual',  status: 'Active',   city: 'Global',  country: 'Remote',  timezone: 'UTC',          is_hq: false, manager_name: 'Emily Johnson',  employee_count: 3,  device_count: 0, latitude: 0,       longitude: 0,       attendance_today: { present: 3, late: 0, absent: 0 }, image: 'https://picsum.photos/seed/rmt/400/200' },
];

// ── EMPLOYEES ─────────────────────────────────────────────────────────────────
// 20 employees – referenced by id across Payroll, Attendance, Leave, Performance, Engagement
export const DEMO_EMPLOYEES = [
  { id: 'E01', name: 'Kelly Robinson',   position: 'Marketing Lead',        department: 'Marketing',   branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e1',  bloodGroup: 'B+',  genotype: 'AA', academics: 'MBA Marketing, Yale University',        baseSalary: 650000, performanceScore: 94 },
  { id: 'E02', name: 'Robert Davis',     position: 'Software Engineer',     department: 'Engineering', branch: 'Abuja Head Office', branchId: 'B1', employment: 'Contract',  status: 'Probation', avatar: 'https://picsum.photos/120/120?sig=e2',  bloodGroup: 'O+',  genotype: 'AS', academics: 'MSc Computer Science, MIT',             baseSalary: 580000, performanceScore: 78 },
  { id: 'E03', name: 'Amanda Ward',      position: 'HR Specialist',         department: 'HR',          branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e3',  bloodGroup: 'A+',  genotype: 'AA', academics: 'BSc Human Resources, Stanford',         baseSalary: 520000, performanceScore: 92 },
  { id: 'E04', name: 'John Smith',       position: 'Sales Associate',       department: 'Sales',       branch: 'Lagos Regional',    branchId: 'B2', employment: 'Full-Time', status: 'On Leave',  avatar: 'https://picsum.photos/120/120?sig=e4',  bloodGroup: 'AB-', genotype: 'AC', academics: 'BBA, University of Chicago',            baseSalary: 420000, performanceScore: 71 },
  { id: 'E05', name: 'Douglas Baker',    position: 'UX Designer',           department: 'Product',     branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e5',  bloodGroup: 'O-',  genotype: 'AA', academics: 'BFA Graphic Design, RISD',              baseSalary: 490000, performanceScore: 83 },
  { id: 'E06', name: 'Sarah Mitchell',   position: 'Account Manager',       department: 'Sales',       branch: 'Lagos Regional',    branchId: 'B2', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e6',  bloodGroup: 'B-',  genotype: 'AA', academics: 'MBA, Harvard Business School',          baseSalary: 560000, performanceScore: 88 },
  { id: 'E07', name: 'Michael Carter',   position: 'Data Analyst',          department: 'Engineering', branch: 'Remote / Virtual',  branchId: 'B4', employment: 'Part-Time', status: 'Remote',    avatar: 'https://picsum.photos/120/120?sig=e7',  bloodGroup: 'A-',  genotype: 'AS', academics: 'BSc Data Science, Berkeley',            baseSalary: 380000, performanceScore: 80 },
  { id: 'E08', name: 'Ethan Parker',     position: 'Branch Manager',        department: 'Operations',  branch: 'Port Harcourt',     branchId: 'B3', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e8',  bloodGroup: 'B+',  genotype: 'AA', academics: 'MBA Operations, Wharton',               baseSalary: 720000, performanceScore: 87 },
  { id: 'E09', name: 'Emily Johnson',    position: 'Remote Team Lead',      department: 'Engineering', branch: 'Remote / Virtual',  branchId: 'B4', employment: 'Full-Time', status: 'Remote',    avatar: 'https://picsum.photos/120/120?sig=e9',  bloodGroup: 'O+',  genotype: 'AA', academics: 'MSc Software Engineering, CMU',         baseSalary: 610000, performanceScore: 91 },
  { id: 'E10', name: 'James Okafor',     position: 'Sales Manager',         department: 'Sales',       branch: 'Lagos Regional',    branchId: 'B2', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e10', bloodGroup: 'A+',  genotype: 'AA', academics: 'BSc Business Admin, UNILAG',            baseSalary: 590000, performanceScore: 85 },
  { id: 'E11', name: 'Fatima Bello',     position: 'Finance Analyst',       department: 'Finance',     branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e11', bloodGroup: 'B+',  genotype: 'AA', academics: 'BSc Accounting, ABU Zaria',             baseSalary: 510000, performanceScore: 89 },
  { id: 'E12', name: 'Chidi Nwosu',      position: 'DevOps Engineer',       department: 'Engineering', branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e12', bloodGroup: 'O+',  genotype: 'AS', academics: 'BSc Computer Engineering, UNN',         baseSalary: 620000, performanceScore: 86 },
  { id: 'E13', name: 'Ngozi Adeyemi',    position: 'HR Manager',            department: 'HR',          branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e13', bloodGroup: 'A+',  genotype: 'AA', academics: 'MSc HRM, University of Lagos',          baseSalary: 680000, performanceScore: 93 },
  { id: 'E14', name: 'Tunde Adebayo',    position: 'Procurement Officer',   department: 'Procurement', branch: 'Lagos Regional',    branchId: 'B2', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e14', bloodGroup: 'B-',  genotype: 'AA', academics: 'BSc Supply Chain, OAU',                baseSalary: 450000, performanceScore: 76 },
  { id: 'E15', name: 'Amaka Eze',        position: 'Customer Success',      department: 'Sales',       branch: 'Port Harcourt',     branchId: 'B3', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e15', bloodGroup: 'O+',  genotype: 'AA', academics: 'BSc Marketing, UNIPORT',               baseSalary: 400000, performanceScore: 82 },
  { id: 'E16', name: 'Brian Clark',      position: 'Product Manager',       department: 'Product',     branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e16', bloodGroup: 'A-',  genotype: 'AA', academics: 'MBA Product, Stanford GSB',             baseSalary: 700000, performanceScore: 90 },
  { id: 'E17', name: 'Lisa Martin',      position: 'QA Engineer',           department: 'Engineering', branch: 'Remote / Virtual',  branchId: 'B4', employment: 'Contract',  status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e17', bloodGroup: 'B+',  genotype: 'AS', academics: 'BSc Computer Science, FUTA',            baseSalary: 430000, performanceScore: 79 },
  { id: 'E18', name: 'Daniel Osei',      position: 'Finance Manager',       department: 'Finance',     branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e18', bloodGroup: 'O-',  genotype: 'AA', academics: 'MBA Finance, Lagos Business School',    baseSalary: 750000, performanceScore: 91 },
  { id: 'E19', name: 'Sofia Mensah',     position: 'Graphic Designer',      department: 'Marketing',   branch: 'Lagos Regional',    branchId: 'B2', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e19', bloodGroup: 'A+',  genotype: 'AA', academics: 'BFA Visual Arts, UNILAG',              baseSalary: 390000, performanceScore: 84 },
  { id: 'E20', name: 'Alex Rivera',      position: 'CEO',                   department: 'Executive',   branch: 'Abuja Head Office', branchId: 'B1', employment: 'Full-Time', status: 'Active',    avatar: 'https://picsum.photos/120/120?sig=e20', bloodGroup: 'B+',  genotype: 'AA', academics: 'MBA, Harvard Business School',          baseSalary: 1200000, performanceScore: 96 },
];

// ── ATTENDANCE RECORDS ────────────────────────────────────────────────────────
// Today = Apr 11 2026. Last 7 days of records for key employees.
export const DEMO_ATTENDANCE = [
  { id: 'A001', employeeId: 'E01', employeeName: 'Kelly Robinson',  avatar: 'https://picsum.photos/120/120?sig=e1',  department: 'Marketing',   date: '2026-04-11', firstIn: '08:52', lastOut: '17:10', totalHours: 8.3,  lateMins: 0,  otMins: 10, status: 'PRESENT', source: 'BIOMETRIC', branch: 'Abuja Head Office' },
  { id: 'A002', employeeId: 'E02', employeeName: 'Robert Davis',    avatar: 'https://picsum.photos/120/120?sig=e2',  department: 'Engineering', date: '2026-04-11', firstIn: '09:22', lastOut: '17:05', totalHours: 7.7,  lateMins: 22, otMins: 0,  status: 'LATE',    source: 'APP',       branch: 'Abuja Head Office' },
  { id: 'A003', employeeId: 'E03', employeeName: 'Amanda Ward',     avatar: 'https://picsum.photos/120/120?sig=e3',  department: 'HR',          date: '2026-04-11', firstIn: '08:58', lastOut: '17:00', totalHours: 8.0,  lateMins: 0,  otMins: 0,  status: 'PRESENT', source: 'BIOMETRIC', branch: 'Abuja Head Office' },
  { id: 'A004', employeeId: 'E04', employeeName: 'John Smith',      avatar: 'https://picsum.photos/120/120?sig=e4',  department: 'Sales',       date: '2026-04-11', firstIn: null,    lastOut: null,    totalHours: 0,    lateMins: 0,  otMins: 0,  status: 'ON_LEAVE', source: 'APP',       branch: 'Lagos Regional' },
  { id: 'A005', employeeId: 'E05', employeeName: 'Douglas Baker',   avatar: 'https://picsum.photos/120/120?sig=e5',  department: 'Product',     date: '2026-04-11', firstIn: '09:01', lastOut: '18:30', totalHours: 9.5,  lateMins: 0,  otMins: 90, status: 'PRESENT', source: 'BIOMETRIC', branch: 'Abuja Head Office' },
  { id: 'A006', employeeId: 'E06', employeeName: 'Sarah Mitchell',  avatar: 'https://picsum.photos/120/120?sig=e6',  department: 'Sales',       date: '2026-04-11', firstIn: '09:35', lastOut: '17:00', totalHours: 7.4,  lateMins: 35, otMins: 0,  status: 'LATE',    source: 'APP',       branch: 'Lagos Regional' },
  { id: 'A007', employeeId: 'E07', employeeName: 'Michael Carter',  avatar: 'https://picsum.photos/120/120?sig=e7',  department: 'Engineering', date: '2026-04-11', firstIn: '09:00', lastOut: '13:00', totalHours: 4.0,  lateMins: 0,  otMins: 0,  status: 'HALF_DAY', source: 'APP',       branch: 'Remote / Virtual' },
  { id: 'A008', employeeId: 'E08', employeeName: 'Ethan Parker',    avatar: 'https://picsum.photos/120/120?sig=e8',  department: 'Operations',  date: '2026-04-11', firstIn: '08:45', lastOut: '17:15', totalHours: 8.5,  lateMins: 0,  otMins: 15, status: 'PRESENT', source: 'BIOMETRIC', branch: 'Port Harcourt' },
  { id: 'A009', employeeId: 'E09', employeeName: 'Emily Johnson',   avatar: 'https://picsum.photos/120/120?sig=e9',  department: 'Engineering', date: '2026-04-11', firstIn: '09:00', lastOut: '17:00', totalHours: 8.0,  lateMins: 0,  otMins: 0,  status: 'PRESENT', source: 'APP',       branch: 'Remote / Virtual' },
  { id: 'A010', employeeId: 'E10', employeeName: 'James Okafor',    avatar: 'https://picsum.photos/120/120?sig=e10', department: 'Sales',       date: '2026-04-11', firstIn: '08:55', lastOut: '17:00', totalHours: 8.1,  lateMins: 0,  otMins: 0,  status: 'PRESENT', source: 'BIOMETRIC', branch: 'Lagos Regional' },
  { id: 'A011', employeeId: 'E11', employeeName: 'Fatima Bello',    avatar: 'https://picsum.photos/120/120?sig=e11', department: 'Finance',     date: '2026-04-11', firstIn: '09:00', lastOut: '17:00', totalHours: 8.0,  lateMins: 0,  otMins: 0,  status: 'PRESENT', source: 'BIOMETRIC', branch: 'Abuja Head Office' },
  { id: 'A012', employeeId: 'E12', employeeName: 'Chidi Nwosu',     avatar: 'https://picsum.photos/120/120?sig=e12', department: 'Engineering', date: '2026-04-11', firstIn: null,    lastOut: null,    totalHours: 0,    lateMins: 0,  otMins: 0,  status: 'ABSENT',  source: 'BIOMETRIC', branch: 'Abuja Head Office' },
  { id: 'A013', employeeId: 'E13', employeeName: 'Ngozi Adeyemi',   avatar: 'https://picsum.photos/120/120?sig=e13', department: 'HR',          date: '2026-04-11', firstIn: '08:50', lastOut: '17:00', totalHours: 8.2,  lateMins: 0,  otMins: 0,  status: 'PRESENT', source: 'BIOMETRIC', branch: 'Abuja Head Office' },
  { id: 'A014', employeeId: 'E14', employeeName: 'Tunde Adebayo',   avatar: 'https://picsum.photos/120/120?sig=e14', department: 'Procurement', date: '2026-04-11', firstIn: '09:18', lastOut: '17:00', totalHours: 7.7,  lateMins: 18, otMins: 0,  status: 'LATE',    source: 'APP',       branch: 'Lagos Regional' },
  { id: 'A015', employeeId: 'E15', employeeName: 'Amaka Eze',       avatar: 'https://picsum.photos/120/120?sig=e15', department: 'Sales',       date: '2026-04-11', firstIn: '09:00', lastOut: '17:00', totalHours: 8.0,  lateMins: 0,  otMins: 0,  status: 'PRESENT', source: 'BIOMETRIC', branch: 'Port Harcourt' },
  { id: 'A016', employeeId: 'E16', employeeName: 'Brian Clark',     avatar: 'https://picsum.photos/120/120?sig=e16', department: 'Product',     date: '2026-04-11', firstIn: '08:40', lastOut: '19:00', totalHours: 10.3, lateMins: 0,  otMins: 120,status: 'PRESENT', source: 'BIOMETRIC', branch: 'Abuja Head Office' },
  { id: 'A017', employeeId: 'E17', employeeName: 'Lisa Martin',     avatar: 'https://picsum.photos/120/120?sig=e17', department: 'Engineering', date: '2026-04-11', firstIn: '09:00', lastOut: '17:00', totalHours: 8.0,  lateMins: 0,  otMins: 0,  status: 'PRESENT', source: 'APP',       branch: 'Remote / Virtual' },
  { id: 'A018', employeeId: 'E18', employeeName: 'Daniel Osei',     avatar: 'https://picsum.photos/120/120?sig=e18', department: 'Finance',     date: '2026-04-11', firstIn: '08:48', lastOut: '17:30', totalHours: 8.7,  lateMins: 0,  otMins: 30, status: 'PRESENT', source: 'BIOMETRIC', branch: 'Abuja Head Office' },
  { id: 'A019', employeeId: 'E19', employeeName: 'Sofia Mensah',    avatar: 'https://picsum.photos/120/120?sig=e19', department: 'Marketing',   date: '2026-04-11', firstIn: '09:05', lastOut: '17:00', totalHours: 7.9,  lateMins: 5,  otMins: 0,  status: 'PRESENT', source: 'APP',       branch: 'Lagos Regional' },
  { id: 'A020', employeeId: 'E20', employeeName: 'Alex Rivera',     avatar: 'https://picsum.photos/120/120?sig=e20', department: 'Executive',   date: '2026-04-11', firstIn: '08:30', lastOut: '19:30', totalHours: 11.0, lateMins: 0,  otMins: 150,status: 'PRESENT', source: 'BIOMETRIC', branch: 'Abuja Head Office' },
];

// Weekly trend (last 7 days) – used by Attendance dashboard charts
export const DEMO_ATTENDANCE_TREND = [
  { day: 'Apr 5',  present: 274, late: 18, absent: 18 },
  { day: 'Apr 6',  present: 268, late: 22, absent: 20 },
  { day: 'Apr 7',  present: 271, late: 15, absent: 24 },
  { day: 'Apr 8',  present: 265, late: 25, absent: 20 },
  { day: 'Apr 9',  present: 278, late: 12, absent: 20 },
  { day: 'Apr 10', present: 270, late: 20, absent: 20 },
  { day: 'Apr 11', present: 274, late: 25, absent: 11 },
];

// ── LEAVE REQUESTS ────────────────────────────────────────────────────────────
export const DEMO_LEAVE_REQUESTS = [
  { id: 'L001', employeeId: 'E01', employeeName: 'Kelly Robinson',  avatar: 'https://picsum.photos/120/120?sig=e1',  department: 'Marketing',   type: 'Annual Leave',    startDate: '2026-04-20', endDate: '2026-04-25', days: 6,  reason: 'Family vacation',              status: 'PENDING',  appliedOn: '2026-04-08' },
  { id: 'L002', employeeId: 'E03', employeeName: 'Amanda Ward',     avatar: 'https://picsum.photos/120/120?sig=e3',  department: 'HR',          type: 'Sick Leave',      startDate: '2026-04-18', endDate: '2026-04-19', days: 2,  reason: 'Medical appointment',          status: 'PENDING',  appliedOn: '2026-04-10' },
  { id: 'L003', employeeId: 'E02', employeeName: 'Robert Davis',    avatar: 'https://picsum.photos/120/120?sig=e2',  department: 'Engineering', type: 'Casual Leave',    startDate: '2026-05-02', endDate: '2026-05-05', days: 4,  reason: 'Personal errands',             status: 'PENDING',  appliedOn: '2026-04-09' },
  { id: 'L004', employeeId: 'E07', employeeName: 'Michael Carter',  avatar: 'https://picsum.photos/120/120?sig=e7',  department: 'Engineering', type: 'Maternity',       startDate: '2026-06-10', endDate: '2026-09-10', days: 92, reason: 'Maternity leave',              status: 'PENDING',  appliedOn: '2026-04-05' },
  { id: 'L005', employeeId: 'E06', employeeName: 'Sarah Mitchell',  avatar: 'https://picsum.photos/120/120?sig=e6',  department: 'Sales',       type: 'Annual Leave',    startDate: '2026-04-28', endDate: '2026-05-02', days: 5,  reason: 'Rest and recuperation',        status: 'PENDING',  appliedOn: '2026-04-07' },
  { id: 'L006', employeeId: 'E04', employeeName: 'John Smith',      avatar: 'https://picsum.photos/120/120?sig=e4',  department: 'Sales',       type: 'Annual Leave',    startDate: '2026-04-07', endDate: '2026-04-14', days: 8,  reason: 'Annual leave',                 status: 'APPROVED', appliedOn: '2026-03-28' },
  { id: 'L007', employeeId: 'E10', employeeName: 'James Okafor',    avatar: 'https://picsum.photos/120/120?sig=e10', department: 'Sales',       type: 'Sick Leave',      startDate: '2026-04-01', endDate: '2026-04-02', days: 2,  reason: 'Flu',                          status: 'APPROVED', appliedOn: '2026-04-01' },
  { id: 'L008', employeeId: 'E15', employeeName: 'Amaka Eze',       avatar: 'https://picsum.photos/120/120?sig=e15', department: 'Sales',       type: 'Casual Leave',    startDate: '2026-04-03', endDate: '2026-04-03', days: 1,  reason: 'Personal',                     status: 'APPROVED', appliedOn: '2026-04-02' },
  { id: 'L009', employeeId: 'E14', employeeName: 'Tunde Adebayo',   avatar: 'https://picsum.photos/120/120?sig=e14', department: 'Procurement', type: 'Annual Leave',    startDate: '2026-03-15', endDate: '2026-03-20', days: 6,  reason: 'Travel',                       status: 'APPROVED', appliedOn: '2026-03-10' },
  { id: 'L010', employeeId: 'E19', employeeName: 'Sofia Mensah',    avatar: 'https://picsum.photos/120/120?sig=e19', department: 'Marketing',   type: 'Sick Leave',      startDate: '2026-04-09', endDate: '2026-04-09', days: 1,  reason: 'Not feeling well',             status: 'REJECTED', appliedOn: '2026-04-09' },
  { id: 'L011', employeeId: 'E12', employeeName: 'Chidi Nwosu',     avatar: 'https://picsum.photos/120/120?sig=e12', department: 'Engineering', type: 'Casual Leave',    startDate: '2026-04-11', endDate: '2026-04-11', days: 1,  reason: 'Emergency',                    status: 'REJECTED', appliedOn: '2026-04-11' },
  { id: 'L012', employeeId: 'E16', employeeName: 'Brian Clark',     avatar: 'https://picsum.photos/120/120?sig=e16', department: 'Product',     type: 'Annual Leave',    startDate: '2026-04-22', endDate: '2026-04-24', days: 3,  reason: 'Short break',                  status: 'PENDING',  appliedOn: '2026-04-10' },
];

// Leave balances per employee (Annual, Sick, Casual, Maternity)
export const DEMO_LEAVE_BALANCES = [
  { employeeId: 'E01', employeeName: 'Kelly Robinson',  annual: { total: 20, used: 8,  remaining: 12 }, sick: { total: 10, used: 2, remaining: 8 }, casual: { total: 5, used: 1, remaining: 4 } },
  { employeeId: 'E02', employeeName: 'Robert Davis',    annual: { total: 20, used: 4,  remaining: 16 }, sick: { total: 10, used: 0, remaining: 10 }, casual: { total: 5, used: 0, remaining: 5 } },
  { employeeId: 'E03', employeeName: 'Amanda Ward',     annual: { total: 20, used: 6,  remaining: 14 }, sick: { total: 10, used: 3, remaining: 7 }, casual: { total: 5, used: 2, remaining: 3 } },
  { employeeId: 'E04', employeeName: 'John Smith',      annual: { total: 20, used: 11, remaining: 9  }, sick: { total: 10, used: 1, remaining: 9 }, casual: { total: 5, used: 0, remaining: 5 } },
  { employeeId: 'E05', employeeName: 'Douglas Baker',   annual: { total: 20, used: 3,  remaining: 17 }, sick: { total: 10, used: 0, remaining: 10 }, casual: { total: 5, used: 1, remaining: 4 } },
  { employeeId: 'E06', employeeName: 'Sarah Mitchell',  annual: { total: 20, used: 9,  remaining: 11 }, sick: { total: 10, used: 2, remaining: 8 }, casual: { total: 5, used: 0, remaining: 5 } },
  { employeeId: 'E10', employeeName: 'James Okafor',    annual: { total: 20, used: 5,  remaining: 15 }, sick: { total: 10, used: 2, remaining: 8 }, casual: { total: 5, used: 1, remaining: 4 } },
  { employeeId: 'E13', employeeName: 'Ngozi Adeyemi',   annual: { total: 20, used: 7,  remaining: 13 }, sick: { total: 10, used: 1, remaining: 9 }, casual: { total: 5, used: 2, remaining: 3 } },
  { employeeId: 'E16', employeeName: 'Brian Clark',     annual: { total: 20, used: 3,  remaining: 17 }, sick: { total: 10, used: 0, remaining: 10 }, casual: { total: 5, used: 0, remaining: 5 } },
  { employeeId: 'E18', employeeName: 'Daniel Osei',     annual: { total: 20, used: 2,  remaining: 18 }, sick: { total: 10, used: 0, remaining: 10 }, casual: { total: 5, used: 0, remaining: 5 } },
];

// ── PAYROLL ───────────────────────────────────────────────────────────────────
export const DEMO_PAYROLL_PERIODS = [
  { id: 'PP01', name: 'March 2026',   startDate: '2026-03-01', endDate: '2026-03-31', status: 'CLOSED' },
  { id: 'PP02', name: 'April 2026',   startDate: '2026-04-01', endDate: '2026-04-30', status: 'OPEN' },
  { id: 'PP03', name: 'February 2026',startDate: '2026-02-01', endDate: '2026-02-28', status: 'CLOSED' },
];

export const DEMO_PAYROLL_RUNS = [
  { id: 'PR01', periodId: 'PP01', periodName: 'March 2026',    status: 'PAID',         branchScope: 'All Branches', deptScope: 'All Departments', totalGross: 11480000, totalNet: 9650000, anomalyCount: 2, submittedBy: 'Ngozi Adeyemi', submittedAt: '2026-03-28' },
  { id: 'PR02', periodId: 'PP02', periodName: 'April 2026',    status: 'UNDER_REVIEW', branchScope: 'All Branches', deptScope: 'All Departments', totalGross: 11480000, totalNet: 9650000, anomalyCount: 3, submittedBy: 'Ngozi Adeyemi', submittedAt: '2026-04-10' },
  { id: 'PR03', periodId: 'PP03', periodName: 'February 2026', status: 'PAID',         branchScope: 'All Branches', deptScope: 'All Departments', totalGross: 11200000, totalNet: 9420000, anomalyCount: 1, submittedBy: 'Ngozi Adeyemi', submittedAt: '2026-02-26' },
];

// Payroll lines – one per employee for April 2026 run
export const DEMO_PAYROLL_LINES = [
  { id: 'PL01', employeeId: 'E01', employeeName: 'Kelly Robinson',  avatar: 'https://picsum.photos/120/120?sig=e1',  department: 'Marketing',   branch: 'Abuja Head Office', baseSalary: 650000, allowances: 97500,  deductions: 65000,  latePenalty: 0,     overtimePay: 5417,   performanceBonus: 65000,  grossPay: 817917,  netPay: 687450,  variance: 12000,  hasAnomalies: false, isOnHold: false },
  { id: 'PL02', employeeId: 'E02', employeeName: 'Robert Davis',    avatar: 'https://picsum.photos/120/120?sig=e2',  department: 'Engineering', branch: 'Abuja Head Office', baseSalary: 580000, allowances: 87000,  deductions: 58000,  latePenalty: 2200,  overtimePay: 0,      performanceBonus: 0,      grossPay: 667000,  netPay: 606800,  variance: -2200,  hasAnomalies: true,  isOnHold: false },
  { id: 'PL03', employeeId: 'E03', employeeName: 'Amanda Ward',     avatar: 'https://picsum.photos/120/120?sig=e3',  department: 'HR',          branch: 'Abuja Head Office', baseSalary: 520000, allowances: 78000,  deductions: 52000,  latePenalty: 0,     overtimePay: 0,      performanceBonus: 47840,  grossPay: 645840,  netPay: 593840,  variance: 5000,   hasAnomalies: false, isOnHold: false },
  { id: 'PL04', employeeId: 'E04', employeeName: 'John Smith',      avatar: 'https://picsum.photos/120/120?sig=e4',  department: 'Sales',       branch: 'Lagos Regional',    baseSalary: 420000, allowances: 63000,  deductions: 42000,  latePenalty: 0,     overtimePay: 0,      performanceBonus: 0,      grossPay: 483000,  netPay: 441000,  variance: 0,      hasAnomalies: false, isOnHold: true  },
  { id: 'PL05', employeeId: 'E05', employeeName: 'Douglas Baker',   avatar: 'https://picsum.photos/120/120?sig=e5',  department: 'Product',     branch: 'Abuja Head Office', baseSalary: 490000, allowances: 73500,  deductions: 49000,  latePenalty: 0,     overtimePay: 30625,  performanceBonus: 20000,  grossPay: 614125,  netPay: 565125,  variance: 8000,   hasAnomalies: false, isOnHold: false },
  { id: 'PL06', employeeId: 'E06', employeeName: 'Sarah Mitchell',  avatar: 'https://picsum.photos/120/120?sig=e6',  department: 'Sales',       branch: 'Lagos Regional',    baseSalary: 560000, allowances: 84000,  deductions: 56000,  latePenalty: 3500,  overtimePay: 0,      performanceBonus: 25000,  grossPay: 669000,  netPay: 609500,  variance: -3500,  hasAnomalies: true,  isOnHold: false },
  { id: 'PL07', employeeId: 'E08', employeeName: 'Ethan Parker',    avatar: 'https://picsum.photos/120/120?sig=e8',  department: 'Operations',  branch: 'Port Harcourt',     baseSalary: 720000, allowances: 108000, deductions: 72000,  latePenalty: 0,     overtimePay: 7500,   performanceBonus: 30000,  grossPay: 865500,  netPay: 793500,  variance: 7500,   hasAnomalies: false, isOnHold: false },
  { id: 'PL08', employeeId: 'E09', employeeName: 'Emily Johnson',   avatar: 'https://picsum.photos/120/120?sig=e9',  department: 'Engineering', branch: 'Remote / Virtual',  baseSalary: 610000, allowances: 91500,  deductions: 61000,  latePenalty: 0,     overtimePay: 0,      performanceBonus: 55000,  grossPay: 756500,  netPay: 695500,  variance: 10000,  hasAnomalies: false, isOnHold: false },
  { id: 'PL09', employeeId: 'E10', employeeName: 'James Okafor',    avatar: 'https://picsum.photos/120/120?sig=e10', department: 'Sales',       branch: 'Lagos Regional',    baseSalary: 590000, allowances: 88500,  deductions: 59000,  latePenalty: 0,     overtimePay: 0,      performanceBonus: 30000,  grossPay: 708500,  netPay: 649500,  variance: 5000,   hasAnomalies: false, isOnHold: false },
  { id: 'PL10', employeeId: 'E11', employeeName: 'Fatima Bello',    avatar: 'https://picsum.photos/120/120?sig=e11', department: 'Finance',     branch: 'Abuja Head Office', baseSalary: 510000, allowances: 76500,  deductions: 51000,  latePenalty: 0,     overtimePay: 0,      performanceBonus: 45000,  grossPay: 631500,  netPay: 580500,  variance: 6000,   hasAnomalies: false, isOnHold: false },
  { id: 'PL11', employeeId: 'E12', employeeName: 'Chidi Nwosu',     avatar: 'https://picsum.photos/120/120?sig=e12', department: 'Engineering', branch: 'Abuja Head Office', baseSalary: 620000, allowances: 93000,  deductions: 62000,  latePenalty: 0,     overtimePay: 0,      performanceBonus: 40000,  grossPay: 753000,  netPay: 691000,  variance: 4000,   hasAnomalies: true,  isOnHold: false },
  { id: 'PL12', employeeId: 'E13', employeeName: 'Ngozi Adeyemi',   avatar: 'https://picsum.photos/120/120?sig=e13', department: 'HR',          branch: 'Abuja Head Office', baseSalary: 680000, allowances: 102000, deductions: 68000,  latePenalty: 0,     overtimePay: 0,      performanceBonus: 60000,  grossPay: 842000,  netPay: 774000,  variance: 8000,   hasAnomalies: false, isOnHold: false },
  { id: 'PL13', employeeId: 'E18', employeeName: 'Daniel Osei',     avatar: 'https://picsum.photos/120/120?sig=e18', department: 'Finance',     branch: 'Abuja Head Office', baseSalary: 750000, allowances: 112500, deductions: 75000,  latePenalty: 0,     overtimePay: 12500,  performanceBonus: 68000,  grossPay: 943000,  netPay: 868000,  variance: 15000,  hasAnomalies: false, isOnHold: false },
  { id: 'PL14', employeeId: 'E20', employeeName: 'Alex Rivera',     avatar: 'https://picsum.photos/120/120?sig=e20', department: 'Executive',   branch: 'Abuja Head Office', baseSalary: 1200000,allowances: 300000, deductions: 180000, latePenalty: 0,     overtimePay: 0,      performanceBonus: 200000, grossPay: 1700000, netPay: 1520000, variance: 20000,  hasAnomalies: false, isOnHold: false },
];

// Monthly payroll trend for charts
export const DEMO_PAYROLL_TREND = [
  { month: "Nov '25", gross: 9200000, net: 7800000 },
  { month: "Dec '25", gross: 9400000, net: 7950000 },
  { month: "Jan '26", gross: 9500000, net: 8050000 },
  { month: "Feb '26", gross: 9700000, net: 8200000 },
  { month: "Mar '26", gross: 9850000, net: 8350000 },
  { month: "Apr '26", gross: 11650000, net: 9986015 },
];

// ── PERFORMANCE / OKRs ────────────────────────────────────────────────────────
export const DEMO_OBJECTIVES = [
  {
    id: 'OBJ01', title: 'Grow Annual Recurring Revenue to ₦2B', ownerId: 'E20', ownerName: 'Alex Rivera', ownerAvatar: 'https://picsum.photos/120/120?sig=e20',
    category: 'Strategic', status: 'ON_TRACK', startDate: '2026-01-01', endDate: '2026-12-31',
    keyResults: [
      { id: 'KR01', description: 'Close 50 enterprise deals', targetValue: 50, currentValue: 18, unit: 'deals', weight: 40 },
      { id: 'KR02', description: 'Reduce churn rate below 5%', targetValue: 5, currentValue: 6.2, unit: '%', weight: 30 },
      { id: 'KR03', description: 'Expand to 3 new markets', targetValue: 3, currentValue: 1, unit: 'markets', weight: 30 },
    ]
  },
  {
    id: 'OBJ02', title: 'Achieve 95% Employee Satisfaction Score', ownerId: 'E13', ownerName: 'Ngozi Adeyemi', ownerAvatar: 'https://picsum.photos/120/120?sig=e13',
    category: 'Cultural', status: 'AT_RISK', startDate: '2026-01-01', endDate: '2026-12-31',
    keyResults: [
      { id: 'KR04', description: 'Complete Q2 engagement survey', targetValue: 100, currentValue: 0, unit: '%', weight: 30 },
      { id: 'KR05', description: 'Reduce voluntary turnover to <8%', targetValue: 8, currentValue: 11.2, unit: '%', weight: 40 },
      { id: 'KR06', description: 'Launch 3 wellness programs', targetValue: 3, currentValue: 1, unit: 'programs', weight: 30 },
    ]
  },
  {
    id: 'OBJ03', title: 'Ship Product v3.0 with Zero Critical Bugs', ownerId: 'E16', ownerName: 'Brian Clark', ownerAvatar: 'https://picsum.photos/120/120?sig=e16',
    category: 'Operational', status: 'ON_TRACK', startDate: '2026-01-01', endDate: '2026-06-30',
    keyResults: [
      { id: 'KR07', description: 'Complete 100% of sprint stories', targetValue: 100, currentValue: 72, unit: '%', weight: 50 },
      { id: 'KR08', description: 'Achieve 98% test coverage', targetValue: 98, currentValue: 91, unit: '%', weight: 30 },
      { id: 'KR09', description: 'Reduce bug backlog by 80%', targetValue: 80, currentValue: 55, unit: '%', weight: 20 },
    ]
  },
  {
    id: 'OBJ04', title: 'Increase Sales Pipeline by 40%', ownerId: 'E10', ownerName: 'James Okafor', ownerAvatar: 'https://picsum.photos/120/120?sig=e10',
    category: 'Growth', status: 'ON_TRACK', startDate: '2026-01-01', endDate: '2026-12-31',
    keyResults: [
      { id: 'KR10', description: 'Generate 200 qualified leads', targetValue: 200, currentValue: 87, unit: 'leads', weight: 40 },
      { id: 'KR11', description: 'Achieve ₦500M in closed deals', targetValue: 500000000, currentValue: 198000000, unit: '₦', weight: 60 },
    ]
  },
  {
    id: 'OBJ05', title: 'Reduce Operational Costs by 15%', ownerId: 'E18', ownerName: 'Daniel Osei', ownerAvatar: 'https://picsum.photos/120/120?sig=e18',
    category: 'Operational', status: 'BEHIND', startDate: '2026-01-01', endDate: '2026-12-31',
    keyResults: [
      { id: 'KR12', description: 'Renegotiate 10 vendor contracts', targetValue: 10, currentValue: 3, unit: 'contracts', weight: 50 },
      { id: 'KR13', description: 'Cut overhead spend by ₦50M', targetValue: 50000000, currentValue: 8000000, unit: '₦', weight: 50 },
    ]
  },
];

// Team performance scores by department – used in Performance dashboard charts
export const DEMO_TEAM_PERFORMANCE = [
  { name: 'Engineering', kpi: 88, behavioral: 92, attendance: 95, avg: 91 },
  { name: 'Sales',       kpi: 72, behavioral: 85, attendance: 88, avg: 81 },
  { name: 'Marketing',   kpi: 78, behavioral: 80, attendance: 90, avg: 82 },
  { name: 'HR',          kpi: 95, behavioral: 98, attendance: 99, avg: 97 },
  { name: 'Operations',  kpi: 65, behavioral: 70, attendance: 82, avg: 72 },
  { name: 'Finance',     kpi: 90, behavioral: 88, attendance: 96, avg: 91 },
  { name: 'Product',     kpi: 87, behavioral: 91, attendance: 93, avg: 90 },
  { name: 'Procurement', kpi: 74, behavioral: 76, attendance: 85, avg: 78 },
];

// ── CRM / DEALS ───────────────────────────────────────────────────────────────
export const DEMO_CRM_DEALS = [
  { id: 'D001', title: 'Zenith Bank – HR Suite License',    companyName: 'Zenith Bank',          value: 48000000,  stage: 'NEGOTIATION', probability: 75, ownerId: 'E10', ownerName: 'James Okafor',   closingDate: '2026-04-30', status: 'ACTIVE',  contacts: ['Chukwuemeka Eze', 'Adaeze Obi'] },
  { id: 'D002', title: 'MTN Nigeria – Payroll Module',      companyName: 'MTN Nigeria',          value: 72000000,  stage: 'PROPOSAL',    probability: 50, ownerId: 'E06', ownerName: 'Sarah Mitchell', closingDate: '2026-05-15', status: 'ACTIVE',  contacts: ['Bola Tinubu Jr.', 'Kemi Adeola'] },
  { id: 'D003', title: 'Access Bank – Full Platform',       companyName: 'Access Bank',          value: 120000000, stage: 'CLOSING',     probability: 90, ownerId: 'E10', ownerName: 'James Okafor',   closingDate: '2026-04-20', status: 'ACTIVE',  contacts: ['Herbert Wigwe II'] },
  { id: 'D004', title: 'Dangote Group – Attendance System', companyName: 'Dangote Industries',   value: 35000000,  stage: 'QUALIFIED',   probability: 35, ownerId: 'E06', ownerName: 'Sarah Mitchell', closingDate: '2026-06-01', status: 'ACTIVE',  contacts: ['Aliko Dangote Jr.'] },
  { id: 'D005', title: 'NNPC – Leave Management',           companyName: 'NNPC Ltd',             value: 55000000,  stage: 'LEAD',        probability: 20, ownerId: 'E15', ownerName: 'Amaka Eze',      closingDate: '2026-07-01', status: 'ACTIVE',  contacts: ['Mele Kyari II'] },
  { id: 'D006', title: 'Flutterwave – Performance Module',  companyName: 'Flutterwave',          value: 28000000,  stage: 'PROPOSAL',    probability: 60, ownerId: 'E15', ownerName: 'Amaka Eze',      closingDate: '2026-05-10', status: 'ACTIVE',  contacts: ['Olugbenga Agboola'] },
  { id: 'D007', title: 'Stanbic IBTC – Full Suite',         companyName: 'Stanbic IBTC',         value: 95000000,  stage: 'NEGOTIATION', probability: 80, ownerId: 'E10', ownerName: 'James Okafor',   closingDate: '2026-04-25', status: 'ACTIVE',  contacts: ['Sola David-Borha'] },
  { id: 'D008', title: 'Interswitch – CRM Add-on',          companyName: 'Interswitch',          value: 18000000,  stage: 'CLOSING',     probability: 95, ownerId: 'E06', ownerName: 'Sarah Mitchell', closingDate: '2026-04-15', status: 'WON',     contacts: ['Mitchell Elegbe'] },
];

// CRM Contacts
export const DEMO_CRM_CONTACTS = [
  { id: 'C001', name: 'Chukwuemeka Eze',  company: 'Zenith Bank',        role: 'CTO',           email: '[email protected]',  phone: '+234-801-000-0001', dealId: 'D001', avatar: 'https://picsum.photos/60/60?sig=c1' },
  { id: 'C002', name: 'Adaeze Obi',       company: 'Zenith Bank',        role: 'HR Director',   email: '[email protected]',  phone: '+234-802-000-0002', dealId: 'D001', avatar: 'https://picsum.photos/60/60?sig=c2' },
  { id: 'C003', name: 'Bola Tinubu Jr.',  company: 'MTN Nigeria',        role: 'VP Operations', email: '[email protected]',  phone: '+234-803-000-0003', dealId: 'D002', avatar: 'https://picsum.photos/60/60?sig=c3' },
  { id: 'C004', name: 'Kemi Adeola',      company: 'MTN Nigeria',        role: 'Procurement',   email: '[email protected]',  phone: '+234-804-000-0004', dealId: 'D002', avatar: 'https://picsum.photos/60/60?sig=c4' },
  { id: 'C005', name: 'Herbert Wigwe II', company: 'Access Bank',        role: 'CEO',           email: '[email protected]', phone: '+234-805-000-0005', dealId: 'D003', avatar: 'https://picsum.photos/60/60?sig=c5' },
  { id: 'C006', name: 'Mitchell Elegbe',  company: 'Interswitch',        role: 'CEO',           email: '[email protected]', phone: '+234-806-000-0006', dealId: 'D008', avatar: 'https://picsum.photos/60/60?sig=c6' },
];

// ── PROCUREMENT ───────────────────────────────────────────────────────────────
export const DEMO_VENDORS = [
  { id: 'V001', name: 'TechSupply Nigeria Ltd',   category: 'IT Equipment',    contactEmail: '[email protected]',    phone: '+234-801-100-0001', rating: 4.5, riskLevel: 'LOW',    totalSpend: 12500000, status: 'APPROVED' },
  { id: 'V002', name: 'OfficeMax Abuja',           category: 'Office Supplies', contactEmail: '[email protected]',    phone: '+234-802-100-0002', rating: 4.0, riskLevel: 'LOW',    totalSpend: 3200000,  status: 'APPROVED' },
  { id: 'V003', name: 'Cleantech Services',        category: 'Facilities',      contactEmail: '[email protected]',  phone: '+234-803-100-0003', rating: 3.8, riskLevel: 'MEDIUM', totalSpend: 5800000,  status: 'APPROVED' },
  { id: 'V004', name: 'DataCenter Pro',            category: 'Cloud Services',  contactEmail: '[email protected]',  phone: '+234-804-100-0004', rating: 4.8, riskLevel: 'LOW',    totalSpend: 28000000, status: 'APPROVED' },
  { id: 'V005', name: 'PrintMasters Lagos',        category: 'Printing',        contactEmail: '[email protected]', phone: '+234-805-100-0005', rating: 3.5, riskLevel: 'MEDIUM', totalSpend: 1800000,  status: 'UNDER_REVIEW' },
];

export const DEMO_PURCHASE_ORDERS = [
  { id: 'PO001', poNumber: 'PO-2026-0041', vendorId: 'V001', vendorName: 'TechSupply Nigeria Ltd',  requesterId: 'E14', requesterName: 'Tunde Adebayo', department: 'Engineering', items: [{ description: '15x Laptop Dell XPS 15', qty: 15, unitPrice: 850000, total: 12750000 }], totalAmount: 12750000, status: 'APPROVED',  createdAt: '2026-04-02', deliveryDate: '2026-04-20' },
  { id: 'PO002', poNumber: 'PO-2026-0042', vendorId: 'V002', vendorName: 'OfficeMax Abuja',          requesterId: 'E03', requesterName: 'Amanda Ward',    department: 'HR',          items: [{ description: 'Office stationery bundle', qty: 50, unitPrice: 25000, total: 1250000 }],   totalAmount: 1250000,  status: 'PENDING',   createdAt: '2026-04-08', deliveryDate: '2026-04-18' },
  { id: 'PO003', poNumber: 'PO-2026-0040', vendorId: 'V004', vendorName: 'DataCenter Pro',           requesterId: 'E12', requesterName: 'Chidi Nwosu',    department: 'Engineering', items: [{ description: 'Cloud hosting – Q2 2026', qty: 1, unitPrice: 7000000, total: 7000000 }],   totalAmount: 7000000,  status: 'APPROVED',  createdAt: '2026-03-28', deliveryDate: '2026-04-01' },
  { id: 'PO004', poNumber: 'PO-2026-0039', vendorId: 'V003', vendorName: 'Cleantech Services',       requesterId: 'E08', requesterName: 'Ethan Parker',   department: 'Operations',  items: [{ description: 'Monthly cleaning contract', qty: 1, unitPrice: 480000, total: 480000 }],   totalAmount: 480000,   status: 'APPROVED',  createdAt: '2026-03-25', deliveryDate: '2026-04-01' },
  { id: 'PO005', poNumber: 'PO-2026-0043', vendorId: 'V005', vendorName: 'PrintMasters Lagos',       requesterId: 'E01', requesterName: 'Kelly Robinson', department: 'Marketing',   items: [{ description: 'Marketing brochures x5000', qty: 5000, unitPrice: 500, total: 2500000 }],  totalAmount: 2500000,  status: 'REJECTED',  createdAt: '2026-04-09', deliveryDate: '2026-04-25' },
];

export const DEMO_REQUISITIONS = [
  { id: 'REQ001', title: 'New MacBook Pros for Design Team',  requesterId: 'E05', requesterName: 'Douglas Baker',  department: 'Product',     estimatedAmount: 9600000,  status: 'APPROVED',  priority: 'HIGH',   createdAt: '2026-04-01' },
  { id: 'REQ002', title: 'Conference Room AV Equipment',      requesterId: 'E20', requesterName: 'Alex Rivera',    department: 'Executive',   estimatedAmount: 4500000,  status: 'PENDING',   priority: 'MEDIUM', createdAt: '2026-04-07' },
  { id: 'REQ003', title: 'HR Software Annual Subscription',   requesterId: 'E13', requesterName: 'Ngozi Adeyemi',  department: 'HR',          estimatedAmount: 2800000,  status: 'APPROVED',  priority: 'HIGH',   createdAt: '2026-03-30' },
  { id: 'REQ004', title: 'Office Furniture – Lagos Branch',   requesterId: 'E10', requesterName: 'James Okafor',   department: 'Sales',       estimatedAmount: 3200000,  status: 'PENDING',   priority: 'LOW',    createdAt: '2026-04-10' },
];

// ── ENGAGEMENT / RECOGNITION ──────────────────────────────────────────────────
export const DEMO_RECOGNITIONS = [
  { id: 'R001', senderId: 'E20', senderName: 'Alex Rivera',    senderRole: 'CEO',              senderAvatar: 'https://picsum.photos/120/120?sig=e20', recipientId: 'E01', recipientName: 'Kelly Robinson',  kudos: '🏆', message: 'Outstanding campaign execution on the Q1 product launch. The results speak for themselves!', timestamp: '2026-04-11T09:15:00', reactions: { '👏': 12, '🔥': 8, '❤️': 5 } },
  { id: 'R002', senderId: 'E16', senderName: 'Brian Clark',    senderRole: 'Product Manager',  senderAvatar: 'https://picsum.photos/120/120?sig=e16', recipientId: 'E09', recipientName: 'Emily Johnson',   kudos: '⭐', message: 'Emily led the remote team through a complex sprint with zero blockers. Exceptional leadership!', timestamp: '2026-04-10T14:30:00', reactions: { '👏': 9, '🚀': 6 } },
  { id: 'R003', senderId: 'E13', senderName: 'Ngozi Adeyemi',  senderRole: 'HR Manager',       senderAvatar: 'https://picsum.photos/120/120?sig=e13', recipientId: 'E03', recipientName: 'Amanda Ward',     kudos: '💡', message: 'Amanda revamped our onboarding process and cut time-to-productivity by 30%. Brilliant work!', timestamp: '2026-04-09T11:00:00', reactions: { '👏': 15, '💯': 7 } },
  { id: 'R004', senderId: 'E10', senderName: 'James Okafor',   senderRole: 'Sales Manager',    senderAvatar: 'https://picsum.photos/120/120?sig=e10', recipientId: 'E06', recipientName: 'Sarah Mitchell',  kudos: '🎯', message: 'Sarah closed the Interswitch deal single-handedly. That\'s ₦18M in the bag!', timestamp: '2026-04-08T16:45:00', reactions: { '🔥': 20, '🎉': 14, '👏': 10 } },
  { id: 'R005', senderId: 'E18', senderName: 'Daniel Osei',    senderRole: 'Finance Manager',  senderAvatar: 'https://picsum.photos/120/120?sig=e18', recipientId: 'E11', recipientName: 'Fatima Bello',    kudos: '📊', message: 'Fatima\'s audit prep was flawless. Zero findings from the external auditors!', timestamp: '2026-04-07T10:20:00', reactions: { '👏': 8, '💯': 5 } },
  { id: 'R006', senderId: 'E08', senderName: 'Ethan Parker',   senderRole: 'Branch Manager',   senderAvatar: 'https://picsum.photos/120/120?sig=e8',  recipientId: 'E15', recipientName: 'Amaka Eze',       kudos: '🌟', message: 'Amaka\'s customer satisfaction scores hit 98% this quarter. PH branch is proud!', timestamp: '2026-04-06T13:00:00', reactions: { '❤️': 11, '👏': 7 } },
];

// Upcoming birthdays & work anniversaries
export const DEMO_MILESTONES = [
  { employeeId: 'E05', employeeName: 'Douglas Baker',  avatar: 'https://picsum.photos/120/120?sig=e5',  type: 'BIRTHDAY',     date: '2026-04-14', note: 'Turning 32' },
  { employeeId: 'E11', employeeName: 'Fatima Bello',   avatar: 'https://picsum.photos/120/120?sig=e11', type: 'ANNIVERSARY',  date: '2026-04-15', note: '3 years at HR360' },
  { employeeId: 'E16', employeeName: 'Brian Clark',    avatar: 'https://picsum.photos/120/120?sig=e16', type: 'BIRTHDAY',     date: '2026-04-18', note: 'Turning 38' },
  { employeeId: 'E03', employeeName: 'Amanda Ward',    avatar: 'https://picsum.photos/120/120?sig=e3',  type: 'ANNIVERSARY',  date: '2026-04-20', note: '5 years at HR360' },
  { employeeId: 'E09', employeeName: 'Emily Johnson',  avatar: 'https://picsum.photos/120/120?sig=e9',  type: 'BIRTHDAY',     date: '2026-04-22', note: 'Turning 35' },
];

// Reward catalog
export const DEMO_REWARDS = [
  { id: 'RW01', title: 'Amazon Gift Card',    icon: '🎁', pointsCost: 500,  description: '₦25,000 Amazon voucher' },
  { id: 'RW02', title: 'Extra Day Off',       icon: '🏖️', pointsCost: 800,  description: 'One additional leave day' },
  { id: 'RW03', title: 'Team Lunch',          icon: '🍽️', pointsCost: 300,  description: 'Lunch for your team (up to 8)' },
  { id: 'RW04', title: 'Training Voucher',    icon: '📚', pointsCost: 1000, description: 'Online course up to ₦50,000' },
  { id: 'RW05', title: 'Wellness Package',    icon: '💆', pointsCost: 600,  description: 'Spa or gym session' },
];

// ── TALENT MANAGEMENT ─────────────────────────────────────────────────────────
export const DEMO_JOB_OPENINGS = [
  { id: 'JO01', title: 'Senior Frontend Engineer',  department: 'Engineering', branch: 'Abuja Head Office', openings: 2, applicants: 34, status: 'OPEN',   postedDate: '2026-03-15', closingDate: '2026-04-30', hiringManager: 'Emily Johnson' },
  { id: 'JO02', title: 'Sales Executive',           department: 'Sales',       branch: 'Lagos Regional',    openings: 3, applicants: 58, status: 'OPEN',   postedDate: '2026-03-20', closingDate: '2026-04-25', hiringManager: 'James Okafor' },
  { id: 'JO03', title: 'HR Business Partner',       department: 'HR',          branch: 'Abuja Head Office', openings: 1, applicants: 22, status: 'OPEN',   postedDate: '2026-04-01', closingDate: '2026-05-01', hiringManager: 'Ngozi Adeyemi' },
  { id: 'JO04', title: 'Finance Controller',        department: 'Finance',     branch: 'Abuja Head Office', openings: 1, applicants: 15, status: 'OPEN',   postedDate: '2026-04-05', closingDate: '2026-05-05', hiringManager: 'Daniel Osei' },
  { id: 'JO05', title: 'Marketing Analyst',         department: 'Marketing',   branch: 'Lagos Regional',    openings: 2, applicants: 41, status: 'CLOSED', postedDate: '2026-02-10', closingDate: '2026-03-31', hiringManager: 'Kelly Robinson' },
];

export const DEMO_CANDIDATES = [
  { id: 'CA01', name: 'Emeka Okonkwo',   email: '[email protected]',   phone: '+234-810-001-0001', position: 'Senior Frontend Engineer', jobId: 'JO01', source: 'LinkedIn',  status: 'INTERVIEW',  appliedDate: '2026-03-18', score: 88, avatar: 'https://picsum.photos/60/60?sig=ca1' },
  { id: 'CA02', name: 'Zainab Musa',     email: '[email protected]',     phone: '+234-811-001-0002', position: 'Senior Frontend Engineer', jobId: 'JO01', source: 'Referral',  status: 'OFFER',      appliedDate: '2026-03-20', score: 94, avatar: 'https://picsum.photos/60/60?sig=ca2' },
  { id: 'CA03', name: 'Taiwo Adeyinka',  email: '[email protected]',  phone: '+234-812-001-0003', position: 'Sales Executive',          jobId: 'JO02', source: 'Indeed',    status: 'SCREENING',  appliedDate: '2026-03-22', score: 72, avatar: 'https://picsum.photos/60/60?sig=ca3' },
  { id: 'CA04', name: 'Chisom Eze',      email: '[email protected]',     phone: '+234-813-001-0004', position: 'Sales Executive',          jobId: 'JO02', source: 'LinkedIn',  status: 'INTERVIEW',  appliedDate: '2026-03-25', score: 81, avatar: 'https://picsum.photos/60/60?sig=ca4' },
  { id: 'CA05', name: 'Adaora Nwosu',    email: '[email protected]',    phone: '+234-814-001-0005', position: 'HR Business Partner',      jobId: 'JO03', source: 'Website',   status: 'ASSESSMENT', appliedDate: '2026-04-03', score: 79, avatar: 'https://picsum.photos/60/60?sig=ca5' },
  { id: 'CA06', name: 'Seun Adesanya',   email: '[email protected]',   phone: '+234-815-001-0006', position: 'Finance Controller',       jobId: 'JO04', source: 'Referral',  status: 'INTERVIEW',  appliedDate: '2026-04-07', score: 91, avatar: 'https://picsum.photos/60/60?sig=ca6' },
  { id: 'CA07', name: 'Blessing Okoro',  email: '[email protected]',  phone: '+234-816-001-0007', position: 'Sales Executive',          jobId: 'JO02', source: 'LinkedIn',  status: 'REJECTED',   appliedDate: '2026-03-21', score: 55, avatar: 'https://picsum.photos/60/60?sig=ca7' },
];

// Onboarding programs
export const DEMO_ONBOARDING = [
  { id: 'ON01', title: 'Engineering Onboarding',  department: 'Engineering', newHires: 2, tasksTotal: 12, tasksCompleted: 8,  startDate: '2026-04-07', assignedTo: 'Emily Johnson' },
  { id: 'ON02', title: 'Sales Onboarding',         department: 'Sales',       newHires: 3, tasksTotal: 10, tasksCompleted: 10, startDate: '2026-04-01', assignedTo: 'James Okafor' },
  { id: 'ON03', title: 'HR Onboarding',            department: 'HR',          newHires: 1, tasksTotal: 8,  tasksCompleted: 3,  startDate: '2026-04-10', assignedTo: 'Ngozi Adeyemi' },
];

// ── MEMOS / COMMUNICATION ─────────────────────────────────────────────────────
export const DEMO_MEMOS = [
  { id: 'M001', senderId: 'E20', senderName: 'Alex Rivera',   senderRole: 'CEO',          senderAvatar: 'https://picsum.photos/120/120?sig=e20', subject: 'Q2 2026 Company Strategy Update',          snippet: 'Team, as we enter Q2 I want to share our strategic priorities...', body: 'Team, as we enter Q2 I want to share our strategic priorities. Revenue growth remains our north star, with a target of ₦2B ARR by year-end. Each department head should align their OKRs accordingly. Let\'s make this quarter count.', recipients: 'All Staff',       timestamp: '2026-04-10T08:00:00', isRead: false, priority: 'HIGH',   attachments: [] },
  { id: 'M002', senderId: 'E13', senderName: 'Ngozi Adeyemi', senderRole: 'HR Manager',   senderAvatar: 'https://picsum.photos/120/120?sig=e13', subject: 'Updated Leave Policy – Effective May 2026', snippet: 'Please note the following updates to our leave policy...', body: 'Please note the following updates to our leave policy effective May 1, 2026: Annual leave accrual increases from 20 to 22 days. Sick leave now requires a medical certificate for absences exceeding 2 days. Maternity leave extended to 16 weeks.', recipients: 'All Staff',       timestamp: '2026-04-09T10:30:00', isRead: false, priority: 'HIGH',   attachments: ['Leave_Policy_2026.pdf'] },
  { id: 'M003', senderId: 'E18', senderName: 'Daniel Osei',   senderRole: 'Finance Mgr',  senderAvatar: 'https://picsum.photos/120/120?sig=e18', subject: 'April 2026 Payroll Processing Schedule',   snippet: 'Kindly note that April payroll will be processed on...', body: 'Kindly note that April payroll will be processed on April 25, 2026. All timesheets and expense claims must be submitted by April 20. Late submissions will be processed in the May cycle.', recipients: 'All Staff',       timestamp: '2026-04-08T09:00:00', isRead: true,  priority: 'MEDIUM', attachments: [] },
  { id: 'M004', senderId: 'E16', senderName: 'Brian Clark',   senderRole: 'Product Mgr',  senderAvatar: 'https://picsum.photos/120/120?sig=e16', subject: 'Product v3.0 Launch – All Hands April 15', snippet: 'We are excited to announce the Product v3.0 launch event...', body: 'We are excited to announce the Product v3.0 launch event on April 15 at 2PM. All engineering and product staff are required to attend. Marketing team please prepare the press release by April 13.', recipients: 'Engineering, Product, Marketing', timestamp: '2026-04-07T14:00:00', isRead: true,  priority: 'MEDIUM', attachments: ['Launch_Agenda.pdf'] },
  { id: 'M005', senderId: 'E08', senderName: 'Ethan Parker',  senderRole: 'Branch Mgr',   senderAvatar: 'https://picsum.photos/120/120?sig=e8',  subject: 'Port Harcourt Office Renovation Notice',   snippet: 'The PH office will undergo renovation from April 21...', body: 'The PH office will undergo renovation from April 21-25. Staff should work remotely during this period. IT will ensure VPN access is available for all PH-based employees.', recipients: 'Port Harcourt Branch', timestamp: '2026-04-06T11:00:00', isRead: true,  priority: 'LOW',    attachments: [] },
];

// Chat messages for the Communication module
export const DEMO_CHAT_MESSAGES = [
  { id: 'CM001', channelId: 'general',    senderId: 'E20', senderName: 'Alex Rivera',   senderAvatar: 'https://picsum.photos/120/120?sig=e20', message: 'Good morning team! Big week ahead – let\'s crush those targets 💪', timestamp: '2026-04-11T08:05:00', reactions: { '💪': 8, '🔥': 5 } },
  { id: 'CM002', channelId: 'general',    senderId: 'E01', senderName: 'Kelly Robinson', senderAvatar: 'https://picsum.photos/120/120?sig=e1',  message: 'Morning! Campaign assets are ready for review. Sharing in #marketing now.', timestamp: '2026-04-11T08:12:00', reactions: { '👍': 4 } },
  { id: 'CM003', channelId: 'engineering',senderId: 'E09', senderName: 'Emily Johnson',  senderAvatar: 'https://picsum.photos/120/120?sig=e9',  message: 'Sprint 14 planning starts at 10AM. Please review the backlog before joining.', timestamp: '2026-04-11T08:20:00', reactions: {} },
  { id: 'CM004', channelId: 'engineering',senderId: 'E12', senderName: 'Chidi Nwosu',    senderAvatar: 'https://picsum.photos/120/120?sig=e12', message: 'Deployment pipeline is green. All services nominal.', timestamp: '2026-04-11T08:35:00', reactions: { '✅': 6 } },
  { id: 'CM005', channelId: 'sales',      senderId: 'E10', senderName: 'James Okafor',   senderAvatar: 'https://picsum.photos/120/120?sig=e10', message: 'Access Bank deal is at 90% probability. Final proposal goes out today!', timestamp: '2026-04-11T08:45:00', reactions: { '🎯': 10, '🔥': 7 } },
  { id: 'CM006', channelId: 'sales',      senderId: 'E06', senderName: 'Sarah Mitchell', senderAvatar: 'https://picsum.photos/120/120?sig=e6',  message: 'MTN proposal is ready. Sending to Bola Tinubu Jr. this afternoon.', timestamp: '2026-04-11T09:00:00', reactions: { '👍': 3 } },
  { id: 'CM007', channelId: 'hr',         senderId: 'E13', senderName: 'Ngozi Adeyemi',  senderAvatar: 'https://picsum.photos/120/120?sig=e13', message: 'Reminder: Q2 performance review cycle opens April 15. Managers please prepare.', timestamp: '2026-04-11T09:10:00', reactions: { '📝': 5 } },
];

// ── DASHBOARD KPI TRENDS ──────────────────────────────────────────────────────
// Used by the main Dashboard for charts and summary cards
export const DEMO_HEADCOUNT_TREND = [
  { month: 'Nov 25', value: 16 },
  { month: 'Dec 25', value: 17 },
  { month: 'Jan 26', value: 17 },
  { month: 'Feb 26', value: 18 },
  { month: 'Mar 26', value: 19 },
  { month: 'Apr 26', value: 20 },
];

export const DEMO_ABSENTEEISM_TREND = [
  { month: 'Nov 25', rate: 3.2 },
  { month: 'Dec 25', rate: 4.1 },
  { month: 'Jan 26', rate: 3.8 },
  { month: 'Feb 26', rate: 3.5 },
  { month: 'Mar 26', rate: 2.9 },
  { month: 'Apr 26', rate: 3.1 },
];

export const DEMO_TURNOVER_TREND = [
  { month: 'Nov 25', voluntary: 0, involuntary: 0 },
  { month: 'Dec 25', voluntary: 1, involuntary: 0 },
  { month: 'Jan 26', voluntary: 0, involuntary: 0 },
  { month: 'Feb 26', voluntary: 1, involuntary: 0 },
  { month: 'Mar 26', voluntary: 1, involuntary: 0 },
  { month: 'Apr 26', voluntary: 0, involuntary: 0 },
];

// Summary KPIs – derived from DEMO_EMPLOYEES and DEMO_ATTENDANCE so numbers are always consistent
export const DEMO_DASHBOARD_KPIS = (() => {
  const total       = DEMO_EMPLOYEES.length;
  const active      = DEMO_EMPLOYEES.filter(e => e.status === 'Active' || e.status === 'Remote').length;
  const onLeave     = DEMO_EMPLOYEES.filter(e => e.status === 'On Leave').length;
  const present     = DEMO_ATTENDANCE.filter(r => r.status === 'PRESENT' || r.status === 'LATE' || r.status === 'HALF_DAY').length;
  const late        = DEMO_ATTENDANCE.filter(r => r.status === 'LATE').length;
  const absent      = DEMO_ATTENDANCE.filter(r => r.status === 'ABSENT').length;
  const avgPerf     = Math.round(DEMO_EMPLOYEES.reduce((s, e) => s + e.performanceScore, 0) / total);
  const monthlyNet  = DEMO_PAYROLL_LINES.reduce((s, l) => s + l.netPay, 0);
  return {
    totalEmployees:         total,
    activeEmployees:        active,
    onLeaveToday:           onLeave,
    presentToday:           present,
    lateToday:              late,
    absentToday:            absent,
    openPositions:          DEMO_JOB_OPENINGS.filter(j => j.status === 'OPEN').reduce((s, j) => s + j.openings, 0),
    pendingLeaveRequests:   DEMO_LEAVE_REQUESTS.filter(r => r.status === 'PENDING').length,
    pendingPayrollApprovals: DEMO_PAYROLL_RUNS.filter(r => r.status === 'UNDER_REVIEW').length,
    monthlyPayrollTotal:    monthlyNet,
    avgPerformanceScore:    avgPerf,
    engagementScore:        78,
    turnoverRateYTD:        Math.round((DEMO_EMPLOYEES.filter(e => e.status === 'Probation').length / total) * 100 * 10) / 10,
    revenueYTD:             DEMO_CRM_DEALS.filter(d => d.status === 'WON').reduce((s, d) => s + d.value, 0),
    pipelineValue:          DEMO_CRM_DEALS.filter(d => d.status === 'ACTIVE').reduce((s, d) => s + d.value, 0),
  };
})();

// ── PAYSLIPS ──────────────────────────────────────────────────────────────────
// Full payslip records per employee – last 3 months (Feb, Mar, Apr 2026).
// Earnings split: Basic 50%, Housing 25%, Transport 15%, Utility 10%.
// Deductions: PAYE ~7%, Pension 8% of basic, NHF 2.5% of basic.
// Numbers are consistent with DEMO_EMPLOYEES baseSalary & DEMO_PAYROLL_LINES.

export const DEMO_PAYSLIPS = [
  // ── Kelly Robinson (E01) – baseSalary 650,000
  {
    id: 'PS-E01-2026-04', employeeId: 'E01', employeeName: 'Kelly Robinson', position: 'Marketing Lead', department: 'Marketing', branch: 'Abuja Head Office',
    period: 'April 2026', payDate: 'Apr 25, 2026', status: 'PENDING',
    bank: { name: 'GTBank', accountNumber: '**** 4421', tin: 'NG-TIN-10101', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 325000 },
        { label: 'Housing Allowance',   amount: 162500 },
        { label: 'Transport Allowance', amount: 97500  },
        { label: 'Utility Allowance',   amount: 65000  },
        { label: 'Performance Bonus',   amount: 65000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 45500 },
        { label: 'Pension (8%)',  amount: 26000 },
        { label: 'NHF (2.5%)',   amount: 8125  },
      ]
    },
    grossPay: 715000, totalDeductions: 79625, netPay: 635375,
  },
  {
    id: 'PS-E01-2026-03', employeeId: 'E01', employeeName: 'Kelly Robinson', position: 'Marketing Lead', department: 'Marketing', branch: 'Abuja Head Office',
    period: 'March 2026', payDate: 'Mar 25, 2026', status: 'PAID',
    bank: { name: 'GTBank', accountNumber: '**** 4421', tin: 'NG-TIN-10101', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 325000 },
        { label: 'Housing Allowance',   amount: 162500 },
        { label: 'Transport Allowance', amount: 97500  },
        { label: 'Utility Allowance',   amount: 65000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 45500 },
        { label: 'Pension (8%)',  amount: 26000 },
        { label: 'NHF (2.5%)',   amount: 8125  },
      ]
    },
    grossPay: 650000, totalDeductions: 79625, netPay: 570375,
  },
  {
    id: 'PS-E01-2026-02', employeeId: 'E01', employeeName: 'Kelly Robinson', position: 'Marketing Lead', department: 'Marketing', branch: 'Abuja Head Office',
    period: 'February 2026', payDate: 'Feb 25, 2026', status: 'PAID',
    bank: { name: 'GTBank', accountNumber: '**** 4421', tin: 'NG-TIN-10101', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 325000 },
        { label: 'Housing Allowance',   amount: 162500 },
        { label: 'Transport Allowance', amount: 97500  },
        { label: 'Utility Allowance',   amount: 65000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 45500 },
        { label: 'Pension (8%)',  amount: 26000 },
        { label: 'NHF (2.5%)',   amount: 8125  },
      ]
    },
    grossPay: 650000, totalDeductions: 79625, netPay: 570375,
  },

  // ── Robert Davis (E02) – baseSalary 580,000
  {
    id: 'PS-E02-2026-04', employeeId: 'E02', employeeName: 'Robert Davis', position: 'Software Engineer', department: 'Engineering', branch: 'Abuja Head Office',
    period: 'April 2026', payDate: 'Apr 25, 2026', status: 'PENDING',
    bank: { name: 'Access Bank', accountNumber: '**** 7732', tin: 'NG-TIN-10202', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 290000 },
        { label: 'Housing Allowance',   amount: 145000 },
        { label: 'Transport Allowance', amount: 87000  },
        { label: 'Utility Allowance',   amount: 58000  },
      ],
      deductions: [
        { label: 'PAYE Tax',        amount: 40600 },
        { label: 'Pension (8%)',    amount: 23200 },
        { label: 'NHF (2.5%)',     amount: 7250  },
        { label: 'Late Penalty',    amount: 2200  },
      ]
    },
    grossPay: 580000, totalDeductions: 73250, netPay: 504550,
  },
  {
    id: 'PS-E02-2026-03', employeeId: 'E02', employeeName: 'Robert Davis', position: 'Software Engineer', department: 'Engineering', branch: 'Abuja Head Office',
    period: 'March 2026', payDate: 'Mar 25, 2026', status: 'PAID',
    bank: { name: 'Access Bank', accountNumber: '**** 7732', tin: 'NG-TIN-10202', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 290000 },
        { label: 'Housing Allowance',   amount: 145000 },
        { label: 'Transport Allowance', amount: 87000  },
        { label: 'Utility Allowance',   amount: 58000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 40600 },
        { label: 'Pension (8%)',  amount: 23200 },
        { label: 'NHF (2.5%)',   amount: 7250  },
      ]
    },
    grossPay: 580000, totalDeductions: 71050, netPay: 508950,
  },

  // ── Amanda Ward (E03) – baseSalary 520,000
  {
    id: 'PS-E03-2026-04', employeeId: 'E03', employeeName: 'Amanda Ward', position: 'HR Specialist', department: 'HR', branch: 'Abuja Head Office',
    period: 'April 2026', payDate: 'Apr 25, 2026', status: 'PENDING',
    bank: { name: 'Zenith Bank', accountNumber: '**** 5510', tin: 'NG-TIN-10303', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 260000 },
        { label: 'Housing Allowance',   amount: 130000 },
        { label: 'Transport Allowance', amount: 78000  },
        { label: 'Utility Allowance',   amount: 52000  },
        { label: 'Performance Bonus',   amount: 47840  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 36400 },
        { label: 'Pension (8%)',  amount: 20800 },
        { label: 'NHF (2.5%)',   amount: 6500  },
      ]
    },
    grossPay: 567840, totalDeductions: 63700, netPay: 504140,
  },
  {
    id: 'PS-E03-2026-03', employeeId: 'E03', employeeName: 'Amanda Ward', position: 'HR Specialist', department: 'HR', branch: 'Abuja Head Office',
    period: 'March 2026', payDate: 'Mar 25, 2026', status: 'PAID',
    bank: { name: 'Zenith Bank', accountNumber: '**** 5510', tin: 'NG-TIN-10303', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 260000 },
        { label: 'Housing Allowance',   amount: 130000 },
        { label: 'Transport Allowance', amount: 78000  },
        { label: 'Utility Allowance',   amount: 52000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 36400 },
        { label: 'Pension (8%)',  amount: 20800 },
        { label: 'NHF (2.5%)',   amount: 6500  },
      ]
    },
    grossPay: 520000, totalDeductions: 63700, netPay: 456300,
  },

  // ── Ethan Parker (E08) – baseSalary 720,000
  {
    id: 'PS-E08-2026-04', employeeId: 'E08', employeeName: 'Ethan Parker', position: 'Branch Manager', department: 'Operations', branch: 'Port Harcourt',
    period: 'April 2026', payDate: 'Apr 25, 2026', status: 'PENDING',
    bank: { name: 'First Bank', accountNumber: '**** 8801', tin: 'NG-TIN-10808', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 360000 },
        { label: 'Housing Allowance',   amount: 180000 },
        { label: 'Transport Allowance', amount: 108000 },
        { label: 'Utility Allowance',   amount: 72000  },
        { label: 'Overtime Pay',        amount: 7500   },
        { label: 'Performance Bonus',   amount: 30000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 50400 },
        { label: 'Pension (8%)',  amount: 28800 },
        { label: 'NHF (2.5%)',   amount: 9000  },
      ]
    },
    grossPay: 757500, totalDeductions: 88200, netPay: 669300,
  },
  {
    id: 'PS-E08-2026-03', employeeId: 'E08', employeeName: 'Ethan Parker', position: 'Branch Manager', department: 'Operations', branch: 'Port Harcourt',
    period: 'March 2026', payDate: 'Mar 25, 2026', status: 'PAID',
    bank: { name: 'First Bank', accountNumber: '**** 8801', tin: 'NG-TIN-10808', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 360000 },
        { label: 'Housing Allowance',   amount: 180000 },
        { label: 'Transport Allowance', amount: 108000 },
        { label: 'Utility Allowance',   amount: 72000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 50400 },
        { label: 'Pension (8%)',  amount: 28800 },
        { label: 'NHF (2.5%)',   amount: 9000  },
      ]
    },
    grossPay: 720000, totalDeductions: 88200, netPay: 631800,
  },

  // ── Emily Johnson (E09) – baseSalary 610,000
  {
    id: 'PS-E09-2026-04', employeeId: 'E09', employeeName: 'Emily Johnson', position: 'Remote Team Lead', department: 'Engineering', branch: 'Remote / Virtual',
    period: 'April 2026', payDate: 'Apr 25, 2026', status: 'PENDING',
    bank: { name: 'UBA', accountNumber: '**** 3390', tin: 'NG-TIN-10909', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 305000 },
        { label: 'Housing Allowance',   amount: 152500 },
        { label: 'Transport Allowance', amount: 91500  },
        { label: 'Utility Allowance',   amount: 61000  },
        { label: 'Performance Bonus',   amount: 55000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 42700 },
        { label: 'Pension (8%)',  amount: 24400 },
        { label: 'NHF (2.5%)',   amount: 7625  },
      ]
    },
    grossPay: 665000, totalDeductions: 74725, netPay: 590275,
  },
  {
    id: 'PS-E09-2026-03', employeeId: 'E09', employeeName: 'Emily Johnson', position: 'Remote Team Lead', department: 'Engineering', branch: 'Remote / Virtual',
    period: 'March 2026', payDate: 'Mar 25, 2026', status: 'PAID',
    bank: { name: 'UBA', accountNumber: '**** 3390', tin: 'NG-TIN-10909', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 305000 },
        { label: 'Housing Allowance',   amount: 152500 },
        { label: 'Transport Allowance', amount: 91500  },
        { label: 'Utility Allowance',   amount: 61000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 42700 },
        { label: 'Pension (8%)',  amount: 24400 },
        { label: 'NHF (2.5%)',   amount: 7625  },
      ]
    },
    grossPay: 610000, totalDeductions: 74725, netPay: 535275,
  },

  // ── Daniel Osei (E18) – baseSalary 750,000
  {
    id: 'PS-E18-2026-04', employeeId: 'E18', employeeName: 'Daniel Osei', position: 'Finance Manager', department: 'Finance', branch: 'Abuja Head Office',
    period: 'April 2026', payDate: 'Apr 25, 2026', status: 'PENDING',
    bank: { name: 'Stanbic IBTC', accountNumber: '**** 6620', tin: 'NG-TIN-11818', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 375000 },
        { label: 'Housing Allowance',   amount: 187500 },
        { label: 'Transport Allowance', amount: 112500 },
        { label: 'Utility Allowance',   amount: 75000  },
        { label: 'Overtime Pay',        amount: 12500  },
        { label: 'Performance Bonus',   amount: 68000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 52500 },
        { label: 'Pension (8%)',  amount: 30000 },
        { label: 'NHF (2.5%)',   amount: 9375  },
      ]
    },
    grossPay: 830500, totalDeductions: 91875, netPay: 738625,
  },
  {
    id: 'PS-E18-2026-03', employeeId: 'E18', employeeName: 'Daniel Osei', position: 'Finance Manager', department: 'Finance', branch: 'Abuja Head Office',
    period: 'March 2026', payDate: 'Mar 25, 2026', status: 'PAID',
    bank: { name: 'Stanbic IBTC', accountNumber: '**** 6620', tin: 'NG-TIN-11818', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 375000 },
        { label: 'Housing Allowance',   amount: 187500 },
        { label: 'Transport Allowance', amount: 112500 },
        { label: 'Utility Allowance',   amount: 75000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 52500 },
        { label: 'Pension (8%)',  amount: 30000 },
        { label: 'NHF (2.5%)',   amount: 9375  },
      ]
    },
    grossPay: 750000, totalDeductions: 91875, netPay: 658125,
  },

  // ── Alex Rivera (E20) – baseSalary 1,200,000
  {
    id: 'PS-E20-2026-04', employeeId: 'E20', employeeName: 'Alex Rivera', position: 'CEO', department: 'Executive', branch: 'Abuja Head Office',
    period: 'April 2026', payDate: 'Apr 25, 2026', status: 'PENDING',
    bank: { name: 'Zenith Bank', accountNumber: '**** 0001', tin: 'NG-TIN-12020', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 600000  },
        { label: 'Housing Allowance',   amount: 300000  },
        { label: 'Transport Allowance', amount: 180000  },
        { label: 'Utility Allowance',   amount: 120000  },
        { label: 'Performance Bonus',   amount: 200000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 168000 },
        { label: 'Pension (8%)',  amount: 48000  },
        { label: 'NHF (2.5%)',   amount: 15000  },
      ]
    },
    grossPay: 1400000, totalDeductions: 231000, netPay: 1169000,
  },
  {
    id: 'PS-E20-2026-03', employeeId: 'E20', employeeName: 'Alex Rivera', position: 'CEO', department: 'Executive', branch: 'Abuja Head Office',
    period: 'March 2026', payDate: 'Mar 25, 2026', status: 'PAID',
    bank: { name: 'Zenith Bank', accountNumber: '**** 0001', tin: 'NG-TIN-12020', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 600000 },
        { label: 'Housing Allowance',   amount: 300000 },
        { label: 'Transport Allowance', amount: 180000 },
        { label: 'Utility Allowance',   amount: 120000 },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 168000 },
        { label: 'Pension (8%)',  amount: 48000  },
        { label: 'NHF (2.5%)',   amount: 15000  },
      ]
    },
    grossPay: 1200000, totalDeductions: 231000, netPay: 969000,
  },
  {
    id: 'PS-E20-2026-02', employeeId: 'E20', employeeName: 'Alex Rivera', position: 'CEO', department: 'Executive', branch: 'Abuja Head Office',
    period: 'February 2026', payDate: 'Feb 25, 2026', status: 'PAID',
    bank: { name: 'Zenith Bank', accountNumber: '**** 0001', tin: 'NG-TIN-12020', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 600000 },
        { label: 'Housing Allowance',   amount: 300000 },
        { label: 'Transport Allowance', amount: 180000 },
        { label: 'Utility Allowance',   amount: 120000 },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 168000 },
        { label: 'Pension (8%)',  amount: 48000  },
        { label: 'NHF (2.5%)',   amount: 15000  },
      ]
    },
    grossPay: 1200000, totalDeductions: 231000, netPay: 969000,
  },

  // ── Ngozi Adeyemi (E13) – baseSalary 680,000
  {
    id: 'PS-E13-2026-04', employeeId: 'E13', employeeName: 'Ngozi Adeyemi', position: 'HR Manager', department: 'HR', branch: 'Abuja Head Office',
    period: 'April 2026', payDate: 'Apr 25, 2026', status: 'PENDING',
    bank: { name: 'GTBank', accountNumber: '**** 2211', tin: 'NG-TIN-11313', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 340000 },
        { label: 'Housing Allowance',   amount: 170000 },
        { label: 'Transport Allowance', amount: 102000 },
        { label: 'Utility Allowance',   amount: 68000  },
        { label: 'Performance Bonus',   amount: 60000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 47600 },
        { label: 'Pension (8%)',  amount: 27200 },
        { label: 'NHF (2.5%)',   amount: 8500  },
      ]
    },
    grossPay: 740000, totalDeductions: 83300, netPay: 656700,
  },
  {
    id: 'PS-E13-2026-03', employeeId: 'E13', employeeName: 'Ngozi Adeyemi', position: 'HR Manager', department: 'HR', branch: 'Abuja Head Office',
    period: 'March 2026', payDate: 'Mar 25, 2026', status: 'PAID',
    bank: { name: 'GTBank', accountNumber: '**** 2211', tin: 'NG-TIN-11313', currency: 'NGN' },
    breakdown: {
      earnings: [
        { label: 'Basic Salary',        amount: 340000 },
        { label: 'Housing Allowance',   amount: 170000 },
        { label: 'Transport Allowance', amount: 102000 },
        { label: 'Utility Allowance',   amount: 68000  },
      ],
      deductions: [
        { label: 'PAYE Tax',      amount: 47600 },
        { label: 'Pension (8%)',  amount: 27200 },
        { label: 'NHF (2.5%)',   amount: 8500  },
      ]
    },
    grossPay: 680000, totalDeductions: 83300, netPay: 596700,
  },
];
