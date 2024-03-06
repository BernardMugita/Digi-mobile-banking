import { FC } from "react";
import "./TestimonialWidget.scss";

type Props = object;

const TestimonialWidget: FC<Props> = () => {
  return (
    <div className="TestimonialWidget">
      <div className="circle_fill_one"></div>
      <div className="circle_fill_two"></div>
      <div className="circle_fill_three"></div>
      <div className="circle_one"></div>
      <div className="circle_two"></div>
      <div className="circle_three"></div>
      <div className="diagonal_bar_one"></div>
      <div className="diagonal_bar_two"></div>
      <div className="diagonal_bar_three"></div>
    </div>
  );
};

export default TestimonialWidget;
