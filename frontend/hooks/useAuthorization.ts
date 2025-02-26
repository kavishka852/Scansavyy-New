import {useEffect, useState} from "react";
import {getSecureItem, SECURE_STORAGE_KEYS} from "@/utils/secureStoreUtils";
import {useRouter} from "expo-router";

export function useAuthorization() {
    const router = useRouter();

    useEffect(() => {
        checkAccess();
    }, []);

    const checkAccess = async () => {
        const accessToken = await getSecureItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN);
        if (accessToken == null) {
            router.push(`/Login`)
        }
    }

    return {
        checkAccess
    };
}
