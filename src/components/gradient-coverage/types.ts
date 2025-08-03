export type GradientMode = 'full' | 'main' | 'main-nav' | 'main-sidebar';

export interface GradientModeConfig {
  id: GradientMode;
  name: string;
  description: string;
  targets: string[];
}

export interface GradientStyle {
  background?: string;
  backdropFilter?: string;
  border?: string;
  boxShadow?: string;
  [key: string]: any; // Allow for additional CSS properties
}