# Testing Report

## Project
Meet AI Next.js application

## Test Type
Module-based automated tests

## Test Framework
Vitest

## Execution Result
- Total test files: 6
- Total tests: 45
- Passed: 45
- Failed: 0
- Skipped: 0

## Execution Command
- npm run test

## Coverage Scope
Major module flows only

### Shared / TRPC Guards
- Protected route without session
- Protected route with session
- Premium guard blocks meetings limit
- Premium guard blocks agents limit
- Premium guard allows subscribed user

### Agents Module
- Create agent with valid input
- Create agent with missing required fields
- Update existing agent
- Update missing agent
- Delete existing agent
- Delete missing agent
- Get one existing agent
- Get missing agent
- List agents with pagination
- List agents with search

### Meetings Module
- Create meeting with valid payload
- Create meeting with missing fields
- Create meeting when agent is missing
- Create scheduled meeting
- Update meeting
- Update missing meeting
- Delete meeting
- Delete missing meeting
- Get one meeting
- Get missing meeting
- List meetings with pagination
- Generate chat token
- Generate video token
- Transcript without URL
- Transcript fetch fails
- Transcript with unknown speaker

### Presentations Module
- Get one presentation
- Get missing presentation
- List presentations
- List presentations with search
- Delete presentation
- Delete missing presentation

### Premium Module
- Current subscription for free user
- Current subscription for paid user
- Get available products
- Get free usage counts
- Free usage for paid user

### Dashboard / Home Module
- Return totals and statuses
- Return monthly analytics
- Return top agents and recent meetings

## Notes
- The suite focuses on major business paths and guard conditions.
- It does not include exhaustive edge-case permutations.
- All tests passed successfully in the latest run.

## Related Files
- [Test case matrix](TEST_CASE_MATRIX.md)
- [Shared guards tests](src/trpc/init.test.ts)
- [Agents tests](src/modules/agents/server/procedures.test.ts)
- [Meetings tests](src/modules/meetings/server/procedures.test.ts)
- [Presentations tests](src/modules/presentations/server/procedures.test.ts)
- [Premium tests](src/modules/premium/server/procedures.test.ts)
- [Dashboard tests](src/modules/home/server/procedures.test.ts)
