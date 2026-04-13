# Software Quality Assurance - Course Projects

## Overview

A collection of Software Quality Assurance (SQA) coursework assignments covering unit testing, integration testing, performance testing, and a gamified React application.

## Project Structure

- **project1/**: Python triangle classification app with unit tests
- **project2/Project2API/**: Flask REST API version of the triangle app for integration testing
- **project 3/**: Performance testing reports using Apache JMeter
- **vibe coding assignments/week 3/**: "Password Bug Hunt" — a React + Vite gamified QA exercise

## Main App: Password Bug Hunt

A React 18 app built with Vite. The user finds intentional bugs in password validation logic across multiple game levels.

### Running Locally
- `cd "vibe coding assignments/week 3" && npm run dev`
- Runs on port 5000 at `http://0.0.0.0:5000`

### Tech Stack
- **Frontend**: React 18, Vite 5, CSS animations
- **Package Manager**: npm
- **Build Tool**: Vite

## Deployment
- Configured as a **static** deployment
- Build command: `cd 'vibe coding assignments/week 3' && npm run build`
- Public directory: `vibe coding assignments/week 3/dist`
