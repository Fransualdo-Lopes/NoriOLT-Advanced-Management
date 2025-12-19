
import { SummaryStats, OLT, ActivityEvent, PONOutage, ONU } from '../types';

export const mockSummary: SummaryStats = {
  waitingAuth: 3,
  waitingSub: { d: 0, resync: 1, new: 2 },
  online: 6766,
  totalAuthorized: 7272,
  offline: 419,
  offlineSub: { pwrFail: 319, los: 13, na: 87 },
  lowSignal: 59,
  lowSignalSub: { warning: 50, critical: 9 }
};

export const mockOLTs: OLT[] = [
  { id: '1', name: 'PGM - Jetz Internet', uptime: '46 days, 11:53', temperature: 29, status: 'online' },
  { id: '2', name: 'ULI - Jetz Internet', uptime: '58 days, 12:19', temperature: 37, status: 'online' },
  { id: '3', name: 'DEU - Jetz Internet', uptime: '216 days, 11:55', temperature: 36, status: 'online' }
];

export const mockEvents: ActivityEvent[] = [
  { id: 'e1', message: 'ONU HWTC D5FC45AF deleted', timestamp: '7 minutes ago', type: 'error' },
  { id: 'e2', message: 'gpon-onu_0/2/0:33 Imported from OLT', timestamp: '9 minutes ago', type: 'success' },
  { id: 'e3', message: 'ONU HWTC D5F4DEAF deleted', timestamp: '11 minutes ago', type: 'error' },
  { id: 'e4', message: 'gpon-onu_0/12/0:12 Mode changed to Bridging', timestamp: '52 minutes ago', type: 'info' },
  { id: 'e5', message: 'gpon-onu_0/12/1:19 Imported from OLT', timestamp: '1 hour ago', type: 'success' }
];

export const mockOutages: PONOutage[] = [
  { id: 'o1', oltName: 'PGM - Jetz Internet', boardPort: '12 / 14', onusAffected: 1, los: 0, power: 1, cause: 'Power fail', since: '1 month ago' }
];

export const mockONUs: ONU[] = [
  { id: 'onu1', name: 'adrianaap', sn: 'HWTC9D70C5B4', olt: 'ULI - Jetz', pon: '0/2/0:33', zone: 'CEO-U09', odb: 'None', signal: -18.5, mode: 'Router', vlan: 100, type: 'EG8145X6-10', authDate: '02-12-2024', status: 'online' },
  { id: 'onu2', name: 'limaa', sn: 'HWTC6C8B83A5', olt: 'PGM - Jetz', pon: '0/12/1:19', zone: 'CEO-165', odb: 'None', signal: -21.2, mode: 'Bridge', vlan: 11, type: 'EG8010H', authDate: '02-12-2024', status: 'online' },
  { id: 'onu3', name: 'carlosnuns', sn: 'HWTC7BAA3CAA', olt: 'PGM - Jetz', pon: '0/3/1:3', zone: 'CEO-097', odb: 'None', signal: -24.1, mode: 'Bridge', vlan: 11, type: 'EG8010H', authDate: '02-12-2024', status: 'online' },
  { id: 'onu4', name: 'antoniomurilo', sn: 'HWTC6C8D39A5', olt: 'PGM - Jetz', pon: '0/1/0:37', zone: 'CEO-015', odb: 'None', signal: -19.8, mode: 'Bridge', vlan: 11, type: 'EG8010H', authDate: '02-12-2024', status: 'online' }
];

export const networkStatusData = [
  { time: 'Thu 20:00', online: 6763, pwrFail: 321, los: 13, na: 87 },
  { time: 'Fri 00:00', online: 6760, pwrFail: 325, los: 12, na: 87 },
  { time: 'Fri 04:00', online: 6766, pwrFail: 319, los: 13, na: 87 },
  { time: 'Fri 08:00', online: 6765, pwrFail: 320, los: 14, na: 87 },
  { time: 'Fri 12:00', online: 6763, pwrFail: 321, los: 13, na: 87 },
  { time: 'Fri 16:00', online: 6766, pwrFail: 319, los: 13, na: 87 }
];

export const authorizationsData = [
  { date: '27-11', count: 12 },
  { date: '28-11', count: 8 },
  { date: '29-11', count: 15 },
  { date: '01-12', count: 5 },
  { date: '02-12', count: 235 },
  { date: '06-12', count: 4 },
  { date: '08-12', count: 9 },
  { date: '15-12', count: 2 },
  { date: '16-12', count: 1 },
  { date: '17-12', count: 5 },
  { date: '19-12', count: 3 }
];
