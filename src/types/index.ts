// Menu types
export interface MenuItem {
  id: string;
  label: string;
  href: string;
}

export interface MenuConfig {
  items: MenuItem[];
  scrollThreshold?: number;
  animationDuration?: number;
}

// Hero types
export type HeroPhrase = string;

export interface HeroMetric {
  label: string;
  value: string;
}

export interface CapabilitiesCardProps {
  phrases: readonly HeroPhrase[];
  metrics: readonly HeroMetric[];
  status: 'active' | 'idle';
}

// Services types
export interface ServiceTag {
  id: string;
  label: string;
}

export interface Service {
  id: string;
  icon: string | React.ReactNode;
  title: string;
  description: string;
  tags: ServiceTag[];
  // Card flip back content
  backIntro?: string;
  backItems?: readonly string[];
  ctaLabel?: string;
  ctaHref?: string;
}

// Mission types
export interface MissionItem {
  id: string;
  title: string;
  description: string;
}

export interface MissionPoint {
  id: string;
  heading: string;
  description: string;
}

// Button types
export type ButtonVariant = 'primary' | 'secondary';

export interface BaseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
}

export interface SecondaryButtonProps extends BaseButtonProps {
  variant: 'secondary';
}

export type ButtonProps = PrimaryButtonProps | SecondaryButtonProps;

// Shared component types
export interface PillProps {
  children: React.ReactNode;
  className?: string;
}

export interface StatusDotProps {
  status?: 'active' | 'idle';
  className?: string;
}

// Clients types
export interface ClientSector {
  id: string;
  label: string;
  description: string;
  icon: string; // SVG path data
  accentVar: string; // CSS variable name
}
