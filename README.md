# VENTAS300: Real Estate Management System

VENTAS300 is a desktop application built with Electron, React, and TypeScript, designed to manage the workflow of a real estate sales business. It covers the entire process from owner and property registration to property valuation by certified appraisers and commission calculation.

## Key Features

*   **Role-Based Access Control:** Separate interfaces and permissions for `Admin` and `Perito` (Appraiser) users.
*   **Comprehensive Dashboard:** A central hub displaying key statistics like total sales requests, status breakdown (pending, assigned, evaluated), total commissions, and average property valuation.
*   **Owner & Property Management:** Easily register new property owners and add multiple properties (houses, apartments, land) under their profile.
*   **Sales Request System:** Generate sales requests directly from a registered property.
*   **Appraiser Assignment:** Admins can assign pending sales requests to available appraisers through a dedicated interface.
*   **Property Valuation Module:** Appraisers can view their assigned properties, submit detailed valuations including observations, a final price, and see the automatically calculated commission.
*   **Persistent Data Storage:** All application data is stored in a MySQL database.

## Core Application Sections

*   **Login:** A simple, role-based login screen. The system includes a default Admin user and dynamically loads Appraiser (`Perito`) users from the database.
*   **Dashboard:** Provides a high-level overview of the system's activity, including financial metrics and workflow progress.
*   **Propietarios (Owners):** For registering owners and their properties. From here, new sales requests can be initiated.
*   **Solicitudes (Requests):** A list of all sales requests, showing their current status (Pending, Assigned, Evaluated) and associated details.
*   **Asignaciones (Assignments):** An admin-only view to assign pending requests to available appraisers.
*   **Mis Evaluaciones (My Valuations):** The appraiser's workspace to manage and submit valuations for their assigned properties.

## Tech Stack

*   **Framework:** Electron
*   **Frontend:** React, TypeScript, Tailwind CSS
*   **Bundler:** Vite
*   **Database:** MySQL
*   **Desktop App Builder:** electron-builder

## Getting Started

### Prerequisites

*   Node.js and npm
*   A running MySQL server

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/plaingabriel/app-ventas-300.git
    cd app-ventas-300
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure the Database:**
    *   The application expects a MySQL database named `ventas300`. The connection details are configured in `src/main/database.ts`. If your local MySQL configuration is different, please update this file.
        ```typescript
        // src/main/database.ts
        const connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'ventas300'
        });
        ```
    *   Create the database and the necessary tables by running the following SQL commands in your MySQL client:
    ```sql
    CREATE DATABASE IF NOT EXISTS ventas300;
    USE ventas300;

    CREATE TABLE solicitante (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Nombre VARCHAR(255) NOT NULL,
      Contacto VARCHAR(50)
    );

    CREATE TABLE propiedad (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Tipo ENUM('Casa', 'Terreno', 'Departamento', 'Otro') NOT NULL,
      Direccion VARCHAR(255) NOT NULL,
      Caracteristicas TEXT,
      ID_Solicitante INT,
      FOREIGN KEY (ID_Solicitante) REFERENCES solicitante(ID)
    );

    CREATE TABLE perito (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Nombre VARCHAR(255) NOT NULL
    );

    CREATE TABLE solicitud (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
      ID_Solicitante INT,
      ID_Propiedad INT,
      ID_Perito INT NULL,
      Estado ENUM('Pendiente', 'Asignada', 'Evaluada') DEFAULT 'Pendiente',
      Observaciones TEXT,
      Precio_Fijado DECIMAL(10, 2) DEFAULT 0,
      Comision DECIMAL(10, 2) DEFAULT 0,
      FOREIGN KEY (ID_Solicitante) REFERENCES solicitante(ID),
      FOREIGN KEY (ID_Propiedad) REFERENCES propiedad(ID),
      FOREIGN KEY (ID_Perito) REFERENCES perito(ID)
    );
    ```

4.  **Add Sample Data (Recommended):**
    To use the login feature for appraisers, you must add at least one `perito` to the database.
    ```sql
    -- Example of how to add an appraiser
    INSERT INTO perito (Nombre) VALUES ('Juan Pérez');
    -- The login dropdown will now show 'Admin Principal' and 'Juan Pérez - Perito'
    ```

## Available Scripts

### Run in Development Mode
Launches the application with hot-reloading enabled.
```bash
npm run dev
```

### Build for Production
Builds and packages the application for distribution.
```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
