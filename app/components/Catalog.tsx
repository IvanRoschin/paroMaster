import Link from 'next/link'

const category = [
	{ categoryName: 'Аксесуари', categoryLink: '/ ' },
	{ categoryName: 'Бойлери', categoryLink: '/ ' },
	{ categoryName: 'Деталі корпусу', categoryLink: '/ ' },
	{ categoryName: 'Клапани', categoryLink: '/ ' },
	{ categoryName: 'Кнопки', categoryLink: '/ ' },
	{ categoryName: 'Насоси(помпи)', categoryLink: '/ ' },
	{ categoryName: 'Плати управління', categoryLink: '/ ' },
	{ categoryName: 'Прокладки', categoryLink: '/ ' },
	{ categoryName: 'Резервуари для води', categoryLink: '/ ' },
	{ categoryName: 'Ручки терморегулятора', categoryLink: '/ ' },
	{ categoryName: 'Мережеві шнури', categoryLink: '/ ' },
	{ categoryName: 'Термостати та запобіжники', categoryLink: '/ ' },
]

type Props = {}

const Catalog = (props: Props) => {
	return (
		<ul>
			{category.map((item, index) => {
				return (
					<li key={index}>
						<Link href={item.categoryLink}>{item.categoryName}</Link>
					</li>
				)
			})}
		</ul>
	)
}

export default Catalog
