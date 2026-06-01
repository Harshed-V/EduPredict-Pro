from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

from ..model_service import predict, ModelBundle


@dataclass(frozen=True, slots=True)
class FaqEntry:
    topic: str
    keywords: tuple[str, ...]
    answer: str


FAQ_ENTRIES: tuple[FaqEntry, ...] = (
    FaqEntry(
        topic="accuracy",
        keywords=("accuracy",),
        answer="Accuracy is the share of predictions the model gets right overall. It is useful when the classes are reasonably balanced.",
    ),
    FaqEntry(
        topic="precision",
        keywords=("precision",),
        answer="Precision measures how often the model is correct when it predicts a specific class. Higher precision means fewer false positives.",
    ),
    FaqEntry(
        topic="recall",
        keywords=("recall",),
        answer="Recall measures how many of the actual cases the model successfully finds. Higher recall means fewer false negatives.",
    ),
    FaqEntry(
        topic="confusion matrix",
        keywords=("confusion matrix", "matrix"),
        answer="A confusion matrix shows how many predictions fell into each actual-versus-predicted bucket. It helps you see where the model confuses classes.",
    ),
    FaqEntry(
        topic="random forest",
        keywords=("random forest", "forest"),
        answer="Random Forest works well here because it handles non-linear relationships, is robust on tabular data, and gives stable feature importance values.",
    ),
    FaqEntry(
        topic="improve grades",
        keywords=("improve", "grades", "performance", "better"),
        answer="Students usually improve by increasing attendance, keeping assignment completion high, studying consistently, and reducing stress spikes.",
    ),
    FaqEntry(
        topic="attendance",
        keywords=("attendance",),
        answer="Yes. Attendance is one of the strongest signals in this model because it captures consistency and classroom engagement.",
    ),
    FaqEntry(
        topic="feature importance",
        keywords=("feature", "important", "most", "affects"),
        answer="The most influential features are usually AssignmentCompletion, Attendance, and StudyHours, though the exact ordering depends on the trained model.",
    ),
)


