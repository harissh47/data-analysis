import { PricingPlan } from './types';
import { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

interface PricingCardProps {
    plan: PricingPlan;
    isYearly: boolean;
}

export default function PricingCard({ plan, isYearly }: PricingCardProps) {
    // Handle price display, including yearly discount logic
    const getPrice = () => {
        if (typeof plan.price === 'string') return plan.price; // For plans with custom prices (e.g., "Custom Pricing")
        return isYearly ? plan.price * 0.8 : plan.price; // 20% discount for yearly plans
    };

    // Initialize add-on states with their enabled status, and calculate initial total price
    const [addonStates, setAddonStates] = useState(() => {
        return plan.addons ? plan.addons.reduce((acc, addon) => {
            acc[addon.name] = addon.enabled || false;
            return acc;
        }, {} as Record<string, boolean>) : {};
    });

    // Calculate the total price considering add-ons
    const [totalPrice, setTotalPrice] = useState(getPrice());

    // Update the total price whenever add-ons change
    useEffect(() => {
        let price = getPrice();

        if (plan.addons) {
            plan.addons.forEach((addon) => {
                if (addonStates[addon.name]) {
                    // Ensure addon price is converted to a number and added to the total price
                    const addonPrice = parseFloat(addon.price.replace('$', '').replace('/mo', '')); // Remove "$" and "/mo"
                    if (!isNaN(addonPrice)) {
                        price = (typeof price === 'number' ? price : parseFloat(price)) + addonPrice; // Add the add-on price to the total price
                    }
                }
            });
        }

        setTotalPrice(price); // Update the total price
    }, [addonStates, isYearly, plan.addons]);

    // Toggle add-on checkbox and update the state
    const handleAddonChange = (addonName: string) => {
        setAddonStates(prevState => {
            const newState = { ...prevState, [addonName]: !prevState[addonName] }; // Toggle the add-on
            return newState;
        });
    };

    return (
        <div
            // className={`rounded-lg border border-gray-200 dark:border-gray-700 p-8 relative hover:shadow-lg transition-shadow duration-300 cursor-pointer ${plan.popular ? 'bg-[#f7f7f7] dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} flex flex-col justify-between`}
            className={`rounded-lg border border-gray-200 dark:border-[#5f5f5f] p-8 relative hover:shadow-lg transition-shadow duration-300 cursor-pointer ${plan.popular ? 'bg-[#f7f7f7] dark:bg-[#333131]' : 'bg-white dark:bg-[#3f3f3f]'} flex flex-col justify-between`}

        >
            {/* Popular Badge */}
            {plan.popular && (
                // <span className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-black text-white text-xs rounded-full">
                <span className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-black text-white text-xs rounded-full dark:bg-[#3F3F3F]">
                    POPULAR
                </span>
            )}

            {/* Plan Name */}
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>

            {/* Price Display */}
            <div className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {typeof totalPrice === 'number' ? `$${totalPrice.toFixed(2)}` : totalPrice}
                {plan.billing && (
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                        {plan.billing}
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{plan.description}</p>

            {/* Add-ons Section */}
            {plan.addons && plan.addons.length > 0 && (
                <div className="mb-6 space-y-3">
                    {plan.addons.map((addon) => (
                        <div key={addon.name} className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer text-gray-900 dark:text-gray-300">
                                {/* Consistent Toggle Switch for Addons */}
                                <div
                                    className={`relative inline-flex items-center cursor-pointer ${addonStates[addon.name] ? 'bg-black dark:bg-[#3f3f3f]' : 'bg-gray-300'} rounded-full w-8 h-4 peer transition duration-200`} // Smaller size toggle for Addons
                                    onClick={() => handleAddonChange(addon.name)}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 block w-3 h-3 bg-white rounded-full transition-all transform ${addonStates[addon.name] ? 'translate-x-4' : ''}`} // Centered ball for Addons
                                    />
                                </div>
                                <span className="ml-2">{addon.name}</span>
                            </label>
                            <span className="text-gray-900 dark:text-gray-300">{addon.price}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Features List */}
            <ul className="space-y-3 text-left mb-6">
                {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                        <CheckIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span>
                            {feature.name}
                            {feature.details && (
                                <span className="text-gray-500 dark:text-gray-400 ml-1">({feature.details})</span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Action Button */}
            {/* <button
                className={`w-full py-2 px-4 rounded-lg mb-6 transition-colors duration-200 cursor-pointer ${plan.buttonVariant === 'primary'
                        ? 'bg-black text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                        : 'bg-white text-black border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700 hover:bg-gray-100'
                    }`}
            >
                {plan.buttonText}
            </button> */}
            <button
                className={`w-full py-2 px-4 rounded-lg mb-6 transition-colors duration-200 cursor-pointer ${plan.buttonVariant === 'primary'
                        ? 'bg-black text-white hover:bg-gray-800 dark:bg-[#3f3f3f]  dark:hover:bg-zinc-800'
                        : 'bg-white text-black border border-gray-200 dark:border-[#5f5f5f] hover:bg-gray-50 dark:bg-[#333131]  dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700'
                    }`}
            >
                {plan.buttonText}
            </button>
        </div>
    );
}
