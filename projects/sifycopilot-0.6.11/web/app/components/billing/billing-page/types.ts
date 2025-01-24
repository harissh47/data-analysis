export interface PlanFeature {
    name: string;
    included: boolean;
    details?: string;
}

export interface PricingPlan {
    name: string;
    price: string | number;
    billing?: string;
    description: string;
    buttonText: string;
    buttonVariant: string;
    features: PlanFeature[];
    popular?: boolean;
    addons?: {
        name: string;
        price: string;
        enabled?: boolean;
    }[];
}

export interface NavigationItem {
    name: string;
    href: string;
}

export interface Logo {
    src: string;
    alt: string;
    text: string;
    width?: number;
    height?: number;
}

export interface PricingData {
    plans: PricingPlan[];
    categories?: Category[];
}

export interface Category {
    name: string;
    icon: { type: string; svg: string };
    features: Feature[];
}

export interface Feature {
    name: string;
    hobby: string | boolean;
    pro: string | boolean;
    enterprise: string | boolean;
    details?: string;
}
