import React, { useEffect, useState } from "react"
interface PricingToggleProps {
    isYearly: boolean;
    setIsYearly: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PricingToggleConfig {
    monthlyBilling: {
        text: string;
        labelClass: string;
        isSelected: boolean;
    };
    yearlyBilling: {
        text: string;
        labelClass: string;
        isSelected: boolean;
    };
    discount: {
        text: string;
        labelClass: string;
    };
    toggleButton: {
        enabled: boolean;
        label: string;
    };
}

const PricingToggle: React.FC<PricingToggleProps> = ({ isYearly, setIsYearly }) => {
    const [pricingToggleConfig, setPricingToggleConfig] = useState<PricingToggleConfig | null>(null);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                const response = await fetch('/pricing_data_test.json');
                const data = await response.json();
                setPricingToggleConfig(data.pricingToggle);
            } catch (error) {
                console.error('Error fetching pricing data:', error);
            }
        };

        fetchPricingData();
    }, []);

    if (!pricingToggleConfig) {
        return null;
    }

    const { monthlyBilling, yearlyBilling, discount, toggleButton } = pricingToggleConfig;

    return (
        <div className="flex items-center justify-center mb-8 space-x-4">
            {/* Monthly Billing Label with Increased Font Size */}
            <span
                className={`text-lg ${isYearly ? 'text-gray-500 dark:text-gray-400' : monthlyBilling.labelClass}`}
            >
                {monthlyBilling.text}
            </span>

            {/* Toggle Button */}
            {toggleButton.enabled && (
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isYearly}
                        onChange={() => setIsYearly((prev) => !prev)}
                        className="sr-only peer"
                    />
                    {/* <div className="w-12 h-5 bg-gray-300 rounded-full peer-checked:bg-black peer-focus:ring-4 peer-focus:ring-black/20 transition duration-200"> */}
                    <div className="w-12 h-5 bg-gray-300 rounded-full peer-checked:bg-black dark:peer-checked:bg-[#3f3f3f] peer-focus:ring-4 peer-focus:ring-black/20 dark:peer-focus:ring-[#3f3f3f]/20 transition duration-200">

                        <span
                            className={`absolute top-1 left-1 block w-5 h-3 bg-white rounded-full transition-transform duration-200 transform ${isYearly ? 'translate-x-5' : ''
                                }`}
                        ></span>
                    </div>
                </label>
            )}

            {/* Yearly Billing Label with Increased Font Size */}
            <span
                className={`text-lg ${isYearly ? yearlyBilling.labelClass : 'text-gray-500 dark:text-gray-400'}`}
            >
                {yearlyBilling.text}
            </span>

            {/* Static "20% Off" label */}
            <span className={discount.labelClass}>
                {discount.text}
            </span>
        </div>
    );
};

export default PricingToggle;