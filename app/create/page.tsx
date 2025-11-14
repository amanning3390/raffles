'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccount } from 'wagmi';
import { parseEther, Address, isAddress } from 'viem';
import { AssetType } from '@/lib/contract';
import { useCreateRaffle } from '@/hooks/useRaffleContract';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export default function CreateRafflePage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { showToast } = useToast();
  const { createRaffle, isPending, isSuccess, error, hash } = useCreateRaffle();
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    assetType: AssetType.ETH,
    assetContract: '',
    assetTokenId: '',
    assetAmount: '',
    entryFee: '',
    maxEntries: '100',
    maxEntriesPerWallet: '10',
    duration: '24',
    winnerCount: '1',
    title: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.assetAmount || parseFloat(formData.assetAmount) <= 0) {
      errors.assetAmount = 'Asset amount must be greater than 0';
    }

    if (!formData.entryFee || parseFloat(formData.entryFee) <= 0) {
      errors.entryFee = 'Entry fee must be greater than 0';
    }

    if (!formData.maxEntries || parseInt(formData.maxEntries) <= 0) {
      errors.maxEntries = 'Max entries must be greater than 0';
    }

    if (!formData.maxEntriesPerWallet || parseInt(formData.maxEntriesPerWallet) <= 0) {
      errors.maxEntriesPerWallet = 'Max entries per wallet must be greater than 0';
    }

    if (parseInt(formData.maxEntriesPerWallet) > parseInt(formData.maxEntries)) {
      errors.maxEntriesPerWallet = 'Max entries per wallet cannot exceed max entries';
    }

    if (!formData.duration || parseFloat(formData.duration) <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }

    if (!formData.winnerCount || parseInt(formData.winnerCount) <= 0) {
      errors.winnerCount = 'Winner count must be greater than 0';
    }

    if (parseInt(formData.winnerCount) > parseInt(formData.maxEntries)) {
      errors.winnerCount = 'Winner count cannot exceed max entries';
    }

    if (formData.assetType === AssetType.ERC721 && parseInt(formData.winnerCount) !== 1) {
      errors.winnerCount = 'NFT raffles must have exactly 1 winner';
    }

    if (formData.assetType === AssetType.ERC20 || formData.assetType === AssetType.ERC721) {
      if (!formData.assetContract || !isAddress(formData.assetContract)) {
        errors.assetContract = 'Valid contract address is required';
      }
    }

    if (formData.assetType === AssetType.ERC721) {
      if (!formData.assetTokenId || parseInt(formData.assetTokenId) < 0) {
        errors.assetTokenId = 'Valid token ID is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRaffle = async () => {
    if (!validateForm()) {
      showToast('Please fix form errors', 'error');
      return;
    }

    if (!address) {
      showToast('Wallet not connected', 'error');
      return;
    }

    try {
      const assetAmount = formData.assetType === AssetType.ETH
        ? parseEther(formData.assetAmount)
        : BigInt(formData.assetAmount);
      
      const entryFee = parseEther(formData.entryFee);
      const duration = BigInt(parseInt(formData.duration));
      const startTime = BigInt(Math.floor(Date.now() / 1000));
      const endTime = startTime + duration * BigInt(3600);

      await createRaffle({
        assetType: formData.assetType,
        assetContract: (formData.assetContract || '0x0000000000000000000000000000000000000000') as Address,
        assetTokenId: BigInt(formData.assetTokenId || '0'),
        assetAmount,
        entryFee,
        maxEntries: BigInt(formData.maxEntries),
        maxEntriesPerWallet: BigInt(formData.maxEntriesPerWallet),
        duration,
        winnerCount: BigInt(formData.winnerCount),
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to create raffle', 'error');
    }
  };

  useEffect(() => {
    if (isSuccess && hash) {
      showToast('Raffle created successfully!', 'success');
      // Redirect to raffle detail page after a short delay
      // Note: We'd need the raffle ID from events, but for now redirect to home
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [isSuccess, hash, router, showToast]);

  useEffect(() => {
    if (error) {
      showToast(error.message || 'Transaction failed', 'error');
    }
  }, [error, showToast]);

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 px-4 pb-12 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <Card>
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  Connect your wallet to create a raffle
                </p>
              </div>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 px-4 pb-16 animate-fade-in bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create a Raffle
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Set up your raffle parameters and start collecting entries
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        step >= s
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step > s ? '✓' : s}
                    </div>
                    {step === s && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse opacity-50"></div>
                    )}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1.5 mx-3 rounded-full transition-all duration-500 ${
                        step > s 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-gray-200 dark:bg-gray-800'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-sm font-semibold">
              <span className={step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}>Asset</span>
              <span className={step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}>Details</span>
              <span className={step >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}>Review</span>
            </div>
          </div>

          {/* Step 1: Choose Asset Type */}
          {step === 1 && (
            <Card className="animate-scale-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">Choose Asset Type</h2>

              <div className="space-y-4 mb-8">
                {/* ETH Option */}
                <label
                  className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    formData.assetType === AssetType.ETH
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 shadow-lg shadow-blue-500/20 scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md'
                  }`}
                >
                  <input
                    type="radio"
                    name="assetType"
                    value={AssetType.ETH}
                    checked={formData.assetType === AssetType.ETH}
                    onChange={() => setFormData({ ...formData, assetType: AssetType.ETH })}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      💎
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">ETH</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Raffle native ETH (Ether)
                      </div>
                    </div>
                    {formData.assetType === AssetType.ETH && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>

                {/* ERC-20 Token Option */}
                <label
                  className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    formData.assetType === AssetType.ERC20
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 shadow-lg shadow-purple-500/20 scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md'
                  }`}
                >
                  <input
                    type="radio"
                    name="assetType"
                    value={AssetType.ERC20}
                    checked={formData.assetType === AssetType.ERC20}
                    onChange={() => setFormData({ ...formData, assetType: AssetType.ERC20 })}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      🪙
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">ERC-20 Token</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Raffle any token (USDC, WETH, etc.)
                      </div>
                    </div>
                    {formData.assetType === AssetType.ERC20 && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>

                {/* NFT Option */}
                <label
                  className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    formData.assetType === AssetType.ERC721
                      ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 shadow-lg shadow-pink-500/20 scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md'
                  }`}
                >
                  <input
                    type="radio"
                    name="assetType"
                    value={AssetType.ERC721}
                    checked={formData.assetType === AssetType.ERC721}
                    onChange={() => setFormData({ ...formData, assetType: AssetType.ERC721 })}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      🖼️
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">NFT (ERC-721)</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Raffle any NFT from any collection
                      </div>
                    </div>
                    {formData.assetType === AssetType.ERC721 && (
                      <div className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Asset-specific inputs */}
              {formData.assetType === AssetType.ETH && (
                <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/30 dark:from-blue-950/30 dark:to-purple-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
                  <Input
                    label="Prize Amount (ETH)"
                    name="assetAmount"
                    type="number"
                    step="0.001"
                    min="0.000001"
                    placeholder="0.1"
                    value={formData.assetAmount}
                    onChange={handleInputChange}
                    helperText="Amount of ETH to raffle"
                    error={formErrors.assetAmount}
                    autoFocus
                  />
                </div>
              )}

              {formData.assetType === AssetType.ERC20 && (
                <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-950/30 dark:to-pink-950/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/30">
                  <Input
                    label="Token Contract Address"
                    name="assetContract"
                    placeholder="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
                    value={formData.assetContract}
                    onChange={handleInputChange}
                    helperText="Address of the ERC-20 token contract"
                    error={formErrors.assetContract}
                  />
                  <Input
                    label="Token Amount"
                    name="assetAmount"
                    type="number"
                    placeholder="100"
                    value={formData.assetAmount}
                    onChange={handleInputChange}
                    helperText="Amount of tokens (in token units)"
                    error={formErrors.assetAmount}
                  />
                </div>
              )}

              {formData.assetType === AssetType.ERC721 && (
                <div className="space-y-4 p-6 bg-gradient-to-br from-pink-50/50 to-orange-50/30 dark:from-pink-950/30 dark:to-orange-950/20 rounded-2xl border border-pink-200/50 dark:border-pink-800/30">
                  <Input
                    label="NFT Contract Address"
                    name="assetContract"
                    placeholder="0x..."
                    value={formData.assetContract}
                    onChange={handleInputChange}
                    helperText="Address of the NFT collection"
                    error={formErrors.assetContract}
                  />
                  <Input
                    label="Token ID"
                    name="assetTokenId"
                    type="number"
                    placeholder="123"
                    value={formData.assetTokenId}
                    onChange={handleInputChange}
                    helperText="ID of the specific NFT to raffle"
                    error={formErrors.assetTokenId}
                  />
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <Button 
                  onClick={() => {
                    // Validate step 1 before proceeding
                    const errors: Record<string, string> = {};
                    if (!formData.assetAmount || parseFloat(formData.assetAmount) <= 0) {
                      errors.assetAmount = 'Asset amount must be greater than 0';
                    }
                    if (formData.assetType === AssetType.ERC20 || formData.assetType === AssetType.ERC721) {
                      if (!formData.assetContract || !isAddress(formData.assetContract)) {
                        errors.assetContract = 'Valid contract address is required';
                      }
                    }
                    if (formData.assetType === AssetType.ERC721) {
                      if (!formData.assetTokenId || parseInt(formData.assetTokenId) < 0) {
                        errors.assetTokenId = 'Valid token ID is required';
                      }
                    }
                    if (Object.keys(errors).length > 0) {
                      setFormErrors({ ...formErrors, ...errors });
                      showToast('Please fix the errors before continuing', 'error');
                    } else {
                      setStep(2);
                    }
                  }} 
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                >
                  Continue →
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Raffle Details */}
          {step === 2 && (
            <Card className="animate-scale-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">Raffle Details</h2>

              <div className="space-y-5">
                <Input
                  label="Entry Fee (ETH)"
                  name="entryFee"
                  type="number"
                  step="0.001"
                  placeholder="0.01"
                  value={formData.entryFee}
                  onChange={handleInputChange}
                  helperText="Cost per entry in ETH"
                  error={formErrors.entryFee}
                />

                <Input
                  label="Max Entries"
                  name="maxEntries"
                  type="number"
                  placeholder="100"
                  value={formData.maxEntries}
                  onChange={handleInputChange}
                  helperText="Maximum number of entries allowed"
                  error={formErrors.maxEntries}
                />

                <Input
                  label="Max Entries Per Wallet"
                  name="maxEntriesPerWallet"
                  type="number"
                  placeholder="10"
                  value={formData.maxEntriesPerWallet}
                  onChange={handleInputChange}
                  helperText="Maximum entries per participant"
                  error={formErrors.maxEntriesPerWallet}
                />

                <Input
                  label="Duration (hours)"
                  name="duration"
                  type="number"
                  placeholder="24"
                  value={formData.duration}
                  onChange={handleInputChange}
                  helperText="How long the raffle will run"
                  error={formErrors.duration}
                />

                <Input
                  label="Number of Winners"
                  name="winnerCount"
                  type="number"
                  placeholder="1"
                  value={formData.winnerCount}
                  onChange={handleInputChange}
                  helperText={formData.assetType === AssetType.ERC721 ? 'Must be 1 for NFTs' : 'Prize will be split among winners'}
                  error={formErrors.winnerCount}
                />
              </div>

              <div className="flex gap-4 mt-8">
                <Button onClick={() => setStep(1)} variant="outline" size="lg" className="flex-1">
                  ← Back
                </Button>
                <Button onClick={() => setStep(3)} variant="gradient" size="lg" className="flex-1">
                  Continue →
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Review & Create */}
          {step === 3 && (
            <Card className="animate-scale-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">Review & Create</h2>

              <div className="space-y-4 mb-8">
                <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    Asset Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Type:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formData.assetType === AssetType.ETH && '💎 ETH'}
                        {formData.assetType === AssetType.ERC20 && '🪙 ERC-20 Token'}
                        {formData.assetType === AssetType.ERC721 && '🖼️ NFT'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Amount:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formData.assetType === AssetType.ETH && `${formData.assetAmount} ETH`}
                        {formData.assetType === AssetType.ERC20 && `${formData.assetAmount} tokens`}
                        {formData.assetType === AssetType.ERC721 && `Token #${formData.assetTokenId}`}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">🎫</span>
                    Entry Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Entry Fee:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formData.entryFee} ETH</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Max Entries:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formData.maxEntries}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Per Wallet:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formData.maxEntriesPerWallet}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-pink-200 dark:border-pink-800">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">⚙️</span>
                    Raffle Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Duration:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formData.duration} hours</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Winners:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formData.winnerCount}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl border-2 border-blue-200 dark:border-blue-800 mb-8">
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                  <strong className="font-bold">⚠️ Note:</strong> You will need to approve the contract to spend your{' '}
                  {formData.assetType === AssetType.ETH && 'ETH'}
                  {formData.assetType === AssetType.ERC20 && 'tokens'}
                  {formData.assetType === AssetType.ERC721 && 'NFT'} before creating the raffle.
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} variant="outline" size="lg" className="flex-1">
                  ← Back
                </Button>
                <Button 
                  onClick={handleCreateRaffle} 
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                  disabled={isPending}
                  isLoading={isPending}
                >
                  {isPending ? 'Creating...' : '✨ Create Raffle'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
