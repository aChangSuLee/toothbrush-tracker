interface Toothbrush {
    id: string;
    name: string;
    purchaseDate: Date;
    quantity: number;
    replacementDue: Date; // 교체 예정일 (구매일로부터 3개월 후)
    notes?: string;
  }

  export type { Toothbrush };