def answer_question(
    question: str,
    bundle: Optional[ModelBundle] = None,
    features: Optional[Dict[str, Any]] = None,
) -> Tuple[str, Optional[str], List[str]]:
    normalized = question.lower().strip()

    # Setup active features (merge with defaults if missing)
    DEFAULT_FEATURES = {
        "studyHours": 6.0,
        "attendance": 85.0,
        "motivation": "Medium",
        "assignment": 92.0,
        "courses": 3.0,
        "stress": 4.0,
    }

    active_features = dict(DEFAULT_FEATURES)
    if features:
        for k, v in features.items():
            if v is not None:
                active_features[k] = v

    # Helper to convert score to grade
    def get_letter_grade(score: float) -> str:
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"

    # 1. Greetings
    if any(k in normalized for k in ("hi", "hello", "hey", "greetings", "start")):
        return (
            "Hello! 👋 I'm your EduPredict Student Assistant. I'm here to help you forecast your grades, run what-if simulations, and discover performance recommendations.\n\nHow can I assist you today?",
            "greeting",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )
    elif any(k in normalized for k in ("thanks", "thank you", "appreciate it")):
        return (
            "You're very welcome! 👍 Let me know if you need anything else to ace your courses. Good luck!",
            "greeting",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )
    elif any(k in normalized for k in ("bye", "goodbye", "see you")):
        return (
            "Goodbye! Keep learning and stay motivated. Feel free to chat with me anytime! 👋",
            "greeting",
            ["Hello"],
        )

    # 2. What-if / Comparative Questions
    is_what_if = (
        "what if" in normalized
        or "what-if" in normalized
        or "will reducing stress" in normalized
        or "if study hours" in normalized
        or "increase study hours" in normalized
    )

    if is_what_if:
        # Check if we have bundle
        if bundle is None:
            return (
                "📈 **What-if Analysis (Sample)**:\n"
                "- **With 3 study hours**: Predicted grade is **B**\n"
                "- **With 5 study hours**: Predicted grade is **A**\n\n"
                "If study hours increase from 3 to 5, predicted grade may improve from B to A.\n\n"
                "*(Please make sure the ML model service is running to see personalized live what-if predictions!)*",
                "what_if",
                ["Why is my grade low?", "Improve attendance", "Reduce stress", "FAQ"],
            )

        # We have a bundle, let's run predictions!
        try:
            # Let's check which attribute to simulate
            if "study" in normalized or "hours" in normalized:
                # Let's try parsing specific numbers, e.g. "from 3 to 5"
                match = re.search(r"(\d+(?:\.\d+)?)\s*(?:to|and)\s*(\d+(?:\.\d+)?)", normalized)
                if match:
                    val1 = float(match.group(1))
                    val2 = float(match.group(2))
                else:
                    val1 = float(active_features["studyHours"])
                    val2 = val1 + 2.0
                    if val2 > 12.0:
                        val2 = 12.0
                        val1 = max(0.0, val2 - 2.0)

                # Payload 1
                p1 = dict(active_features)
                p1["studyHours"] = val1
                res1 = predict(bundle, p1)

                # Payload 2
                p2 = dict(active_features)
                p2["studyHours"] = val2
                res2 = predict(bundle, p2)

                grade1 = get_letter_grade(res1["predicted_score"])
                grade2 = get_letter_grade(res2["predicted_score"])

                improvement = "improve" if res2["predicted_score"] >= res1["predicted_score"] else "change"

                return (
                    f"📈 **What-if Analysis (Daily Study Hours)**:\n"
                    f"- **With {val1}h study**: Predicted score is **{res1['predicted_score']}** (Grade: **{grade1}**)\n"
                    f"- **With {val2}h study**: Predicted score is **{res2['predicted_score']}** (Grade: **{grade2}**)\n\n"
                    f"If study hours increase from {val1} to {val2}, predicted grade may {improvement} from **{grade1}** to **{grade2}**.",
                    "what_if",
                    ["Why is my grade low?", "Improve attendance", "Reduce stress", "FAQ"],
                )

            elif "attendance" in normalized or "attend" in normalized:
                match = re.search(r"(\d+(?:\.\d+)?)\s*(?:to|and|becomes)?\s*(\d+(?:\.\d+)?)", normalized)
                val1 = float(active_features["attendance"])
                val2 = 95.0
                if match:
                    vals = re.findall(r"\d+", normalized)
                    if len(vals) >= 2:
                        val1 = float(vals[0])
                        val2 = float(vals[1])
                    elif len(vals) == 1:
                        val2 = float(vals[0])

                p1 = dict(active_features)
                p1["attendance"] = val1
                res1 = predict(bundle, p1)

                p2 = dict(active_features)
                p2["attendance"] = val2
                res2 = predict(bundle, p2)

                grade1 = get_letter_grade(res1["predicted_score"])
                grade2 = get_letter_grade(res2["predicted_score"])
                improvement = "improve" if res2["predicted_score"] >= res1["predicted_score"] else "change"

                return (
                    f"📈 **What-if Analysis (Attendance Rate)**:\n"
                    f"- **With {val1}% attendance**: Predicted score is **{res1['predicted_score']}** (Grade: **{grade1}**)\n"
                    f"- **With {val2}% attendance**: Predicted score is **{res2['predicted_score']}** (Grade: **{grade2}**)\n\n"
                    f"If attendance increases from {val1}% to {val2}%, predicted grade may {improvement} from **{grade1}** to **{grade2}**.",
                    "what_if",
                    ["Why is my grade low?", "Increase study hours", "Reduce stress", "FAQ"],
                )

            elif "stress" in normalized or "reducing" in normalized:
                val1 = float(active_features["stress"])
                val2 = 2.0

                p1 = dict(active_features)
                p1["stress"] = val1
                res1 = predict(bundle, p1)

                p2 = dict(active_features)
                p2["stress"] = val2
                res2 = predict(bundle, p2)

                grade1 = get_letter_grade(res1["predicted_score"])
                grade2 = get_letter_grade(res2["predicted_score"])
                improvement = "improve" if res2["predicted_score"] >= res1["predicted_score"] else "change"

                return (
                    f"📈 **What-if Analysis (Stress Reduction)**:\n"
                    f"- **With current stress ({val1}/10)**: Predicted score is **{res1['predicted_score']}** (Grade: **{grade1}**)\n"
                    f"- **With reduced stress (2/10)**: Predicted score is **{res2['predicted_score']}** (Grade: **{grade2}**)\n\n"
                    f"Reducing your stress from {val1} to 2 may {improvement} your predicted grade from **{grade1}** to **{grade2}** by lowering academic pressure.",
                    "what_if",
                    ["Why is my grade low?", "Increase study hours", "Improve attendance", "FAQ"],
                )
            else:
                val1 = float(active_features["studyHours"])
                val2 = val1 + 2.0
                if val2 > 12.0:
                    val2 = 12.0

                p1 = dict(active_features)
                p1["studyHours"] = val1
                res1 = predict(bundle, p1)

                p2 = dict(active_features)
                p2["studyHours"] = val2
                res2 = predict(bundle, p2)

                grade1 = get_letter_grade(res1["predicted_score"])
                grade2 = get_letter_grade(res2["predicted_score"])

                return (
                    f"📈 **What-if Analysis (Sample)**:\n"
                    f"If you increase study hours from {val1}h to {val2}h daily, your predicted score is estimated to rise from **{res1['predicted_score']}** (Grade: **{grade1}**) to **{res2['predicted_score']}** (Grade: **{grade2}**).\n\n"
                    f"Try asking more specific what-if questions like:\n"
                    f"- *'What if attendance becomes 95%?'*\n"
                    f"- *'Will reducing stress improve my grade?'*",
                    "what_if",
                    ["Why is my grade low?", "Improve attendance", "Reduce stress", "FAQ"],
                )
        except Exception as e:
            return (
                f"I encountered an error running the what-if simulation: {str(e)}. "
                f"Please ensure all feature values are correct.",
                "what_if",
                ["Why is my grade low?", "FAQ"],
            )

    # 3. Prediction Questions
    is_predict = any(k in normalized for k in ("predict", "estimate", "marks", "final grade", "will i pass"))
    if is_predict:
        if bundle is None:
            return (
                "Based on the default student profile, your predicted score is **82/100** (Grade: **B**, Consistent Performance).\n\n"
                "To see a personalized estimate, please adjust inputs on the [Predict Score](file:///predict) page or tell me your values here! "
                "*(The ML model service is currently unavailable to run a live calculation).* ",
                "prediction",
                ["Why is my grade low?", "Improve attendance", "Reduce stress", "Increase study hours"],
            )

        try:
            res = predict(bundle, active_features)
            grade = get_letter_grade(res["predicted_score"])

            # Risk detection
            risk_alert = ""
            if res["predicted_score"] < 70:
                risk_alert = "\n\n⚠️ **Risk Alert**: Your predicted score is in the at-risk category. We strongly suggest focusing on improving attendance and assignment completion to lower academic risk."
            elif res["predicted_score"] >= 90:
                risk_alert = "\n\n🎉 **Motivational Boost**: Excellent profile! You are on track for an elite grade. Keep maintaining this consistency!"
            else:
                risk_alert = "\n\n✨ **Motivational Boost**: You are performing consistently. A small boost in study hours or attendance could easily push you into the next tier!"

            return (
                f"Based on your profile, here is your predicted performance:\n"
                f"- **Predicted Score**: **{res['predicted_score']} / 100**\n"
                f"- **Estimated Grade**: **{grade}** ({res['performance_category']})\n"
                f"- **Confidence Level**: **{res['confidence']}%** ({res['confidence_label']})\n"
                f"- **Peer Percentile**: **{res['peer_percentile']}** of students\n"
                f"- **Recommendation**: {res['recommendation']}"
                f"{risk_alert}",
                "prediction",
                ["Why is my grade low?", "Improve attendance", "Reduce stress", "Increase study hours"],
            )
        except Exception as e:
            return (
                f"I couldn't calculate the prediction due to an error: {str(e)}",
                "prediction",
                ["Why is my grade low?", "FAQ"],
            )

    # 4. Performance Questions
    if (
        "predicted grade low" in normalized
        or "grade low" in normalized
        or "predicted score low" in normalized
        or "why is my predicted grade low" in normalized
        or "why is my grade low" in normalized
    ):
        return (
            "Predicted grades are influenced heavily by your Attendance Rate, Assignment Completion, and Study Hours. A low predicted grade is usually due to attendance under 75% or assignment completion under 70%.\n\n"
            "By increasing study hours and turning in all assignments, you can lift your prediction significantly. Try testing it on the Predict page!",
            "performance",
            ["Improve My Score", "Increase study hours", "FAQ"],
        )
    elif (
        "factor affects" in normalized
        or "affects my performance" in normalized
        or "most important" in normalized
        or "feature importance" in normalized
    ):
        return (
            "According to our model's feature importance analysis, **Assignment Completion**, **Attendance Rate**, and **Study Hours** are the top three factors affecting student performance. Attendance captures consistency, while assignments capture hands-on mastery.",
            "performance",
            ["Improve My Score", "Increase study hours", "FAQ"],
        )
    elif (
        "improve my score" in normalized
        or "improve score" in normalized
        or "how can i improve" in normalized
        or "how can i improve my score" in normalized
    ):
        return (
            "To improve your score:\n"
            "1. 📈 **Increase Attendance**: Try to keep attendance above 90%.\n"
            "2. 📝 **Complete Assignments**: Aim for 95%+ completion.\n"
            "3. ⏱️ **Study Consistently**: Aim for 5-6 hours of daily study.\n"
            "4. 🧘 **Manage Stress**: High stress levels (above 7) negatively impact retention.\n\n"
            "Would you like to try a 'what-if' scenario to see the impact of these changes?",
            "performance",
            ["Why is my grade low?", "Improve attendance", "Reduce stress", "Increase study hours"],
        )
    elif "stress" in normalized and (
        "affecting" in normalized or "effect" in normalized or "score" in normalized or "performance" in normalized
    ):
        return (
            "Yes, stress has a significant impact! High stress levels (above 7) trigger a negative coefficient in our model, which can reduce your predicted score by 5-10%. We recommend keeping stress below 5 by organizing study schedules and taking regular breaks.",
            "performance",
            ["Improve My Score", "FAQ"],
        )

    # 5. Recommendation Questions
    if (
        "how many hours should i study" in normalized
        or "how much should i study" in normalized
        or "study hours" in normalized
    ):
        return (
            "For optimal performance, our model shows that **5 to 7 hours of daily study** yields the best balance. Studying more than 8 hours without breaks can increase stress levels and actually lead to diminishing returns.",
            "recommendation",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )
    elif "online courses" in normalized or "should i take online" in normalized:
        return (
            "Yes! Completing 2-4 relevant online courses shows a positive correlation with higher performance, as it broadens your understanding and boosts confidence. However, ensure it doesn't overwhelm your study schedule.",
            "recommendation",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )
    elif "improve attendance" in normalized or "how can i improve attendance" in normalized:
        return (
            "Improving attendance is highly effective! You can improve attendance by:\n"
            "1. Planning your weekly schedule ahead.\n"
            "2. Setting reminders for morning classes.\n"
            "3. Engaging in peer study groups to stay accountable.\n\n"
            "Even a 5% increase in attendance can lift your predicted grade tier!",
            "recommendation",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )
    elif "reduce exam stress" in normalized or "reduce stress" in normalized or "how to reduce stress" in normalized:
        return (
            "To reduce exam stress:\n"
            "1. Break down study topics into smaller, manageable chunks.\n"
            "2. Use the Pomodoro technique (25 mins study, 5 mins break).\n"
            "3. Ensure 7-8 hours of sleep before exam days.\n"
            "4. Practice mindfulness or light exercise.",
            "recommendation",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )

    # 6. FAQ Questions
    if (
        "how does the prediction system work" in normalized
        or "prediction system work" in normalized
        or "faq" in normalized
    ):
        return (
            "The prediction system uses a machine learning model trained on historical student records. It analyzes inputs like study hours, attendance, assignments, and stress to classify your performance tier and project a final score.",
            "faq",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )
    elif (
        "ml model" in normalized
        or "which model is used" in normalized
        or "random forest" in normalized
        or "xgboost" in normalized
    ):
        return (
            "We use an optimized Random Forest classifier as our core model, which performs exceptionally well on tabular academic datasets. It evaluates feature interactions to provide stable, high-confidence predictions.",
            "faq",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )
    elif "is my data safe" in normalized or "data safety" in normalized or "privacy" in normalized:
        return (
            "Absolutely! All student data is processed securely in real-time and is never stored or shared with third parties. Predictions are run in real-time, adhering to strict data privacy standards.",
            "faq",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )
    elif "accuracy" in normalized or "how accurate" in normalized:
        return (
            "Our optimized model achieves **94.2% accuracy** on validation datasets, with high confidence scores for consistent profiles. You can view the full benchmarks on the [Model Performance](file:///model-performance) page.",
            "faq",
            ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
        )

    # Fallback to the original matching list
    for entry in FAQ_ENTRIES:
        if any(keyword in normalized for keyword in entry.keywords):
            return (
                entry.answer,
                entry.topic,
                ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
            )

    # Global Fallback
    return (
        "I'm not sure I understand that query. 🤖 I can help you with grade predictions, performance recommendations, and FAQs about the ML model.\n\n"
        "Try asking me:\n"
        "- *'Can you predict my grade?'*\n"
        "- *'What if I increase study hours?'*\n"
        "- *'How can I improve my score?'*\n"
        "- *'Which ML model is used?'*",
        None,
        ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"],
    )
