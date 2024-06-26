import React, { useState, useEffect } from 'react';
import { GetAllCarResponse } from '../../../models/cars/response/getAllCarResponse';
import { FaCarSide, FaChair, FaCog, FaCrown, FaGasPump, FaLeaf, FaMoneyBillAlt, FaOilCan, FaPlane, FaPlug, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
 import './Car.css';

type NestedKeysInGetAllCarResponse = keyof GetAllCarResponse | keyof GetAllCarResponse['modelName'] | 'brandName' | 'location' | 'color';

const CarTable = ({ data }: { data: GetAllCarResponse[] }) => {
  const [filter, setFilter] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: NestedKeysInGetAllCarResponse, direction: 'ascending' | 'descending' } | null>({ key: 'modelYear', direction: 'ascending' });
  const [sortedCars, setSortedCars] = useState<GetAllCarResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setSortedCars(data);
  }, [data]);

  const fuelTypeTranslations: { [key: string]: { name: string, color: string, icon: JSX.Element } } = {
    ELECTRIC: { name: 'Elektrikli', color: '#2ecc71', icon: <FaPlug /> },
    GASOLINE: { name: 'Benzinli', color: '#3498db', icon: <FaGasPump /> },
    DIESEL: { name: 'Dizel', color: '#f1c40f', icon: <FaOilCan /> },
    HYBRID: { name: 'Hibrit', color: '#8e44ad', icon: <FaLeaf /> },
  };


  const transmissionTypeTranslations: { [key: string]: { name: string, color: string, font: string, icon: JSX.Element } } = {
    MANUAL: { name: 'Manuel', color: '#FF5733', font: 'Arial, sans-serif', icon: <FaCog /> },
    AUTOMATIC: { name: 'Otomatik', color: '#3366FF', font: 'Tahoma, sans-serif', icon: <FaCarSide /> },
  };


  const categoryTranslations: { [key: string]: { name: string, color: string, icon: JSX.Element } } = {
    economy: { name: 'Ekonomi', color: 'rgb(137, 60, 208)', icon: <FaMoneyBillAlt /> },
    comfort: { name: 'Konfor', color: 'rgb(213, 78, 215)', icon: <FaChair /> },
    luxury: { name: 'Lüks', color: 'rgb(37, 109, 191)', icon: <FaCrown /> }
  };

  const locationIcons: { [key: string]: JSX.Element } = {
    'sab. gök. havalimanı': <FaPlane />,
    'atatürk havalimanı': <FaPlane />,
    'istanbul havalimanı': <FaPlane />
  };

  const columnKeys: { [key: string]: NestedKeysInGetAllCarResponse } = {
    'Model Yılı': 'modelYear',
    'Plaka': 'plate',
    'Kredi Notu': 'minFindeksRate',
    'Kilometre': 'kilometer',
    'Günlük Fiyat': 'dailyPrice',
    'Marka': 'brandName',
    'Model': 'modelName',
    'Renk': 'color',
    'Vites Tipi': 'transmissionType',
    'Yakıt Tipi': 'fuelType',
    'Kategori': 'category',
    'Lokasyon': 'location'
  };

  const handleSort = (key: NestedKeysInGetAllCarResponse) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }

    let sortedCars = [...data];

    sortedCars.sort((a, b) => {
      let aValue;
      let bValue;

      if (key === 'brandName') {
        aValue = a.brandName;
        bValue = b.brandName;
      } else if (key === 'modelName') {
        aValue = a.modelName;
        bValue = b.modelName;
      } else if (key === 'location') {
        aValue = a.location.name;
        bValue = b.location.name;
      } else if (key === 'color') {
        aValue = a.colorName;
        bValue = b.colorName;
      } else {
        aValue = a[key as keyof GetAllCarResponse];
        bValue = b[key as keyof GetAllCarResponse];
      }

      if (aValue && bValue) {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'ascending' ? aValue - bValue : bValue - aValue;
        }
      }

      return 0;
    });

    setSortConfig({ key, direction });
    setSortedCars(sortedCars);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase(); // Filtre değerini küçük harfe dönüştür
    setFilter(value);
    const filteredCars = data.filter(car => car.plate.toLowerCase().includes(value)); // Araba plakalarını küçük harfe dönüştürerek filtrele
    setSortedCars(filteredCars);
  };

  // Mevcut sayfadaki araba öğelerini al
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCars.slice(indexOfFirstItem, indexOfLastItem);

  // Sayfa numaralarını oluştur
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedCars.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Sayfa değiştirme işlevi
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <input
        className='form-control'
        type="text"
        placeholder="Plaka filtresi..."
        value={filter}
        onChange={handleFilterChange}
      />
      <table>
        <thead>
          <tr>
            {Object.keys(columnKeys).map((columnName, index) => (
              <th key={index} onClick={() => handleSort(columnKeys[columnName])}>
                {columnName} {sortConfig && sortConfig.key === columnKeys[columnName] && (sortConfig.direction === 'ascending' ? <FaSortAmountDown /> : <FaSortAmountUp />)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((car: GetAllCarResponse, index) => (
            <tr key={car.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{car.modelYear}</td>
              <td>{car.plate}</td>
              <td>{car.minFindeksRate}</td>
              <td>{car.kilometer}</td>
              <td>{car.dailyPrice}₺</td>
              <td>{car.brandName}</td>
              <td>{car.modelName}</td>
              <td>{car.colorName}</td>
              <td style={{ color: transmissionTypeTranslations[car.transmissionType].color, fontFamily: transmissionTypeTranslations[car.transmissionType].font }}>
                {transmissionTypeTranslations[car.transmissionType].icon} {transmissionTypeTranslations[car.transmissionType].name}
              </td>
              <td style={{ color: fuelTypeTranslations[car.fuelType].color }}>
                {fuelTypeTranslations[car.fuelType].icon} {fuelTypeTranslations[car.fuelType].name}
              </td>
              <td style={{ color: categoryTranslations[car.category.toLowerCase()].color }}>
                {categoryTranslations[car.category.toLowerCase()].icon} {categoryTranslations[car.category.toLowerCase()].name}
              </td>
              <td>
                {locationIcons[car.location.name.toLowerCase()]} {car.location.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Sayfalama düğmeleri */}
      <div>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => handlePageChange(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarTable;
