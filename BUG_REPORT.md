# 🐛 Bug Report - Raffles Platform

This document contains all identified bugs and issues in the raffles codebase, categorized by severity and component.

## 🔴 CRITICAL BUGS (Smart Contract)

### 1. **Duplicate Winner Selection Bug**
**Location**: `contracts/src/RaffleCore.sol:174-177`

**Issue**: The winner selection algorithm can select the same winner multiple times when `actualWinnerCount > 1`. The code uses `(randomSeed + i) % participantCount` which can result in duplicate indices.

**Impact**: Multiple winners could be the same address, reducing fairness and potentially causing prize distribution issues.

**Code**:
```solidity
for (uint256 i = 0; i < actualWinnerCount; i++) {
    uint256 winnerIndex = (randomSeed + i) % participantCount;
    winners[raffleId].push(participants[raffleId][winnerIndex]);
}
```

**Fix**: Implement a deduplication mechanism or use a shuffle algorithm to ensure unique winners.

---

### 2. **Prize Division Mismatch**
**Location**: `contracts/src/RaffleCore.sol:217, 223`

**Issue**: Prize is divided by `raffle.winnerCount`, but if there are fewer participants than winners, `actualWinnerCount` is used instead. This causes incorrect prize amounts.

**Impact**: Winners receive incorrect prize amounts. If 3 winners expected but only 2 participants, each gets `prizeAmount / 3` instead of `prizeAmount / 2`.

**Code**:
```solidity
uint256 prizeAmount = raffle.assetAmount / raffle.winnerCount;
```

**Fix**: Use `actualWinnerCount` (from `endRaffle`) or store it in the raffle config.

---

### 3. **No Creator Refund When Raffle Ends with Zero Entries**
**Location**: `contracts/src/RaffleCore.sol:180-183`

**Issue**: When a raffle ends with no entries, the comment says "refund creator" but there's no actual refund code. The prize asset remains locked in the contract.

**Impact**: Creator loses their prize asset if no one enters the raffle.

**Code**:
```solidity
} else {
    // No entries - refund creator
    emit RaffleEnded(raffleId, new address[](0));
}
```

**Fix**: Add refund logic to return the prize asset to the creator.

---

### 4. **Platform Fee Withdrawal Has No Access Control**
**Location**: `contracts/src/RaffleCore.sol:323-329`

**Issue**: `withdrawPlatformFees()` can be called by anyone, allowing any address to drain all accumulated platform fees.

**Impact**: Platform fees can be stolen by anyone.

**Code**:
```solidity
function withdrawPlatformFees() external {
    uint256 amount = accumulatedFees;
    accumulatedFees = 0;
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Withdrawal failed");
}
```

**Fix**: Add access control (owner, DAO, or multisig).

---

### 5. **NFT Raffles Can Have Multiple Winners But Only First Gets NFT**
**Location**: `contracts/src/RaffleCore.sol:228-234`

**Issue**: NFT raffles can be created with `winnerCount > 1`, but only the first winner (winnerIndex == 0) receives the NFT. Other winners get nothing.

**Impact**: Winners 2-N receive no prize, losing their entry fees unfairly.

**Code**:
```solidity
} else if (raffle.assetType == AssetType.ERC721) {
    // ERC-721 NFT prize - only first winner gets NFT (can't split NFTs)
    // For NFT raffles, winnerCount should be 1
    if (winnerIndex == 0) {
        IERC721 nft = IERC721(raffle.assetContract);
        nft.safeTransferFrom(address(this), msg.sender, raffle.assetTokenId);
    }
}
```

**Fix**: Either validate `winnerCount == 1` in `createRaffle` for NFT raffles, or implement a different prize mechanism for NFT raffles with multiple winners.

---

### 6. **Entry Fees Only Transferred on First Winner Claim**
**Location**: `contracts/src/RaffleCore.sol:238-247`

**Issue**: Entry fees are only transferred to the creator when the first winner (winnerIndex == 0) claims. If no winners claim, the creator never receives payment.

**Impact**: Creator may never receive entry fees if winners don't claim.

**Code**:
```solidity
// Transfer entry fees to creator on first claim (minus platform fee)
if (winnerIndex == 0) {
    uint256 totalFees = totalEntries[raffleId] * raffle.entryFee;
    // ... transfer logic
}
```

**Fix**: Transfer entry fees when raffle ends, not when first winner claims.

---

### 7. **Integer Division Precision Loss**
**Location**: `contracts/src/RaffleCore.sol:217, 223`

**Issue**: When dividing prizes among winners, integer division can cause precision loss. For example, 1 ETH split among 3 winners = 0 ETH each (0.333... rounds down to 0).

**Impact**: Small prizes may result in zero amounts for winners.

**Code**:
```solidity
uint256 prizeAmount = raffle.assetAmount / raffle.winnerCount;
```

**Fix**: Use a more sophisticated division that handles remainders, or validate that `assetAmount >= winnerCount` to prevent zero amounts.

---

## 🟡 HIGH PRIORITY BUGS (Smart Contract)

### 8. **Weak Randomness Source**
**Location**: `contracts/src/RaffleCore.sol:170-172`

**Issue**: Uses `block.timestamp` which can be manipulated by miners within a small range, making winner selection somewhat predictable.

**Impact**: Reduced fairness, potential for manipulation in high-value raffles.

**Code**:
```solidity
uint256 randomSeed = uint256(
    keccak256(abi.encodePacked(block.timestamp, block.prevrandao, raffleId))
);
```

**Fix**: For production, integrate Chainlink VRF or use commit-reveal scheme. Document the limitation clearly.

---

