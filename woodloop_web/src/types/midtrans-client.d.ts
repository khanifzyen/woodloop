declare module "midtrans-client" {
  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionParameter {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details: {
      first_name: string;
      email: string;
      phone: string;
    };
    item_details: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
  }

  interface TransactionResult {
    token: string;
    redirect_url: string;
  }

  export class Snap {
    constructor(options: SnapOptions);
    createTransaction(params: TransactionParameter): Promise<TransactionResult>;
  }

  export class CoreApi {
    constructor(options: SnapOptions);
  }

  export class Iris {
    constructor(options: SnapOptions);
  }
}
