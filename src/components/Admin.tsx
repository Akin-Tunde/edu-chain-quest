// src/components/Admin.tsx

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { toast } from "sonner";
import { Loader2, ShieldCheck, PlusCircle } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CourseRegistryAddress, CourseRegistryABI } from "@/lib/contracts";
import { getErrorMessage } from "@/lib/utils";

export const Admin = () => {
    const { address } = useAccount();
    const { writeContract, isPending, data: hash } = useWriteContract();

    // State for the Create Course form
    const [metadataHash, setMetadataHash] = useState("");

    // State for the Verify Instructor form
    const [instructorAddress, setInstructorAddress] = useState("");

    // --- Role-Based Access Control (RBAC) Check ---
    // First, we need the ADMIN_ROLE identifier from the contract
    const { data: adminRole } = useReadContract({
        address: CourseRegistryAddress,
        abi: CourseRegistryABI,
        functionName: 'ADMIN_ROLE',
    });

    // Then, we check if the connected address HAS that role
    const { data: isAdmin, isLoading: isAdminLoading } = useReadContract({
        address: CourseRegistryAddress,
        abi: CourseRegistryABI,
        functionName: 'hasRole',
        args: [adminRole!, address!],
        query: { enabled: !!address && !!adminRole },
    });

    const handleCreateCourse = () => {
        if (!metadataHash) return toast.error("Please provide a metadata hash.");

        writeContract({
            address: CourseRegistryAddress,
            abi: CourseRegistryABI,
            functionName: 'createCourse',
            args: [metadataHash, 0, 0, 0], // Using 0 for price, share, and badgeId for free courses
        }, {
            onSuccess: () => toast.success("Course creation transaction sent!"),
            onError: (error) => toast.error(getErrorMessage(error)),
        });
    };

    const handleVerifyInstructor = () => {
        if (!instructorAddress) return toast.error("Please provide an instructor address.");

        writeContract({
            address: CourseRegistryAddress,
            abi: CourseRegistryABI,
            functionName: 'verifyInstructor',
            args: [instructorAddress as `0x${string}`],
        }, {
            onSuccess: () => toast.success("Instructor verification transaction sent!"),
            onError: (error) => toast.error(getErrorMessage(error)),
        });
    };

    // --- Render Logic ---
    if (isAdminLoading) {
        return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
    }

    if (!isAdmin) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-destructive" />
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold gradient-text text-center">Admin Panel</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Create Course Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><PlusCircle className="mr-2" />Create New Course</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="metadataHash">IPFS Metadata Hash</Label>
                            <Input 
                                id="metadataHash" 
                                value={metadataHash}
                                onChange={(e) => setMetadataHash(e.target.value)}
                                placeholder="QmPlaceholder..." 
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            For now, price and revenue share are hardcoded to 0 for free courses.
                        </p>
                        <Button onClick={handleCreateCourse} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Course
                        </Button>
                    </CardContent>
                </Card>

                {/* Verify Instructor Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><ShieldCheck className="mr-2" />Verify Instructor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="instructorAddress">Instructor Wallet Address</Label>
                            <Input 
                                id="instructorAddress" 
                                value={instructorAddress}
                                onChange={(e) => setInstructorAddress(e.target.value)}
                                placeholder="0x..." 
                            />
                        </div>
                        <Button onClick={handleVerifyInstructor} disabled={isPending}>
                             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify Instructor
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};