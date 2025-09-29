// src/components/RewardCard.tsx

import { useEffect, useMemo } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { toast } from "sonner";
import { Loader2, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RewardDistributionAddress, RewardDistributionABI, EDUTokenAddress } from "@/lib/contracts";
import { getErrorMessage } from "@/lib/utils"; // We'll create this helper function next

export const RewardCard = () => {
    const queryClient = useQueryClient();
    const { address, isConnected } = useAccount();
    
    const { data: hash, writeContract, isPending, reset } = useWriteContract();

    // Read the user's reward data struct from the contract
    const { data: rewardData, refetch: refetchRewardData } = useReadContract({
        address: RewardDistributionAddress,
        abi: RewardDistributionABI,
        functionName: 'userRewards',
        args: [address!, EDUTokenAddress],
        query: { enabled: !!address },
    });

    // The contract returns an array [earned, claimed, ...]. We calculate the claimable amount.
    const claimableAmount = useMemo(() => {
        if (rewardData && Array.isArray(rewardData)) {
            const [earned, claimed] = rewardData;
            if (typeof earned === 'bigint' && typeof claimed === 'bigint') {
                return earned - claimed;
            }
        }
        return BigInt(0);
    }, [rewardData]);
    
    const formattedClaimable = formatUnits(claimableAmount, 18);

    const handleClaim = () => {
        if (claimableAmount <= 0) return toast.error("You have no rewards to claim.");
        
        toast.info("Please confirm the transaction in your wallet.");
        writeContract({
            address: RewardDistributionAddress,
            abi: RewardDistributionABI,
            functionName: 'claimAllRewards',
            args: [], // This function takes no arguments
        });
    };

    // Wait for the claim transaction to be mined
    useWaitForTransactionReceipt({ 
        hash,
        onSuccess: (data) => {
            toast.success("Rewards claimed successfully!", { id: hash });
            refetchRewardData(); // Refetch the claimable amount (should be 0 now)
            queryClient.invalidateQueries(); // Force refetch of wallet balance in header
            reset();
        },
        onError: (error) => {
            toast.error(getErrorMessage(error), { id: hash });
        }
    });

    if (!isConnected) {
        return null; // Don't show the card if the user isn't connected
    }

    return (
        <Card className="glass p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                🎉 Claim Your Rewards
            </h2>
            <div className="flex items-center justify-between bg-secondary p-4 rounded-lg">
                <div>
                    <p className="text-muted-foreground text-sm">You have earned</p>
                    <p className="text-3xl font-bold gradient-text">
                        {parseFloat(formattedClaimable).toLocaleString('en-US', { maximumFractionDigits: 2 })} EDU
                    </p>
                </div>
                <Button 
                    onClick={handleClaim} 
                    disabled={isPending || claimableAmount <= 0} 
                    size="lg" 
                    className="h-14 text-lg"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <><PartyPopper className="mr-2"/> Claim Now</>}
                </Button>
            </div>
        </Card>
    );
};