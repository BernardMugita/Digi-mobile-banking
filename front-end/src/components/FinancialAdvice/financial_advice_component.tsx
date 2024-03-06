import { FC, useState, useEffect } from "react";
import './financial_advice_component.scss'
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type Props = object;

const FinancialAdviceComponent: FC<Props> = () => {
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

  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAdviceIndex((prevIndex) => (prevIndex + 1) % financialAdvice.length);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId); // Cleanup function to clear interval on component unmount
  }, [financialAdvice.length]);

  const handlePrevAdvice = () => {
    setCurrentAdviceIndex((prevIndex) => (prevIndex === 0 ? financialAdvice.length - 1 : prevIndex - 1));
  };

  const handleNextAdvice = () => {
    setCurrentAdviceIndex((prevIndex) => (prevIndex + 1) % financialAdvice.length);
  };

  return (
    <div className="FinancialAdviceComponent">
      <div className="body">
        <p>{financialAdvice[currentAdviceIndex]}</p>
      </div>
      <div className="line"></div>
      <div className="toggle">
        <MdChevronLeft onClick={handlePrevAdvice} />
        <MdChevronRight onClick={handleNextAdvice} />
      </div>
    </div>
  );
};

export default FinancialAdviceComponent;
