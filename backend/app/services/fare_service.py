"""
DMRC Official Fare Service
Calculates exact metro fares based on official DMRC distance slabs,
smart card discounts (10% standard, 20% off-peak), Sunday/national holiday concessions,
and Airport Express Line special fare matrices.
"""

from typing import Dict, Any

def calculate_fare(
    distance_km: float,
    uses_airport_line: bool = False,
    is_sunday_or_holiday: bool = False
) -> Dict[str, Any]:
    """
    Computes token/QR fare, smart card discounted fare, and holiday fare.
    """
    # Airport Express Line has dedicated pricing
    if uses_airport_line:
        if distance_km <= 5:
            token_fare = 20
        elif distance_km <= 15:
            token_fare = 50
        else:
            token_fare = 60
        smart_card_fare = round(token_fare * 0.90)
        smart_card_off_peak = round(token_fare * 0.80)
        sunday_fare = token_fare
        slab_label = f"Airport Express Corridor ({distance_km:.1f} km)"
    else:
        if distance_km <= 2.0:
            token_fare = 11
            smart_card_fare = 10
            sunday_fare = 11
            slab_label = "0 - 2 km"
        elif distance_km <= 5.0:
            token_fare = 21
            smart_card_fare = 19
            sunday_fare = 11
            slab_label = "2 - 5 km"
        elif distance_km <= 12.0:
            token_fare = 32
            smart_card_fare = 29
            sunday_fare = 21
            slab_label = "5 - 12 km"
        elif distance_km <= 21.0:
            token_fare = 43
            smart_card_fare = 39
            sunday_fare = 32
            slab_label = "12 - 21 km"
        elif distance_km <= 32.0:
            token_fare = 54
            smart_card_fare = 49
            sunday_fare = 43
            slab_label = "21 - 32 km"
        else:
            token_fare = 64
            smart_card_fare = 58
            sunday_fare = 54
            slab_label = "> 32 km"

        smart_card_off_peak = round(token_fare * 0.80)

    return {
        "distance_km": round(distance_km, 2),
        "distance_slab": slab_label,
        "token_qr_fare": token_fare,
        "smart_card_fare": smart_card_fare,
        "smart_card_off_peak_fare": smart_card_off_peak,
        "sunday_holiday_fare": sunday_fare,
        "currency": "INR",
        "savings_with_card": token_fare - smart_card_fare,
        "discount_notes": "Smart Card & NCMC save 10% on standard journeys and 20% during off-peak hours (before 8 AM, 12-5 PM, after 9 PM)."
    }

