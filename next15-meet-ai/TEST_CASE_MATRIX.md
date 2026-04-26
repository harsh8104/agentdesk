# Test Case Matrix

This matrix covers the major module-level cases implemented in the test suite.

## Shared / TRPC Guards

| ID | Module | Scenario | Preconditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| SH_001 | Shared | Protected route without session | No active session | Unauthorized error | Route rejected with 401 Unauthorized error | ✅ Pass |
| SH_002 | Shared | Protected route with session | Valid session exists | Request succeeds | Route accepted and executed successfully | ✅ Pass |
| SH_003 | Shared | Premium guard blocks meetings limit | Free user at meeting limit | Forbidden error | User blocked with error message when limit (3) reached | ✅ Pass |
| SH_004 | Shared | Premium guard blocks agents limit | Free user at agent limit | Forbidden error | User blocked with error message when limit (1) reached | ✅ Pass |
| SH_005 | Shared | Premium guard allows subscribed user | Active subscription exists | Request succeeds | Subscribed user allowed to exceed free limits | ✅ Pass |

## Agents Module

| ID | Module | Scenario | Preconditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| AG_001 | Agents | Create agent with valid input | Authenticated user | Agent is created | Agent created with id, name, and instructions stored in DB | ✅ Pass |
| AG_002 | Agents | Create agent with missing required fields | Authenticated user | Validation error | Zod validation rejected empty name/instructions fields | ✅ Pass |
| AG_003 | Agents | Update existing agent | Owned agent exists | Agent is updated | Agent record updated with new values returned | ✅ Pass |
| AG_004 | Agents | Update missing agent | Agent not found | Not found error | Returned TRPCError "Agent not found" with code NOT_FOUND | ✅ Pass |
| AG_005 | Agents | Delete existing agent | Owned agent exists | Agent is deleted | Agent removed from DB, id returned | ✅ Pass |
| AG_006 | Agents | Delete missing agent | Agent not found | Not found error | Returned TRPCError "Agent not found" with code NOT_FOUND | ✅ Pass |
| AG_007 | Agents | Get one existing agent | Owned agent exists | Agent data + meetingCount returned | Agent record returned with meeting count aggregated | ✅ Pass |
| AG_008 | Agents | Get missing agent | Agent not found | Not found error | Returned TRPCError "Agent not found" with code NOT_FOUND | ✅ Pass |
| AG_009 | Agents | List agents with pagination | User has agents | Paginated list returned | Returned items array with total and totalPages calculated | ✅ Pass |
| AG_010 | Agents | List agents with search | Search term provided | Filtered list returned | ilike() search filtered results by agent name | ✅ Pass |

## Meetings Module

| ID | Module | Scenario | Preconditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| MT_001 | Meetings | Create meeting with valid payload | Authenticated user, valid agent | Meeting is created | Meeting inserted with agent lookup verified, id/name returned | ✅ Pass |
| MT_002 | Meetings | Create meeting with missing fields | Authenticated user | Validation error | Zod validation rejected empty name/agentId fields | ✅ Pass |
| MT_003 | Meetings | Create meeting when agent is missing | Agent lookup fails | Not found error | Returned TRPCError "Agent not found" after DB lookup | ✅ Pass |
| MT_004 | Meetings | Create scheduled meeting | scheduledAt is provided | Reminder event is sent | Inngest event triggered with meetingId, userId, scheduledAt | ✅ Pass |
| MT_005 | Meetings | Update meeting | Owned meeting exists | Meeting is updated | Meeting record updated, new values returned | ✅ Pass |
| MT_006 | Meetings | Update missing meeting | Meeting not found | Not found error | Returned TRPCError "Meeting not found" with code NOT_FOUND | ✅ Pass |
| MT_007 | Meetings | Delete meeting | Owned meeting exists | Meeting is deleted | Meeting removed from DB, id returned | ✅ Pass |
| MT_008 | Meetings | Delete missing meeting | Meeting not found | Not found error | Returned TRPCError "Meeting not found" with code NOT_FOUND | ✅ Pass |
| MT_009 | Meetings | Get one meeting | Meeting exists with joined agent | Meeting + agent + duration returned | Meeting joined with agent info, duration calculated in seconds | ✅ Pass |
| MT_010 | Meetings | Get missing meeting | Meeting not found | Not found error | Returned TRPCError "Meeting not found" with code NOT_FOUND | ✅ Pass |
| MT_011 | Meetings | List meetings with pagination | User has meetings | Paginated list returned | Returned items with total count and totalPages calculated | ✅ Pass |
| MT_014 | Meetings | Transcript without URL | Transcript URL missing | Empty array returned | Empty array [] returned when transcriptUrl is null | ✅ Pass |
| MT_015 | Meetings | Transcript fetch fails | Fetch/parse fails | Empty array returned | Empty array [] returned on fetch/parse error, error caught and logged | ✅ Pass |

