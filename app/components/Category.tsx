import Link from "next/link";
import { Icon } from "./Icon";

const category = [
  {
    iconName: "category_korpusniDetali",
    categoryName: "Корпус станції",
    categoryLink: "/ ",
  },
  {
    iconName: "category_korpusUtuga",
    categoryName: "Корпус утюга",
    categoryLink: "/ ",
  },
  {
    iconName: "category_pidoshvaUtuga",
    categoryName: "Підошви для утюгів",
    categoryLink: "/ ",
  },
  {
    iconName: "category_platu",
    categoryName: "Плати керування",
    categoryLink: "/ ",
  },
  { iconName: "category_boiler", categoryName: "Бойлери", categoryLink: "/ " },
  {
    iconName: "category_electroKlapan",
    categoryName: "Електроклапани",
    categoryLink: "/ ",
  },
  {
    iconName: "category_nasos",
    categoryName: "Насоси(помпи)",
    categoryLink: "/ ",
  },
  {
    iconName: "category_rezervuarVoda",
    categoryName: "Резервуари для води",
    categoryLink: "/ ",
  },
  {
    iconName: "category_provoda",
    categoryName: "Провода та шланги",
    categoryLink: "/ ",
  },
  {
    iconName: "category_accsecuari",
    categoryName: "Аксесуари та комплектуючі",
    categoryLink: "/ ",
  },
];

interface CategoryItem {
  iconName: string;
  categoryName: string;
  categoryLink: string;
}

interface Props {
  categories: CategoryItem[];
}

const Category = () => {
  return (
    <div className="pt-0 mr-4 text-sm">
      <ul className="bg-secondaryBackground p-4">
        {category.map(({ categoryLink, iconName, categoryName }, index) => {
          return (
            <li key={index} className="mb-3">
              <Link
                href={categoryLink}
                className="flex justify-start items-start nav"
              >
                <Icon name={iconName} className="w-4 h-4  mr-3" />
                {categoryName}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Category;
