export interface StatItem {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
}

export interface CarProps {
  id?: string;
  className?: string;
  variant?: "mclaren" | "side-view";
}

export interface HeroProps {
  initialCarVariant?: "mclaren" | "side-view";
}