## Presentations Module

| ID | Module | Scenario | Preconditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| PR_001 | Presentations | Get one presentation | Owned presentation exists | Presentation + ordered slides returned | Presentation fetched with slides ordered by slideNumber | ✅ Pass |
| PR_002 | Presentations | Get missing presentation | Presentation not found | Not found error | Returned TRPCError "Presentation not found" with code NOT_FOUND | ✅ Pass |
| PR_003 | Presentations | List presentations | User has presentations | Paginated list returned | Returned items with total count and totalPages calculated | ✅ Pass |
| PR_004 | Presentations | List presentations with search | Search term provided | Filtered list returned | ilike() search filtered results by presentation name | ✅ Pass |
| PR_005 | Presentations | Delete presentation | Owned presentation exists | Presentation removed | Presentation deleted from DB, id returned | ✅ Pass |
| PR_006 | Presentations | Delete missing presentation | Presentation not found | Not found error | Returned TRPCError "Presentation not found" with code NOT_FOUND | ✅ Pass |

## Premium Module

| ID | Module | Scenario | Preconditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| PM_001 | Premium | Current subscription for free user | No active subscription | `null` returned | getStateExternal() called, activeSubscriptions array empty, null returned | ✅ Pass |
| PM_002 | Premium | Current subscription for paid user | Active subscription exists | Product returned | Active subscription found, product fetched by productId and returned | ✅ Pass |
| PM_003 | Premium | Get available products | Products exist | Recurring products list returned | Products filtered by recurring: true and returned in array | ✅ Pass |

## Dashboard / Home Module

| ID | Module | Scenario | Preconditions | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| DB_001 | Dashboard | Return totals and statuses | User has meetings and agents | Totals and status buckets returned | Totals aggregated by status (upcoming/active/completed/processing), counts returned | ✅ Pass |
| DB_002 | Dashboard | Return monthly analytics | User has meeting history | Monthly aggregation returned | Meetings aggregated by month, with count and duration metrics | ✅ Pass |
| DB_003 | Dashboard | Return top agents and recent meetings | User has meeting history | Top agents and recent meetings returned | Top 5 agents by frequency and recent 10 meetings fetched with agent data | ✅ Pass |

## Summary

- Total test cases covered: **38**
- Tests Passed: **38/38** (100%)
- Format: Detailed test documentation with expected vs actual results
- Scope: Major module flows (Authentication, CRUD operations, Data aggregation)
- Purpose: Comprehensive test tracking with granular result documentation

## Abbreviations

| Abbreviation | Full Form |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| tRPC | TypeScript Remote Procedure Call |
| ORM | Object-Relational Mapping |
| OAuth | Open Authorization |
| SDK | Software Development Kit |
| VAD | Voice Activity Detection |
| JSONL | JSON Lines |
| HTML | Hypertext Markup Language |
| PPTX | PowerPoint Presentation |
| DB | Database |
| JWT | JSON Web Token |
| REST | Representational State Transfer |
| JSON | JavaScript Object Notation |
| UI | User Interface |
| SSO | Single Sign-On |
| SMS | Stream Messaging Service |
| CRUD | Create, Read, Update, Delete |
| GPT | Generative Pre-trained Transformer |
