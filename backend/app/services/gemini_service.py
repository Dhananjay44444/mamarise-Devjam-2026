import json
import logging
import httpx
from typing import Dict, Any, List
from ..config import settings

logger = logging.getLogger("mamarise.gemini")

GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"

class GeminiService:
    @staticmethod
    async def _call_gemini_api(prompt: str, system_instruction: str = "") -> str:
        """Helper to invoke Gemini 1.5 REST API with robust error handling."""
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "topP": 0.85,
                "maxOutputTokens": 1024,
            }
        }
        
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    GEMINI_API_URL,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        content_parts = candidates[0].get("content", {}).get("parts", [])
                        if content_parts:
                            return content_parts[0].get("text", "").strip()
                else:
                    logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Gemini API invocation error: {e}")

        return ""

    @classmethod
    async def generate_empathetic_voice_reply(
        cls, 
        transcript: str, 
        role: str = "mom", 
        user_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Interprets voice commands with Gemini and returns both a structured JSON intent
        and a warm, calm, empathetic, and validating companion response.
        """
        system_instruction = (
            "You are MamaRise Companion, a compassionate, soothing, and emotionally supportive "
            "clinical postpartum assistant. When mothers or partners speak to you, your tone is "
            "calm, warm, reassuring, and completely free of pressure or judgment.\n"
            "Analyze the user's transcript and produce a valid JSON object with:\n"
            "1. 'intent': One of ['ASSIGN_TASK', 'COMPLETE_TASK', 'LOG_RECOVERY', 'REQUEST_HELP', 'GENERAL_SUPPORT']\n"
            "2. 'task_name': Clean task name (if applicable)\n"
            "3. 'assign_to': 'Partner' or 'Me'\n"
            "4. 'energy': 'Low' | 'Okay' | 'Good' (if mentioned)\n"
            "5. 'sleep_hours': Number of hours (if mentioned)\n"
            "6. 'pain': 'None' | 'Mild' | 'Moderate' | 'Severe' (if mentioned)\n"
            "7. 'mood': 'Low' | 'Tired' | 'Okay' | 'Good' (if mentioned)\n"
            "8. 'empathetic_reply': A brief (1-2 sentences) serene, deeply empathetic, and validating message acknowledging their effort.\n"
            "Output strictly JSON without markdown backticks."
        )

        prompt = f"User Role: {role}\nContext: {json.dumps(user_context or {})}\nSpoken Transcript: '{transcript}'"

        raw_response = await cls._call_gemini_api(prompt, system_instruction)
        
        # Parse response
        if raw_response:
            try:
                cleaned = raw_response.replace("```json", "").replace("```", "").strip()
                data = json.loads(cleaned)
                return data
            except Exception as e:
                logger.warning(f"Failed to parse Gemini JSON output: {e}, raw: {raw_response}")

        # Fallback rule-based empathetic reply if Gemini is unreachable
        return cls._fallback_voice_interpreter(transcript, role)

    @classmethod
    async def generate_nutrition_suggestions(
        cls, 
        phase: str = "Week 8 Postpartum", 
        current_energy: str = "Low", 
        sleep_hours: float = 5.0,
        dietary_preference: str = "General"
    ) -> List[Dict[str, Any]]:
        """
        Generates 4 tailored postpartum nutrition suggestions (Hydration, Iron Recovery, 
        1-Handed Nursing Fuel, Evening Calming Tonics) powered by Gemini AI.
        """
        system_instruction = (
            "You are a Clinical Perinatal Nutritionist specializing in fourth-trimester healing. "
            "Provide 4 practical, no-fuss, restorative nutrition suggestions tailored to a mother's energy.\n"
            "Rule: No calorie tracking or diet culture. Prioritize warm digestion, tissue repair, lactation hydration, and one-handed snacks.\n"
            "Output strictly a JSON list containing 4 objects with keys:\n"
            "- 'pillar': 'hydration' | 'iron_recovery' | 'nursing_snacks' | 'calming_tonics'\n"
            "- 'pillar_title': Display title for the pillar\n"
            "- 'title': Dish or routine name\n"
            "- 'rationale': Evidence-based 1-sentence healing rationale\n"
            "- 'action_tip': 1-sentence instant actionable instruction\n"
            "- 'timing': 'Morning' | 'Afternoon Shift' | 'Nursing Block' | '30 Mins Before Sleep'\n"
            "- 'quick_prep_mins': Minutes to prepare (e.g. 2, 5, 10)\n"
            "Output strictly JSON without markdown backticks."
        )

        prompt = (
            f"Postpartum Phase: {phase}\n"
            f"Current Energy: {current_energy}\n"
            f"Last Night's Sleep: {sleep_hours} hours\n"
            f"Dietary: {dietary_preference}"
        )

        raw_response = await cls._call_gemini_api(prompt, system_instruction)

        if raw_response:
            try:
                cleaned = raw_response.replace("```json", "").replace("```", "").strip()
                data = json.loads(cleaned)
                if isinstance(data, list) and len(data) >= 4:
                    return data
            except Exception as e:
                logger.warning(f"Failed to parse Gemini nutrition output: {e}")

        # Fallback curated clinical nutrition suggestions
        return cls._fallback_nutrition_suggestions(current_energy, sleep_hours)

    @staticmethod
    def _fallback_voice_interpreter(transcript: str, role: str) -> Dict[str, Any]:
        lower = transcript.lower()
        if "dish" in lower or "laundry" in lower or "cook" in lower or "diaper" in lower or "bottle" in lower:
            task = "Household Task"
            if "dish" in lower: task = "Wash and sterilize baby bottles & dishes"
            elif "laundry" in lower: task = "Fold and put away baby laundry"
            elif "cook" in lower or "dinner" in lower: task = "Prepare nourishing warm dinner"
            
            return {
                "intent": "ASSIGN_TASK",
                "task_name": task,
                "assign_to": "Partner",
                "empathetic_reply": "I hear you, and you shouldn't have to carry this alone. I have assigned this task to your partner so you can rest."
            }
        elif "done" in lower or "finished" in lower or "complete" in lower:
            return {
                "intent": "COMPLETE_TASK",
                "task_name": "Completed Item",
                "empathetic_reply": "Wonderful job. Every small step matters, and your recovery is moving forward beautifully."
            }
        elif "tired" in lower or "exhaust" in lower or "sleep" in lower or "pain" in lower:
            return {
                "intent": "LOG_RECOVERY",
                "energy": "Low",
                "empathetic_reply": "Thank you for letting me know. Your body has done monumental work—please allow yourself to pause without any guilt."
            }
        
        return {
            "intent": "GENERAL_SUPPORT",
            "empathetic_reply": "I'm listening and right here with you. Take a deep breath—you are doing enough."
        }

    @staticmethod
    def _fallback_nutrition_suggestions(energy: str, sleep: float) -> List[Dict[str, Any]]:
        return [
            {
                "pillar": "hydration",
                "pillar_title": "Electrolyte & Thermal Hydration",
                "title": "Warm Thermal Water with Himalayan Salt & Lemon",
                "rationale": "Breastfeeding draws 700ml+ daily fluids; cellular hydration requires trace minerals over plain cold water.",
                "action_tip": "Keep an insulated 1L bottle on your nightstand at 45°C with a pinch of sea salt.",
                "timing": "Morning & Night Shift",
                "quick_prep_mins": 2
            },
            {
                "pillar": "iron_recovery",
                "pillar_title": "Iron & Tissue Recovery",
                "title": "Spiced Bone Broth or Golden Lentil Soup with Ghee",
                "rationale": "Replenishes postpartum blood volume losses and provides bioavailable collagen for pelvic healing.",
                "action_tip": "Add 1 tsp of grass-fed ghee and crushed cumin to warm broth in a mug.",
                "timing": "Afternoon Shift",
                "quick_prep_mins": 5
            },
            {
                "pillar": "nursing_snacks",
                "pillar_title": "1-Handed Nursing Snacks",
                "title": "Oat, Flaxseed & Tahini Energy Clusters",
                "rationale": "Beta-glucans and plant lignans support prolactin balance without sudden blood sugar spikes.",
                "action_tip": "Roll oats, honey, tahini, and crushed chia into 1-inch bite balls; store in bedside jar.",
                "timing": "Nursing Block",
                "quick_prep_mins": 10
            },
            {
                "pillar": "calming_tonics",
                "pillar_title": "Nervous System Reset",
                "title": "Warm Chamomile & Magnesium Night Elixir",
                "rationale": "Down-regulates high cortisol surges during fragmented 3 AM newborn wakings.",
                "action_tip": "Steep pure chamomile flowers with warm oat milk and a dash of nutmeg.",
                "timing": "30 Mins Before Sleep",
                "quick_prep_mins": 3
            }
        ]
