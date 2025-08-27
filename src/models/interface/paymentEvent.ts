export interface IPaymentEvent {
    id ?: number;
    event_id: string;
    invoice_id: number;
    amount: number;
    status ?: string;
    retry_count: number;
}
