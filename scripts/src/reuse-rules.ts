export interface ReuseRule {
  id: string;
  audit: string;
  pattern: RegExp;
  allowIn?: readonly string[];
  message: string;
}

export const RULES: ReuseRule[] = [];
