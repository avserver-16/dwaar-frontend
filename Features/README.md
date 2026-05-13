# Key Features

## 1. Radius-Based Community Discovery

Users can discover groups based on their current location.

Features:

* Configurable search radius
* Nearby group recommendations
* Dynamic distance calculation
* Real-time local discovery

Example:

* “Startup Founders — 2.1 km away”
* “Football Community — 800m away”

---

## 2. Secure Authentication System

Authentication mechanisms include:

* Email & Password Login
* Google OAuth
* Phone OTP Verification
* JWT-based Session Management

---

## 3. Trust-Based User Profiles

Each user profile includes:

* Profile picture
* Bio & interests
* Mutual communities
* Verification indicators
* Community participation visibility

This creates a safer and more trusted local ecosystem.

---

## 4. Public & Private Groups

### Public Groups

Anyone within the permitted radius can join.

### Private Groups

Require approval from group administrators.

### Secret Groups

Invite-only communities hidden from public discovery.

---

## 5. Temporary Geo-Groups

Users can create short-lived communities for:

* events,
* hackathons,
* tournaments,
* local meetups,
* festivals.

These groups automatically expire after a configured duration.

---

## 6. Group Categories

Communities are organized into categories such as:

* Sports
* Technology
* Startups
* Gaming
* Music
* Travel
* Study
* Local Communities

---

## 7. Smart Location Engine

The platform continuously adapts based on user movement.

Capabilities:

* Dynamic nearby group updates
* Geospatial querying
* Radius validation
* Live local discovery

---

## 8. Real-Time Group Chat

Groups support real-time communication through:

* Instant messaging
* Media sharing
* Voice notes
* Polls and reactions
* Reply threads

Powered using WebSockets / Socket.io.

---

## 9. Hyperlocal Feed

A personalized local feed displays:

* Nearby discussions
* Community updates
* Meetups
* Local announcements
* Trending nearby activity

---

## 10. Nearby People Discovery

Users can discover nearby individuals with:

* shared interests,
* mutual groups,
* similar activities.

This encourages networking and real-world interaction.

---

## 11. Community Moderation & Safety

To maintain healthy communities, Dwaar includes:

* Reporting system
* User blocking
* Spam detection
* Toxicity filtering
* Admin moderation tools

---

## 12. Reputation & Community System

Users build trust through participation.

Possible metrics:

* Community score
* Active member badges
* Trusted contributor status
* Event organizer recognition

---

## 13. Interactive Map View

An integrated map interface enables users to:

* visualize nearby groups,
* discover active communities,
* explore local events geographically.

---

## 14. Push Notifications

Real-time notifications for:

* New nearby groups
* Join requests
* Group activity
* Event reminders
* Community announcements

---

# Tech Stack

## Frontend

* React Native
* React Navigation
* Zustand / Redux
* React Native Maps

---

## Backend

* Node.js
* Express.js
* MongoDB
* Socket.io

---

## Supporting Services

* Firebase Cloud Messaging
* Cloudinary
* Google Maps API / Mapbox

---

# System Architecture

## Frontend Responsibilities

* User authentication
* Real-time UI updates
* Maps & location handling
* Community interaction
* State management

---

## Backend Responsibilities

* Authentication & authorization
* Geospatial querying
* Group management
* Real-time messaging
* Notification handling
* Community moderation

---

# Database Design

## Users

Stores:

* profile information,
* interests,
* location metadata,
* privacy preferences.

---

## Groups

Stores:

* group radius,
* geo-coordinates,
* visibility type,
* categories,
* membership data.

---

## Messages

Stores:

* sender,
* group reference,
* timestamps,
* media attachments.

---

## Events

Stores:

* venue,
* attendee information,
* event radius,
* schedules.

---

# Future Scope

The future roadmap of Dwaar includes expanding from a hyperlocal social platform into a broader proximity-driven ecosystem.

## Planned Enhancements

### AI-Based Recommendations

* Smart community suggestions
* Personalized local feeds
* Interest-based nearby discovery

---

### Event Ecosystem

* QR-based event attendance
* Ticketing integration
* Smart meetup management

---

### Hyperlocal Marketplace

* Nearby buying/selling
* Local service exchange
* Community commerce

---

### Emergency Networks

* SOS communities
* Blood donation alerts
* Disaster response coordination

---

### Dynamic Live Radius Rooms

Real-time communities that adapt based on:

* college campuses,
* concerts,
* airports,
* festivals,
* co-working spaces.

---

### Advanced Privacy Controls

* Ghost mode
* Approximate location visibility
* Time-based visibility controls

---

### AI Moderation

* Toxicity detection
* Spam prevention
* Community health analytics

---

# Scalability Considerations

Dwaar is designed with scalability in mind:

* Geospatial indexing using MongoDB `2dsphere`
* WebSocket-based real-time infrastructure
* Modular backend services
* Cloud-ready deployment architecture

---

# Vision

> “Dwaar aims to bridge the gap between digital interaction and real-world community engagement through location-aware social networking.”

---

# Potential Use Cases

* College communities
* Apartment societies
* Startup networking
* Sports matchmaking
* Event coordination
* Travel communities
* Hyperlocal interest groups

---

# Status

Currently under active development.

Frontend: React Native
Backend: Node.js + Express
Database: MongoDB
