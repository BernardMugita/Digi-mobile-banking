import React, { FC } from "react";
import "./financial_tips.scss";
import TestimonialWidget from "../../components/Testimonial widget/TestimonialWidget";

interface Props {}

const FinancialTips: FC<Props> = () => {
  const financialAdvice = [
    "Start saving early and regularly to take advantage of compound interest.",
    "Create and stick to a budget to manage your expenses effectively.",
    "Pay off high-interest debt as quickly as possible to save money on interest.",
    "Build an emergency fund to cover unexpected expenses and avoid going into debt.",
    "Invest in your retirement savings early to secure your financial future.",
    "Diversify your investment portfolio to reduce risk and maximize returns.",
    "Avoid unnecessary expenses and prioritize spending on needs over wants.",
    "Review your insurance coverage regularly to ensure adequate protection.",
    "Take advantage of employer-sponsored retirement plans and matching contributions.",
    "Educate yourself about personal finance and investment strategies to make informed decisions.",
    "Avoid emotional investing and stick to a long-term investment plan.",
    "Monitor your credit score and report regularly to detect and correct errors.",
    "Plan for major financial goals such as buying a home, paying for education, or starting a business.",
    "Consider working with a financial advisor to develop a comprehensive financial plan.",
    "Stay disciplined and patient with your financial goals, and adjust your plan as needed over time.",
  ];

  return (
    <div className="FinancialTips">
      <TestimonialWidget />
      <div className="banner">
        <h2>
          Here are some Financial tips to give you some insights about your
          money
        </h2>
      </div>
      <div className="tips-list">
        {financialAdvice.map((tip, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <li>{tip}</li>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialTips;
