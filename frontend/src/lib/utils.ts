import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Transaction } from "@mysten/sui/transactions"
import { useSuiClient, useSignTransaction, useCurrentAccount } from "@mysten/dapp-kit"
import { BACKEND_URL } from "../constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sponsorAndExecute({
  tx,
  suiClient,
  signTransaction,
  currentAccount,
  allowedMoveCallTargets,
  allowedAddresses,
}: {
  tx: Transaction;
  suiClient: ReturnType<typeof useSuiClient>;
  signTransaction: ReturnType<typeof useSignTransaction>["mutateAsync"];
  currentAccount: ReturnType<typeof useCurrentAccount>;
  allowedMoveCallTargets?: string[];
  allowedAddresses: string[];
}) {
  if (!currentAccount) {
    throw new Error("No account connected");
  }

  // 1. Build transaction bytes
  const txBytes = await tx.build({
    client: suiClient,
    onlyTransactionKind: true,
  });

  // 2. Request sponsorship from backend
  const sponsorResponse = await fetch(
    `${BACKEND_URL}/api/sponsor-transaction`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionKindBytes: btoa(String.fromCharCode(...new Uint8Array(txBytes))),
        sender: currentAccount.address,
        network: "testnet",
        ...(allowedMoveCallTargets && { allowedMoveCallTargets }),
        allowedAddresses,
      }),
    }
  );

  if (!sponsorResponse.ok) {
    const errorText = await sponsorResponse.text();
    let errorMessage = `Sponsorship failed: ${sponsorResponse.status}`;
    try {
      const error = JSON.parse(errorText);
      errorMessage = `Sponsorship failed: ${error.error || error.message || errorText}`;
    } catch {
      errorMessage = `Sponsorship failed: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  const sponsorData = await sponsorResponse.json();
  const { bytes, digest } = sponsorData;

  // 3. Sign with user's zkLogin key
  const { signature } = await signTransaction({ transaction: bytes });
  if (!signature) {
    throw new Error("Error signing transaction");
  }

  // 4. Execute the transaction via backend
  const executeResponse = await fetch(
    `${BACKEND_URL}/api/execute-transaction`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ digest, signature }),
    }
  );

  if (!executeResponse.ok) {
    const errorText = await executeResponse.text();
    let errorMessage = `Execution failed: ${executeResponse.status}`;
    try {
      const error = JSON.parse(errorText);
      errorMessage = `Execution failed: ${error.error || error.message || errorText}`;
    } catch {
      errorMessage = `Execution failed: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  await executeResponse.json();
  return true;
}
