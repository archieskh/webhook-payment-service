import PaymentEvent from "./models/paymentEvent";
import { applyPaymentEvent } from "./services/applyPaymentEvent";
import sequelizeConnection from "./db";

const MAX_RETRIES = 5

async function processPaymentEvent() {
    console.log("Processing payment events...");
    const events = await PaymentEvent.findAll({
        where: { status: "pending" },
        order: [["id", "ASC"]], 
        limit: 10
    });
    for (const event of events) {
        try {
            console.log(`Processing payment event: ${event.event_id} (attempt ${event.retry_count + 1})`);
            await applyPaymentEvent(event);

            event.status = "processed";
            event.retry_count = 0;
            await event.save();

            console.log(`Event ${event.event_id} processed successfully.`);
        } catch ( err: any) {
            console.error(`Error processing event ${event.event_id}: ${err.message}`);

            event.retry_count += 1;
            
            if(event.retry_count >= MAX_RETRIES) {
                event.status = "failed";
                console.warn(`Event ${event.event_id} marked as failed after ${MAX_RETRIES} attempts.`);
            }

            await event.save();
        }
    }
}

async function main() {
    await sequelizeConnection.authenticate();

    console.log('Worker connected to Database, starting queue...');

    setInterval( async () => {
        try {
            await processPaymentEvent();
        } catch (error) {
            console.error(`Error processing payment events: ${error}`);
        }
    }, 5000);
}

main().catch(err => {
    console.error(`Error in worker: ${err}`);
    process.exit(1);
});
