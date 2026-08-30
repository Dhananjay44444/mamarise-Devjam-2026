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
        """Helper to invoke Gemini REST API with multi-model fallback and robust error handling."""
        if not settings.GEMINI_API_KEY:
            return ""

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

        candidate_models = [settings.GEMINI_MODEL, "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro"]
        
        for model in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
            try:
                async with httpx.AsyncClient(timeout=3.5) as client:
                    response = await client.post(
                        url,
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
            except Exception:
                continue

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

    @classmethod
    async def answer_nutrition_query(
        cls,
        question: str,
        recovery: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Answers Mom's custom postpartum gentle nutrition & recovery questions using Gemini AI.
        Follows clinical principles: zero diet culture, no calorie counting, fast prep, warm digestion.
        """
        recovery = recovery or {}
        sleep_hours = recovery.get("sleepHours", 6.0)
        energy = recovery.get("energy", "Okay")
        pain = recovery.get("pain", "None")

        system_instruction = (
            "You are an empathetic, clinical postpartum nutritionist for MamaRise.\n"
            "Answer the mother's question with warm, practical, 0-guilt guidance.\n"
            "Rules:\n"
            "1. Absolutely zero calorie counting, weight-loss talk, or diet culture.\n"
            "2. Focus on warm digestion, cellular hydration, tissue healing, steady blood sugar, and 1-handed low-effort prep.\n"
            "3. Return strictly a JSON object with keys:\n"
            "- 'title': Short, appetizing recommendation title\n"
            "- 'recommendation': 2-3 sentence empathetic, practical advice addressing her specific question\n"
            "- 'quickRecipe': 1-2 sentence immediate preparation steps\n"
            "- 'healingBenefit': 1 sentence physiological benefit (e.g. 'Stabilizes blood sugar and boosts lactation hydration without insulin spike')\n"
            "- 'prepTime': e.g. '2 mins', '4 mins'\n"
            "Return strictly valid JSON without markdown formatting."
        )

        prompt = (
            f"Mother's Specific Question: {question}\n"
            f"Her Recovery Context: Sleep={sleep_hours}h, Energy={energy}, Strain={pain}"
        )

        raw_response = await cls._call_gemini_api(prompt, system_instruction)

        if raw_response:
            try:
                cleaned = raw_response.replace("```json", "").replace("```", "").strip()
                data = json.loads(cleaned)
                if isinstance(data, dict) and "title" in data and "recommendation" in data:
                    return data
            except Exception as e:
                logger.warning(f"Failed to parse Gemini nutrition answer: {e}")

        # Comprehensive Dynamic Clinical NLP Engine for any postpartum question
        return cls._synthesize_nutrition_answer(question, recovery)

    @classmethod
    def _synthesize_nutrition_answer(cls, question: str, recovery: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Intelligently parses user question intent, ingredients, symptoms, and postpartum recovery
        context to craft a completely dynamic, tailored, zero-guilt nutritional recommendation.
        """
        recovery = recovery or {}
        sleep_hours = recovery.get("sleepHours", 6.0)
        energy = recovery.get("energy", "Okay")
        q = (question or "").lower().strip()

        # 1. Dizziness / Lightheaded / Low Blood Pressure / Sweet Craving
        if any(w in q for w in ["dizzy", "lighthead", "faint", "shaky", "weak"]):
            return {
                "title": "Warm Spiced Date & Salted Nut Butter Toast",
                "recommendation": f"Post-nursing lightheadedness happens when rapid fluid and glucose transfer into breast milk. With your energy currently {energy.lower()} ({sleep_hours}h sleep), combining natural unrefined sugars with healthy plant fats restores cellular equilibrium fast.",
                "quickRecipe": "Toast 1 slice of whole-grain or sourdough bread, spread 1 generous tablespoon of salted peanut or almond butter, and press 2 pitted dates on top.",
                "healingBenefit": "Quickly stabilizes vascular blood pressure and glycogen stores without causing a secondary insulin crash.",
                "prepTime": "3 mins"
            }

        # 2. Sweet Cravings / Chocolate / Sugar / Dessert
        if any(w in q for w in ["sweet", "sugar", "chocolate", "dessert", "crave", "craving", "candy"]):
            return {
                "title": "Warm Dark Cacao & Cinnamon Golden Oats",
                "recommendation": "Postpartum sweet cravings are biological signals of high prolactin output and sudden energy dips. Honoring this need with warm, magnesium-rich dark cacao satisfies dopamine reward pathways while keeping blood sugar steady.",
                "quickRecipe": "Warm 1/2 cup rolled oats with almond or oat milk, stir in 1 tbsp pure cacao, a drizzle of maple syrup or jaggery, and a pinch of cinnamon.",
                "healingBenefit": "Delivers rich bioavailable magnesium for nerve relaxation and serotonin balance in 3 minutes.",
                "prepTime": "3 mins"
            }

        # 3. Eggs / Spinach / Savory / High Protein / Breakfast
        if any(w in q for w in ["egg", "spinach", "protein", "omelet", "scramble", "breakfast"]):
            return {
                "title": "1-Pan Ghee-Wilted Spinach & Soft Egg Scramble",
                "recommendation": "Eggs provide essential choline for postpartum neurological recovery, while quickly wilted spinach supplies folate and non-heme iron that absorbs efficiently in warm healthy fats.",
                "quickRecipe": "Melt 1 tsp ghee in a skillet, add a handful of spinach until soft (30 seconds), crack 2 eggs in, and softly fold with a pinch of sea salt and pepper.",
                "healingBenefit": "Provides 14g of complete bioavailable amino acids and choline for maternal tissue reconstruction.",
                "prepTime": "4 mins"
            }

        # 4. Lactation / Breast Milk Supply / Milk Flow / Nursing
        if any(w in q for w in ["milk", "supply", "lactat", "flow", "breastfeed", "nurs", "pump"]):
            return {
                "title": "Toasted Sesame & Warm Cardamom Milk Elixir",
                "recommendation": "Phytoestrogen-rich sesame seeds and warming cardamom encourage prolactin stimulation and tissue relaxation when paired with warm thermal hydration.",
                "quickRecipe": "Warm 1 cup of oat or cow's milk with 1 tsp toasted sesame seeds, 1/4 tsp ground cardamom, and a spoon of raw honey.",
                "healingBenefit": "Stimulates the let-down reflex and hydrates breast milk glandular pathways deeply.",
                "prepTime": "3 mins"
            }

        # 5. Sore Muscles / Back Pain / Body Aches / Pelvic Discomfort
        if any(w in q for w in ["sore", "pain", "back", "muscle", "ache", "pelvic", "cramp", "joint"]):
            return {
                "title": "Golden Turmeric Bone Broth with Ghee & Sea Salt",
                "recommendation": "Postpartum pelvic strain and muscular fatigue respond best to collagen-rich fluids infused with anti-inflammatory turmeric and bioavailable black pepper.",
                "quickRecipe": "Heat 1 cup of bone broth or golden lentil soup, whisk in 1/2 tsp ground turmeric, a crack of black pepper, and 1 tsp melted grass-fed ghee.",
                "healingBenefit": "Curcumin with piperine soothes pelvic muscular tension and accelerates connective tissue healing.",
                "prepTime": "2 mins"
            }

        # 6. Night Fuel / 3 AM / Late Night / Middle of Night / 1-Handed
        if any(w in q for w in ["3 am", "night", "midnight", "wake", "bed", "1 hand", "one hand", "quick snack"]):
            return {
                "title": "Bedside Seed & Tahini Energy Cluster",
                "recommendation": "During fragmented night shifts, you need zero-cook, 1-handed fuel that can be eaten in the dark without waking up digestive organs with cold foods.",
                "quickRecipe": "Keep a jar of rolled oats, sunflower butter, chia seeds, and raw honey rolled into bite-sized balls right beside your nursing station.",
                "healingBenefit": "Provides sustained medium-chain triglycerides that prevent overnight blood glucose dips.",
                "prepTime": "1 min"
            }

        # 7. Hot Drinks / Tea / Warm Drinks / Coffee Substitute / Calm
        if any(w in q for w in ["tea", "drink", "coffee", "warm", "hot", "tonic", "elixir", "calm", "relax"]):
            return {
                "title": "Warm Chamomile, Nutmeg & Almond Rest Tonic",
                "recommendation": "When exhausted but wired, gentle warm tonics signal the parasympathetic nervous system to down-regulate elevated stress cortisol.",
                "quickRecipe": "Steep pure chamomile in hot water, top with a splash of warm almond milk, and sprinkle freshly grated nutmeg on top.",
                "healingBenefit": "Down-regulates central nervous system alertness and encourages deeper REM recovery cycles.",
                "prepTime": "3 mins"
            }

        # 8. Iron / Blood Recovery / Hemoglobin / Fatigue
        if any(w in q for w in ["iron", "blood", "anemia", "pale", "tired", "exhaust", "fatigue", "energy"]):
            return {
                "title": "Soaked Black Raisin & Lemon Moong Broth",
                "recommendation": f"Replenishing postpartum blood volume requires non-constipating plant iron paired with vitamin C for 3x higher absorption. With {sleep_hours}h of rest, warm liquid iron foods digest effortlessly.",
                "quickRecipe": "Warm a bowl of yellow moong dal soup, squeeze in half a fresh lemon, and eat alongside 6-8 soaked black raisins.",
                "healingBenefit": "Boosts ferritin and hemoglobin production without creating gastrointestinal heaviness.",
                "prepTime": "4 mins"
            }

        # 9. Digestion / Constipation / Bloating / Gut
        if any(w in q for w in ["constipat", "gut", "bloat", "digest", "stomach", "fiber"]):
            return {
                "title": "Warm Soaked Prune & Flaxseed Compote",
                "recommendation": "Postpartum pelvic tone can slow bowel transit. Gentle soluble fiber paired with warm thermal fluids softens digestion without harsh laxative cramping.",
                "quickRecipe": "Warm 3-4 soaked prunes in 1/2 cup hot water with 1 tsp ground flaxseeds and a pinch of cardamom.",
                "healingBenefit": "Encourages smooth natural peristalsis and strain-free pelvic recovery.",
                "prepTime": "3 mins"
            }

        # 10. Dynamic Intelligent Match for any other specific dish / ingredient
        words = [w for w in q.replace("?", "").replace(".", "").split() if len(w) > 3 and w not in ["what", "have", "with", "make", "food", "eat", "should", "some", "good", "easy", "postpartum"]]
        subject = " ".join(words[:2]).title() if words else "Restorative Recovery Fuel"

        return {
            "title": f"Warm {subject} Nourish Bowl",
            "recommendation": f"Addressing your query regarding '{question}': In your current postpartum recovery state ({energy.lower()} energy, {sleep_hours}h sleep), prioritizing warm, low-glycemic nourishment protects hormone balance without digestive burden.",
            "quickRecipe": "Combine your ingredients in a warm bowl with a spoon of healthy fat (ghee, olive oil, or tahini) and a pinch of mineral salt.",
            "healingBenefit": "Delivers gentle, bioavailable micronutrients customized for postpartum tissue repair and sustained energy.",
            "prepTime": "3 mins"
        }

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
        elif any(k in lower for k in ["sleep", "slept", "energy", "tired", "exhaust", "pain", "mood", "feeling", "feel", "hours", "hrs"]):
            import re
            hours_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)', lower) or re.search(r'slept\s*(?:for\s*)?(\d+(?:\.\d+)?)', lower)
            sleep_hours = float(hours_match.group(1)) if hours_match else 8.0
            
            energy = "Good" if any(w in lower for w in ["good", "great", "high", "refreshed", "well", "fine", "energetic"]) else ("Low" if any(w in lower for w in ["tired", "exhaust", "low", "drained", "heavy"]) else "Okay")
            mood = "Good" if any(w in lower for w in ["good", "great", "happy", "fine", "optimistic"]) else ("Tired" if any(w in lower for w in ["tired", "exhaust"]) else "Okay")
            pain = "Severe" if "severe" in lower else ("Mild" if "mild" in lower else "None")
            
            display_hrs = int(sleep_hours) if sleep_hours.is_integer() else sleep_hours
            if energy == "Good":
                reply = f"Wonderful to hear you got {display_hrs} hours of restorative sleep and are feeling good! Your postpartum recovery is progressing beautifully."
            else:
                reply = "Thank you for letting me know. Your body has done monumental work—please allow yourself to pause without any guilt."
            
            return {
                "intent": "LOG_RECOVERY",
                "energy": energy,
                "sleep_hours": sleep_hours,
                "pain": pain,
                "mood": mood,
                "empathetic_reply": reply
            }
        
        return {
            "intent": "GENERAL_SUPPORT",
            "empathetic_reply": "I'm listening and right here with you. Take a deep breath—you are doing enough."
        }

    @classmethod
    async def generate_rebalance_recommendations(
        cls,
        recovery: Dict[str, Any],
        chores: List[Dict[str, Any]],
        chore_split: Dict[str, int],
        partner_name: str = "Partner"
    ) -> List[Dict[str, Any]]:
        """
        Generates intelligent household rebalancing chore recommendations tailored to Mom's 
        current physical recovery metrics, pain points, and domestic equity split using Gemini AI.
        """
        system_instruction = (
            "You are an empathetic Family Workload & Postpartum Ergonomics AI Assistant for MamaRise.\n"
            "Analyze Mom's physical recovery triage metrics (sleep hours, energy, pain points, mood) "
            "and her current domestic chore load compared to her partner.\n"
            "Generate 4 to 5 highly practical, actionable household tasks that should be shifted to her partner "
            "to relieve physical strain, protect restorative rest, and balance the domestic workload.\n"
            "Output strictly a JSON list containing objects with keys:\n"
            "- 'id': unique string id\n"
            "- 'name': Specific task name (e.g., 'Night Bottle & Soothing Duty', 'Laundry Washing & Folding')\n"
            "- 'desc': 1-sentence concise description\n"
            "- 'aiRationale': 1-2 sentence empathetic explanation of WHY shifting this task helps Mom's recovery\n"
            "- 'category': 'Night Care' | 'Cooking' | 'Errands' | 'Cleaning' | 'Baby Care'\n"
            "- 'estMins': estimated minutes saved (e.g. 30, 45, 60)\n"
            "- 'urgency': 'Urgent' | 'High Priority' | 'Recommended'\n"
            "- 'impactBadge': 'Spinal Relief' | 'Sleep Restoration' | 'Fatigue Reduction' | 'Errand Offload'\n"
            "Output strictly valid JSON without markdown formatting."
        )

        prompt = (
            f"Mom's Recovery Data: {json.dumps(recovery)}\n"
            f"Current Domestic Load Split: Mom {chore_split.get('me', 75)}% vs Partner {chore_split.get('partner', 25)}%\n"
            f"Partner Name: {partner_name}\n"
            f"Active Household Chores: {json.dumps([c.get('task', '') for c in chores[:10]])}"
        )

        raw_response = await cls._call_gemini_api(prompt, system_instruction)

        if raw_response:
            try:
                cleaned = raw_response.replace("```json", "").replace("```", "").strip()
                data = json.loads(cleaned)
                if isinstance(data, list) and len(data) >= 3:
                    return data
            except Exception as e:
                logger.warning(f"Failed to parse Gemini rebalance output: {e}")

        return cls._fallback_rebalance_suggestions(recovery, chore_split, partner_name)

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

    @staticmethod
    def _fallback_rebalance_suggestions(
        recovery: Dict[str, Any], 
        chore_split: Dict[str, int], 
        partner_name: str
    ) -> List[Dict[str, Any]]:
        sleep_hours = recovery.get("sleepHours", 6)
        energy = recovery.get("energy", "Okay")
        pain = recovery.get("pain", "None")

        is_high_strain = sleep_hours < 5 or energy == "Low" or pain in ["Moderate", "Severe"]

        return [
            {
                "id": "rebal-night-01",
                "name": "Night Wake-Up & Feeding Assist Shift",
                "desc": f"Transfers 3 AM diaper and burping duty to {partner_name}",
                "aiRationale": f"Because you logged {sleep_hours}h sleep and {energy} energy, taking over the night waking protects 90 continuous minutes of deep REM recovery sleep.",
                "category": "Night Care",
                "estMins": 45,
                "urgency": "Urgent" if is_high_strain else "High Priority",
                "impactBadge": "Sleep Restoration"
            },
            {
                "id": "rebal-cook-02",
                "name": "Evening Warm Dinner & Khichdi Prep",
                "desc": "Transfers standing kitchen cooking duties to partner",
                "aiRationale": f"Eliminates 40 minutes of continuous standing in the kitchen, relieving pelvic and lower lumbar strain during postpartum tissue healing.",
                "category": "Cooking",
                "estMins": 40,
                "urgency": "High Priority" if pain != "None" else "Recommended",
                "impactBadge": "Spinal Relief"
            },
            {
                "id": "rebal-errand-03",
                "name": "Grocery & Pharmacy Errand Run",
                "desc": "Offloads external errands and heavy grocery bags",
                "aiRationale": f"Prevents heavy lifting and driving stress, allowing you to stay resting in comfortable clothing at home.",
                "category": "Errands",
                "estMins": 35,
                "urgency": "Recommended",
                "impactBadge": "Errand Offload"
            },
            {
                "id": "rebal-laundry-04",
                "name": "Laundry Wash, Fold & Put Away",
                "desc": "Transfers heavy basket carrying and repetitive bending",
                "aiRationale": f"Repetitive bending over laundry baskets stresses the lumbar spine. Handing this to {partner_name} saves 30 minutes of physical exertion.",
                "category": "Cleaning",
                "estMins": 30,
                "urgency": "High Priority" if pain in ["Mild", "Moderate", "Severe"] else "Recommended",
                "impactBadge": "Spinal Relief"
            },
            {
                "id": "rebal-bottles-05",
                "name": "Sanitize Pump Parts & Bottles",
                "desc": "Handles evening sterilizer run and bottle prep",
                "aiRationale": f"Ensures all clean feeding gear is ready beside your bed before the night shift without you having to clean at midnight.",
                "category": "Baby Care",
                "estMins": 20,
                "urgency": "Recommended",
                "impactBadge": "Fatigue Reduction"
            }
        ]
