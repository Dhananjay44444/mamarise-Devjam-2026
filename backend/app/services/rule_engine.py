from typing import Dict, Any, List

class SafetyRuleEngine:
    """
    Deterministic clinical & emotional safety rule engine for MamaRise.
    Calculates audited recovery triage scores and partner escalation thresholds.
    """

    @classmethod
    def evaluate_triage(
        cls,
        sleep_hours: float,
        energy: str,
        pain: str,
        mood: str,
        has_fever: bool = False,
        has_heavy_bleeding: bool = False,
    ) -> Dict[str, Any]:
        
        # 1. Tier 1: Red-Flag Clinical Consultation Required
        if has_fever or has_heavy_bleeding or pain == "Severe":
            return {
                "triage_tier": "Clinical Consultation Required",
                "capacity_score": 15,
                "capacity_level": "Critical Rest",
                "partner_alert_needed": True,
                "clinical_recommendation": (
                    "Physical symptoms indicate acute clinical strain. Contact your healthcare provider "
                    "or midwife promptly. Partner should take 100% of caregiving and domestic tasks today."
                ),
                "suggested_actions": [
                    "Message OB/GYN or healthcare provider",
                    "Partner assumes all infant soothing & domestic chores",
                    "Suspend all career upskilling and physical movement"
                ]
            }

        # 2. Tier 2: Low Capacity / Urgent Rest
        if sleep_hours < 5.0 or (energy == "Low" and mood in ["Low", "Tired"]) or pain == "Moderate":
            return {
                "triage_tier": "Low Capacity / Urgent Rest",
                "capacity_score": 35,
                "capacity_level": "Low Capacity",
                "partner_alert_needed": True,
                "clinical_recommendation": (
                    "Sleep and recovery metrics show severe exhaustion. All non-essential chores must be "
                    "transferred to your partner. Prioritize one 4-hour consolidated sleep block."
                ),
                "suggested_actions": [
                    "Partner handles next feeding shift & laundry",
                    "Hydrate with warm mineral electrolytes",
                    "Limit active wake time to gentle resting"
                ]
            }

        # 3. Tier 3: Steady Recovery
        if 5.0 <= sleep_hours <= 7.0 or energy == "Okay":
            return {
                "triage_tier": "Steady Recovery",
                "capacity_score": 65,
                "capacity_level": "Moderate Capacity",
                "partner_alert_needed": False,
                "clinical_recommendation": (
                    "Recovery pacing is healthy and stable. Continue gentle 15-minute micro-refreshes "
                    "and maintain equal chore distribution with your partner."
                ),
                "suggested_actions": [
                    "Complete 15-min Career Micro-Refresh",
                    "Review shared task load with partner",
                    "10-minute gentle diaphragmatic breathing"
                ]
            }

        # 4. Tier 4: High Capacity & Return Ready
        return {
            "triage_tier": "High Capacity & Return Ready",
            "capacity_score": 90,
            "capacity_level": "Steady Capacity",
            "partner_alert_needed": False,
            "clinical_recommendation": (
                "Excellent restorative sleep and physical comfort. You have bandwidth for career upskilling "
                "tracks (UI/UX, Python, Java, Self-Financing) at your preferred pace."
            ),
            "suggested_actions": [
                "Explore Career Restart Video Studio courses",
                "Update Readiness Credential portfolio",
                "Enjoy balanced family time"
            ]
        }