### 9. **Missing Validation: Start Time Can Be in Past**
**Location**: `contracts/src/RaffleCore.sol:56`

**Issue**: The validation `config.startTime < block.timestamp` should be `config.startTime <= block.timestamp` or allow immediate start. Current check allows `startTime == block.timestamp` which might be problematic.

**Impact**: Edge case where raffle might start before intended time.

**Code**:
```solidity
if (config.startTime < block.timestamp) revert InvalidTimeRange();
```

**Fix**: Clarify the intended behavior and adjust validation accordingly.

---

### 10. **No Validation for Zero Entry Fee**
**Location**: `contracts/src/RaffleCore.sol:49-108`

**Issue**: `createRaffle` doesn't validate that `entryFee > 0`, allowing free raffles which could be abused.

**Impact**: Potential for spam or abuse with zero-fee raffles.

**Fix**: Add validation: `if (config.entryFee == 0) revert InvalidEntryFee();`

---

## 🟠 MEDIUM PRIORITY BUGS (Frontend)

### 11. **Frontend Uses Mock Data Instead of Contract**
**Location**: `app/page.tsx`, `app/raffle/[id]/page.tsx`, `app/profile/[address]/page.tsx`

**Issue**: All pages use hardcoded mock data instead of fetching from the smart contract. The hooks (`useRaffleContract.ts`) are defined but never used.

**Impact**: Application doesn't actually work - users can't see real raffles, create raffles, or enter raffles.

**Code Examples**:
- `app/page.tsx:11-62` - Mock raffles array
- `app/raffle/[id]/page.tsx:13-31` - Mock raffle data
- `app/profile/[address]/page.tsx:12-61` - Mock user data

**Fix**: Replace mock data with actual contract calls using the hooks.

---

### 12. **Create Raffle Page Doesn't Call Contract**
**Location**: `app/create/page.tsx:395`

**Issue**: The "Create Raffle" button doesn't actually call `useCreateRaffle()` hook. The form collects data but doesn't submit it.

**Impact**: Users cannot create raffles.

**Fix**: Integrate `useCreateRaffle` hook and handle transaction states.

---

### 13. **Raffle Detail Page Doesn't Enter Raffles**
**Location**: `app/raffle/[id]/page.tsx:55-62`

**Issue**: The `handleEnter` function is a mock that just shows an alert. It doesn't call `useEnterRaffle()`.

**Impact**: Users cannot enter raffles.

**Fix**: Integrate `useEnterRaffle` hook.

---

### 14. **Missing Contract Address Validation**
**Location**: `lib/contract.ts:5`

**Issue**: `RAFFLE_CORE_ADDRESS` is read from environment but not validated. If undefined, it will cause runtime errors.

**Impact**: Application crashes if environment variable is missing.

**Code**:
```typescript
export const RAFFLE_CORE_ADDRESS = process.env.NEXT_PUBLIC_RAFFLE_CORE_ADDRESS as `0x${string}`;
```

**Fix**: Add validation and error handling for missing address.

---

### 15. **No Error Handling for Failed Transactions**
**Location**: `hooks/useRaffleContract.ts`

**Issue**: Hooks return errors but frontend pages don't display them to users.

**Impact**: Users don't know why transactions fail.

**Fix**: Add error display in UI components.

---

## 🔵 LOW PRIORITY / CODE QUALITY ISSUES

### 16. **Missing Input Validation in Frontend**
**Location**: `app/create/page.tsx`

**Issue**: Form doesn't validate:
- Asset amount > 0
- Entry fee > 0
- Max entries > 0
- Duration > 0
- Winner count > 0 and <= max entries
- For NFTs: winner count must be 1

**Impact**: Users can submit invalid data, causing transaction failures.

---

### 17. **No Loading States During Contract Reads**
**Location**: Frontend pages

**Issue**: When fetching raffle data from contract, there's no loading indicator.

**Impact**: Poor UX - users don't know if data is loading or if there's an error.

---

### 18. **Homepage Shows Mock Stats**
**Location**: `app/page.tsx:116-141`

**Issue**: Statistics are hardcoded and don't reflect real contract data.

**Impact**: Misleading information to users.

---

### 19. **Profile Page Doesn't Fetch Real Data**
**Location**: `app/profile/[address]/page.tsx`

**Issue**: Uses mock data instead of querying contract for user's created/entered/won raffles.

**Impact**: Profile page shows incorrect information.

---

### 20. **No Tests for Smart Contract**
**Location**: `contracts/test/RaffleCore.t.sol`

**Issue**: Test file only has a placeholder test. No actual tests exist.

**Impact**: No confidence in contract correctness, bugs go undetected.

---

## 📋 SUMMARY

**Total Bugs Found**: 20

- **Critical (Smart Contract)**: 7
- **High Priority (Smart Contract)**: 3
- **Medium Priority (Frontend)**: 5
- **Low Priority (Code Quality)**: 5

**Most Critical Issues**:
1. Duplicate winner selection
2. Platform fee withdrawal access control
3. No creator refund when raffle ends with zero entries
4. Frontend not connected to contract (all pages use mock data)

**Recommended Fix Order**:
1. Fix smart contract critical bugs (1-7)
2. Add access control to platform fee withdrawal (4)
3. Connect frontend to contract (11-13)
4. Add input validation and error handling (14-15)
5. Write comprehensive tests (20)

---

## 🔧 QUICK FIXES NEEDED

1. **Immediate**: Add access control to `withdrawPlatformFees()`
2. **Immediate**: Fix duplicate winner selection
3. **Immediate**: Add creator refund when raffle ends with no entries
4. **High Priority**: Connect frontend to contract
5. **High Priority**: Add input validation

---

*Report generated after comprehensive codebase review*

