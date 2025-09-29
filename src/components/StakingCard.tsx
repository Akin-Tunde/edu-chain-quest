// src/components/StakingCard.tsx

import { useEffect, useState } from "react";
import { useAccount, useChainId, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { celo } from "wagmi/chains";
import { parseEther, BaseError } from "viem";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EDUTokenABI, EDUTokenAddress, EDUStakingABI, EDUStakingAddress } from "@/lib/contracts";

const getErrorMessage = (error: any): string => {
    if (error instanceof BaseError) {
        const rootCause = error.walk();
        return (rootCause as any).shortMessage || rootCause.message || "An unknown error occurred.";
    }
    return error.message || "An unknown error occurred.";
};

export const StakingCard = () => {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState("");
    
    const currentChainId = useChainId();
    const { switchChain } = useSwitchChain();
    const isWrongNetwork = isConnected && currentChainId !== celo.id;

    // --- CHANGE 1: We now need separate hooks for approve and stake actions ---
    const { data: approveHash, writeContract: approve, isPending: isApproving, error: approveError } = useWriteContract();
    const { data: stakeHash, writeContract: stake, isPending: isStaking, error: stakeError } = useWriteContract();

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: EDUTokenAddress,
        abi: EDUTokenABI,
        functionName: 'allowance',
        args: [address!, EDUStakingAddress],
        query: { enabled: isConnected && !isWrongNetwork },
    });
    
    const needsApproval = allowance !== undefined && parseEther(amount || "0") > allowance;

    // --- Main handler for the single button ---
    const handleSubmit = () => {
        if (!amount || parseFloat(amount) <= 0) return toast.error("Please enter a valid amount.");
        if (needsApproval) {
            approve({
                address: EDUTokenAddress,
                abi: EDUTokenABI,
                functionName: 'approve',
                args: [EDUStakingAddress, parseEther(amount)],
            });
        } else {
            stake({
                address: EDUStakingAddress,
                abi: EDUStakingABI,
                functionName: 'stake',
                args: [parseEther(amount), 0], 
            });
        }
    };
    
    // --- CHANGE 2: A dedicated hook to wait for the APPROVE transaction ---
    const { isLoading: isConfirmingApprove, isSuccess: isApproved } = useWaitForTransactionReceipt({ hash: approveHash });

    // --- CHANGE 3: A dedicated hook to wait for the STAKE transaction ---
    const { isLoading: isConfirmingStake, isSuccess: isStaked } = useWaitForTransactionReceipt({ hash: stakeHash });

    // --- CHANGE 4: A dedicated useEffect to automatically trigger staking after approval ---
    useEffect(() => {
        if (isApproved) {
            toast.success("Approved successfully! Now staking...", { id: approveHash });
            // Now that approval is confirmed, call the stake function
            stake({
                address: EDUStakingAddress,
                abi: EDUStakingABI,
                functionName: 'stake',
                args: [parseEther(amount), 0],
            });
        }
    }, [isApproved]);

    // --- CHANGE 5: Consolidated useEffect for handling all notifications ---
    useEffect(() => {
        const handleToast = (hash: `0x${string}` | undefined, isConfirming: boolean, isSuccess: boolean, error: any, action: string) => {
            if (!hash) return;
            if (isConfirming) toast.loading(`${action} in progress...`, { id: hash });
            if (isSuccess) {
                toast.success(`${action} successful!`, { id: hash });
                if (action === 'Stake') {
                    setAmount(""); // Only reset amount on final success
                    refetchAllowance();
                }
            }
            if (error) toast.error(getErrorMessage(error), { id: hash });
        };

        handleToast(approveHash, isConfirmingApprove, isApproved, approveError, 'Approval');
        handleToast(stakeHash, isConfirmingStake, isStaked, stakeError, 'Stake');
    }, [
        approveHash, isConfirmingApprove, isApproved, approveError, 
        stakeHash, isConfirmingStake, isStaked, stakeError, 
        refetchAllowance
    ]);
    
    const isPending = isApproving || isConfirmingApprove || isStaking || isConfirmingStake;

    return (
        <Card className="glass p-6">
            <h2 className="text-2xl font-bold mb-4">💰 Stake Your EDU Tokens</h2>
            <p className="text-muted-foreground mb-6">Stake tokens to earn rewards. Choose the flexible option for now.</p>

            {!isConnected && <p className="text-center text-muted-foreground p-4">Please connect your wallet.</p>}

            {isWrongNetwork && (
                <div className="flex flex-col items-center p-4 space-y-4 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="w-10 h-10 text-destructive" />
                    <p className="font-semibold text-center">Wrong Network Detected</p>
                    <Button onClick={() => switchChain({ chainId: celo.id })}>Switch to Celo Mainnet</Button>
                </div>
            )}

            {isConnected && !isWrongNetwork && (
                <div className="space-y-4">
                    <Input
                        type="number"
                        placeholder="Enter amount to stake"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={isPending}
                        className="text-lg h-12"
                    />
                    <Button onClick={handleSubmit} disabled={isPending || !amount} className="w-full h-12 text-base">
                        {isPending 
                            ? <><Loader2 className="animate-spin mr-2" />{isConfirmingApprove ? 'Approving...' : 'Staking...'}</>
                            : 'Stake Now'
                        }
                    </Button>
                </div>
            )}
        </Card>
    );
};