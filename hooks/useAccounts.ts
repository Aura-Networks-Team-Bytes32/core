import { useCallback, useState } from "react";
import { AuthMethod } from "@lit-protocol/types";
import { getPKPs, mintPKP } from "../utils/lit";
import { IRelayPKP } from "@lit-protocol/types";
import { setPKPToStorage, setAccountType } from "@/utils/cache";

export default function useAccounts() {
  const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
  const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  /**
   * Fetch PKPs tied to given auth method
   */
  const fetchAccounts = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        // Fetch PKPs tied to given auth method
        const myPKPs = await getPKPs(authMethod);
        // console.log('fetchAccounts pkps: ', myPKPs);
        setAccounts(myPKPs);
        // If only one PKP, set as current account
        if (myPKPs.length === 1) {
          setCurrentAccount(myPKPs[0]);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Mint a new PKP for current auth method
   */
  const createAccount = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      console.log("minting");
      try {
        const newPKP = await mintPKP(authMethod);
        setPKPToStorage(newPKP[0]);
        setAccountType("new");
        // console.log('createAccount pkp: ', newPKP);
        setAccounts((prev) => [...prev, newPKP[0]]);
        setCurrentAccount(newPKP[0]);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchAccounts,
    createAccount,
    setCurrentAccount,
    accounts,
    currentAccount,
    loading,
    error,
  };
}
