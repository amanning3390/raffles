# 🐛 UI/UX Bugs Found

## 🔴 Critical Issues

### 1. **Create Page - Missing Step 1 Validation**
**Location**: `app/create/page.tsx:369-373`
- **Issue**: "Continue" button on Step 1 doesn't validate asset amount before proceeding
- **Impact**: User can proceed to Step 2 with invalid/empty asset amount
- **Fix**: Add validation before allowing step progression

### 2. **Raffle Detail - Entry Count Validation Missing**
**Location**: `app/raffle/[id]/page.tsx:274-282`
- **Issue**: No validation that entryCount doesn't exceed user's remaining allowed entries
- **Impact**: User can try to enter more than allowed, causing transaction failure
- **Fix**: Validate against `maxEntriesPerWallet - userEntries`

### 3. **Raffle Detail - No Start Time Check**
**Location**: `app/raffle/[id]/page.tsx:75-91`
- **Issue**: Doesn't check if raffle has started yet (startTime)
- **Impact**: User can try to enter before raffle starts, causing transaction failure
- **Fix**: Check `block.timestamp >= raffle.startTime`

### 4. **Raffle Detail - Progress Bar Can Exceed 100%**
**Location**: `app/raffle/[id]/page.tsx:60-63`
- **Issue**: Progress percentage calculation doesn't cap at 100%
- **Impact**: Visual bug showing progress > 100%
- **Fix**: Use `Math.min(progressPercentage, 100)`

### 5. **Raffle Detail - No Winners Display**
**Location**: `app/raffle/[id]/page.tsx`
- **Issue**: Winners are fetched but never displayed
- **Impact**: Users can't see who won after raffle ends
- **Fix**: Add winners display section

### 6. **Raffle Detail - No Claim Prize Functionality**
**Location**: `app/raffle/[id]/page.tsx`
- **Issue**: No button/functionality for winners to claim prizes
- **Impact**: Winners can't claim their prizes from the UI
- **Fix**: Add claim prize button and hook integration

## 🟡 High Priority Issues

### 7. **Create Page - Missing Asset Amount Error Display in Step 1**
**Location**: `app/create/page.tsx:308-318`
- **Issue**: Asset amount input doesn't show error message
- **Impact**: User doesn't know why they can't proceed
- **Fix**: Add error prop to Input component

### 8. **Create Page - No Balance Check**
**Location**: `app/create/page.tsx:100-135`
- **Issue**: Doesn't check if user has enough ETH/tokens before creating
- **Impact**: Transaction will fail, poor UX
- **Fix**: Add balance check and warning

### 9. **Raffle Detail - Invalid Raffle ID Handling**
**Location**: `app/raffle/[id]/page.tsx:26`
- **Issue**: If raffleId is invalid (NaN, negative, etc.), BigInt conversion will fail
- **Impact**: Page crashes with invalid IDs
- **Fix**: Validate raffle ID before converting to BigInt

### 10. **Profile Page - Buttons Don't Work**
**Location**: `app/profile/[address]/page.tsx:192, 279`
- **Issue**: "End Raffle" and "Claim Prize" buttons have no functionality
- **Impact**: Users can't perform these actions
- **Fix**: Connect to contract hooks

### 11. **Homepage - Still Uses Mock Data**
**Location**: `app/page.tsx:11-62`
- **Issue**: Homepage shows mock raffles instead of real data
- **Impact**: Users see fake raffles
- **Fix**: Connect to contract (known issue, lower priority)

## 🟠 Medium Priority Issues

### 12. **Accessibility - Missing ARIA Labels**
**Location**: Multiple pages
- **Issue**: Filter buttons, form inputs lack proper ARIA labels
- **Impact**: Poor accessibility for screen readers
- **Fix**: Add aria-label attributes

### 13. **Loading States - Inconsistent**
**Location**: Multiple pages
- **Issue**: Some loading states show "Loading..." text, others show nothing
- **Impact**: Inconsistent UX
- **Fix**: Use consistent loading skeletons

### 14. **Error Handling - No Error Boundaries**
**Location**: App structure
- **Issue**: No error boundaries to catch React errors
- **Impact**: Entire app crashes on error
- **Fix**: Add error boundaries (component exists but not used)

### 15. **Form Validation - Entry Count Edge Cases**
**Location**: `app/raffle/[id]/page.tsx:274-282`
- **Issue**: Entry count can be empty string, negative, or decimal
- **Impact**: Invalid input causes errors
- **Fix**: Add input type="number" with min/max and validation

### 16. **Time Display - Negative Time**
**Location**: `components/raffle/RaffleCard.tsx:55-68`
- **Issue**: If raffle already ended, time calculation could show negative
- **Impact**: Confusing display
- **Fix**: Already handled but could be clearer

### 17. **Profile Page - Address Validation**
**Location**: `app/profile/[address]/page.tsx:63`
- **Issue**: No validation that address param is valid Ethereum address
- **Impact**: Page could crash with invalid address
- **Fix**: Validate address format

## 🔵 Low Priority / UX Improvements

### 18. **Empty States - Could Be Better**
**Location**: Multiple pages
- **Issue**: Empty states are basic, could be more engaging
- **Impact**: Minor UX issue
- **Fix**: Improve empty state designs

### 19. **Toast Notifications - No Accessibility**
**Location**: `components/ui/toast.tsx`
- **Issue**: Toast notifications may not be accessible to screen readers
- **Impact**: Accessibility issue
- **Fix**: Add ARIA live regions

### 20. **Loading Skeletons - Missing**
**Location**: Multiple pages
- **Issue**: No skeleton loaders, just "Loading..." text
- **Impact**: Less polished UX
- **Fix**: Add skeleton components

### 21. **Responsive Design - Mobile Check Needed**
**Location**: All pages
- **Issue**: Need to verify mobile responsiveness
- **Impact**: May have issues on small screens
- **Fix**: Test and fix responsive issues

### 22. **Navigation - No Active State**
**Location**: `components/Navbar.tsx`
- **Issue**: Navigation links don't show active state
- **Impact**: User doesn't know which page they're on
- **Fix**: Add active state styling

### 23. **Form - No Auto-focus**
**Location**: `app/create/page.tsx`
- **Issue**: First input doesn't auto-focus
- **Impact**: Minor UX issue
- **Fix**: Add autoFocus to first input

### 24. **Error Messages - Could Be More Specific**
**Location**: Multiple pages
- **Issue**: Generic error messages don't help users fix issues
- **Impact**: Users don't know how to fix errors
- **Fix**: Add more specific error messages

