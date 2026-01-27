export interface PromotionStrategy {
    calculateFinalPrice(basePrice: number, value: number): number;
}

export class FixedDiscountStrategy implements PromotionStrategy {
    calculateFinalPrice(basePrice: number, value: number): number {
        return Math.max(0, basePrice - value);
    }
}

export class PercentageDiscountStrategy implements PromotionStrategy {
    calculateFinalPrice(basePrice: number, value: number): number {
        const discount = basePrice * (value / 100);
        return Math.max(0, basePrice - discount);
    }
}

export class PromotionContext {
    private strategies: Map<string, PromotionStrategy> = new Map();

    constructor() {
        this.strategies.set('fixed', new FixedDiscountStrategy());
        this.strategies.set('percentage', new PercentageDiscountStrategy());
    }

    getStrategy(type: string): PromotionStrategy {
        const strategy = this.strategies.get(type);
        if (!strategy) {
            throw new Error(`Strategy type ${type} not found`);
        }
        return strategy;
    }

    registerStrategy(type: string, strategy: PromotionStrategy) {
        this.strategies.set(type, strategy);
    }
}

export const promotionContext = new PromotionContext();
