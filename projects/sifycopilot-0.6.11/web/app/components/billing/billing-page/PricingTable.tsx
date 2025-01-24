import React, { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

type Feature =
    | { name: string; hobby: boolean; pro: boolean; enterprise: boolean; details?: never }
    | { name: string; hobby: string; pro: string; enterprise: string; details?: never }
    | { name: string; hobby: boolean; pro: boolean; enterprise: boolean; details: string };

type Plan = {
    name: string;
    color: string; // This will dictate the button color
    popular?: boolean;
    buttonText: string;
    buttonLink: string;
    buttonVariant: 'default' | 'secondary';
};

type Category = {
    name: string;
    icon: { type: string; src: string };
    features: Feature[];
};

type PricingData = {
    plans: Plan[];
    categories: Category[];
};

const PricingTable: React.FC = () => {
    const [pricingData, setPricingData] = useState<PricingData | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchPricingData = async () => {
            const response = await fetch('/pricing_data_test.json');
            const data = await response.json();
            setPricingData(data.pricingTable);
        };

        fetchPricingData();

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const renderFeatureValue = (feature: Feature, planKey: string) => {
        const featureValue = feature[planKey as keyof Feature];
        if (typeof featureValue === 'boolean') {
            return featureValue ? <CheckIcon className="w-5 h-5 mx-auto text-green-600" /> : null;
        }
        return featureValue;
    };

    if (!pricingData) return null;

    return (
        <div className="relative bg-white dark:bg-[#202020] ">
            {/* Sticky header shadow */}
            <div
                className={`fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-gray-900 to-transparent pointer-events-none transition-opacity duration-200 z-20  ${isScrolled ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            <div className="relative">
                <table className="w-full border-collapse">
                    {/* <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10"> */}
                    <thead className="sticky top-0 bg-white dark:bg-[#202020] z-10">

                        <tr>
                            {/* <th colSpan={pricingData.plans.length + 1} className="p-6 text-center bg-white dark:bg-gray-900"> */}
                            <th colSpan={pricingData.plans.length + 1} className="p-6 text-center bg-white dark:bg-[#202020]">

                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Plan</h2>
                            </th>
                        </tr>
                        {/* <tr className="border-b"> */}
                        <tr className="border-b dark:border-b-[#5f5f5f]">

                            {/* <th className="text-left p-6 bg-white dark:bg-gray-900 " /> */}
                            <th className="text-left p-6 bg-white dark:bg-[#202020] " />

                            {pricingData.plans.map((plan) => (
                                // <th key={plan.name} className="p-6 text-center bg-white dark:bg-gray-900">
                                <th key={plan.name} className="p-6 text-center bg-white dark:bg-[#202020]">

                                    <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                        {plan.name}
                                        {plan.popular && (
                                            // <span className="ml-2 text-xs bg-black text-white rounded-full px-2 py-1">POPULAR</span>
                                            <span className="ml-2 text-xs bg-black dark:bg-[#3f3f3f] text-white rounded-full px-2 py-1">POPULAR</span>

                                        )}
                                    </div>
                                    {/* <a
                                        // href={plan.buttonLink}
                                        className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${plan.popular
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {plan.buttonText}
                                    </a> */}
                                     <a
                                        // href={plan.buttonLink}
                                        className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${plan.popular
                                            ? 'bg-black dark:bg-[#333333] text-white hover:bg-gray-800 dark:hover:bg-zinc-800'
                                            : 'bg-white  text-black hover:bg-gray-100 dark:bg-[#202020] dark:text-white dark:hover:bg-zinc-700'
                                            }`}
                                    >
                                        {plan.buttonText}
                                    </a>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody >
                        {pricingData.categories.map((category) => (
                            <React.Fragment key={category.name}>
                                {/* <tr className="bg-white dark:bg-gray-900"> */}
                                <tr className="bg-white dark:bg-[#202020]">

                                    <td colSpan={pricingData.plans.length + 1} className="p-6 font-semibold text-left text-gray-900 dark:text-white flex items-center ">
                                        {/* <img src={category.icon.src} alt={category.name} className="w-5 h-5 mr-2" /> */}
                                        <img src={category.icon.src} alt={category.name} className="w-5 h-5 mr-2" />
                                        {category.name}
                                    </td>
                                </tr>
                                {category.features.map((feature) => (
                                    // <tr key={feature.name} className="bg-white dark:bg-gray-900">
                                    <tr key={feature.name} className="bg-white dark:bg-[#202020]">

                                        {/* <td className="p-6 border-t text-left text-gray-900 dark:text-white"> */}
                                        <td className="p-6 border-t dark:border-t-[#5f5f5f] text-left text-gray-900 dark:text-white">

                                            {feature.name}
                                            {feature.details && (
                                                <span className="text-gray-500 dark:text-gray-400 ml-1">({feature.details})</span>
                                            )}
                                        </td>
                                        {['hobby', 'pro', 'enterprise'].map((planKey, index) => (
                                            // <td key={index} className="p-6 text-center border-t text-gray-900 dark:text-white">
                                            <td key={index} className="p-6 text-center border-t dark:border-t-[#5f5f5f] text-gray-900 dark:text-white">

                                                {renderFeatureValue(feature, planKey)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PricingTable;
