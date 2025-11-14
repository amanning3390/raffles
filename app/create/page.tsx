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
      <main className="min-h-screen pt-24 px-4 pb-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create a Raffle</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up your raffle parameters and start collecting entries
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                      step >= s
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-200 ${
                        step > s ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200 dark:bg-gray-800'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500'}>Asset</span>
              <span className={step >= 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500'}>Details</span>
              <span className={step >= 3 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500'}>Review</span>
            </div>
          </div>

          {/* Step 1: Choose Asset Type */}
          {step === 1 && (
            <Card>
              <h2 className="text-2xl font-bold mb-6">Choose Asset Type</h2>

              <div className="space-y-4 mb-6">
                {/* ETH Option */}
                <label
                  className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.assetType === AssetType.ETH
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
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
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">💎</div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">ETH</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Raffle native ETH (Ether)
                      </div>
                    </div>
                  </div>
                </label>

                {/* ERC-20 Token Option */}
                <label
                  className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.assetType === AssetType.ERC20
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
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
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🪙</div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">ERC-20 Token</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Raffle any token (USDC, WETH, etc.)
                      </div>
                    </div>
                  </div>
                </label>

                {/* NFT Option */}
                <label
                  className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.assetType === AssetType.ERC721
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
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
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🖼️</div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">NFT (ERC-721)</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Raffle any NFT from any collection
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Asset-specific inputs */}
              {formData.assetType === AssetType.ETH && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Input
                    label="Prize Amount (ETH)"
                    name="assetAmount"
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    value={formData.assetAmount}
                    onChange={handleInputChange}
                    helperText="Amount of ETH to raffle"
                  />
                </div>
              )}

              {formData.assetType === AssetType.ERC20 && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
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

              <div className="flex gap-4 mt-6">
                <Button onClick={() => setStep(2)} className="flex-1">
                  Continue
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Raffle Details */}
          {step === 2 && (
            <Card>
              <h2 className="text-2xl font-bold mb-6">Raffle Details</h2>

              <div className="space-y-4">
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

              <div className="flex gap-4 mt-6">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Review & Create */}
          {step === 3 && (
            <Card>
              <h2 className="text-2xl font-bold mb-6">Review & Create</h2>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="font-semibold mb-2">Asset Details</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium">
                        {formData.assetType === AssetType.ETH && '💎 ETH'}
                        {formData.assetType === AssetType.ERC20 && '🪙 ERC-20 Token'}
                        {formData.assetType === AssetType.ERC721 && '🖼️ NFT'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-medium">
                        {formData.assetType === AssetType.ETH && `${formData.assetAmount} ETH`}
                        {formData.assetType === AssetType.ERC20 && `${formData.assetAmount} tokens`}
                        {formData.assetType === AssetType.ERC721 && `Token #${formData.assetTokenId}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="font-semibold mb-2">Entry Settings</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Entry Fee:</span>
                      <span className="font-medium">{formData.entryFee} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Entries:</span>
                      <span className="font-medium">{formData.maxEntries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Per Wallet:</span>
                      <span className="font-medium">{formData.maxEntriesPerWallet}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="font-semibold mb-2">Raffle Settings</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium">{formData.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Winners:</span>
                      <span className="font-medium">{formData.winnerCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> You will need to approve the contract to spend your{' '}
                  {formData.assetType === AssetType.ETH && 'ETH'}
                  {formData.assetType === AssetType.ERC20 && 'tokens'}
                  {formData.assetType === AssetType.ERC721 && 'NFT'} before creating the raffle.
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleCreateRaffle} 
                  className="flex-1"
                  disabled={isPending}
                  isLoading={isPending}
                >
                  {isPending ? 'Creating...' : 'Create Raffle'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
