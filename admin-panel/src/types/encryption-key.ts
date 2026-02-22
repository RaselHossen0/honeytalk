/** API-ready types for Encryption Key Configuration */

export interface EncryptionKeyConfig {
  id: number;
  number: number;
  key: string;
  packingAndFilling: boolean;
  valid: boolean;
}

export interface EncryptionKeyConfigCreate {
  key: string;
  packingAndFilling: boolean;
  valid: boolean;
}

export interface EncryptionKeyConfigUpdate extends Partial<EncryptionKeyConfigCreate> {}
