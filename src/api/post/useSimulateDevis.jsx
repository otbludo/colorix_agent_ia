import { useEffect, useState } from "react";

export function useDevisWebSocket(formData, devisId = null) {
    const [pricing, setPricing] = useState(null);
    // console.log("useDevisWebSocket called with formData:", formData, "and devisId:", devisId);
    useEffect(() => {
        // MODE CREATE
        if (!devisId && (!formData.id_product || !formData.id_customer)) return;

        // MODE EDIT
        if (devisId && !formData.quantity && !formData.impression) return;

        const ws = new WebSocket("ws://localhost:8000/api/v1/ws/simulate_devis");

        ws.onopen = () => {
            ws.send(JSON.stringify({ ...formData, devis_id: devisId }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (!data.error) setPricing(data);
        };

        return () => ws.close();
    }, [
        devisId,
        formData
    ]);


    return pricing;
}

