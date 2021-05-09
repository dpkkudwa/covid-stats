import Layout from "../../components/Layout/Layout";
import styles from './Country.module.css';
import { useEffect, useState } from "react";


const getCountry = async (c_name) => {
  let selectedCountry = c_name;
  let coutries_res, country;
  const covid_res = await fetch(`https://covid-19-tracking.p.rapidapi.com/v1/${selectedCountry}?rapidapi-key=c91ed370f8msh532ba50d892af34p13a3ccjsn5d76659a874e`);
  const covid_output = await covid_res.json();
  if (selectedCountry === 'India') {
    coutries_res = await fetch(`https://restcountries.eu/rest/v2/alpha/ind`);
    const countries_output = await coutries_res.json();
    country = {
      ...covid_output,
      ...countries_output
    };
  }
  else {
    coutries_res = await fetch(`https://restcountries.eu/rest/v2/name/${selectedCountry}`);
    const countries_output = await coutries_res.json();
    country = {
      ...covid_output,
      ...countries_output[0]
    };
  }
  return country;
}

const getCountryBorders = async (country_code) => {
  const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${country_code}`);
  const countries = await res.json();
  return countries;
}

const Country = ({country}) => {
  let bordersArray;
  const [borders, setBorders] = useState("");
  const getBorders = async () => {
    if (country.borders != undefined) {
      setBorders(await Promise.all(country.borders.map((brder) => getCountryBorders(brder))));
    }
  }

  useEffect(() => {
    getBorders();
  }, []);

  if (borders.length > 0) {
    bordersArray = borders.map(({flag, name}, index) => {
      return (
        <div key={index} className={styles.details_panel_border_country}>
          <img src={flag} alt={name} />
          <div className={styles.details_panel_bordername}>{name}</div>
        </div>
      );
    });
  }

  return (
    <Layout title={country["Country_text"]}>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <div key={country} className={styles.overview_panel}>
            <img src={country.flag} alt={country.name}/>
            <h1 className={styles.overview_name}>{country.name}</h1>
            <div className={styles.overview_region}>{country.region}</div>

            <div className={styles.overview_numbers}>
              <div className={styles.overview_population}>
                <div className={styles.overview_label}>{country.population}</div>
                <div className={styles.overview_value}>Population</div>
              </div>
              <div className={styles.overview_area}>
                <div className={styles.overview_label}>{country["Active Cases_text"]}</div>
                <div className={styles.overview_value}>Active Cases</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.container_right}>
          <div className={styles.details_panel}>
            <h4 className={styles.details_panel_heading}>Details</h4>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Capital</div>
              <div  className={styles.details_panel_value}>{country.capital}</div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Sub-Region</div>
              <div  className={styles.details_panel_value}>{country.subregion}</div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Language</div>
              {/* <div  className={styles.details_panel_value}>{country.languages.map(({name}) => name).join(", ")}</div> */}
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Currency</div>
              <div  className={styles.details_panel_value}>{country.currencies.map(({name}) => name).join(", ")}</div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Native Name</div>
              <div  className={styles.details_panel_value}>{country.nativeName}</div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Total Cases</div>
              <div  className={styles.details_panel_value}>{country['Total Cases_text']}</div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Total Deaths</div>
              <div  className={styles.details_panel_value}>{country['Total Deaths_text']}</div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Total Recovered</div>
              <div  className={styles.details_panel_value}>{country['Total Recovered_text']}</div>
            </div>

            <div className={styles.details_panel_borders}>
              <div className={styles.details_panel_borders_label}>Neighbouring Countries</div>
              <div className={styles.details_panel_borders_container}>
                {bordersArray}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Country;

export const getServerSideProps = async ({params}) => {
  const country = await getCountry(params.name);

  return {
    props: {
      country
    }
  }
}
