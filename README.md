# NoriOLT — Advanced OLT Management Platform

![NoriOLT Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%2019-blue)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-06b6d4)

NoriOLT is a high-precision, cloud-native **ONU Provisioning and OLT Management System** designed for Internet Service Providers (ISPs) to manage GPON networks with efficiency. It provides a unified interface for multi-vendor hardware (Huawei, ZTE, Fiberhome), replacing complex legacy systems with a modern, responsive, and intuitive NOC experience.

---

## 🚀 Key Features

### 1. Centralized NOC Dashboard
*   **Real-time Telemetry**: Monitoring of Online/Offline status, Power Fails, and Signal Loss (LOS).
*   **Network Integrity Analytics**: Visual tracking of network health trends using interactive area charts.
*   **Critical Incident Tracking**: Consolidated table for PON outages and root-cause analysis.

### 2. Intelligent ONU Provisioning
*   **Simplified Authorization**: Streamlined workflow to authorize new ONUs in seconds.
*   **Logic & Service Profiles**: Automated assignment of VLANs, Network Modes (Bridge/Router), and Speed Profiles.
*   **Hardware Sync**: Precision mapping of OLT, Board, and Port indices.

### 3. Inventory & Fleet Management
*   **Domain-Driven Search**: Instant lookup by Serial Number (SN), Name, or Zone.
*   **Signal Diagnostics**: Visual indicators for optical power levels (dBm) with warning/critical thresholds.
*   **Activity Logs**: Detailed audit trail of every modification, import, and deletion.

### 4. Security & Engineering
*   **Operator Access Control**: Secure login system with "Remember Access" persistence.
*   **Multi-language Core**: Native support for English (EN) and Portuguese (PT).
*   **Responsive Architecture**: Designed for both Command Centers (4K displays) and Field Operations (Mobile).

---

## 🛠️ Technical Stack

- **Framework:** [React 19](https://react.dev/) (ESM-based)
- **Language:** [TypeScript](https://www.typescriptlang.org/) for domain-driven type safety.
- **Styling:** [TailwindCSS](https://tailwindcss.com/) for high-performance, utility-first UI.
- **Charts:** [Recharts](https://recharts.org/) for data visualization.
- **Icons:** [Lucide React](https://lucide.dev/) for a consistent iconography system.
- **API Handling:** [Axios](https://axios-http.com/) with centralized interceptors.

---

## 🏗️ Architecture

The project follows a **Feature-Based Architecture**, ensuring scalability and isolation of business logic:

*   **API Layer:** Abstraction layer for RESTful communication.
*   **Service Layer:** Business logic for OLT telemetry, ONU management, and auth.
*   **Domain Types:** Strict TypeScript interfaces for GPON hardware and system states.
*   **Socket-Ready:** Architecture prepared for WebSocket integration (LOS/PowerFail alerts).

For more details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/nori-olt.git
   cd nori-olt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file based on the implementation:
   ```env
   API_BASE_URL=https://api.your-isp.com/v1
   SOCKET_URL=wss://socket.your-isp.com
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Precision Engineering by Nori Platforms</b><br>
  <i>Empowering ISPs with high-performance network management.</i>
</p>