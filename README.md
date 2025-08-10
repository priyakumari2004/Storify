## 📦 Project: Storify - Distributed File Storage System

Storify is a modern distributed file storage solution that allows users to upload, store, and retrieve files through a seamless React-based UI. Files are intelligently chunked and (optionally) distributed across multiple simulated nodes for redundancy and efficient access

## 💡 Features

- Upload files with simulated chunking logic
- Store metadata locally
- View all uploaded files and delete them
- Retrieve/download files
- Visualize how files are distributed across virtual nodes

## 🛠️ Technologies Used

### Frontend
- **React.js** – Building dynamic and interactive UI
- **Vite** – Fast frontend build tool for modern React apps
- **Tailwind CSS** – Utility-first CSS framework for styling
- **Lucide React** – Icon library for React
- **HTML5, CSS3, JavaScript**

 ### Other Tools
- **Local Storage System** – Files are stored and reconstructed without a database
- **ESLint** – For maintaining code quality and consistency


## 🔧 How to Run

### Frontend
```bash
npm install
npm run dev

🚀 What This UploadFile Component Does:
It lets users upload a file and simulates how it would be:
1.	Split into chunks (small pieces)
2.	Distributed across multiple virtual nodes
3.	Displayed visually as uploading + chunk distribution
4.	Stored in localStorage for session persistence
