export type OAuthProvider = "gmail" | "outlook" | "google_drive" | "dropbox" | "slack" | "github";

export type OAuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
};

export type OAuthProviderConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
};

export type SyncOperation = {
  id: string;
  type: "create" | "update" | "delete";
  resourceType: string;
  resourceId: string;
  data: Record<string, unknown>;
  timestamp: Date;
  retryCount: number;
};

export type SyncStatus = "pending" | "syncing" | "completed" | "failed";
