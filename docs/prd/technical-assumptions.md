# Technical Assumptions

## Repository Structure: Monorepo
Single repository containing the complete TimeFlow Pro web application with clear folder structure for components, services, and utilities.

## Service Architecture
**Monolith** - Single-page web application with modular architecture. All functionality contained within one deployable unit for MVP simplicity, with clear separation between:
- Timer/Time Entry modules
- Task Management modules  
- Billing/Payment modules
- Integration modules (Asana, Cloud Storage)
- Analytics/Reporting modules

## Testing Requirements
**Unit + Integration** - Comprehensive testing strategy including:
- Unit tests for core business logic (time calculations, billing logic)
- Integration tests for external APIs (Asana, JSONBin.io)
- Manual testing convenience methods for UI workflows
- Local storage and sync operation testing

## Additional Technical Assumptions and Requests

**Frontend Technology Stack:**
- **HTML5/CSS3/Vanilla JavaScript** for maximum performance and minimal dependencies
- **CSS Grid/Flexbox** for responsive layout without framework overhead
- **LocalStorage API** for offline capability and data persistence
- **Fetch API** for all external integrations

**External Service Dependencies:**
- **Asana REST API v1.0** with Personal Access Token authentication
- **JSONBin.io API** as primary cloud storage (free tier sufficient for MVP)
- **Rate limiting compliance** - 150 requests/minute for Asana API
- **Offline-first architecture** - full functionality without network connectivity

**Browser Compatibility:**
- **Minimum support:** Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Progressive enhancement** approach for older browsers
- **ES6+ JavaScript** with appropriate polyfills if needed

**Performance Constraints:**
- **10MB maximum** localStorage usage
- **Sub-3-second** page load times on 3G connections
- **Client-side only** - no server infrastructure required for MVP
