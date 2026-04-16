# Test Case Matrix

This matrix covers the major module-level cases implemented in the test suite.

## Shared / TRPC Guards

| ID | Module | Scenario | Preconditions | Expected Result | Test File |
|---|---|---|---|---|---|
| SH_001 | Shared | Protected route without session | No active session | Unauthorized error | `src/trpc/init.test.ts` |
| SH_002 | Shared | Protected route with session | Valid session exists | Request succeeds | `src/trpc/init.test.ts` |
| SH_003 | Shared | Premium guard blocks meetings limit | Free user at meeting limit | Forbidden error | `src/trpc/init.test.ts` |
| SH_004 | Shared | Premium guard blocks agents limit | Free user at agent limit | Forbidden error | `src/trpc/init.test.ts` |
| SH_005 | Shared | Premium guard allows subscribed user | Active subscription exists | Request succeeds | `src/trpc/init.test.ts` |

## Agents Module

| ID | Module | Scenario | Preconditions | Expected Result | Test File |
|---|---|---|---|---|---|
| AG_001 | Agents | Create agent with valid input | Authenticated user | Agent is created | `src/modules/agents/server/procedures.test.ts` |
| AG_002 | Agents | Create agent with missing required fields | Authenticated user | Validation error | `src/modules/agents/server/procedures.test.ts` |
| AG_003 | Agents | Update existing agent | Owned agent exists | Agent is updated | `src/modules/agents/server/procedures.test.ts` |
| AG_004 | Agents | Update missing agent | Agent not found | Not found error | `src/modules/agents/server/procedures.test.ts` |
| AG_005 | Agents | Delete existing agent | Owned agent exists | Agent is deleted | `src/modules/agents/server/procedures.test.ts` |
| AG_006 | Agents | Delete missing agent | Agent not found | Not found error | `src/modules/agents/server/procedures.test.ts` |
| AG_007 | Agents | Get one existing agent | Owned agent exists | Agent data + meetingCount returned | `src/modules/agents/server/procedures.test.ts` |
| AG_008 | Agents | Get missing agent | Agent not found | Not found error | `src/modules/agents/server/procedures.test.ts` |
| AG_009 | Agents | List agents with pagination | User has agents | Paginated list returned | `src/modules/agents/server/procedures.test.ts` |
| AG_010 | Agents | List agents with search | Search term provided | Filtered list returned | `src/modules/agents/server/procedures.test.ts` |

## Meetings Module

| ID | Module | Scenario | Preconditions | Expected Result | Test File |
|---|---|---|---|---|---|
| MT_001 | Meetings | Create meeting with valid payload | Authenticated user, valid agent | Meeting is created | `src/modules/meetings/server/procedures.test.ts` |
| MT_002 | Meetings | Create meeting with missing fields | Authenticated user | Validation error | `src/modules/meetings/server/procedures.test.ts` |
| MT_003 | Meetings | Create meeting when agent is missing | Agent lookup fails | Not found error | `src/modules/meetings/server/procedures.test.ts` |
| MT_004 | Meetings | Create scheduled meeting | scheduledAt is provided | Reminder event is sent | `src/modules/meetings/server/procedures.test.ts` |
| MT_005 | Meetings | Update meeting | Owned meeting exists | Meeting is updated | `src/modules/meetings/server/procedures.test.ts` |
| MT_006 | Meetings | Update missing meeting | Meeting not found | Not found error | `src/modules/meetings/server/procedures.test.ts` |
| MT_007 | Meetings | Delete meeting | Owned meeting exists | Meeting is deleted | `src/modules/meetings/server/procedures.test.ts` |
| MT_008 | Meetings | Delete missing meeting | Meeting not found | Not found error | `src/modules/meetings/server/procedures.test.ts` |
| MT_009 | Meetings | Get one meeting | Meeting exists with joined agent | Meeting + agent + duration returned | `src/modules/meetings/server/procedures.test.ts` |
| MT_010 | Meetings | Get missing meeting | Meeting not found | Not found error | `src/modules/meetings/server/procedures.test.ts` |
| MT_011 | Meetings | List meetings with pagination | User has meetings | Paginated list returned | `src/modules/meetings/server/procedures.test.ts` |
| MT_012 | Meetings | Generate chat token | Authenticated user | Chat token returned and user upserted | `src/modules/meetings/server/procedures.test.ts` |
| MT_013 | Meetings | Generate video token | Authenticated user | Video token returned | `src/modules/meetings/server/procedures.test.ts` |
| MT_014 | Meetings | Transcript without URL | Transcript URL missing | Empty array returned | `src/modules/meetings/server/procedures.test.ts` |
| MT_015 | Meetings | Transcript fetch fails | Fetch/parse fails | Empty array returned | `src/modules/meetings/server/procedures.test.ts` |
| MT_016 | Meetings | Transcript with unknown speaker | Speaker not mapped | Unknown fallback user used | `src/modules/meetings/server/procedures.test.ts` |

## Presentations Module

| ID | Module | Scenario | Preconditions | Expected Result | Test File |
|---|---|---|---|---|---|
| PR_001 | Presentations | Get one presentation | Owned presentation exists | Presentation + ordered slides returned | `src/modules/presentations/server/procedures.test.ts` |
| PR_002 | Presentations | Get missing presentation | Presentation not found | Not found error | `src/modules/presentations/server/procedures.test.ts` |
| PR_003 | Presentations | List presentations | User has presentations | Paginated list returned | `src/modules/presentations/server/procedures.test.ts` |
| PR_004 | Presentations | List presentations with search | Search term provided | Filtered list returned | `src/modules/presentations/server/procedures.test.ts` |
| PR_005 | Presentations | Delete presentation | Owned presentation exists | Presentation removed | `src/modules/presentations/server/procedures.test.ts` |
| PR_006 | Presentations | Delete missing presentation | Presentation not found | Not found error | `src/modules/presentations/server/procedures.test.ts` |

## Premium Module

| ID | Module | Scenario | Preconditions | Expected Result | Test File |
|---|---|---|---|---|---|
| PM_001 | Premium | Current subscription for free user | No active subscription | `null` returned | `src/modules/premium/server/procedures.test.ts` |
| PM_002 | Premium | Current subscription for paid user | Active subscription exists | Product returned | `src/modules/premium/server/procedures.test.ts` |
| PM_003 | Premium | Get available products | Products exist | Recurring products list returned | `src/modules/premium/server/procedures.test.ts` |
| PM_004 | Premium | Get free usage counts | Free user | Meeting/agent/presentation counts returned | `src/modules/premium/server/procedures.test.ts` |
| PM_005 | Premium | Free usage for paid user | Active subscription exists | `null` returned | `src/modules/premium/server/procedures.test.ts` |

## Dashboard / Home Module

| ID | Module | Scenario | Preconditions | Expected Result | Test File |
|---|---|---|---|---|---|
| DB_001 | Dashboard | Return totals and statuses | User has meetings and agents | Totals and status buckets returned | `src/modules/home/server/procedures.test.ts` |
| DB_002 | Dashboard | Return monthly analytics | User has meeting history | Monthly aggregation returned | `src/modules/home/server/procedures.test.ts` |
| DB_003 | Dashboard | Return top agents and recent meetings | User has meeting history | Top agents and recent meetings returned | `src/modules/home/server/procedures.test.ts` |

## Summary

- Total test cases covered: **45**
- Scope: **major module flows only**
- Purpose: **approval-ready module-based test plan**
