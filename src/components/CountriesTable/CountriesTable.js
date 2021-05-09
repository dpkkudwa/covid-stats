import styles from './CountriesTable.module.css';
import { KeyboardArrowDownRounded, KeyboardArrowUpRounded} from "@material-ui/icons";
import { useState } from "react";
import Link from "next/link";

const orderBy = (countries, value, direction) => {
  if (direction === 'asc') {
    return [...countries].sort((a, b) => {
      if (b[value] != undefined && a[value] != undefined) {
        if (value === 'Country_text') {
          return (a[value] > b[value] ? 1 : -1);
        }
        else {
          return (Number(a[value].replace(/[,]/g, '')) > Number(b[value].replace(/[,]/g, '')) ? 1 : -1)
        }
      }
    });
  }

  if (direction === 'desc') {
    return [...countries].sort((a, b) => {
      if (b[value] != undefined && a[value] != undefined) {
        if (value === 'Country_text') {
          return (a[value] > b[value] ? -1 : 1);
        }
        else {
          return (Number(a[value].replace(/[,]/g, '')) > Number(b[value].replace(/[,]/g, '')) ? -1 : 1);
        }
      }
    });
  }

  return countries;
}


const SortArray = ({direction}) => {
  if (!direction) {
    return <></>;
  }
  if (direction === 'desc') {
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowDownRounded color="inherit" />
      </div>
    );
  }
  else {
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowUpRounded color="inherit" />
      </div>
    );
  }
}

const CountriesTable = ({countries}) => {
  const [direction, setDirection] = useState();
  const [value, setValue] = useState();

  const orderedCountries = orderBy(countries, value, direction);

  const switchDirection = () => {
    if (!direction) {
      setDirection('desc');
    }
    else if (direction === 'desc') {
      setDirection('asc');
    }
    else {
      setDirection(null);
    }
  }

  const setValueAndDirection = (type) => {
    switchDirection();
    setValue(type);
  }

  const countriesArray = orderedCountries.map((country) => {
    if (country["Country_text"] === 'World') {
      return (
      <div className={styles.row}>
        <div className={styles.name}>
          {country["Country_text"]}
        </div>

        <div className={styles.active_cases}>
          {country["Total Cases_text"]}
        </div>

        <div className={styles.active_cases}>
          {country["Active Cases_text"]}
        </div>
      </div>
      )
    }
    else {
      return (
        <Link href={`/country/${country["Country_text"]}`}  key={country["Country_text"]} >
          <div className={styles.row}>
            <div className={styles.name}>
              {country["Country_text"]}
            </div>

            <div className={styles.active_cases}>
              {country["Total Cases_text"]}
            </div>

            <div className={styles.active_cases}>
              {country["Active Cases_text"]}
            </div>

          </div>
        </Link>
      );
    }

  });
  return (
    <div>
      <div className={styles.heading}>
        <button className={styles.heading_name} onClick={() => setValueAndDirection('Country_text')}>
          <div>Name</div>
          { value === 'Country_text' && <SortArray /> }
        </button>

        <button className={styles.heading_cases} onClick={() => setValueAndDirection('Total Cases_text')}>
          <div>Total Cases</div>
         { value === 'Total Cases_text' &&  <SortArray direction={direction}/> }
        </button>

        <button className={styles.heading_cases} onClick={() => setValueAndDirection('Active Cases_text')}>
          <div>Active Cases</div>
          { value === 'Active Cases_text' &&  <SortArray direction={direction}/> }
        </button>

      </div>
      {countriesArray}
    </div>
  )
}

export default CountriesTable;
