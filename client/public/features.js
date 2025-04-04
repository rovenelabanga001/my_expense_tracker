import { BiDollar } from "react-icons/bi";
import { IoAnalyticsSharp } from "react-icons/io5";
import { AiOutlineSchedule } from "react-icons/ai";
const features = [
  {
    id: 1,
    icon: <BiDollar />,
    title: "Real-Time Expense Tracking",
    description:
      "Easily log and categorize expenses with instant updates, ensuring a clear view of your spending.",
  },
  {
    id: 2,
    icon: <IoAnalyticsSharp />,
    title: "Detailed Insights & Analytics",
    description:
      "Visual reports, spending trends, and budget summaries to help you understand your financial habits and make informed decisions.",
  },
  {
    id: 3,
    icon: <AiOutlineSchedule  />,
    title: "Custom Budgeting & Alerts",
    description:
      "Set spending limits for different categories and receive alerts when approaching or exceeding budgets, helping you stay financially disciplined.",
  },
];

export default features;
