# BizTech - Enterprise Frontend Portal

## 💡 Tech Stack
* **Core:** React 19
* **Build Tool:** Vite 8
* **Styling:** Tailwind CSS v4 (Next-gen engine)
* **State Management:** Redux Toolkit
* **Routing:** React Router 7
* **API Client:** Axios with Interceptors
* **Icons:** Custom SVG & Lucide-style iconography

## ✨ Key Features

### 🔐 Advanced Authentication
* **Role-Based Protected Routes:** Separate entry points and permissions for **Admin**, **Client**, and **Vendor**.
* **Session Persistence:** Secure JWT handling using Redux and LocalStorage.
* **Smart Interceptors:** Automatic logout and redirection to login if a session expires (401 handling).
* **Account Recovery:** Integrated Forgot Password flow.

### 🏗️ Role-Specific Dashboards
* **Client Dashboard:**
    * Create and manage detailed Tenders.
    * Set deadlines and update them in real-time.
    * Review submitted proposals and **Accept/Reject** bids.
* **Vendor Dashboard:**
    * Browse an "Active Tenders" marketplace.
    * Submit detailed proposals (Bid amount + Cover letter).
    * Track application status (Pending/Accepted/Rejected).
* **Admin Dashboard:**
    * Centralized hub for platform governance and statistics.

### 👤 Profile & Notifications
* **Profile Management:** View and edit personal/company information.
* **Notification System:** Real-time feedback for users when proposal statuses change or new bids are received.

