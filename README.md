## 💡 What is Storify?

Storify simulates a distributed file storage system. It handles:
- File chunking and reconstruction
- Distributed storage across simulated nodes
- Metadata storage using MongoDB
- REST APIs for upload and download


## 🚀 Tech Stack

- Node.js + Express.js (Backend APIs)
- MongoDB (Metadata Storage)
- Multer + FS module (File handling)
- HTML/CSS/JS (Simple frontend)

## ⚙️ Key Features

- Chunking of large files (e.g., 1MB per chunk)
- Storage of chunks in simulated “nodes”
- MongoDB-based metadata management
- File reconstruction from chunks
- Minimal frontend interface

### 📊 System Architecture Diagram

![System Flow](assets/preview.png)

## How to Run
1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`
