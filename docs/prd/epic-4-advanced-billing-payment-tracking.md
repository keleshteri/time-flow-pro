# Epic 4: Advanced Billing & Payment Tracking

**Epic Goal:** Implement the sophisticated billing system that separates tracked hours from billable hours and manages the complete payment lifecycle. Users can configure flexible billing rates, track client payments through Ready to Bill → Billed → Paid stages, and maintain professional invoicing records with accurate revenue calculations.

## Story 4.1: Flexible Billing Rate Configuration
As a freelancer with multiple clients and service types,
I want to configure different billing rates for different projects and task types,
so that I can accurately price my work and maximize revenue.

**Acceptance Criteria:**
1. Default hourly rate setting for new projects and tasks
2. Project-specific rate overrides for different clients
3. Task-type-specific rates (development, review, meeting, research, etc.)
4. Rate history tracking with effective date ranges
5. Bulk rate update functionality for multiple projects/tasks
6. Rate templates for common service types
7. Rate calculation preview showing potential revenue before committing
8. Warning notifications when rates haven't been set for new entries

## Story 4.2: Billable vs. Tracked Hours Management
As a freelancer,
I want to set billable hours separately from tracked hours,
so that I can offer competitive pricing while maintaining accurate work records.

**Acceptance Criteria:**
1. Billable hours field for each time entry (defaults to tracked hours)
2. Quick adjustment controls (25%, 50%, 75%, 100% of tracked time)
3. Billable hours cannot exceed tracked hours without explicit confirmation
4. Visual indicators distinguishing billable vs. non-billable time
5. Bulk editing for converting multiple entries to billable
6. Billable time calculation across projects with running totals
7. Reporting showing billable efficiency ratios (billable/tracked percentages)
8. Notes field to explain billing adjustments for audit purposes

## Story 4.3: Three-Stage Billing Workflow Implementation
As a freelancer,
I want to manage client billing through Ready to Bill → Billed → Paid stages,
so that I can track the complete payment lifecycle and manage cash flow.

**Acceptance Criteria:**
1. Ready to Bill: Automatic identification of billable entries not yet invoiced
2. Mark entries as "Billed" with invoice reference and date
3. Mark invoices as "Paid" with payment date and amount
4. Billing stage indicators with color coding and status transitions
5. Bulk operations for moving multiple entries between stages
6. Invoice generation summaries grouped by client and date range
7. Outstanding payment calculations and aging reports
8. Payment reminder functionality with customizable follow-up dates

## Story 4.4: Professional Invoice Generation & Management
As a freelancer,
I want to generate professional invoices from my billable time entries,
so that I can send clients accurate, detailed billing information.

**Acceptance Criteria:**
1. Invoice templates with customizable business information and branding
2. Automatic invoice generation from selected Ready to Bill entries
3. Invoice numbering system with customizable formats
4. Line items showing date, task description, hours, rate, and total
5. Invoice totals with subtotal, tax calculations, and grand total
6. PDF export functionality for professional invoice delivery
7. Invoice history with status tracking (draft, sent, paid, overdue)
8. Invoice customization options (terms, payment methods, notes)

## Story 4.5: Revenue Analytics & Payment Tracking
As a freelancer,
I want comprehensive revenue analytics and payment tracking,
so that I can understand my business performance and plan for growth.

**Acceptance Criteria:**
1. Revenue dashboard showing daily, weekly, monthly income trends
2. Payment status overview with outstanding amounts and aging analysis
3. Client-specific revenue reports with payment history
4. Profitability analysis comparing tracked time vs. revenue earned
5. Cash flow projections based on billed but unpaid invoices
6. Revenue per hour calculations across different service types
7. Year-over-year growth comparisons with trend analysis
8. Export capabilities for accounting software integration (QuickBooks, etc.)
9. Tax period summaries for business accounting purposes
