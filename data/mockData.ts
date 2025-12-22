
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
  { 
    id: 'onu1', 
    name: 'valdodocunha', 
    sn: 'HWTCE44BFC9A', 
    mac: 'E4:4B:FC:9A:00:01',
    olt: 'PGM - Jetz', 
    pon: '0/5/11:32', 
    zone: 'CEO 009', 
    odb: 'None', 
    signal: -28.5, 
    mode: 'Router', 
    vlan: 11, 
    type: 'ONU-type-eth-1-pots-2-catv-0', 
    profile: 'Residential_300M',
    authDate: '02-12-2024', 
    lastSeen: '20-12-2024 08:31:13',
    mgmt_ip: '172.16.5.112',
    status: 'offline' 
  },
  { 
    id: 'onu2', 
    name: 'valdodocunha', 
    sn: 'HWTC157D42A4', 
    mac: '15:7D:42:A4:00:02',
    olt: 'PGM - Jetz', 
    pon: '0/5/11:40', 
    zone: 'CEO 009', 
    odb: 'None', 
    signal: -19.2, 
    mode: 'Bridge', 
    vlan: 11, 
    type: 'EG8010H', 
    profile: 'Residential_100M',
    authDate: '02-12-2024', 
    lastSeen: '20-12-2024 10:15:22',
    mgmt_ip: '172.16.5.120',
    status: 'online' 
  },
  { 
    id: 'onu3', 
    name: 'franciscosvieira', 
    sn: 'HWTCF813D8A7', 
    mac: 'F8:13:D8:A7:00:03',
    olt: 'PGM - Jetz', 
    pon: '0/2/12:30', 
    zone: 'CEO 092', 
    odb: 'None', 
    signal: -24.1, 
    mode: 'Bridge', 
    vlan: 11, 
    type: 'EG8010H', 
    profile: 'Residential_100M',
    authDate: '02-12-2024', 
    lastSeen: '20-12-2024 11:22:45',
    mgmt_ip: '172.16.2.145',
    status: 'online' 
  },
  { 
    id: 'onu4', 
    name: 'laislucena', 
    sn: 'HWTC36F5BDAE', 
    mac: '36:F5:BD:AE:00:04',
    olt: 'PGM - Jetz', 
    pon: '0/1/4:25', 
    zone: 'CEO 001', 
    odb: 'None', 
    signal: -18.8, 
    mode: 'Router', 
    vlan: 11, 
    type: 'EG8145X6-10', 
    profile: 'Residential_600M',
    authDate: '02-12-2024', 
    lastSeen: '20-12-2024 09:10:05',
    mgmt_ip: '172.16.1.104',
    status: 'online' 
  },
  { 
    id: 'onu5', 
    name: 'naila', 
    sn: 'HWTCF487A59F', 
    mac: 'F4:87:A5:9F:00:05',
    olt: 'PGM - Jetz', 
    pon: '0/1/4:26', 
    zone: 'CEO 120', 
    odb: 'None', 
    signal: -21.4, 
    mode: 'Router', 
    vlan: 11, 
    type: 'HG8245Q2', 
    profile: 'Residential_300M',
    authDate: '02-12-2024', 
    lastSeen: '20-12-2024 12:44:33',
    mgmt_ip: '172.16.1.105',
    status: 'online' 
  },
  { 
    id: 'onu6', 
    name: 'rodrigo_silva', 
    sn: 'HWTC4A2211C9', 
    mac: '4A:22:11:C9:00:06',
    olt: 'ULI - Jetz', 
    pon: '0/2/1:10', 
    zone: 'CEO 001', 
    odb: 'ODB-01', 
    signal: -17.5, 
    mode: 'Router', 
    vlan: 100, 
    type: 'EG8145X6', 
    profile: 'Residential_300M',
    authDate: '05-12-2024', 
    lastSeen: '20-12-2024 14:02:11',
    mgmt_ip: '10.50.2.110',
    status: 'online' 
  },
  { 
    id: 'onu7', 
    name: 'maria_oliveira', 
    sn: 'HWTC998877AA', 
    mac: '99:88:77:AA:00:07',
    olt: 'DEU - Jetz', 
    pon: '1/0/4:2', 
    zone: 'CEO 055', 
    odb: 'ODB-02', 
    signal: -23.8, 
    mode: 'Bridge', 
    vlan: 200, 
    type: 'EG8010H', 
    profile: 'Residential_100M',
    authDate: '06-12-2024', 
    lastSeen: '20-12-2024 15:55:01',
    mgmt_ip: '192.168.10.22',
    status: 'online' 
  }
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
