import { FaTruck } from 'react-icons/fa';
import { GiReturnArrow } from 'react-icons/gi';
import { MdOutlineSupportAgent } from 'react-icons/md';

const advantages = [
  {
    title: 'Безкоштовна доставка',
    subtitle: 'від 200 грн.',
    icon: 'FaTruck',
    iconSize: 32,
  },
  {
    title: 'Постійна підтримка',
    subtitle: 'Ми завжди на зв`язку',
    icon: 'MdOutlineSupportAgent',
    iconSize: 32,
  },
  {
    title: 'Швидке повернення',
    subtitle: 'Проста та зрозуміла політика повернення',
    icon: 'GiReturnArrow',
    iconSize: 32,
  },
];

const iconComponents: { [key: string]: React.ElementType } = {
  FaTruck,
  GiReturnArrow,
  MdOutlineSupportAgent,
};

const Advantages = ({ title }: { title?: string }) => {
  return (
    <>
      <h2 className="subtitle-main">{title}</h2>
      <div className="flex flex-wrap justify-around">
        {advantages.map((item, index) => {
          const IconComponent = iconComponents[item.icon];
          return (
            <div
              key={index}
              className="flex flex-col items-center m-4 p-4 bg-gray-100 rounded-lg shadow-md w-[270px] mb-20"
            >
              <IconComponent
                size={item.iconSize}
                className="mb-2 text-primaryAccentColor"
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.subtitle}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Advantages;
