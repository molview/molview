# MolView - Molecular Visualization Web Application

## Overview
MolView is an intuitive web application for chemistry and biology visualization. It allows users to sketch molecular structures, search for compounds, and visualize 3D molecular models using various rendering engines.

## Project Structure
- **Frontend**: HTML/CSS/JavaScript static web application
- **Build System**: Grunt for asset compilation and optimization
- **Dependencies**: Bower for frontend package management
- **Deployment**: Static file server using http-server

## Current State (September 3, 2025)
- ✅ Project successfully imported and configured for Replit environment
- ✅ All dependencies installed (Node.js, Bower, Grunt, http-server, PHP, SQLite)
- ✅ Build system working correctly - all assets compiled
- ✅ Web server running on port 5000 with CORS enabled
- ✅ Application loads and displays correctly
- ✅ Deployment configuration set up for production
- ✅ Removed initial progress/update popup window
- ✅ Added Library tab with file upload functionality
- ✅ **UPGRADED: Database-powered permanent storage system**
- ✅ **NEW: SQLite database for file metadata and management**
- ✅ **ENHANCED: Progress tracking and error handling for uploads**

## Architecture
- **Source Code**: `/src/` directory containing JavaScript, LESS stylesheets, and SVG assets
- **Built Assets**: `/build/` directory with minified JavaScript and CSS files
- **Dependencies**: `/bower_components/` for frontend libraries (jQuery, FileSaver, etc.)
- **Build Output**: Compiled and optimized files served by static HTTP server

## Development Workflow
1. Source files in `/src/` are edited
2. Run `grunt` to build and compile assets to `/build/`
3. Static server serves the compiled application
4. No backend processing required - pure static application

## Key Features
- Molecular structure sketching and editing
- 3D molecular visualization with multiple rendering engines (GLmol, JSmol, ChemDoodle)
- Chemical database search and compound lookup
- Export capabilities for images and molecular files
- **Database-Powered Library System**: Upload, store, and manage 3D molecular structures (.pdb, .mol, .sdf, .xyz, .cif, .mol2, .cml)
- **Animation Library**: Upload and store molecular animation videos (.mp4, .webm, .avi, .mov, .gif)
- **SQLite Database Storage**: Permanent file storage with complete metadata tracking and integrity
- **Advanced File Management**: 
  - Progress tracking during uploads with real-time status
  - Detailed error reporting and debugging information
  - File size validation and type checking
  - One-click load, download, and delete operations
  - Database-backed search and filtering capabilities
- Responsive design for desktop and mobile devices

## Configuration
- **Development Server**: http-server on 0.0.0.0:5000 with CORS enabled
- **Production Deployment**: Autoscale deployment with Grunt build step
- **Host Configuration**: Allows all hosts for Replit proxy compatibility