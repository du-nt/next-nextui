import { QueryClient, QueryKey } from "@tanstack/react-query";
import { JWTPayload, jwtVerify } from "jose";

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT Secret key is not provided");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}

export const removeAllExceptKey = (
  queryClient: QueryClient,
  keyToKeep: QueryKey
) => {
  const queryCache = queryClient.getQueryCache();

  const keysToRemove = queryCache
    .getAll()
    .reduce((keys: QueryKey[], { queryKey }) => {
      if (JSON.stringify(queryKey) === JSON.stringify(keyToKeep)) {
        return keys;
      }

      return [...keys, queryKey];
    }, []);

  if (keysToRemove.length > 0) {
    queryClient.removeQueries({ queryKey: keysToRemove });
  }
};
