# features.md

## Overview
This backend is built using **Node.js**, **Express**, and **Supabase (PostgreSQL)**.  
It is developed as part of *The Great Indian Kitchen* website project and runs on **port 5001**.  
The frontend (React) connects to this backend through a proxy from  
**http://localhost:5173 → http://localhost:5001**.

The backend provides secure user authentication, database operations for saving user favorites, and functionality for creating and viewing restaurant reservations.  
All data is stored in a **cloud-hosted Supabase database**, which can be accessed from any machine or IP address.

---

## How to Run the Server
1. Open the terminal and navigate to the server folder:
   ```bash
   cd server
